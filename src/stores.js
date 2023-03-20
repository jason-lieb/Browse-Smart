import { writable } from 'svelte/store'

export let selectedFilter = writable('Current Window')

// currentWindow: [Tab: {}]
export let currentWindow = writable([])
// allWindows: [[Tab: {}}]]
export let allWindows = writable([])
// sleeping: [Tab: {}]
export let sleeping = writable([])

export let groups = writable({})
