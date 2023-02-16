<script>
  import Tab from './Tab.svelte'
  import WindowHeader from './WindowHeader.svelte'
  import GroupHeader from './GroupHeader.svelte'
  export let window
  export let windowIndex = -1
  export let groups

  function toggleRotate(e) {
    let classes =
      e.target.nodeName === 'svg'
        ? e.target.parentNode.className.split(' ')
        : e.target.className.split(' ')
    let newClasses = classes.map((className) => {
      if (className === 'closed') {
        // update for accordion / rotate
        return 'expanded'
      } else if (className === 'expanded') {
        return 'closed'
      } else {
        return className
      }
    })
    if (e.target.nodeName === 'svg') {
      e.target.parentNode.className = newClasses.join(' ')
    } else {
      e.target.className = newClasses.join(' ')
    }
  }
</script>

<div class="main">
  <div class="window container">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div on:click={toggleRotate} class="accordion rotate">
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
    <WindowHeader {windowIndex} />
    {#each window as tab, index}
      {#if tab.groupID !== -1 && window[index - 1].groupID !== tab.groupID}
        <GroupHeader group={groups[tab.groupID]} />
      {:else if tab.groupID !== -1}
        <Tab {tab} group={groups[tab.groupID]} />
      {:else}
        <Tab {tab} />
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
  .rotate {
    transform: rotate(-90deg);
  }
  .accordion {
    position: relative;
    top: 1rem;
    left: -0.5rem;
    height: 24px;
    width: 24px;
    stroke: rgb(26, 179, 230);
  }
</style>
