<script>
  import Nav from './components/Nav.svelte'
  import Body from './components/Body.svelte'

  let filters = ['Current Window', 'All', 'Sleeping']
  let selectedFilter = 'Current Window';
  let windows = [];

  // document.addEventListener('visibilitychange', () => {
  //   if (!document.hidden) {
  //     // Reload
  //     //// Send message to background to update data
  //     //// Read message from background
  //     //// Update DOM
  //   }
  // })

  // Send message to background asking for window ID when created

  // @ts-ignore
  chrome.runtime.onMessage.addListener((message) => readData(message));

  function readData(ID) {
    // @ts-ignore
    chrome.storage.local.get(ID, (data) => {
      // @ts-ignore
      windows = [JSON.parse(data[Object.keys(data)]).slice(1)];
    });
  }

</script>

<main>
  <Nav {filters} {selectedFilter}/>
  <Body {windows}/>
</main>

<style>
  main {
    height: 100vh;
    max-width: 100vw;
    overflow-x: hidden;
    display: grid;
    grid-template-columns: 15rem 1fr;
  }
</style>
