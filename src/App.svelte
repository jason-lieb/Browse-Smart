<script>
  import Nav from './components/Nav.svelte'
  import Body from './components/Body.svelte'
  import { selectedFilter } from './stores.js'


  let filters = ['Current Window', 'All', 'Sleeping']
  let windows = {
    currentWindow: [],
    allWindows: []
  };
  let currentWindow;

  // function testConsole() {
  //   console.log(selectedFilter);
  // }
  // testConsole();
  // setTimeout(testConsole, 8000);

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
  chrome.runtime.onMessage.addListener(readWindow);


  function readWindow(id) {
    // If id is not an array?

    // @ts-ignore
    chrome.storage.local.get(id, async (data) => {
      // Get Tab IDs and Group IDs
      let window = JSON.parse(data[id]);
      // Build windows for current window
      windows.currentWindow = await buildWindow(window.tabIDs.slice(1));
      console.log(windows.currentWindow)

      // window.groupIDs.forEach((id) => readGroup(String(id))); // switch to build group and output group array / object / map?
    });
  }

  async function buildWindow(ids) {
    let buildWindow = [];
    for (let id of ids) {
      // @ts-ignore
      let output = await chrome.storage.local.get(String(id));
      buildWindow.push(JSON.parse(output[id]))
    }
    return buildWindow
  }

  // function readTab(id) {
  //   // @ts-ignore
  //   chrome.storage.local.get(id, (data) => {
  //     // console.log(JSON.parse(data[id]))
  //     return JSON.parse(data[id]);
  //   })
  // }

  async function readGroup(id) {
    // console.log('id', id);
    // @ts-ignore
    let data = await chrome.storage.local.get(id);
    // console.log('data', data);
    let group = JSON.parse(data[id]);
    // console.log('group', group);
  }

</script>

<main>
  <Nav {filters} />
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
