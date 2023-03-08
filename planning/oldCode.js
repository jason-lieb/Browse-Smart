// // // Check if data was actually updated in updateOnEvent
// let windowIDs = await chrome.storage.local.get('windowIDs')
// windowIDs = JSON.parse(windowIDs.windowIDs)
// const windows = []
// for (let windowID of windowIDs) {
//   const window = await chrome.storage.local.get(String(windowID))
//   // console.log(window)
//   // console.log(window[String(windowID)])
//   // console.log(JSON.parse(window[String(windowID)]))
//   windows.push(JSON.parse(window[String(windowID)]))
// }
// console.log(windows)

//
// console.time('hometabs')
// let promise = await wait3sec()
// console.timeEnd('hometabs')
// function wait3sec() {
//   return new Promise((resolve) => setTimeout(resolve, 3000))
// }
//

// function debounce(func) {
//   let timeout = 500
//   let timer
//   return (...args) => {
//     clearTimeout(timer)
//     timer = setTimeout(() => {
//       func.apply(this, args)
//     }, timeout)
//   }
// }

// function readData(IDs) {
//   IDs.forEach((ID) => {
//     chrome.storage.local.get(ID, (data) => {
//       console.log(JSON.parse(data[Object.keys(data)]))
//     });
//   })
// }

// let rawData = await chrome.tabs.query({});

// parse data
// const global = {};
// rawData.forEach((tab) => { // Switch from object to map for hash table?
//   if (!global[String(tab.windowId)]) global[String(tab.windowId)] = [];
//   global[String(tab.windowId)][tab.index] = new Tab(tab.id, tab.title, tab.url, tab.favIconUrl, tab.groupId);
// })

// let tab = new Tab(tab.id, tab.title, tab.url, tab.favIconUrl, tab.groupId);
// let newWindow = new Window(id, tabsInWindow, tabsInWindow);

// function checkForFileTab(rawData) {
//   let toRemove = [];
//   rawData.forEach((tab, i) => {
//     if (tab.url === 'chrome://file-manager/') toRemove.unshift(i)
//   })
//   toRemove.forEach((i) => {
//     rawData = [...rawData.slice(0, i), ...rawData.slice(i+1)];
//   })
//   return rawData;
// }
