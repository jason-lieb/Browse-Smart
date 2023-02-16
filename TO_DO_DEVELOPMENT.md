MVP

Data Structures
windowIDs

- list of windows
  windows
- stored individually based on windowID
- contains tabIDs and groupIDs
  groups
- stored individually based on groupID -> store as a single object?
- contains color, title -> add collapsed
  tabs
- stored individually based on tabID
- contains url, favIcon, title, groupID

-- add sleeping
-- add saved window name
-- add custom filters

How to visualize custom filters

- Vertical bars to left of buttons?
- More vertical bars to left of tabs

Uncomment group query, parsing, etc.

Error handling for when groups aren't functioning properly
Erroring when task manager is open?

Sleep tabs within a window (show sleeping tabs below awake tabs / don't keep index of sleeping tabs)
Sleep entire windows / separate sleeping tabs in window to separate window

Awake Filter?

Group colors are correct -> how to pass data around
Background.js automatically creates new home tabs
All windows have 1 and only 1 home tab
Get All window filter working
Decide on buttons for tabs and windows and selected tabs
How to sleep tabs and how to store sleeping tabs

Groups -> Only pass color to tabs, No accordion or group header

Memory, Events, and Messages
Background.js -> If a window only has a home tab, close window

Other runtime events

Aesthetics

Add Accordion Drop Down to Left of Input in Window Header
Add Group Header
Get ellipses when text overflows
Tab Icon for Chrome Settings / Extensions / etc. -> Loop through all tabs and add to ones with url Chrome://
Adds Colored line for groups
Different Color for Different Workspaces
Gap on right side of tab disappears when shrunk

Pop-up

- Show settings (or separate settings option in home tab)
- Recreate Home tab for that window
- Save page to notion
- Minimize page / save to history (sleep)

Filter for reclaiming tabs from Notion?
Load from Notion Button in Extension to Re-Open Long-Term Storage

Additional Functionality:

Separate "stuff to google" / notes section

Potential Issues:

Learn what Chrome does when power is abruptly turned off instead of shutting down -> how to recover data

What happens if it goes offline?

- Background service worker should still be able to run
- Error message for certain functionalities

What to do if storage is full?
Expand storage with unlimited storage permission?

Possible Future Additions:

Tabs from other windows but across browsers

- Use Pico.css CDN to update to latest changes with simple rebuild?

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
