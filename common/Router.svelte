<script context='module'>
  const mql = matchMedia('(min-width: 769px)')
  export const isMobile = readable(!mql.matches, set => {
    const check = ({ matches }) => set(!matches)
    mql.addEventListener('change', check)
    return () => mql.removeEventListener('change', check)
  })
</script>

<script>
  import Home from './views/Home/Home.svelte'
  import MediaHandler from './views/Player/MediaHandler.svelte'
  import Settings from '@/views/Settings/Settings.svelte'
  import WatchTogether from './views/WatchTogether/WatchTogether.svelte'
  import Miniplayer from 'svelte-miniplayer'
  import Search from './views/Search.svelte'
  import { toast } from 'svelte-sonner';
  import AiringSchedule from './views/AiringSchedule.svelte'
  import { readable } from 'simple-store-svelte'
  import { files } from './views/Player/MediaHandler.svelte' // this is sooo hacky and possibly delaying viewer on startup
  import { rss } from './views/TorrentSearch/TorrentModal.svelte';
  import { view } from './App.svelte';

  export let page = 'home'

  $: minwidth = $isMobile ? '200px' : '35rem'
  $: maxwidth = $isMobile ? '200px' : '60rem'

  if ($isMobile) {
    let backButtonPressTimeout;

    window.Capacitor.Plugins.App.addListener('backButton', () => {
      if (page === 'home' && $view === null && $rss === null) {
        if (backButtonPressTimeout) {
          clearTimeout(backButtonPressTimeout);
          window.Capacitor.Plugins.App.exitApp();
        } else {
          toast.warning('Press again to exit', { duration: 1000 });
          backButtonPressTimeout = setTimeout(() => {
            backButtonPressTimeout = null;
          }, 1000);
        }
      } else {
        if (document.fullscreenElement) document.exitFullscreen()
        page = 'home';
        $rss = null;
        $view = null;
      }
    });
  }



</script>

<div class='w-full h-full position-absolute overflow-hidden' class:sr-only={($files.length === 0)}>
  <Miniplayer active={page !== 'player'} class='bg-dark-light z-10 {page === 'player' ? 'h-full' : ''}' {minwidth} {maxwidth} width='300px' padding='2rem' resize={!$isMobile}>
    <MediaHandler miniplayer={page !== 'player'} bind:page />
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
