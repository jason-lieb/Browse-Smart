<script>
  import Nav from './components/Nav.svelte'
  import Body from './components/Body.svelte'

  let filters = ['Current Window', 'All']
  let windows = [[
    {
      title: 'Tab 1',
      url: 'www.taburl.com',
      favIcon: 'https://developer.chrome.com/images/meta/favicon-32x32.png'
    },
    {
      title: 'Tab 2',
      url: 'www.taburl.com',
      favIcon: 'https://developer.chrome.com/images/meta/favicon-32x32.png'
    }
  ]]; // Get example data

  // chrome.tabs.query({ "currentWindow": true }, init)

  // function init(rawData) {
  //   let { windowIDs, tabs } = getAllData(rawData);
  //   windowIDs.forEach(createHomeTab);
  // }

  // function getAllData(rawData) {
  //   const tabs = [];
  //   let windowIDs = new Set();
  //   if (chrome.runtime.lastError) {
  //     console.error(chrome.runtime.lastError);
  //   } else {
  //     for (const tab of rawData) {
  //       windowIDs.add(tab.windowId);
  //       tabs.push({
  //         title: tab.title,
  //         active: tab.active,
  //         groupID: tab.groupId,
  //         windowID: tab.windowId,
  //         index: tab.index,
  //         url: tab.url,
  //         favIconURL: tab.favIconUrl
  //       })
  //     }
  //     windowIDs = Array.from(windowIDs);
  //     return { windowIDs, tabs }
  //   }
  // }

  // function createHomeTab(windowID) {
  //   chrome.tabs.create({
  //     "windowId": windowID,
  //     // "pinned": true,
  //     "index": 0,
  //     // "url": './home.html'
  //   });
  // }
</script>

<main>
  <Nav {filters}/>
  <Body {windows}/>
</main>

<style>
  main {
    height: 100vh;
    display: grid;
    grid-template-columns: 15rem 1fr;
  }
</style>
