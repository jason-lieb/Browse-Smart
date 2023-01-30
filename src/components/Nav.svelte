<script>
  import Filter from './Filter.svelte'
  export let filters
</script>
<div class="container">
  <h1>Tab Manager</h1>
  {#each filters as filter}
    <Filter {filter}/>
  {/each}
</div>

<style>
  h1 {
    text-align: center;
  }
</style>