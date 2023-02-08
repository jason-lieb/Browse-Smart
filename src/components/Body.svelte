<script>
  import Window from './Window.svelte'
  import { selectedFilter } from '../stores.js'
  export let windows
</script>
<div class="container-fluid">
  {#if $selectedFilter === 'Current Window'}
    <Window window={windows.currentWindow} />
  {:else}
    {#each windows.allWindows as window, windowIndex}
      <Window {window} {windowIndex}/>
    {/each}
  {/if}

</div>

<style>
  div {
    grid-column: 2;
  }
</style>