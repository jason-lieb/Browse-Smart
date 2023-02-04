<script>
  import Filter from './Filter.svelte'
  export let filters
  export let selectedFilter
</script>
<div class="container">
  <h1>Tab Manager</h1>
  {#each filters as filter}
    <Filter {filter} {selectedFilter} />
  {/each}
</div>

<style>
  h1 {
    text-align: center;
    margin: 2rem 0;
    color: rgb(26, 179, 230);
  }
  div {
    border-right: solid 1px rgba(115, 130, 140, 0.2);
    background: hsl(206, 29%, 11%);
  }
</style>