<script>
  import Tab from './Tab.svelte'
  import WindowHeader from './WindowHeader.svelte'
  import GroupHeader from './GroupHeader.svelte'
  export let window
  export let windowIndex = -1
  export let groups
</script>

<div class="main">
  <div class="window container">
    <WindowHeader {windowIndex} />
    {#each window as tab, index}
      {#if tab.groupID !== -1 && window[index - 1].groupID !== tab.groupID }
        <GroupHeader group={groups[tab.groupID]}/>
      {:else if tab.groupID !== -1}
        <Tab {tab} group={groups[tab.groupID]}/>
      {:else}
        <Tab {tab}/>
      {/if}
    {/each}
  </div>
</div>

<style>
  .main {
    max-width: calc(100vw - 17rem);
    padding: 1rem 0;
  }
  .window {
    max-width: 100%;
    border: 1px solid rgba(115, 130, 140, 0.2);
    background: hsl(206, 29%, 11%);
    padding: 0.5rem 1rem;
    margin: 0;
    border-radius: 0.5rem;
    display: grid;
    grid-template-columns: 1.25rem 1fr;
  }
</style>