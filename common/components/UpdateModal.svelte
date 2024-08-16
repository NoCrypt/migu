<script context='module'>
  import { click } from '@/modules/click.js'
  import { writable } from 'simple-store-svelte'
  import IPC from '@/modules/ipc.js';

  export const updateModal = writable(false)
  export const changeLog = (async () => {
    const res = await fetch('https://api.github.com/repos/NoCrypt/migu/releases')
    const json = await res.json()
    return [json.map(({ body, tag_name: version, published_at: date, assets }) => ({ body, version, date, assets }))[0]]
  })()
</script>

<script>
  import { SUPPORTS } from "@/modules/support.js";

  let modal
  let ignoreVersion = false
  function close () {
    if (ignoreVersion) {
      changeLog.then((cl)=>localStorage.setItem('ignoredVersion', cl[0].version))
    }
    $updateModal = false
  }
  function checkClose ({ keyCode }) {
    if (keyCode === 27) close()
  }
  function confirm () {
    IPC.emit('update-download')
    $updateModal = false
  }
  $: $updateModal && modal?.focus()

</script>
  
  <div class='modal z-40' class:show={$updateModal}>
    {#if $updateModal}
      <div class='modal-dialog' on:pointerup|self={close} on:keydown={checkClose} tabindex='-1' role='button' bind:this={modal}>
        <div class='modal-content d-flex justify-content-center flex-column' style="width: 70rem; overflow-y: hidden">
          <button class='close pointer z-30 top-20 right-0 position-absolute' type='button' use:click={close}> &times; </button>
          <!-- <h5 class='modal-title'>Update Available: v.5.6969</h5> -->
          <p>
            <!-- changelog -->
            {#await changeLog}
              {#each Array(1) as _}
                <div class='row px-20 px-sm-0'>
                  <div class='col-sm-3 my-20 order-last order-sm-first '>
                    <div class='skeloader rounded w-100 h-10 bg-very-dark'>
                      <div class='skeleloader-swipe' />
                    </div>
                  </div>
                  <div class='col-sm-9'>
                    <div class='skeloader rounded w-150 h-25 bg-very-dark mb-10'>
                      <div class='skeleloader-swipe' />
                    </div>
                    <div class='skeloader rounded w-250 h-10 bg-very-dark mt-20'>
                      <div class='skeleloader-swipe' />
                    </div>
                    <div class='skeloader rounded w-200 h-10 bg-very-dark mt-15'>
                      <div class='skeleloader-swipe' />
                    </div>
                  </div>
                </div>
              {/each}
          {:then changelog}
            {#each changelog as { version, date, body }}
              <div class='row px-20 px-sm-0 position-relative' tabindex='0' role='button'>
                <div class='col-sm-9  text-muted'>
                  <h2 class='mt-0 font-weight-bold text-white'>New Update Available</h2>
                  {version} | {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} <br/>
                  {#if SUPPORTS.isAndroid}
                    <div class='text-left mt-20'>
                      <h4 class='mt-0 font-weight-bold text-white'>Notice</h4>
                      <div class="text-muted" style='font-style: italic;'>This update was served directly from the GitHub release. If you have downloaded this app from F-Droid or IzzyOnDroid, please be aware that updating this way did not go through the additional screening process typically performed by these platforms.</div>
                    </div>
                  {/if}
                  <hr class='my-20'/>
                  <h4 class='mt-0 font-weight-bold text-white'>Changelog</h4>
                  <div class="pre-wrap">
                    {body.replaceAll('- ', '• ')}
                  </div>
                    
                </div>
              </div>
            {/each}
          {:catch}
            {#each Array(1) as _}
              <div class='row px-20 px-sm-0'>
                <div class='col-sm-3 my-20 order-last order-sm-first '>
                  <div class='skeloader rounded w-100 h-10 bg-very-dark'>
                    <div class='skeleloader-swipe' />
                  </div>
                </div>
                <div class='col-sm-9'>
                  <div class='skeloader rounded w-150 h-25 bg-very-dark mb-10'>
                    <div class='skeleloader-swipe' />
                  </div>
                  <div class='skeloader rounded w-250 h-10 bg-very-dark mt-20'>
                    <div class='skeleloader-swipe' />
                  </div>
                  <div class='skeloader rounded w-200 h-10 bg-very-dark mt-15'>
                    <div class='skeleloader-swipe' />
                  </div>
                </div>
              </div>
            {/each}
          {/await} 
          </p>

          <div class=' text-right mt-20'>
            <input type='checkbox' id='player-sub-blur' bind:checked={ignoreVersion}  />
            <label for='player-sub-blur'>Ignore this version</label>
          </div>
          <div class='text-right mt-20'>
            <button class='btn mr-5 btn-danger' type='button' on:click={close}>{ignoreVersion ? 'Ignore' : 'Cancel'}</button>
            <button class='btn btn-primary' type='button' on:click={confirm}>Update</button>
          </div>

        </div>
      </div>
    {/if}
  </div>
  
  <style>
    .close {
      top: 4rem !important;
      left: unset !important;
      right: 2.5rem !important;
    }
    .modal {
        background-color: rgba(0, 0, 0, 0.4) !important;
    }
    .modal-dialog:focus-visible {
      box-shadow: none !important;
    }
    .modal:focus-visible {
      box-shadow: none !important;
    }
  </style>
  