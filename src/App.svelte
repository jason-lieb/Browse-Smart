<script>
  import Nav from './components/nav/Nav.svelte'
  import Body from './components/Body.svelte'

  import { currentWindow, allWindows, sleeping, groups } from './stores.js'

  let filters = ['Current Window', 'All', 'Sleeping']
  let windowID

  init()

  // Load initial data and request windowID from background service
  function init() {
    // @ts-ignore
    setTimeout(chrome.runtime.sendMessage, 500, 'windowID')
    loadAllWindows()
    loadSleeping()
  }

  // Reload data on home tab visibility change
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(reload, 500)
    }
  })

  function reload() {
    if (windowID) loadCurrentWindow(windowID)
    loadAllWindows()
    loadSleeping()
  }

  // @ts-ignore // Handle message from background service
  chrome.runtime.onMessage.addListener(handleMessage)

  function handleMessage(message) {
    switch (message.length) {
      case 6: // message is 'update'
        if (windowID) loadCurrentWindow(windowID)
        loadAllWindows()
        loadSleeping()
        break
      default: // message is windowID
        if (message === 'windowID') return // Ignore the runtime message
        if (message.split(' ')[0] === 'sleep') return // Ignore messages sent from home tab buttons
        if (message.split(' ')[0] === 'delete') return
        if (message.split(' ')[0] === 'wake') return
        windowID = message
        loadCurrentWindow(message)
    }
  }

  //////////////////////////////// Move Data Functions to Different File

  async function loadAllWindows() {
    // @ts-ignore
    let windowIDs = await chrome.storage.local.get('windowIDs')
    windowIDs = JSON.parse(windowIDs['windowIDs'])
    let allWindowsBuild = []
    for (let id of windowIDs) {
      let newWindow = await readWindow(String(id))
      allWindowsBuild.push(newWindow)
    }
    allWindows.set(allWindowsBuild)
  }

  async function loadSleeping() {
    // @ts-ignore
    let sleepingTabs = await chrome.storage.local.get('sleeping')
    sleepingTabs =
      Object.keys(sleepingTabs).length > 0
        ? JSON.parse(sleepingTabs['sleeping'])
        : []
    const sleepingBuild = await buildWindow(sleepingTabs)
    sleeping.set(sleepingBuild)
  }

  async function loadCurrentWindow(id) {
    let currentWindowBuild = await readWindow(id)
    if (!currentWindowBuild) return
    currentWindow.set(currentWindowBuild)
  }

  async function readWindow(id) {
    // @ts-ignore
    let data = await chrome.storage.local.get(id)
    // console.log('readWindow', id, data, data[id]) /////////////////////////////////
    if (!data[id]) return
    data = JSON.parse(data[id])
    let window = await buildWindow(data.tabIDs.slice(1))
    data.groupIDs.forEach((id) => loadGroup(id))
    return window
  }

  async function buildWindow(ids) {
    let buildWindow = []
    for (let id of ids) {
      // @ts-ignore
      let output = await chrome.storage.local.get(String(id))
      buildWindow.push({ ...JSON.parse(output[id]), id })
    }
    return buildWindow
  }

  async function loadGroup(id) {
    // @ts-ignore
    let group = await chrome.storage.local.get(String(id))
    group = JSON.parse(group[id])
    groups.update((currentGroups) => ({ ...currentGroups, [id]: group }))
  }
</script>

<main>
  <Nav {filters} />
  <Body />
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
