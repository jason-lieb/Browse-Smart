<script>
  import Delete from './Delete.svelte'
  export let tab
</script>

<div class="container flex">
  <img src={tab.favIcon} alt="Tab Fav Icon">
  <div class="stackedText">
    <h4>{tab.title}</h4>
    <p>{tab.url}</p>
  </div>
  <Delete />
</div>

<style>
  .flex {
    display: flex;
    align-items: center;
  }
</style>