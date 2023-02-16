<script>
  import Filter from './Filter.svelte'
  export let filters
</script>

<div class="container">
  <h1>Browser Hero</h1>
  {#each filters as filter}
    <Filter {filter} />
  {/each}
</div>

<style>
  @font-face {
    font-family: lobster;
    src: url('../assets/Lobster-Regular.ttf');
  }
  h1 {
    text-align: center;
    margin: 1rem 0;
    padding: 1rem;
    color: rgb(26, 179, 230);
    font-family: lobster, system-ui;
    font-size: 2.5rem;
  }
  div {
    border-right: solid 1px rgba(115, 130, 140, 0.2);
    background: hsl(206, 29%, 11%);
    position: absolute;
    top: 0;
    left: 0;
    width: 15rem;
    height: 100vh;
  }
</style>
