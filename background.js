// Global
let homeTabIDs
let windowIDs
let manageHomeRunning = false
let startedManageHomeTabs
let startedUpdateEvents
let updateAlreadyQueued
let manageAlreadyQueued
let _

// Initialization of Extension
chrome.runtime.onInstalled.addListener(manageHomeTabs)

// Handle messages from home tabs
chrome.runtime.onMessage.addListener(handleIncomingMessages)

// Events that will create a new window
chrome.windows.onCreated.addListener(manageHomeTabs)
chrome.tabs.onDetached.addListener(manageHomeTabs)

// Listen for if home tab is deleted or if home tab is only tab in window
chrome.tabs.onRemoved.addListener(manageHomeTabs)

// If home tab is unpinned, create new home tab and delete old one? ///////////////////////////////////////
chrome.tabs.onUpdated.addListener(updateOnEvent)

// Order of events if other pinned tabs are moved in front of home tab (is onUpdated first?) /////////////////////
chrome.tabs.onMoved.addListener(updateOnEvent)

// Events that only require updating data
chrome.windows.onRemoved.addListener(updateOnEvent)
chrome.tabs.onCreated.addListener(updateOnEvent)
chrome.tabGroups.onCreated.addListener(updateOnEvent)
chrome.tabGroups.onMoved.addListener(updateOnEvent)
chrome.tabGroups.onRemoved.addListener(updateOnEvent) ////////////////////// Investigate error
chrome.tabGroups.onUpdated.addListener(updateOnEvent)

// Parse windows query and save windowIDs to storage
function createWindowIDs(rawData) {
  let setWindowIDs = new Set()
  rawData.forEach((window) => setWindowIDs.add(window.id))
  chrome.storage.local.set(
    { windowIDs: JSON.stringify(Array.from(setWindowIDs)) },
    () => {
      let error = chrome.runtime.lastError
      if (error) {
        console.error(error)
      }
    }
  )
  windowIDs = Array.from(setWindowIDs)
}

// Query data and save to storage
async function updateData() {
  try {
    let rawWindows = await chrome.windows.getAll({
      populate: true,
      windowTypes: ['normal'],
    })
    let rawGroups = await chrome.tabGroups.query({})
    homeTabIDs = parseWindows(rawWindows)
    parseGroups(rawGroups)
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
  })
  chrome.storage.local.set({ groups: JSON.stringify(groups) }, () => {
    let error = chrome.runtime.lastError
    if (error) {
      console.error(error)
    }
  })
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function handleIncomingMessages(message, sender) {
  // console.log('incoming message')
  // console.log('message', message)
  // console.log('sender', sender)
  const windowIdOfSender = sender.tab.windowId
  switch (message) {
    case 'windowID':
      // console.log('response to incoming message')
      // console.log('windowIdOfSender', windowIdOfSender)
      chrome.tabs.sendMessage(sender.tab.id, String(windowIdOfSender))
      break
    default:
      console.log('default case')
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to update stored data on chrome events
async function updateOnEvent() {
  // Only run function if it hasn't been ran for 500 ms and manageHomeTabs isn't running
  if (Date.now() - startedUpdateEvents < 500 || manageHomeRunning) {
    if (!updateAlreadyQueued) {
      setTimeout(updateOnEvent, 1000)
      updateAlreadyQueued = true
    }
    return
  }
  startedUpdateEvents = Date.now()
  updateAlreadyQueued = false
  // console.log('run update') //////////////////////////////////////////

  // Update data and message active home tabs, so they know to update
  _ = await updateData()
  const activeTabs = await chrome.tabs.query({ active: true })
  activeTabs.forEach((active) => {
    if (homeTabIDs.includes(active.id))
      chrome.tabs.sendMessage(active.id, 'update')
  })
}

// Function to delete out of place home tabs and create home tabs at index 0
async function manageHomeTabs() {
  // Block update function from running
  manageHomeRunning = true

  // Only run function if it hasn't been ran for 500 ms
  if (Date.now() - startedManageHomeTabs < 500) {
    if (!manageAlreadyQueued) {
      setTimeout(manageHomeTabs, 1000)
      manageAlreadyQueued = true
    }
    return
  } // || updateEventsRunning
  startedManageHomeTabs = Date.now()
  manageAlreadyQueued = false
  // console.log('run manage') //////////////////////////////////////////

  // Query all windows with their tabs included
  const allWindows = await chrome.windows.getAll({
    windowTypes: ['normal'],
    populate: true,
  })

  // Set variable windowIDs
  createWindowIDs(allWindows) ///////////////////////// Necessary Here? / In Update Instead?

  // Delete all home tabs that aren't in index 0
  const tabsToDelete = findHomeTabsToDelete(allWindows)
  _ = await deleteHomeTabs(tabsToDelete)

  // Add home tabs to windows without home tab in position 0
  _ = await addHomeTabs(allWindows)

  manageHomeRunning = false
  updateOnEvent()
}

function findHomeTabsToDelete(allWindows) {
  const tabsToDelete = []
  allWindows.forEach((window) => {
    // Add tab ids of any home tabs not in index 0 to list to delete
    for (let i = 1; i < window.tabs.length; i++) {
      if (window.tabs[i].title === 'Browse Smart') {
        tabsToDelete.push(window.tabs[i].id)
      }
    }
    // Add tab id of home tab to list to delete if its the only tab in the window
    if (window.tabs.length === 1 && window.tabs[0].title === 'Browse Smart') {
      tabsToDelete.push(window.tabs[0].id)
    }
  })
  // console.log('all tabs to delete', tabsToDelete) ///////////////////
  return tabsToDelete
}

async function deleteHomeTabs(tabsToDelete) {
  // Loop to try to delete home tabs until it is successful
  let deletedSuccessfully = false
  do {
    try {
      _ = await deleteTabs(tabsToDelete)
      // console.log('deleted Successfully') ///////////////////
      deletedSuccessfully = true
    } catch (err) {
      _ = await wait()
      // console.log('test wait delete') ///////////////////
    }
  } while (!deletedSuccessfully)
  // console.log('end of delete Home Tabs') ///////////////////
}

async function deleteTabs(tabsToDelete) {
  _ = await chrome.tabs.remove(tabsToDelete)
}

async function addHomeTabs(allWindows) {
  // Loop to try to add home tabs until it is successful
  let tabCreationSuccessful = false
  do {
    try {
      for (let window of allWindows) {
        if (window.tabs[0].title !== 'Browse Smart') {
          _ = await createHomeTab(window.id)
        }
      }
      tabCreationSuccessful = true
    } catch (err) {
      let _ = await wait()
      // console.log('test wait create')
    }
  } while (!tabCreationSuccessful)
}

async function createHomeTab(windowID) {
  _ = await chrome.tabs.create({
    windowId: windowID,
    active: false,
    pinned: true,
    index: 0,
    url: './index.html',
  })
}

function wait() {
  return new Promise((resolve) => setTimeout(resolve, 500))
}
