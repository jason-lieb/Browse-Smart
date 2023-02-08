<script>
  export let windowIndex
</script>

<div class="header">
  {#if windowIndex === -1}
    <input type="text" placeholder="Current Window" readonly>
  {:else}
    <input type="text" placeholder="Window {windowIndex + 1}" readonly>
  {/if}
</div>

<style>
  .header {
    background: hsl(206, 29%, 11%);
    grid-column: span 2;
  }
  input {
    border: none;
    padding: .125rem;
    padding-left: .625rem;
    margin-left: 1.5rem;
    margin-bottom: 0.375rem;
    background: hsl(206, 29%, 11%);
    font-size: 1.5rem;
    font-weight: bold;
    font-style: italic;
    color: rgb(26, 179, 230);
    max-width: 20rem;
  }
  input::placeholder {
    color: rgb(26, 179, 230);
  }
  input:focus {
    box-shadow: none;
  }
</style>