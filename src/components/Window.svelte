<script>
  import Tab from './Tab.svelte'
  import WindowHeader from './WindowHeader.svelte'
  import GroupHeader from './GroupHeader.svelte'

  import { selectedFilter } from '../stores.js'

  export let window
  export let windowIndex = -1
  export let groups

  let collapsed = false;

  function toggleRotate(e) {
    let div
    switch (e.target.nodeName) {
      case 'svg':
        div = e.target.parentNode
        break
      case 'polyline':
        div = e.target.parentNode.parentNode
        break
      default:
        div = e.target
    }
    let classes = div.className.split(' ')
    classes = classes[0] === 'rotate' ? [classes[1], classes[2]] : ['rotate', ... classes]
    div.className = classes.join(' ')
    return div
  }

  function toggleWindow(e) {
    collapsed = collapsed === true ? false : true
    toggleRotate(e);
  }

  function handleMessage(e) {
    groups[e.detail.id].collapsedInSvelte = (groups[e.detail.id].collapsedInSvelte ?? groups[e.detail.id].collapsed) ? false : true
  }
</script>

<div class="main">
  <div class="window container">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    {#if $selectedFilter !== 'Current Window'}
    <div on:click={toggleWindow} class="rotate accordion">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"><polyline points="6 9 12 15 18 9" /></svg
      >
    </div>
    {:else}
      <div></div>
    {/if}
    <WindowHeader {windowIndex} />
    {#if !collapsed}
      {#each window as tab, index}
        {#if tab.groupID !== -1 && window[index - 1].groupID !== tab.groupID}
          <GroupHeader group={groups[tab.groupID]} groupID={tab.groupID} {toggleRotate} on:message={handleMessage}/>
        {/if}
        {#if tab.groupID !== -1 && !(groups[tab.groupID].collapsedInSvelte ?? groups[tab.groupID].collapsed)}
          <Tab {tab} group={groups[tab.groupID]} />
        {:else if tab.groupID === -1}
          <Tab {tab} />
        {/if}
      {/each}
    {/if}
  </div>
</div>

<style>
  .main {
    max-width: calc(100vw - 17rem);
    padding-top: 1rem;
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
  .rotate {
    transform: rotate(0deg) !important;
  }
  .accordion {
    position: relative;
    top: 1rem;
    left: -0.5rem;
    height: 24px;
    width: 24px;
    stroke: rgb(26, 179, 230);
    transform: rotate(-90deg);
  }
</style>
