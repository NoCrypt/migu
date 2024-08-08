export function volumeScroll(node, options = {}) {
    const {
      minVolume = 0,
      maxVolume = 1,
      sensitivity = 0.001,
      videoSelector = 'video',
      indicatorFadeDelay = 500,
    } = options;
  
    let video = document.querySelector(videoSelector);
    let indicator;
    let fadeTimeout;
  
    function createIndicator() {
      indicator = document.createElement('div');
      indicator.style.cssText = `
        position: absolute;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 10px;
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
      
      indicator.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        </svg>
        <span class="volume-value">50%</span>
      `;
      
      node.style.position = 'relative';
      node.appendChild(indicator);
    }
  
    function updateIndicator(volume) {
      if (!indicator) createIndicator();
      const percentage = Math.round(volume * 100);
      const volumeValue = indicator.querySelector('.volume-value');
      volumeValue.textContent = `${percentage}%`;
      
      indicator.style.opacity = '1';
      
      clearTimeout(fadeTimeout);
      fadeTimeout = setTimeout(() => {
        indicator.style.opacity = '0';
      }, indicatorFadeDelay);
    }
  
    function handleWheel(e) {
      if (!video) return;
  
      const volumeChange = e.deltaY * sensitivity;
      let newVolume = video.volume - volumeChange;
      newVolume = Math.max(minVolume, Math.min(maxVolume, newVolume));
      video.volume = newVolume;
  
      updateIndicator(newVolume);
  
      // Prevent default scrolling behavior
      e.preventDefault();
    }
  
    createIndicator();
    node.addEventListener('wheel', handleWheel, { passive: false });
  
    return {
      destroy() {
        node.removeEventListener('wheel', handleWheel);
        if (indicator && indicator.parentNode) {
          indicator.parentNode.removeChild(indicator);
        }
        clearTimeout(fadeTimeout);
      }
    };
  }