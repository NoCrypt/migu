<script>
  import { click } from "@/modules/click.js";
  import { Lock } from 'lucide-svelte'

  export let isLocked = false;
  let lockImmersed = false;
  let lockImmerseTimeout = null;

  function immerse() {
    lockImmersed = true;
    lockImmerseTimeout = undefined;
  }

  function resetImmerse() {
    clearTimeout(lockImmerseTimeout);
    lockImmersed = false;
    lockImmerseTimeout = setTimeout(immerse, 1000);
  }

  function toggleImmerse() {
    clearTimeout(lockImmerseTimeout)
    lockImmersed = !lockImmersed
  }
</script>

{#if isLocked}
  <div
    on:click={toggleImmerse}
    on:mouseleave={immerse}
    on:pointermove={resetImmerse}
    on:keypress={resetImmerse}
    on:keydown={resetImmerse}
    role="none"
    class="position-absolute bg-transparent w-full h-full z-50 d-flex align-items-start justify-content-end"
    style="padding: 28px"
  >
    <span
      class="icon pointer lock-button"
      class:opacity-0={lockImmersed}
      use:click={() => (isLocked = false)}>
        <Lock size='2.5rem' strokeWidth={2.5} />

      </span
    >
  </div>
{/if}

<style>
  .opacity-0 {
    opacity: 0;
  }

  .lock-button {
    transition: opacity 0.3s;
    background-color: rgba(20, 20, 20, 0.6);
    padding: 8px;
    border-radius: 4px;
    color: white;
  }

  .icon {
    font-size: 2.8rem;
    padding: 1.5rem;
    display: flex;
    font-variation-settings:
      "FILL" 1,
      "wght" 300,
      "GRAD" 100,
      "opsz" 64;
  }
</style>
