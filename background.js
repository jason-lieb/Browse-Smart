// Data Structures
// windowIDs: [windowID] // Use a Set when not serializing to JSON
// "windowID": { groupsIDs: [Int], tabIDs: [Int]}
// "tabID": { title: String, url: String, favIcon: String, groupID: Int }
// sleeping: [Int]
// groups: { "groupID": { title: String, color: String, collapsed: Bool } }

// Global
let homeTabIDs // Is this still used?
let windowIDs // Is this still used?
let manageHomeRunning = false
let startedManageHomeTabs
let startedUpdateEvents
let updateAlreadyQueued
let manageAlreadyQueued
let uniqueID = 0
let _

// Initialization of Extension
chrome.runtime.onInstalled.addListener(init)

// Handle messages from home tabs
chrome.runtime.onMessage.addListener(handleIncomingMessages)

// Events that will create a new window
chrome.windows.onCreated.addListener(manageHomeTabs)
chrome.tabs.onDetached.addListener(manageHomeTabs)

// Listen for if home tab is deleted or if home tab is only tab in window
chrome.tabs.onRemoved.addListener((id) => {
  manageHomeTabs()
  // Remove deleted tab from Chrome Storage
  deleteFromMemory(String(id))
})

// If home tab is unpinned, create new home tab and delete old one? ////////////////////////////////////////////////
chrome.tabs.onUpdated.addListener(updateOnEvent)

// Order of events if other pinned tabs are moved in front of home tab (is onUpdated first?) /////////////////////
chrome.tabs.onMoved.addListener(updateOnEvent)

// Events that don't require home tabs to be modified
chrome.windows.onRemoved.addListener((id) => {
  manageHomeTabs()
  // Remove deleted window from Chrome Storage
  deleteFromMemory(String(id))
})
chrome.tabGroups.onRemoved.addListener((group) => {
  manageHomeTabs()
  // Remove deleted tab group from Chrome Storage
  deleteFromMemory(String(group.id))
}) //////////////////////////////////////////////////////////////////////////////////////////////// Investigate error
chrome.tabs.onCreated.addListener(updateOnEvent)
chrome.tabGroups.onCreated.addListener(updateOnEvent)
chrome.tabGroups.onMoved.addListener(updateOnEvent)
chrome.tabGroups.onUpdated.addListener(updateOnEvent)

// Clear leftover memory and create home tabs
function init() {
  chrome.storage.local.clear()
  manageHomeTabs()
}

// Query windows (including tabs) and groups and save to storage
async function updateData() {
  try {
    let rawWindows = await chrome.windows.getAll({
      populate: true,
      windowTypes: ['normal'],
    })
    homeTabIDs = parseWindows(rawWindows)
  } catch (err) {
    console.error(err)
  }
  try {
    let rawGroups = await chrome.tabGroups.query({})
    // console.log('rawGroups', rawGroups)
    parseGroups(rawGroups)
  } catch (err) {
    console.error(err)
  }
}

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

// Parse raw window and tab data and save individually according to window / tab id to Chrome Storage
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

// Parse raw group data and save groups to Chrome Storage
function parseGroups(rawGroups) {
  rawGroups.forEach((group) => {
    let groupContent = {
      title: group.title,
      color: group.color,
      collapsed: group.collapsed,
    }
    chrome.storage.local.set(
      { [String(group.id)]: JSON.stringify(groupContent) },
      () => {
        let error = chrome.runtime.lastError
        if (error) {
          console.error(error)
        }
      }
    )
  })
}

// Handle communication between background service and home tabs
async function handleIncomingMessages(message, sender) {
  const windowIdOfSender = sender.tab.windowId
  const [messageType, tabId, url, favIcon, ...titleSegments] =
    message.split(' ')
  const title = titleSegments.join(' ')

  switch (messageType) {
    case 'windowID':
      chrome.tabs.sendMessage(sender.tab.id, String(windowIdOfSender))
      break
    case 'sleep':
      let sleeping = await chrome.storage.local.get('sleeping')
      sleeping =
        Object.keys(sleeping).length > 0 ? JSON.parse(sleeping['sleeping']) : []
      chrome.storage.local.set({
        [String(uniqueID)]: JSON.stringify({ title, url, favIcon }),
      })
      sleeping.push(uniqueID++)
      chrome.storage.local.set({ sleeping: JSON.stringify(sleeping) }, () => {
        let error = chrome.runtime.lastError
        if (error) {
          console.error(error)
        }
      })
      deleteTabs(+tabId)
      break
    case 'delete':
      deleteTabs(+tabId)
      break
    default:
      console.log('default case')
  }
}

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

  // Update data and message active home tabs, so they know to update
  _ = await updateData()
  const activeTabs = await chrome.tabs.query({ active: true })
  activeTabs.forEach((active) => {
    if (homeTabIDs.includes(active.id))
      chrome.tabs.sendMessage(active.id, 'update')
  })
}

// Create home tabs at index 0 and delete out of place home tabs
async function manageHomeTabs() {
  // Block update function from running
  manageHomeRunning = true

  // Only run function if it hasn't been ran for 500 ms
  if (Date.now() - startedManageHomeTabs < 500) {
    // Queue up manageHomeTabs to run after current instance is finished
    if (!manageAlreadyQueued) {
      setTimeout(manageHomeTabs, 500)
      manageAlreadyQueued = true
    }
    return
  }
  startedManageHomeTabs = Date.now()
  manageAlreadyQueued = false

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

  // Unblock update from running and run update
  manageHomeRunning = false
  updateOnEvent()
}

// Create list of home tabs not in index 0 or in their own window
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
  return tabsToDelete
}

// Delete all out of place home tabs
async function deleteHomeTabs(tabsToDelete) {
  // Loop to try to delete home tabs until it is successful
  // Home tabs can't be created while a tab is being dragged
  let deletedSuccessfully = false
  do {
    try {
      _ = await deleteTabs(tabsToDelete)
      deletedSuccessfully = true
    } catch (err) {
      _ = await wait()
    }
  } while (!deletedSuccessfully)
}

// Close tab and remove from Chrome Storage
async function deleteTabs(tabsToDelete) {
  _ = await chrome.tabs.remove(tabsToDelete)
}

// Create home tabs for all windows
async function addHomeTabs(allWindows) {
  // Loop to try to add home tabs until it is successful
  // Home tabs can't be created while a tab is being dragged
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
    }
  } while (!tabCreationSuccessful)
}

// Create new home tab
async function createHomeTab(windowID) {
  _ = await chrome.tabs.create({
    windowId: windowID,
    active: false,
    pinned: true,
    index: 0,
    url: './index.html',
  })
}

// Half second delay
function wait() {
  return new Promise((resolve) => setTimeout(resolve, 500))
}

// Remove deleted tabs, tab groups, and windows from Chrome Storage
function deleteFromMemory(id) {
  chrome.storage.local.remove(id, () => {
    const err = chrome.runtime.lastError
    if (err) console.error(err)
  })
}

//
//
//
//
//
//
// chrome.windows.onRemoved.addListener((e) => console.log('window removed', e)) // window id
// chrome.tabs.onRemoved.addListener((e) => console.log('tab deleted', e)) // tab id
// chrome.tabGroups.onRemoved.addListener((e) => console.log('group removed', e)) // {id}
