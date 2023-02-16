<script>
  import Window from './Window.svelte'
  import { selectedFilter } from '../stores.js'
  export let windows
  export let groups
</script>

<div class="container-fluid">
  {#if $selectedFilter === 'Current Window'}
    <Window window={windows.currentWindow} {groups} />
  {:else if $selectedFilter === 'All'}
    {#each windows.allWindows as window, windowIndex}
      <Window {window} {windowIndex} {groups} />
    {/each}
  {/if}
</div>

<style>
  div {
    grid-column: 2;
  }
</style>
