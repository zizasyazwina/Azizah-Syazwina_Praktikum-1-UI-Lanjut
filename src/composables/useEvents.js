import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'gatherly_events'
const savedData = localStorage.getItem(STORAGE_KEY)
const events = ref(savedData ? JSON.parse(savedData) : [])

watch(
  events,
  (newEvents) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents))
  },
  { deep: true },
)

export function useEvents() {
  const totalEvents = computed(() => events.value.length)
  const activeEvents = computed(() => events.value.filter((e) => !e.done))
  const completedEvents = computed(() => events.value.filter((e) => e.done))

  const createEvent = (eventData) => {
    const locString = eventData.loc || ''
    const formattedLoc = locString.startsWith('📍') ? locString : `📍 ${locString}`

    const newEvent = {
      id: Date.now(),
      title: eventData.title,
      date: eventData.date,
      loc: formattedLoc,
      cat: eventData.cat,
      category: eventData.cat,
      quota: Number(eventData.quota) || 100,
      price: eventData.price || 'Free',
      desc: eventData.desc,
      done: false,
    }

    events.value.unshift(newEvent)
    return newEvent
  }

  const completeEvent = (id) => {
    const item = events.value.find((e) => e.id === Number(id))
    if (item) {
      item.done = true
    }
  }

  const deleteEvent = (id) => {
    const idx = events.value.findIndex((e) => e.id === Number(id))
    if (idx !== -1) {
      events.value.splice(idx, 1)
    }
  }

  const getEventById = (id) => {
    return events.value.find((e) => e.id === Number(id))
  }

  const clearAllEvents = () => {
    events.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    events,
    totalEvents,
    activeEvents,
    completedEvents,
    createEvent,
    completeEvent,
    deleteEvent,
    getEventById,
    clearAllEvents,
  }
}
