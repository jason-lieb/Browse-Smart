<script>
  import Window from './Window.svelte'
  export let windows
</script>
<div class="container">
  {#each windows as tabs}
    <Window {tabs}/>
  {/each}
</div>