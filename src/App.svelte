<script>
  import Nav from './components/Nav.svelte'
  import Body from './components/Body.svelte'
  // import { selectedFilter } from './stores.js'

  let filters = ['Current Window', 'All', 'Sleeping']
  let windows = {
    currentWindow: [],
    allWindows: [],
  }
  let groups

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
  chrome.runtime.onMessage.addListener(loadCurrentWindow)

  setTimeout(loadAllWindows, 2000)
  setTimeout(loadAllGroups, 0)

  async function loadAllWindows() {
    // @ts-ignore
    let windowIDs = await chrome.storage.local.get('windowIDs')
    windowIDs = JSON.parse(windowIDs['windowIDs'])
    let allWindows = []
    for (let id of windowIDs) {
      let newWindow = await readWindow(String(id))
      allWindows.push(newWindow)
    }
    windows.allWindows = allWindows
  }

  async function loadAllGroups() {
    // @ts-ignore
    let loadGroups = await chrome.storage.local.get('groups')
    loadGroups = JSON.parse(loadGroups['groups'])
    groups = loadGroups
  }

  async function loadCurrentWindow(id) {
    let buildWindow = await readWindow(id)
    windows.currentWindow = buildWindow
  }

  async function readWindow(id) {
    // @ts-ignore
    let data = await chrome.storage.local.get(id) //, async (data) => {
    //   // Get Tab IDs and Group IDs
    //   let window = JSON.parse(data[id]);
    //   // Build windows for current window
    //   let buildWindow = await buildWindowFunc(window.tabIDs.slice(1));
    //   return buildWindow
    //   // console.log(windows.currentWindow)

    //   // window.groupIDs.forEach((id) => readGroup(String(id))); // switch to build group and output group array / object / map?
    // });
    data = JSON.parse(data[id])
    let window = await buildWindow(data.tabIDs.slice(1))
    return window
  }

  async function buildWindow(ids) {
    let buildWindow = []
    for (let id of ids) {
      // @ts-ignore
      let output = await chrome.storage.local.get(String(id))
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

  // async function readGroup(id) {
  //   // console.log('id', id);
  //   // @ts-ignore
  //   let data = await chrome.storage.local.get(id);
  //   // console.log('data', data);
  //   let group = JSON.parse(data[id]);
  //   // console.log('group', group);
  // }
</script>

<main>
  <Nav {filters} />
  <Body {windows} {groups} />
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
