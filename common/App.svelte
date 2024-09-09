<script context='module'>
  import { setContext } from 'svelte'
  import { writable } from 'simple-store-svelte'
  import { anilistClient } from '@/modules/anilist.js'
  import IPC from '@/modules/ipc.js'
  // import { rss } from './views/TorrentSearch/TorrentModal.svelte'

  export const page = writable('home')
  export const overlay = writable('none')
  export const view = writable(null)
  export async function handleAnime (anime) {
    view.set(null)
    view.set((await anilistClient.searchIDSingle({ id: anime })).data.Media)
  }
  IPC.on('open-anime', handleAnime)
  IPC.on('schedule', () => {
    page.set('schedule')
  })

  let ignoreNext = false
  function addPage (value, type) {
    if (ignoreNext) {
      ignoreNext = false
      return
    }
    history.pushState({ type, value }, '', location.origin + location.pathname + '?id=' + Math.trunc(Math.random() * Number.MAX_SAFE_INTEGER).toString())
  }
  page.subscribe((value) => {
    addPage(value, 'page')
  })
  view.subscribe((value) => {
    addPage(value, 'view')
  })

  addPage('home', 'page')

  window.addEventListener('popstate', e => {
    const { state } = e
    if (!state) return
    ignoreNext = true
    view.set(null)
    // rss.set(null)
    if (document.fullscreenElement) {
      document.exitFullscreen();
      if (state.type === 'view') page.set('home')
    }
    if (state.type === 'page') {
      page.set(state.value)
    } else {
      view.set(state.value)
    }
  })
</script>

<script>
  import Sidebar from './components/Sidebar.svelte'
  import Router from './Router.svelte'
  import ViewAnime from './views/ViewAnime/ViewAnime.svelte'
  import TorrentModal from './views/TorrentSearch/TorrentModal.svelte'
  import Menubar from './components/Menubar.svelte'
  import { toast, Toaster } from 'svelte-sonner'
  import Profiles from './components/Profiles.svelte'
  import Navbar from './components/Navbar.svelte'
  import { SUPPORTS } from '@/modules/support.js';
  import UpdateModal, { changeLog, updateModal } from './components/UpdateModal.svelte';

  setContext('view', view)

  // Cleaning up your messy IPC UPDATER listeners, 
  // and unify them for android. smh.
  // Client IPC listener: update-available, update-downloading, update-downloaded
  // Server IPC listener: update, update-download, quit-and-install

  IPC.on('update-available', () => {
    changeLog.then((cl)=>{
      if (cl[0].version !== localStorage.getItem('ignoredVersion')) {
        $updateModal = true
      }
    })
  })

  IPC.on('update-downloading', () => {
    toast.loading('Downloading Update...', {
      duration: Number.POSITIVE_INFINITY, 
      dismissable: false,
      cancel:{
        label: 'Hide',
        onClick: () => {
          toast.dismiss()
        }
      }
    })
  })

  IPC.on('update-downloaded', () => {
    toast.dismiss()
    toast.success('Update Downloaded', {
      duration: Number.POSITIVE_INFINITY,
      description: 'Click install now to install the update. Installation can also occur after you quit the app.',
      action: {
        label: 'Install now',
        onClick: () => IPC.emit('quit-and-install')
      }
    })

    $updateModal = false
  })
  

</script>

<div class="page-wrapper with-transitions bg-dark position-relative" data-sidebar-type='overlayed-all'>
  <Menubar bind:page={$page} />
  <Profiles />
  <Sidebar bind:page={$page} />
  <div class='overflow-hidden content-wrapper h-full'>
    <Toaster visibleToasts={6} position='top-right' theme='dark' richColors duration={10000} closeButton toastOptions={{
      classes: {
        closeButton: SUPPORTS.isAndroid ? "toast-close-button" : ""
      }
    }} />
    <ViewAnime bind:overlay={$overlay} />
    <UpdateModal/>
    <TorrentModal bind:overlay={$overlay} />
    <Router bind:page={$page} bind:overlay={$overlay} />
  </div>
  <Navbar bind:page={$page} />
</div>

<style>

  :global(.toast-close-button){
    bottom: -10px !important;
    right: -10px !important;
    left: unset !important;
    top: unset !important;
  }

  :global(:where([data-sonner-toast]) :where([data-disabled='true']) ){
    opacity: 0 !important;
  }

  :global(:root){
    --normal-bg: var(--dark-color-light) !important;
  }

  .content-wrapper {
    will-change: width;
    white-space: pre-line;
    top: 0 !important;
  }

  .page-wrapper > .content-wrapper {
    margin-left: var(--sidebar-minimised) !important;
    width: calc(100% - var(--sidebar-minimised)) !important;
    transition: none !important;
  }
  .page-wrapper {
    height: calc(100% - var(--navbar-height)) !important;
  }
  @media (min-width: 769px) {
    .page-wrapper  {
      padding-left: max(var(--safe-area-left), env(safe-area-inset-left, 0)) !important;
    }
  }
</style>
