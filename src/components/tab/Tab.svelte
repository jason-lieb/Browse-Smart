<script>
  import TabButtonGroup from './TabButtonGroup.svelte'
  export let tab
  export let group = { color: 'background' }

  function handleClick(e) {
    console.log(e)
  }
</script>

<div class="group {group.color}" />
<div class="flex">
  <div class="tab">
    {#if tab.favIcon}
      <img src={tab.favIcon} alt="Tab Fav Icon" />
    {:else}
      <div class="blank" />
    {/if}
    <div class="stackedText">
      <h6>{tab.title}</h6>
      <p>{tab.url}</p>
    </div>
  </div>
  <TabButtonGroup />
</div>

<style>
  .group {
    height: 4rem;
    width: 0.25rem;
  }
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #11191f;
    border: 1px solid rgba(115, 130, 140, 0.2);
    margin: 0.25rem 0;
    border-radius: 0.5rem;
  }
  .tab {
    display: flex;
    align-items: center;
  }
  .stackedText {
    max-width: calc(100vw - 25rem);
    flex-shrink: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  img,
  .blank {
    margin: 0.5rem 1rem;
    width: 32px;
    height: 32px;
  }
  h6 {
    margin-top: 0.25rem;
    margin-bottom: 0;
    /* text-overflow: ellipsis; */
    white-space: nowrap;
    font-size: 112.5%;
  }
  p {
    margin-bottom: 0.25rem;
    white-space: nowrap;
    font-size: 100%;
    /* text-overflow: ellipsis; */
  }
  .background {
    background: hsl(206, 29%, 11%);
  }
  .grey {
    background: #dadce0;
  }
  .blue {
    background: #7cb7f5;
  }
  .red {
    background: #f48984;
  }
  .yellow {
    background: #f8d36e;
  }
  .green {
    background: #77c897;
  }
  .pink {
    background: #f68bca;
  }
  .purple {
    background: #c68ff5;
  }
  .cyan {
    background: #5ddaeb;
  }
  .orange {
    background: #f6aa76;
  }
</style>
