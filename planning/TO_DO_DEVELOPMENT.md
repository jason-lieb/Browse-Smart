## To Do

Messages from Home Tabs (Sleep / Delete)
Break background into modules
Error handling

## Special Cases

Home tag is detached
Unpinned home tag
Pinned other tabs moved in front of home tab

## Commands

chrome.windows.remove
chrome.tabs.move
chrome.tabs.remove

## Buttons

- send to Notion
- export

## Data Structure

- windowsIDs
  list of windows
- windows
  stored individually based on windowID
  contains tabIDs and groupIDs
- groups
  stored individually based on groupID -> store as a single object?
  contains color, title -> add collapsed
- tabs
  stored individually based on tabID
  contains url, favIcon, title, groupID

## Sleeping

Sleep tabs within a window (show sleeping tabs below awake tabs / don't keep index of sleeping tabs)
Sleep entire windows / separate sleeping tabs in window to separate window
How to sleep tabs and how to store sleeping tabs
Awake Filter?
Accordion for sleeping tabs
Shift to end of window on sleep or create entirely new window?

## Misc

Cache Home Page, etc.

## Custom Filters

How to visualize custom filters

- Tags?
- Vertical bars to left of buttons?
- More vertical bars to left of tabs

## Saved Windows Names

- save button to right of input
- how to save data?

## Errors

Error handling for when groups aren't functioning properly
Erroring when task manager is open?

## Potential Issues:

Learn what Chrome does when power is abruptly turned off instead of shutting down -> how to recover data
What happens if it goes offline?

- Background service worker should still be able to run
- Error message for certain functionalities
  What to do if storage is full?
  Expand storage with unlimited storage permission?

## Aesthetics

Get ellipses when text overflows
Tab Icon for Chrome Settings / Extensions / etc. -> Loop through all tabs and add to ones with url Chrome://
Different Color for Different Workspaces
Gap on right side of tab disappears when shrunk

## Pop-up

- Show settings (or separate settings option in home tab)
- Recreate Home tab for that window (If necessary)
- Save page to notion?
- Minimize page / save to history (sleep)?

Filter for reclaiming tabs from Notion?
Load from Notion Button in Extension to Re-Open Long-Term Storage

## Additional Functionality:

Separate "stuff to google" / notes section

## Possible Future Additions:

Tabs from other windows but across browsers

- Use Pico.css CDN to update to latest changes with simple rebuild?
- Switch to Tailwind?

Less permissions to just create bookmark
Option for full tab manager

If tab is discarded (unloaded from memory), save URL and remove tab

Autosync?

Button to Undo Entire Application So It Isn't a Pain to Use Temporarily

Light Mode / Themes

Support for Different Desks? -> Might Not Be Possible

Keyboard Shortcut Event Listeners

Right click add to ~ Tab Manager Name ~

Cache Pages, so they can be minimized, but don't have to be reloaded if expanded?

After x period of time, make tab manager active tab and minimize other tabs / Option to merge all windows with only manager tabs together
