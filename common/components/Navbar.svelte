<script>
  import { getContext } from 'svelte'
  import { media } from '../views/Player/MediaHandler.svelte'
  import { click } from '@/modules/click.js'
  import IPC from '@/modules/ipc.js'
  import { rss } from '@/views/TorrentSearch/TorrentModal.svelte'
  const view = getContext('view')
  export let page
  const links = [
    // {
    //   click: () => {
    //     page = 'search'
    //   },
    //   css: 'ml-auto',
    //   page: 'search',
    //   icon: 'search',
    //   text: 'Search'
    // },
    {
      click: () => {
        page = 'schedule'
        $view = null
        $rss = null
        
      },
      page: 'schedule',
      icon: 'search',
      text: 'Schedule'
    },
    {
      click: () => {
        if (!($view === null)) {
          $view = null
          return
        }
        if ($media) $view = $media.media
        $rss = null
      },
      icon: 'queue_music',
      text: 'Now Playing'
    },
    {
      click: () => {
        page = 'watchtogether'
        $view = null
        $rss = null
      },
      page: 'watchtogether',
      icon: 'groups',
      text: 'Watch Together'
    },
    // {
    //   click: () => {
    //      IPC.emit('open', 'https://github.com/sponsors/ThaUnknown/')
    //   },
    //   icon: 'favorite',
    //   text: 'Support This App',
    //   css: 'ml-auto donate'
    // },
    {
      click: () => {
        page = 'settings'
        $view = null
        $rss = null
      },
      page: 'settings',
      icon: 'settings',
      text: 'Settings',
      css: 'ml-auto'
    }
  ]
  function close () {
    $view = null
    $rss = null
    page = 'home'
  }
</script>

<nav class='navbar navbar-fixed-bottom d-block d-md-none border-0 bg-dark'>
  <div class='navbar-menu h-full d-flex flex-row justify-content-center align-items-center m-0 pb-5' class:animate={page !== 'player'}>
    <!-- <img src='./logo_filled.png' class='w-50 h-50 m-10 pointer p-5' alt='ico' use:click={close} />-->
    <div
        class='navbar-link navbar-link-with-icon pointer overflow-hidden mx-auto'
        use:click={close}>
        <span class='material-symbols-outlined rounded'>home</span>
    </div>

    {#each links as { click: _click, icon, text, image, css, page: _page }, i (i)}
      <div
        class='navbar-link navbar-link-with-icon pointer overflow-hidden mx-auto {css}'
        use:click={_click}>
        {#if image}
          <span class='material-symbols-outlined rounded' class:filled={page === _page}>
            <img src={image} class='h-30 rounded' alt='logo' />
          </span>
        {:else}
          <span class='material-symbols-outlined rounded' class:filled={page === _page}>{icon}</span>
        {/if}
      </div>
    {/each}
  </div>
</nav>

<style>
  nav {
    height: var(--navbar-height);
  }
  @keyframes glow {
    from {
      text-shadow: 0 0 2rem #fa68b6;
    }
    to {
      text-shadow: 0 0 1rem #fa68b6;
    }
  }
  .animate .donate .material-symbols-outlined {
    animation: glow 1s ease-in-out infinite alternate;
  }
  .donate:hover .material-symbols-outlined {
    background: #fff;
    color: #fa68b6 !important;
  }
  .donate .material-symbols-outlined {
    font-variation-settings: 'FILL' 1;
    color: #fa68b6;
    text-shadow: 0 0 1rem #fa68b6;
  }
  /* .sidebar-menu {
    padding-top: 10rem;
  } */
  .text {
    opacity: 1;
    transition: opacity 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  .navbar-link > span {
    color: #fff;
    border-radius: 0.3rem;
  }

  .material-symbols-outlined {
    color: #fff;
    transition: background .8s cubic-bezier(0.25, 0.8, 0.25, 1), color .8s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .navbar-link:active > span {
    background: #fff;
    color: var(--dark-color);
  }

  .navbar-link {
    font-size: 1.5rem;
    padding: 0.65rem;
    height: 5.5rem;
  }

  .material-symbols-outlined {
    font-size: 2.5rem;
    min-width: 4.2rem;
    width: 6rem;
    height: 4.2rem;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  .navbar-link img {
    font-size: 2.2rem;
    width: 3rem;
    height: 3rem;
    margin: 0.5rem;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  img {
    margin-right: var(--sidebar-brand-image-margin-right);
  }
</style>
