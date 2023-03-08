// Global
const extensionID = chrome.runtime.id
let homeTabIDs
let windowIDs
let manageHomeRunning = false
let startedManageHomeTabs
let startedUpdateEvents

// Initialization of Extension
chrome.runtime.onInstalled.addListener(init)

async function init() {
  // chrome.storage.local.clear(); /////
  try {
    // Create home tabs for all windows and get data on all tabs / groups to save to storage
    const _ = await manageHomeTabs()
    updateData()
    // homeTabIDs = await updateData() // Change to updateData()? ///////////////////////////////
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

// function createHomeTab(windowID) {
//   chrome.tabs.create({
//     windowId: windowID,
//     active: false,
//     pinned: true,
//     index: 0,
//     url: './index.html',
//   })
// }

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
    // return homeTabIDs
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
  setTimeout(chrome.tabs.sendMessage, 1000, tabID, windowID) // Delay needed?
}

//
//
//
//
//
//
// Message from home tabs
chrome.runtime.onMessage.addListener(handleIncomingMessages)
function handleIncomingMessages(message, sender) {
  // console.log('incoming message')
  console.log('message', message)
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
//
//
//
//
//
//
//

// Update Data on Events -> Change to Windows, Tab Groups, or Tabs

// Events that will create a new window
chrome.windows.onCreated.addListener(createHomeTabAndUpdate)
chrome.tabs.onDetached.addListener(createHomeTabAndUpdate) // Special Case: if home tab is detached

// Listen for if home tab is deleted or if home tab is only tab in window
chrome.tabs.onRemoved.addListener(createHomeTabAndUpdate)

// If home tab is unpinned, create new home tab and delete old one?
chrome.tabs.onUpdated.addListener(updateOnEvent)

// Order of events if other pinned tabs are moved in front of home tab (is onUpdated first?)
chrome.tabs.onMoved.addListener(updateOnEvent)

// Events that only require updating data
chrome.windows.onRemoved.addListener(updateOnEvent)
chrome.tabs.onCreated.addListener(updateOnEvent)
chrome.tabGroups.onCreated.addListener(updateOnEvent)
chrome.tabGroups.onMoved.addListener(updateOnEvent)
chrome.tabGroups.onRemoved.addListener(updateOnEvent)
chrome.tabGroups.onUpdated.addListener(updateOnEvent)

async function createHomeTabAndUpdate() {
  let _ = await manageHomeTabs()
  updateOnEvent()
}

// Function to update stored data on chrome events
async function updateOnEvent() {
  // Only run function if it hasn't been ran for 500 ms and manageHomeTabs isn't running
  if (Date.now() - startedUpdateEvents < 500 || manageHomeRunning) return
  startedUpdateEvents = Date.now()

  // Update data and message active home tabs, so they know to update
  let _ = await updateData()
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
  if (Date.now() - startedManageHomeTabs < 500) return
  startedManageHomeTabs = Date.now()

  // Query all windows with their tabs included
  const allWindows = await chrome.windows.getAll({
    windowTypes: ['normal'],
    populate: true,
  })

  // Set variable windowIDs
  createWindowIDs(allWindows)

  // Delete all home tabs that aren't in index 0
  deleteHomeTabs(allWindows)

  // Loop to try to add home tabs until it is successful
  let tabCreationSuccessful = false
  do {
    try {
      // Add home tabs to windows without home tab in position 0
      let _ = await addHomeTabs(allWindows)
      tabCreationSuccessful = true
    } catch (err) {
      let wait = () => new Promise((resolve) => setTimeout(resolve, 500))
      let _ = await wait()
    }
  } while (!tabCreationSuccessful)

  manageHomeRunning = false
  return
}

function deleteHomeTabs(allWindows) {
  console.log('test')
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
  chrome.tabs.remove(tabsToDelete)
}

async function addHomeTabs(allWindows) {
  for (let window of allWindows) {
    if (window.tabs[0].title !== 'Browse Smart') {
      let _ = await chrome.tabs.create({
        //////////////////////////////// Need to be asynchronous?
        windowId: window.id,
        active: false,
        pinned: true,
        index: 0,
        url: './index.html',
      })
    }
  }
}
