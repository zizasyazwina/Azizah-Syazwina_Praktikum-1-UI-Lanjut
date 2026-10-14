<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
// eslint-disable-next-line no-unused-vars
import AppCard from '@/components/ui/AppCard.vue'
// eslint-disable-next-line no-unused-vars
import AppButton from '@/components/ui/AppButton.vue'
import EventCard from '@/components/event/EventCard.vue'
import SearchBar from '@/components/event/SearchBar.vue'
import CategoryFilter from '@/components/event/CategoryFilter.vue'

const router = useRouter()

const events = ref([
  {
    id: 1,
    title: 'Vue.js Mastery Workshop',
    date: 'Oct 12, 2026',
    loc: 'Telkom University, Jakarta',
    category: 'Workshop',
    desc: 'Learn advanced Vue.js concepts and build high-performance applications.',
  },
  {
    id: 2,
    title: 'National Tech Meetup',
    date: 'Oct 15, 2026',
    loc: 'Jakarta',
    category: 'Meetup',
    desc: 'A gathering of technology enthusiasts to discuss current trends.',
  },
  {
    id: 3,
    title: 'Startup Pitch Competition',
    date: 'Oct 20, 2026',
    loc: 'Jakarta',
    category: 'Competition',
    desc: 'Showcase your startup idea and receive feedback from mentors.',
  },
  {
    id: 4,
    title: 'UI/UX Design Sprint',
    date: 'Nov 10, 2026',
    loc: 'Telkom University, Jakarta',
    category: 'Workshop',
    desc: 'A hands-on session on designing user interfaces by implementing layout systems and visual hierarchy principles.',
  },
  {
    id: 5,
    title: 'Digital Marketing Seminar',
    date: 'Nov 20, 2026',
    loc: 'Grand Hotel Hall, Jakarta',
    category: 'Seminar',
    desc: 'An in-depth seminar dissecting modern digital marketing strategies, from SEO optimization to user conversion tactics.',
  },
  {
    id: 6,
    title: 'Community Leaders Summit',
    date: 'Dec 05, 2026',
    loc: 'Gatherly HQ, Jakarta',
    category: 'Conference',
    desc: 'An exclusive year-end conference for community leaders to formulate sustainable ecosystem development strategies.',
  },
])

const searchQuery = ref('')
const selectedCategory = ref('All')
const categories = ['All', 'Workshop', 'Meetup', 'Competition', 'Seminar', 'Conference']

const filteredEvents = computed(() => {
  return events.value.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.loc.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory =
      selectedCategory.value === 'All' || event.category === selectedCategory.value
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

    <div class="events-grid">
      <EventCard
        v-for="event in filteredEvents"
        :key="event.id"
        :event="event"
        @view-detail="handleViewDetail"
      />
    </div>

    <div v-if="filteredEvents.length === 0" class="empty-state">
      No events found matching your criteria.
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

.empty-state {
  text-align: center;
  padding: var(--space-12) var(--space-6);
  color: var(--text-muted);
  font-size: 1.1rem;
  background: var(--bg-light);
  border-radius: var(--space-4);
  border: 1px dashed var(--border-color);
  margin-top: var(--space-6);
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
