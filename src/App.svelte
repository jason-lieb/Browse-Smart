<script>
  import Nav from './components/nav/Nav.svelte'
  import Body from './components/Body.svelte'

  let filters = ['Current Window', 'All', 'Sleeping']
  let windows = {
    currentWindow: [],
    allWindows: [],
  }
  let groups
  let windowID

  // Reload data on home tab visibility change
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      if (windowID) loadCurrentWindow(windowID)
      loadAllWindows()
      loadAllGroups()
    }
  })

  init()

  // Load initial data and request windowID from background service
  function init() {
    // @ts-ignore
    chrome.runtime.sendMessage('windowID')
    loadAllGroups()
    loadAllWindows()
  }

  // @ts-ignore // Handle message from background service
  chrome.runtime.onMessage.addListener(handleMessage)

  function handleMessage(message) {
    switch (message.length) {
      case 6: // message is 'update'
        if (windowID) loadCurrentWindow(windowID)
        loadAllWindows()
        loadAllGroups()
        break
      default: // message is windowID
        if (message === 'windowID') return // Ignore the runtime message
        windowID = message
        loadCurrentWindow(message)
    }
  }

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
    let data = await chrome.storage.local.get(id)
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
