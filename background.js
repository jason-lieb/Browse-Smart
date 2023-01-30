chrome.runtime.onInstalled.addListener(() => chrome.tabs.query({ "currentWindow": true }, init))

function init(rawData) {
  let { windowIDs, tabs } = getAllData(rawData);
  windowIDs.forEach(createHomeTab);
}

function getAllData(rawData) {
  const tabs = [];
  let windowIDs = new Set();
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError);
  } else {
    for (const tab of rawData) {
      windowIDs.add(tab.windowId);
      tabs.push({
        title: tab.title,
        active: tab.active,
        groupID: tab.groupId,
        windowID: tab.windowId,
        index: tab.index,
        url: tab.url,
        favIconURL: tab.favIconUrl
      })
    }
    windowIDs = Array.from(windowIDs);
    return { windowIDs, tabs }
  }
}

function createHomeTab(windowID) {
  chrome.tabs.create({
    "windowId": windowID,
    // "active": true,
    // "pinned": true,
    "index": 0,
    "url": './index.html'
  });
}






// Classes for windows and tabs?
// List of window IDs to create pinned tabs

// Svelte components
//// Nav bar
//// Filters (Current Window and All / Workspaces and Tags)
//// Main Body
//// Windows
//// Tabs -> Group Support



///// Example of Chrome Local Storage from ChatGPT

// // Store data
// chrome.storage.local.set({'myKey': 'myValue'}, function() {
//   console.log('Data stored');
// });

// // Retrieve data
// chrome.storage.local.get(['myKey'], function(result) {
//   console.log(result.myKey); // Output: 'myValue'
// });
