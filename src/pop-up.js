const template = document.querySelector('template');

// for (const tab of tabs) {
//   // console.log(tab);

//   const element = template.content.firstElementChild.cloneNode(true);
//   element.querySelector('.title').textContent = `Title: ${tab.title}`;
//   element.querySelector('.active').textContent = `Active: ${tab.active}`;
//   element.querySelector('.groupID').textContent = `GroupID: ${tab.groupId}`;
//   element.querySelector('.windowID').textContent = `WindowID: ${tab.windowId}`;
//   element.querySelector('.index').textContent = `Index: ${tab.index}`;
//   document.querySelector('ul').append(element);
//   console.log(tab.windowId) /////
//   windowIDs.add(tab.windowId);
//   elements.push({
//     title: tab.title,
//     active: tab.active,
//     groupID: tab.groupId,
//     windowID: tab.windowId,
//     index: tab.index
//   })
// }
// windowIDs = Array.from(windowIDs);
// for (const windowID of windowIDs) {
//   console.log(windowID); /////
// }