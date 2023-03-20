<script>
  import Window from './window/Window.svelte'
  import {
    currentWindow,
    allWindows,
    sleeping,
    selectedFilter,
  } from '../stores.js'
</script>

<div class="container-fluid">
  {#if $selectedFilter === 'Current Window'}
    <Window window={$currentWindow} on:button />
  {:else if $selectedFilter === 'All'}
    {#each $allWindows as window, windowIndex}
      <Window {window} {windowIndex} on:button />
    {/each}
  {:else if $selectedFilter === 'Sleeping'}
    <Window window={$sleeping} />
  {/if}
  <div class="padding" />
</div>

<style>
  div {
    grid-column: 2;
  }

  .padding {
    height: 1rem;
  }
</style>
