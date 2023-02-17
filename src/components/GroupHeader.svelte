<script>
  export let group
  export let groupID
  export let toggleRotate

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function toggleGroup(e) {
    let div = toggleRotate(e)
    dispatch('message', { id: div.parentNode.id })
  }

  let accordionColor = `stroke: var(--${group.color})`;
</script>

<div class="groupHeader" id={String(groupID)}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div on:click={toggleGroup} class="rotate accordionGroup" style={accordionColor}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"><polyline points="6 9 12 15 18 9" /></svg
    >
  </div>
  <input type="text" placeholder={group.title} class={group.color} readonly />
</div>

<style>
  .groupHeader {
    --grey: #dadce0;
    --blue: #7cb7f5;
    --red: #f48984;
    --yellow: #f8d36e;
    --green: #77c897;
    --pink: #f68bca;
    --purple: #c68ff5;
    --cyan: #5ddaeb;
    --orange: #f6aa76;

    grid-column: span 2;
    height: 3rem;
    position: relative;
    top: -1.25rem;
  }

  .accordionGroup {
    position: relative;
    top: 2.15rem;
    left: -0.45rem;
    height: 24px;
    width: 24px;
    z-index: 1;
  }

  .rotate {
    transform: rotate(-90deg);
  }
  input {
    border: none;
    padding: 0.125rem;
    padding-left: 0.625rem;
    margin-left: 2.5rem;
    margin-bottom: 0;
    background: hsl(206, 29%, 11%);
    font-size: 1.25rem;
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
  .grey, .grey::placeholder {
    color: var(--grey);
  }
  .blue, .blue::placeholder {
    color: var(--blue);
  }
  .red, .red::placeholder {
    color: var(--red);
  }
  .yellow, .yellow::placeholder {
    color: var(--yellow);
  }
  .green, .green::placeholder {
    color: var(--green);
  }
  .pink, .pink::placeholder {
    color: var(--pink);
  }
  .purple, .purple::placeholder {
    color: var(--purple);
  }
  .cyan, .cyan::placeholder {
    color: var(--cyan);
  }
  .orange, .orange::placeholder {
    color: var(--orange);
  }
</style>
