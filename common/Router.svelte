<script context='module'>
  const mql = matchMedia('(min-width: 769px)')
  const isMobile = readable(!mql.matches, set => {
    const check = ({ matches }) => set(!matches)
    mql.addEventListener('change', check)
    return () => mql.removeEventListener('change', check)
  })
</script>

<script>
  import Home from './views/Home/Home.svelte'
  import MediaHandler, { media } from './views/Player/MediaHandler.svelte'
  import Settings, { version } from '@/views/Settings/Settings.svelte'
  import WatchTogether from './views/WatchTogether/WatchTogether.svelte'
  import Miniplayer from 'svelte-miniplayer'
  import Search from './views/Search.svelte'
  import { toast } from 'svelte-sonner';
  import AiringSchedule from './views/AiringSchedule.svelte'
  import { readable } from 'simple-store-svelte'
  import { files } from './views/Player/MediaHandler.svelte' // this is sooo hacky and possibly delaying viewer on startup
  import { rss } from './views/TorrentSearch/TorrentModal.svelte';
  import { view } from './App.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { SUPPORTS } from '@/modules/support.js';
  import { click } from '@/modules/click.js';
  import { client } from '@/modules/torrent.js';
  import { settings } from '@/modules/settings.js';
  import IPC from '@/modules/ipc.js';

  export let page = 'home'

  $: minwidth = $isMobile ? '200px' : '35rem'
  $: maxwidth = $isMobile ? '200px' : '60rem'

  onMount(() => {
    // Check update (ask if on Android, install if on PC)
    if($settings.enableAutoUpdate && SUPPORTS.update) IPC.emit('update')
    if (SUPPORTS.isAndroid) {
      // Auto updater for android
      IPC.on('android-update-available', () => {
        toast.info('Update found', {
          description: 'Wanna install it?',
          action: {
            label: 'Install now',
            onClick: () => {
              console.log(version)
              IPC.emit('android-install-update')
              toast.loading('Downloading...', {
                description: 'Please allow the permission when asked. ',
                duration: Number.POSITIVE_INFINITY, 
                dismissable: false,
                cancel:{
                  label: 'Hide',
                  onClick: () => {
                    toast.dismiss()
                  }
                }
              })
            }
          },
          cancel: {
            label: 'Never show again',
            onClick: () => {
              $settings.enableAutoUpdate = false
              toast('Auto update disabled. You can re-enable it in Settings > App')
            }
          },
          duration: Number.POSITIVE_INFINITY
        })  
      })

      // Back button support
      let backButtonPressTimeout;
      window.Capacitor.Plugins.App.addListener("backButton", () => {
        if (page === "home" && $view === null && $rss === null) {
          if (backButtonPressTimeout) {
            clearTimeout(backButtonPressTimeout);
            window.Capacitor.Plugins.App.exitApp();
          } else {
            toast.warning("Press again to exit", { duration: 1000 });
            backButtonPressTimeout = setTimeout(() => {
              backButtonPressTimeout = null;
            }, 1000);
          }
        } else {
          if (document.fullscreenElement) document.exitFullscreen();
          page = "home";
          $rss = null;
          $view = null;
        }
      });
    }
  });

  onDestroy(() => {
    if (SUPPORTS.isAndroid) window.Capacitor.Plugins.App.removeAllListeners();
  });

  function closeMiniplayer() {
    $files = []
    $media = null
    localStorage.setItem('torrent', '[]')
    client.send('torrent', null)
  }

</script>

<div class='w-full h-full position-absolute overflow-hidden' class:sr-only={($files.length === 0)}>
  <Miniplayer active={page !== 'player'} class='bg-dark-light z-10 {page === 'player' ? 'h-full' : ''}' {minwidth} {maxwidth} width='300px' padding='2rem' resize={!$isMobile}>
    <MediaHandler miniplayer={page !== 'player'} bind:page />
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    {#if page !== 'player'} 
      <div tabindex="0" use:click={closeMiniplayer} style="position: absolute; top: 5px; right: 5px; cursor: alias; z-index: 100; font-size: 3rem; line-height: 2.2rem; text-shadow: 0px 0px 10px black;">&times;</div>
    {/if}
    </Miniplayer>
</div>
{#if page === 'settings'}
  <Settings />
{:else if page === 'home'}
  <Home />
{:else if page === 'search'}
  <Search /> 
{:else if page === 'schedule'}
  <AiringSchedule />
{:else if page === 'watchtogether'}
  <WatchTogether />
{/if}
