<script>
  import Delete from '../Delete.svelte'
  import Sleep from '../Sleep.svelte'

  function handleClick(e) {
    console.log(e.target.nodeName)
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={handleClick}>
  <Sleep />
  <Delete />
</div>

<style>
  div {
    display: flex;
    justify-content: flex-end;
    width: 12rem;
    opacity: 0;
    margin-right: 0.5rem;
  }
  div:hover {
    opacity: 100%;
  }
</style>
