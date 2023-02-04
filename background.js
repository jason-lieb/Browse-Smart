// bug: opens two home tabs on active window

chrome.runtime.onInstalled.addListener(init);

let global; // want this to be available globally?

async function init() {
  let rawData = await chrome.tabs.query({});
  let windowIDs = getWindowIDs(rawData);
  windowIDs.forEach(createHomeTab); // Conditional to not create a new tab if one is already there? Reload? Send new message?
  // separate below into separate function for reuse?
  let status = await updateData();
  console.log(global);
  Object.keys(global).forEach((key) => sendMessage(key));
  // readData();
  // send message
}

function getWindowIDs(rawData) {
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError);
  } else {
    let windowIDs = new Set();
    rawData.forEach((tab) => windowIDs.add(tab.windowId));
    return windowIDs;
  }
}

function createHomeTab(windowID) {
  chrome.tabs.create({
    "windowId": windowID,
    "active": false,
    "pinned": true,
    "index": 0,
    "url": './index.html'
  });
}

async function updateData() {
  let rawData = await chrome.tabs.query({});
  global = parseData(rawData);
  setData(global);
  return true;
}

function parseData(rawData) {
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError);
  } else {
    const global = {};
    rawData.forEach((tab) => { // Switch from object to map for hash table?
      if (!global[String(tab.windowId)]) global[String(tab.windowId)] = [];
      global[String(tab.windowId)][tab.index] = new Tab(tab.id, tab.title, tab.url, tab.favIconUrl, tab.groupId);
    })
    return global;
  }
}

function setData(global) {
  let keys = Object.keys(global);
  keys.forEach((key) => {
    chrome.storage.local.set({[key]: JSON.stringify(global[key])}, () => {
      let error = chrome.runtime.lastError;
      if (error) {
        console.error(error)
      }
    })
  })
}

function readData() {
  let windowIDs = Object.keys(global);
  windowIDs.forEach((ID) => {
    chrome.storage.local.get(ID, (data) => {
      // console.log(Object.keys(data));
      // console.log(data);
      console.log(JSON.parse(data[Object.keys(data)]))
    });
  })
}

function sendMessage(key) {
  let tabID = global[key][0].id;
  setTimeout(chrome.tabs.sendMessage, 1000, tabID, key);
}

class Tab {
  constructor(id, title, url, favIcon, groupID) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.favIcon = favIcon;
    this.groupID = groupID;
  }
}
