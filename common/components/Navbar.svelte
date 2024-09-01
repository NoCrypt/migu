<script>
  import { getContext } from 'svelte'
  import { media } from '../views/Player/MediaHandler.svelte'
  import { rss } from '@/views/TorrentSearch/TorrentModal.svelte'
  import NavbarLink from './NavbarLink.svelte'
  import { MagnifyingGlass } from 'svelte-radix'
  import { Users, Clock, Settings, Heart, ListVideo, House } from 'lucide-svelte'
  const view = getContext('view')
  export let page

  function noModals(i = true) {
    if (i) $view = null; 
    else  $view = $view===null ? $media.media : null;
    
    $rss = null
  }

</script>

<nav class='navbar navbar-fixed-bottom d-block d-md-none border-0 bg-dark' style='border-top: 1.5px #fff2 solid !important;'>
  <div class='navbar-menu h-full d-flex flex-row justify-content-center align-items-center m-0 pb-5' class:animate={page !== 'player'}>
    <!-- <img src='./logo_filled.png' class='w-50 h-50 m-10 pointer p-5' alt='ico'  /> -->
    <NavbarLink click={() => { page = 'home'; noModals()}} _page='home' icon='home' {page} let:active>
      <House size='2.2rem' class='flex-shrink-0 p-5 w-30 h-30 m-5 rounded' strokeWidth={active ? '3.5' : '2'} />
    </NavbarLink>
    <NavbarLink click={() => { page = 'search'; noModals()}} _page='search' icon='search' {page} let:active>
      <MagnifyingGlass size='2.2rem' class='flex-shrink-0 p-5 w-30 h-30 m-5 rounded' stroke-width={active ? '2' : '0'} stroke='currentColor' />
    </NavbarLink>
    {#if $media?.media}
      <NavbarLink click={() => { noModals(false) }} icon='queue_music' {page} let:active>
        <ListVideo size='2.2rem' class='flex-shrink-0 p-5 w-30 h-30 m-5 rounded' strokeWidth={active ? '3.5' : '2'} />
      </NavbarLink>
    {:else}
      <NavbarLink click={() => { page = 'schedule'; noModals() }} _page='schedule' icon='schedule' {page} let:active>
        <Clock size='2.2rem' class='flex-shrink-0 p-5 w-30 h-30 m-5 rounded' strokeWidth={active ? '3.5' : '2'} />
      </NavbarLink>
    {/if}
    <NavbarLink click={() => { page = 'watchtogether'; noModals() }} _page='watchtogether' icon='groups' {page} let:active>
      <Users size='2.2rem' class='flex-shrink-0 p-5 w-30 h-30 m-5 rounded' strokeWidth={active ? '3.5' : '2'} />
    </NavbarLink>
    <!-- <NavbarLink click={() => { IPC.emit('open', 'https://github.com/sponsors/ThaUnknown/') }} icon='favorite' css='ml-auto donate' {page} let:active>
      <Heart size='2.2rem' class='flex-shrink-0 p-5 w-30 h-30 m-5 rounded donate' strokeWidth={active ? '3.5' : '2'} fill='currentColor' />
    </NavbarLink> -->
    <NavbarLink click={() => { page = 'settings'; noModals() }} _page='settings' icon='settings' css='ml-auto' {page} let:active>
      <Settings size='2.2rem' class='flex-shrink-0 p-5 w-30 h-30 m-5 rounded' strokeWidth={active ? '3.5' : '2'} />
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
