<script context='module'>
  import { readable } from 'simple-store-svelte'

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
  import Settings from '@/views/Settings/Settings.svelte'
  import WatchTogether from './views/WatchTogether/WatchTogether.svelte'
  import Miniplayer from 'svelte-miniplayer'
  import Search from './views/Search.svelte'
  import AiringSchedule from './views/AiringSchedule.svelte'
  import { files } from './views/Player/MediaHandler.svelte' // this is sooo hacky and possibly delaying viewer on startup
  import { onMount } from 'svelte';
  import { SUPPORTS } from '@/modules/support.js';
  import { click } from '@/modules/click.js';
  import { client } from '@/modules/torrent.js';
  import { settings } from '@/modules/settings.js';
  import IPC from '@/modules/ipc.js';
  import { rss } from './views/TorrentSearch/TorrentModal.svelte';

  export let page = 'home'
  export let overlay = 'none'

  $: minwidth = $isMobile ? '200px' : '35rem'
  $: maxwidth = $isMobile ? '200px' : '60rem'

  onMount(() => {
    // Check update
    if($settings.enableAutoUpdate && SUPPORTS.update) IPC.emit('update')

    window.addEventListener('popstate', e => {
      $rss = null
    })
  });

  function closeMiniplayer() {
    $files = []
    $media = null
    localStorage.setItem('torrent', '[]')
    client.send('torrent', null)
  }


</script>

<div class='w-full h-full position-absolute overflow-hidden' class:sr-only={($files.length === 0)}>
  <Miniplayer active={(page !== 'player' && overlay !== 'torrent') || overlay === 'viewanime'} class='bg-dark-light z-100 {(page === "player" && overlay !== "viewanime") ? "h-full" : ""}' {minwidth} {maxwidth} width='300px' padding='2rem' resize={!$isMobile}>
    <MediaHandler miniplayer={page !== 'player' || overlay === 'viewanime'} bind:page bind:overlay />
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
