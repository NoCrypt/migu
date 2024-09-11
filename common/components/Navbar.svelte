<script>
  import { getContext } from 'svelte'
  import { media } from '../views/Player/MediaHandler.svelte'
  import { rss } from '@/views/TorrentSearch/TorrentModal.svelte'
  import NavbarLink from './NavbarLink.svelte'
  // import { click } from '@/modules/click.js'
  // import IPC from '@/modules/ipc.js'
  import { MagnifyingGlass } from 'svelte-radix'
  import { Users, Clock, Settings, Heart, ListVideo, House } from 'lucide-svelte'
  const view = getContext('view')
  export let page

  function noModals(i = true) {
    if (i) $view = null; 
    else  $view = $view===null ? $media.media : null;
    
    $rss = null
  }

  // function close () {
  //   $view = null
  //   page = 'home'
  // }
</script>

<nav class='navbar navbar-fixed-bottom d-block d-md-none border-0 bg-dark' style='border-top: 1.5px #fff2 solid !important;'>
  <div class='navbar-menu h-full d-flex flex-row justify-content-center align-items-center m-0 pb-5' class:animate={page !== 'player'}>
    <!-- <img src='./logo_filled.png' class='w-50 h-50 m-10 pointer p-5' alt='ico' use:click={close} /> -->
    <NavbarLink click={() => { page = 'home'; noModals()}} _page='home' icon='home' {page} let:active>
      <House size='3.3rem' class='flex-shrink-0 p-5 m-5 rounded' strokeWidth='2.5' color={active ? 'currentColor':'#888'} />
    </NavbarLink>
    <NavbarLink click={() => { page = 'search'; noModals()}} _page='search' icon='search' {page}>
      <MagnifyingGlass size='3.3rem' class='flex-shrink-0 p-5 m-5 rounded' stroke-width='0.9' style="color: {page==='search' ? 'currentColor':'#888'}" stroke='currentColor'/>
    </NavbarLink>
    {#if $media?.media}
      <NavbarLink click={() => { noModals(false) }} icon='queue_music' {page} let:active>
        <ListVideo size='3.3rem' class='flex-shrink-0 p-5 m-5 rounded' strokeWidth='2.5' color={active ? 'currentColor':'#888'} />
      </NavbarLink>
    {:else}
      <NavbarLink click={() => { page = 'schedule'; noModals() }} _page='schedule' icon='schedule' {page} let:active>
        <Clock size='3.3rem' class='flex-shrink-0 p-5 m-5 rounded' strokeWidth='2.5' color={active ? 'currentColor':'#888'} />
      </NavbarLink>
    {/if}
    <NavbarLink click={() => { page = 'watchtogether'; noModals() }} _page='watchtogether' icon='groups' {page} let:active>
      <Users size='3.3rem' class='flex-shrink-0 p-5 m-5 rounded' strokeWidth='2.5' color={active ? 'currentColor':'#888'} />
    </NavbarLink>
    <!-- <NavbarLink click={() => { IPC.emit('open', 'https://github.com/sponsors/ThaUnknown/') }} icon='favorite' css='ml-auto donate' {page} let:active>
      <Heart size='3.3rem' class='flex-shrink-0 p-5 m-5 rounded donate' strokeWidth='2.5' fill={active ? 'currentColor':'#888'} />
    </NavbarLink> -->
    <NavbarLink click={() => { page = 'settings'; noModals() }} _page='settings' icon='settings' css='ml-auto' {page} let:active>
      <Settings size='3.3rem' class='flex-shrink-0 p-5 m-5 rounded' strokeWidth='2.5' color={active ? 'currentColor':'#888'} />
    </NavbarLink>
  </div>
</nav>

<style>
  .navbar .animate :global(.donate) {
    animation: glow 1s ease-in-out infinite alternate;
  }
  .navbar :global(.donate):active {
    color: #fa68b6 !important;
  }
  .navbar :global(.donate) {
    font-variation-settings: 'FILL' 1;
    color: #fa68b6;
    text-shadow: 0 0 1rem #fa68b6;
  }
  @keyframes glow {
    from {
      filter: drop-shadow(0 0 1rem #fa68b6);
    }
    to {
      filter: drop-shadow(0 0 0.5rem #fa68b6);
    }
  }
</style>