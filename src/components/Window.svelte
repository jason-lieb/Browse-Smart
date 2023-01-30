<script>
  import Tab from './Tab.svelte'
  export let tabs
</script>

{#each tabs as tab}
  <Tab {tab} />
{/each}