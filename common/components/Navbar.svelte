<script>
  import { getContext } from 'svelte'
  import { media } from '../views/Player/MediaHandler.svelte'
  import { rss } from '@/views/TorrentSearch/TorrentModal.svelte'
  import NavbarLink from './NavbarLink.svelte'
  import { MagnifyingGlass } from 'svelte-radix'
  import { Users, Clock, Settings, Heart, ListVideo } from 'lucide-svelte'
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
    <img src='./logo_filled.png' class='w-50 h-50 m-10 pointer p-5' alt='ico' use:click={close} />
    <NavbarLink click={() => { page = 'search' }} _page='search' css='ml-auto' icon='search' {page} let:active>
      <MagnifyingGlass size='2rem' class='flex-shrink-0 p-5 w-30 h-30 m-5 rounded' stroke-width={active ? '2' : '0'} stroke='currentColor' />
    </NavbarLink>
    <NavbarLink click={() => { page = 'schedule' }} _page='schedule' icon='schedule' {page} let:active>
      <Clock size='2rem' class='flex-shrink-0 p-5 w-30 h-30 m-5 rounded' strokeWidth={active ? '3.5' : '2'} />
    </NavbarLink>
    {#if $media?.media}
      <NavbarLink click={() => { $view = $media.media }} icon='queue_music' {page} let:active>
        <ListVideo size='2rem' class='flex-shrink-0 p-5 w-30 h-30 m-5 rounded' strokeWidth={active ? '3.5' : '2'} />
      </NavbarLink>
    {/if}
    <NavbarLink click={() => { page = 'watchtogether' }} _page='watchtogether' icon='groups' {page} let:active>
      <Users size='2rem' class='flex-shrink-0 p-5 w-30 h-30 m-5 rounded' strokeWidth={active ? '3.5' : '2'} />
    </NavbarLink>
    <!-- <NavbarLink click={() => { IPC.emit('open', 'https://github.com/sponsors/ThaUnknown/') }} icon='favorite' css='ml-auto donate' {page} let:active>
      <Heart size='2rem' class='flex-shrink-0 p-5 w-30 h-30 m-5 rounded donate' strokeWidth={active ? '3.5' : '2'} fill='currentColor' />
    </NavbarLink> -->
    <NavbarLink click={() => { page = 'settings' }} _page='settings' icon='settings' css='ml-auto' {page} let:active>
      <Settings size='2rem' class='flex-shrink-0 p-5 w-30 h-30 m-5 rounded' strokeWidth={active ? '3.5' : '2'} />
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
