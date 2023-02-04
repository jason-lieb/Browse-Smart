<script>
  export let filter
  export let selectedFilter

  const selectFilter = (e) => {
    if (filter !== selectedFilter) {
      selectedFilter = filter;
    }
  }
</script>

{#if filter === selectedFilter}
<button class="selected">{filter}</button>
{:else}
<button class="outline" on:click={selectFilter}>{filter}</button>
{/if}
<style>

  button {
    margin: 1rem;
    padding: 0.5rem;
    width: 13rem;
  }
  .selected {
    color: #11191f;
  }

</style>