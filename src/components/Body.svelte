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
  <div class="padding"></div>
</div>

<style>
  div {
    grid-column: 2;
  }

  .padding {
    height: 1rem;
  }
</style>
