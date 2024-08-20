<script>
  import { getContext } from 'svelte'
  import { media } from '../views/Player/MediaHandler.svelte'
  import { rss } from '@/views/TorrentSearch/TorrentModal.svelte'
  import NavbarLink from './NavbarLink.svelte'
  const view = getContext('view')
  export let page

  function noModals(i = true) {
    if (i) $view = null; 
    else  $view = $view===null ? $media.media : null;
    
    $rss = null
  }

  function close () {
    page = 'home'
    noModals()
  }
</script>

<nav class='navbar navbar-fixed-bottom d-block d-md-none border-0 bg-dark'>
  <div class='navbar-menu h-full d-flex flex-row justify-content-center align-items-center m-0 pb-5' class:animate={page !== 'player'}>
    <!-- <img src='./logo_filled.png' class='w-50 h-50 m-10 pointer p-5' alt='ico' use:click={} /> -->
    <NavbarLink click={close} _page='home' css='ml-auto' icon='home' {page} />
    <NavbarLink click={() => { page = 'search'; noModals() }} _page='search' css='ml-auto' icon='search' {page} />
    {#if $media?.media}
      <NavbarLink click={() => { noModals(false) }} icon='queue_music' {page} />
    {:else}
      <NavbarLink click={() => { page = 'schedule'; noModals() }} _page='schedule' icon='schedule' {page} />
    {/if}
    <NavbarLink click={() => { page = 'watchtogether'; noModals() }} _page='watchtogether' icon='groups' {page} />
    <!-- <NavbarLink click={() => { IPC.emit('open', 'https://github.com/sponsors/ThaUnknown/') }} icon='favorite' css='ml-auto donate' {page} /> -->
    <NavbarLink click={() => { page = 'settings'; noModals() }} _page='settings' icon='settings' {page} />
  </div>
</nav>
