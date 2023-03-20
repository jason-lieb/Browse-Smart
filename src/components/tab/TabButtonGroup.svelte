<script>
  import Delete from '../buttons/Delete.svelte'
  import Sleep from '../buttons/Sleep.svelte'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  function handleClick(e) {
    let button
    switch (e.target.nodeName) {
      case 'path':
        button = e.target.parentNode.parentNode.className.split(' ')[0]
        break
      case 'svg':
        button = e.target.parentNode.className.split(' ')[0]
        break
      case 'BUTTON':
        button = e.target.className.split(' ')[0]
        break
      default:
        return
    }
    dispatch('button', { button })
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
    flex-shrink: 0;
    width: 6rem;
    opacity: 0;
    margin-right: 0.5rem;
  }
  div:hover {
    opacity: 100%;
  }
</style>
