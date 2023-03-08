// // // DETACHING MULTIPLE TABS AT ONCE????
// ON TAB DETACHMENT / WINDOW CREATED, HOME TABS NEED TO BE UPDATED FIRST BECAUSE CODE CURRENTLY ASSUMES FIRST TAB IS HOME TAB
// // ADD VALIDATION THAT HOME TAB IS ACTUALLY HOME TAB??
// // WHEN A NEW WINDOW IS CREATED, CREATE HOME TAB
// // IF ALL TABS ARE DELETED, DELETE HOME TAB

// IF MANUALLY DELETE HOME TAB, RECREATE IT

// Rules
// Right click options on home tab that could mess stuff up
// // Duplicate
// // Add to Group
// // Move Tab to Another Window

// // // // Reloading Home Tab Creates Errors

////////////////////////////////////////////////////////////////////////////////////

// // // Mechanics of Modifying Windows, Tab Groups, and Tabs

// // Tab Detached -> 2 Events: 1. Window Created 2. Tab Detached
// // Tab Un-Detached -> 2 Events: 1. Tab Moved 2. Window Removed

// chrome.windows.onCreated.addListener((e) => console.log('window created', e)) // Event (see below)
// chrome.windows.onRemoved.addListener((e) => console.log('window removed', e)) // window id
// chrome.tabs.onCreated.addListener((e) => console.log('tab created', e)) // Event (see below)
// chrome.tabs.onDetached.addListener((e) => console.log('tab detached', e)) // tab id
// chrome.tabs.onMoved.addListener((e) => console.log('tab moved', e)) // tab id
// chrome.tabs.onRemoved.addListener((e) => console.log('tab deleted', e)) // tab id
// chrome.tabs.onUpdated.addListener((e) => console.log('tab updated', e)) // tab id
// chrome.tabGroups.onCreated.addListener((e) => console.log('group created', e)) // Event (see below)
// chrome.tabGroups.onMoved.addListener((e) => console.log('group moved', e)) // Event (see below)
// chrome.tabGroups.onRemoved.addListener((e) => console.log('group removed', e)) // Event (see below)
// chrome.tabGroups.onUpdated.addListener((e) => console.log('group updated', e)) // Event (see below)

// Window Created Event (Object)
// // alwaysOnTop
// // focused
// // height
// // id
// // incognito
// // left
// // state
// // top
// // type
// // width

// Group Created / Updated / Moved / Removed Event (Object)
// // collapsed
// // color
// // id
// // title
// // windowId

// Tab Created Event (Object)
// // all tab fields
