<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEvents } from '@/composables/useEvents'
import EventCard from '@/components/event/EventCard.vue'
import SearchBar from '@/components/event/SearchBar.vue'
import CategoryFilter from '@/components/event/CategoryFilter.vue'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const { activeEvents } = useEvents()

const searchQuery = ref('')
const selectedCategory = ref('All')
const categories = ['All', 'Workshop', 'Meetup', 'Competition', 'Seminar', 'Conference']

const filteredEvents = computed(() => {
  return activeEvents.value.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.loc.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory =
      selectedCategory.value === 'All' ||
      event.cat === selectedCategory.value ||
      event.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const handleViewDetail = (id) => {
  router.push(`/browse/events/${id}`)
}
</script>

<template>
  <div class="event-list-page">
    <div class="event-list-header">
      <h1>Upcoming Events</h1>
      <p>Discover workshops, tech meetups, and competitions near you.</p>
    </div>

    <div class="filters-area">
      <SearchBar v-model="searchQuery" />
      <CategoryFilter :categories="categories" v-model="selectedCategory" />
    </div>

    <!-- POPULATED STATE -->
    <div v-if="filteredEvents.length > 0" class="events-grid">
      <EventCard
        v-for="event in filteredEvents"
        :key="event.id"
        :event="event"
        @view-detail="handleViewDetail"
      />
    </div>

    <!-- FRIENDLY EMPTY STATE -->
    <div v-else class="empty-state-card">
      <div class="empty-illustration">📭</div>
      <h3 class="empty-title">No Events Available Yet</h3>
      <p class="empty-description">
        There are currently no active events scheduled. Please check back later or publish your own
        event from the organizer dashboard.
      </p>
      <AppButton variant="primary" @click="router.push('/dashboard/events')">
        Go to Organizer Dashboard &rarr;
      </AppButton>
    </div>
  </div>
</template>

<style scoped>
.event-list-page {
  animation: fadeIn 0.3s ease;
}

.event-list-header {
  margin-bottom: var(--space-8);
}

.event-list-header h1 {
  font-size: 2.2rem;
  color: var(--text-main);
  margin-bottom: var(--space-2);
}

.event-list-header p {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.filters-area {
  margin-bottom: var(--space-6);
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
}

.empty-state-card {
  text-align: center;
  padding: var(--space-12) var(--space-6);
  background: white;
  border-radius: var(--space-4);
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  margin-top: var(--space-6);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.empty-illustration {
  font-size: 3.5rem;
  margin-bottom: var(--space-3);
}

.empty-title {
  font-size: 1.5rem;
  color: var(--text-main);
  margin-bottom: var(--space-2);
}

.empty-description {
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: var(--space-6);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
