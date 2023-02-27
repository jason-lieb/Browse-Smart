chrome.runtime.onInstalled.addListener(init)

async function init() {
  // chrome.storage.local.clear(); /////
  try {
    // Get window IDs, store window IDs to storage, and create home tab on each window
    const rawData = await chrome.windows.getAll({ windowTypes: ['normal'] })
    const windowIDs = createWindowIDs(rawData)
    windowIDs.forEach(createHomeTab) // Add in if (url !== '') -> check for already created home tabs [Pending URL...?]

    // Get data on all tabs / groups and save to storage
    const homeTabIDs = await updateData()
    // Tell all the home tabs the window ID of its window
    windowIDs.forEach((windowID, i) =>
      sendMessage(String(windowID), homeTabIDs[i])
    )
  } catch (err) {
    console.error(err)
  }
}

/////////////// Window IDs
function createWindowIDs(rawData) {
  let windowIDs = new Set()
  rawData.forEach((window) => windowIDs.add(window.id))
  chrome.storage.local.set(
    { windowIDs: JSON.stringify(Array.from(windowIDs)) },
    () => {
      let error = chrome.runtime.lastError
      if (error) {
        console.error(error)
      }
    }
  )
  return Array.from(windowIDs)
}

function createHomeTab(windowID) {
  chrome.tabs.create({
    windowId: windowID,
    active: false,
    pinned: true,
    index: 0,
    url: './index.html',
  })
}

///////////////////////// Data
async function updateData() {
  try {
    let rawWindows = await chrome.windows.getAll({
      populate: true,
      windowTypes: ['normal'],
    })
    let rawGroups = await chrome.tabGroups.query({})
    homeTabIDs = parseWindows(rawWindows)
    parseGroups(rawGroups)
    return homeTabIDs
  } catch (err) {
    console.error(err)
  }
}

function parseWindows(rawWindows) {
  const homeTabIDs = []
  // Loop through all windows
  rawWindows.forEach((window) => {
    let tabsInWindow = []
    let groupsInWindow = new Set()
    // Loop through all tabs in window
    window.tabs.forEach((tab) => {
      // Add tabs and groups
      tabsInWindow.push(tab.id)
      if (tab.groupId !== -1) groupsInWindow.add(tab.groupId)
      // Save tab info to local storage for each individual tab
      let tabContent = {
        title: tab.title,
        url: tab.url,
        favIcon: tab.favIconUrl,
        groupID: tab.groupId,
      }
      chrome.storage.local.set(
        { [String(tab.id)]: JSON.stringify(tabContent) },
        () => {
          let error = chrome.runtime.lastError
          if (error) {
            console.error(error)
          }
        }
      )
    })
    let windowContent = {
      tabIDs: tabsInWindow,
      groupIDs: Array.from(groupsInWindow),
    }
    homeTabIDs.push(tabsInWindow[0])
    chrome.storage.local.set(
      { [String(window.id)]: JSON.stringify(windowContent) },
      () => {
        let error = chrome.runtime.lastError
        if (error) {
          console.error(error)
        }
      }
    )
  })
  return homeTabIDs
}

function parseGroups(rawGroups) {
  const groups = {}
  rawGroups.forEach((group) => {
    let groupID = group.id
    let groupContent = {
      title: group.title,
      color: group.color,
      collapsed: group.collapsed,
    }
    groups[groupID] = groupContent
    // chrome.storage.local.set({[String(group.id)]: JSON.stringify(groupContent)}, () => {
    //   let error = chrome.runtime.lastError;
    //   if (error) {
    //     console.error(error)
    //   }
    // })
    // groups.push(String(group.id)); // For testing
    // groups.set(group.id, { title: group.title, color: group.color })
  })
  chrome.storage.local.set({ groups: JSON.stringify(groups) }, () => {
    let error = chrome.runtime.lastError
    if (error) {
      console.error(error)
    }
  })
  // return groups;
}

function sendMessage(windowID, tabID) {
  setTimeout(chrome.tabs.sendMessage, 1000, tabID, windowID)
}

//
//
//
//

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

// class Tab {
//   constructor(id, title, url, favIcon, groupID) {
//     this.id = id;
//     this.title = title;
//     this.url = url;
//     this.favIcon = favIcon;
//     this.groupID = groupID;
//   }
// }

// class Window {
//   constructor(id, tabIDs, groupIDs) {
//     this.id = id;
//     this.tabs = tabIDs;
//     this.groupIDs = groupIDs;
//   }
// }

// class Group {
//   constructor(id, title, color, tabIDs) {
//     this.id = id;
//     this.title = title;
//     this.color = color;
//     this.tabIDs = tabIDs;
//   }
// }

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
