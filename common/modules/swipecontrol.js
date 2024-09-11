import { Capacitor } from '@capacitor/core';
import { ScreenBrightness } from '@capacitor-community/screen-brightness';
import { VolumeControl } from 'capacitor-volume-control';

export function swipeControls(node, props = { enabled: true, immersePlayer: () => {} }) {
  if (!props.enabled) return;

  const isNative = Capacitor.isNativePlatform();
  let brightness = 50;
  let volume = 50; // Start at middle volume (range 0-100)
  let startY = 0;
  let isDragging = false;
  let activeControl = null;
  let timeoutId;
  let updateTimeoutId;

  const indicators = document.createElement('div');
  indicators.className = 'swipe-control-indicators';
  indicators.style.cssText = `
    position: absolute;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 20px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-family: Arial, sans-serif;
    font-size: 14px;
  `;
  
  indicators.innerHTML = `
    <div class="indicator brightness" style="display:flex; justify-content:center; gap: 5px;">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
      <span class="brightness-value">100%</span>
    </div>
    <div class="indicator volume" style="display:flex; justify-content:center; gap: 5px;">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
      </svg>
      <span class="volume-value">50%</span>
    </div>
  `;
  
  node.style.position = 'relative';
  node.appendChild(indicators);

  const brightnessValue = indicators.querySelector('.brightness-value');
  const volumeValue = indicators.querySelector('.volume-value');

  function handleTouchStart(event) {
    if (!props.enabled) return;
    if (!isNative) return;
    isDragging = true;
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
    const rect = node.getBoundingClientRect();
    activeControl = (event.touches[0].clientX - rect.left) < rect.width / 2 ? 'brightness' : 'volume';
  }

  function handleTouchMove(event) {
    if (!props.enabled) return;
    if (!isNative || !isDragging) return;

    const currentY = event.touches[0].clientY;
    const deltaY = startY - currentY;
    const rect = node.getBoundingClientRect();
    const sensitivity = 0.5 * (200 / rect.height);

    if (Math.abs(deltaY) > 5) {
      if (activeControl === 'brightness') {
        brightness = Math.max(0, Math.min(100, brightness + deltaY * sensitivity));
        updateBrightness();
      } else if (activeControl === 'volume') {
        volume = Math.max(0, Math.min(100, volume + deltaY * sensitivity));
        debouncedUpdateVolume();
      }

      showControlsIndicator();
      startY = currentY;
    }
  }

  function handleTouchEnd() {
    if (!props.enabled) return;
    isDragging = false;
    activeControl = null;
  }

  async function updateBrightness() {
    try {
      await ScreenBrightness.setBrightness({ brightness: brightness / 100 });
      brightnessValue.textContent = `${Math.round(brightness)}%`;
    } catch (error) {
      console.error('Error updating brightness:', error);
    }
  }

  let lastVolume = 50;
  const VOLUME_CHANGE_THRESHOLD = 1;
  
  function debouncedUpdateVolume() {
    clearTimeout(updateTimeoutId);
    
    // Update UI immediately
    volumeValue.textContent = `${Math.round(volume)}%`;
  
    updateTimeoutId = setTimeout(async () => {
      if (Math.abs(volume - lastVolume) >= VOLUME_CHANGE_THRESHOLD) {
        try {
          await VolumeControl.setVolume({ volume: Math.round(volume), showUI: false });
          lastVolume = volume;
        } catch (error) {
          console.error('Error updating volume:', error);
          // Retry logic
          setTimeout(() => debouncedUpdateVolume(), 50);
        }
      }
    }, 33);
  }
  function showControlsIndicator() {
    indicators.style.opacity = '1';
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      indicators.style.opacity = '0';
      props.immersePlayer();
    }, 500);
  }

  node.addEventListener('touchstart', handleTouchStart);
  node.addEventListener('touchmove', handleTouchMove, { passive: false });
  node.addEventListener('touchend', handleTouchEnd);

  async function init() {
    if (isNative) {
      try {
        // const { brightness: currentBrightness } = await ScreenBrightness.getBrightness();
        const { volume: currentVolume } = await VolumeControl.getVolume();
        brightness = 50;
        volume = currentVolume;
        // updateBrightness();
        brightnessValue.textContent = `50%`;
        debouncedUpdateVolume();
      } catch (error) {
        console.error('Error initializing brightness and volume:', error);
      }
    }
  }

  init();

  return {
    destroy() {
      node.removeEventListener('touchstart', handleTouchStart);
      node.removeEventListener('touchmove', handleTouchMove);
      node.removeEventListener('touchend', handleTouchEnd);
      clearTimeout(timeoutId);
      node.removeChild(indicators);
    }
  };
}