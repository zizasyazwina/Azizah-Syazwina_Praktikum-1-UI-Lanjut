<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useEvents } from '@/composables/useEvents'
import AppModal from '@/components/ui/AppModal.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const { activeEvents, completedEvents, createEvent, completeEvent, deleteEvent } = useEvents()

const currentTab = ref('active')

const form = reactive({
  title: '',
  cat: 'Workshop',
  date: '',
  loc: '',
  quota: 100,
  price: 'Free',
  desc: '',
})

const errorMessage = ref('')
const successMessage = ref('')

const isModalOpen = ref(false)
const modalAction = ref('complete')
const selectedEvent = ref(null)

const handleOpenCompleteModal = (item) => {
  selectedEvent.value = item
  modalAction.value = 'complete'
  isModalOpen.value = true
}

const handleOpenDeleteModal = (item) => {
  selectedEvent.value = item
  modalAction.value = 'delete'
  isModalOpen.value = true
}

const handleConfirmModal = () => {
  if (selectedEvent.value) {
    if (modalAction.value === 'complete') {
      completeEvent(selectedEvent.value.id)
    } else if (modalAction.value === 'delete') {
      deleteEvent(selectedEvent.value.id)
    }
  }
  isModalOpen.value = false
  selectedEvent.value = null
}

const handleCancelModal = () => {
  isModalOpen.value = false
  selectedEvent.value = null
}

const formatEventDate = (dt) => {
  if (!dt) return ''
  const dateObj = new Date(dt)
  if (isNaN(dateObj.getTime())) return dt
  const datePart = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const timePart = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
  return `${datePart} • ${timePart}`
}

const handleSubmitEvent = () => {
  if (!form.title.trim() || !form.date || !form.loc.trim() || !form.desc.trim()) {
    errorMessage.value = 'Please fill in all required fields before publishing the event!'
    successMessage.value = ''
    return
  }

  createEvent({
    title: form.title.trim(),
    cat: form.cat,
    date: formatEventDate(form.date),
    loc: form.loc.trim(),
    quota: form.quota,
    price: form.price,
    desc: form.desc.trim(),
  })

  form.title = ''
  form.date = ''
  form.loc = ''
  form.quota = 100
  form.price = 'Free'
  form.desc = ''

  errorMessage.value = ''
  successMessage.value = 'Event published successfully!'

  setTimeout(() => {
    successMessage.value = ''
    currentTab.value = 'active'
  }, 1000)
}
</script>

<template>
  <div class="event-management">
    <div class="page-header">
      <div>
        <h2>Event Management Control</h2>
        <p class="subtitle">
          Manage event lifecycle, publish new events, and archive completed ones.
        </p>
      </div>
      <AppButton variant="primary" @click="currentTab = 'create'"> + Create New Event </AppButton>
    </div>

    <!-- Tabs Navigation -->
    <div class="tabs-nav">
      <button
        :class="['tab-btn', { active: currentTab === 'active' }]"
        @click="currentTab = 'active'"
      >
        ⚡ Active Events ({{ activeEvents.length }})
      </button>
      <button
        :class="['tab-btn', { active: currentTab === 'create' }]"
        @click="currentTab = 'create'"
      >
        ➕ Create Event
      </button>
      <button
        :class="['tab-btn', { active: currentTab === 'completed' }]"
        @click="currentTab = 'completed'"
      >
        📁 Completed Events ({{ completedEvents.length }})
      </button>
    </div>

    <!-- Tab 1: Active Events -->
    <section v-if="currentTab === 'active'" class="tab-content">
      <div v-if="activeEvents.length > 0" class="events-grid">
        <AppCard v-for="item in activeEvents" :key="item.id" class="management-card">
          <div class="card-header">
            <span class="category-badge">{{ item.cat }}</span>
            <span class="status-badge status-active">Active</span>
          </div>
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-meta">{{ item.date }} &bull; {{ item.loc }}</p>
          <p class="card-desc">{{ item.desc }}</p>
          <div class="card-actions">
            <button class="btn-action btn-view" @click="router.push(`/browse/events/${item.id}`)">
              👁️ View Details
            </button>
            <button class="btn-action btn-complete" @click="handleOpenCompleteModal(item)">
              ✅ Complete Event
            </button>
            <button class="btn-action btn-delete" @click="handleOpenDeleteModal(item)">
              🗑️ Delete
            </button>
          </div>
        </AppCard>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>No Active Events</h3>
        <p>All events have ended or none have been created yet. Please create a new event.</p>
        <AppButton variant="primary" @click="currentTab = 'create'"> Create Event Now </AppButton>
      </div>
    </section>

    <!-- Tab 2: Create Event Form -->
    <section v-if="currentTab === 'create'" class="tab-content">
      <AppCard class="form-card">
        <div class="form-header">
          <h3>Create New Event Form</h3>
          <p class="form-subtitle">
            Information entered here will be instantly published to the Gatherly public catalog.
          </p>
        </div>

        <div v-if="errorMessage" class="alert alert-error">⚠️ {{ errorMessage }}</div>

        <div v-if="successMessage" class="alert alert-success">✅ {{ successMessage }}</div>

        <form @submit.prevent="handleSubmitEvent" class="event-form">
          <div class="form-group">
            <label for="event-title">Event Title *</label>
            <input
              id="event-title"
              v-model="form.title"
              type="text"
              placeholder="e.g., Vue.js Advanced Architecture"
              class="form-input"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="event-cat">Event Category *</label>
              <select id="event-cat" v-model="form.cat" class="form-input">
                <option value="Workshop">Workshop</option>
                <option value="Meetup">Meetup</option>
                <option value="Competition">Competition</option>
                <option value="Seminar">Seminar</option>
                <option value="Conference">Conference</option>
              </select>
            </div>
            <div class="form-group">
              <label for="event-date">Date & Time *</label>
              <input id="event-date" v-model="form.date" type="datetime-local" class="form-input" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="event-loc">Event Location *</label>
              <input
                id="event-loc"
                v-model="form.loc"
                type="text"
                placeholder="e.g., Telkom University Jakarta"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label for="event-quota">Attendee Quota</label>
              <input
                id="event-quota"
                v-model.number="form.quota"
                type="number"
                min="1"
                placeholder="100"
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="event-price">Ticket Price</label>
            <input
              id="event-price"
              v-model="form.price"
              type="text"
              placeholder="e.g., Free or $25"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="event-desc">Event Description *</label>
            <textarea
              id="event-desc"
              v-model="form.desc"
              rows="4"
              placeholder="Provide comprehensive details about this event..."
              class="form-input"
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary-action" @click="currentTab = 'active'">
              Cancel
            </button>
            <AppButton variant="primary" type="submit"> 🚀 Publish Event Now </AppButton>
          </div>
        </form>
      </AppCard>
    </section>

    <!-- Tab 3: Completed Events -->
    <section v-if="currentTab === 'completed'" class="tab-content">
      <div v-if="completedEvents.length > 0" class="events-grid">
        <AppCard
          v-for="item in completedEvents"
          :key="item.id"
          class="management-card completed-card"
        >
          <div class="card-header">
            <span class="category-badge">{{ item.cat }}</span>
            <span class="status-badge status-completed">Completed</span>
          </div>
          <h3 class="card-title completed-title">{{ item.title }}</h3>
          <p class="card-meta">{{ item.date }} &bull; {{ item.loc }}</p>
          <p class="card-desc">{{ item.desc }}</p>
          <div class="card-actions">
            <button class="btn-action btn-delete" @click="handleOpenDeleteModal(item)">
              🗑️ Delete from Archive
            </button>
          </div>
        </AppCard>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📁</div>
        <h3>No Completed Events</h3>
        <p>Events marked as completed will be archived here.</p>
      </div>
    </section>

    <!-- Reusable Modal Confirmation -->
    <AppModal
      :is-open="isModalOpen"
      :title="modalAction === 'complete' ? 'Mark Event as Completed?' : 'Delete Event Permanently?'"
      :message="
        modalAction === 'complete'
          ? `Are you sure you want to mark '${selectedEvent?.title}' as completed? Once completed, the status is final and the event will be automatically removed from public listings.`
          : `Are you sure you want to permanently delete '${selectedEvent?.title}'? This action cannot be undone and will permanently remove this event from all records.`
      "
      :confirm-text="
        modalAction === 'complete' ? 'Yes, Mark as Completed' : 'Yes, Delete Permanently'
      "
      cancel-text="Cancel"
      @confirm="handleConfirmModal"
      @close="handleCancelModal"
    />
  </div>
</template>

<style scoped>
.event-management {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
  flex-wrap: wrap;
  gap: var(--space-4);
}

.page-header h2 {
  font-size: 2rem;
  color: var(--text-main);
  margin-bottom: var(--space-1);
}

.subtitle {
  color: var(--text-muted);
  font-size: 1rem;
  margin: 0;
}

.tabs-nav {
  display: flex;
  gap: var(--space-3);
  border-bottom: 2px solid var(--border-color);
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-2);
  flex-wrap: wrap;
}

.tab-btn {
  background: none;
  border: none;
  padding: var(--space-3) var(--space-6);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.tab-btn:hover {
  background-color: rgba(102, 68, 255, 0.05);
  color: var(--primary);
}

.tab-btn.active {
  background-color: var(--primary);
  color: white;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-12);
}

.management-card {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.completed-card {
  opacity: 0.85;
  background-color: #fafafa;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.category-badge {
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary);
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 700;
}

.status-active {
  background: rgba(46, 204, 113, 0.15);
  color: #2ecc71;
}

.status-completed {
  background: rgba(108, 117, 125, 0.15);
  color: #6c757d;
}

.card-title {
  font-size: 1.3rem;
  margin-bottom: var(--space-2);
  color: var(--text-main);
}

.completed-title {
  text-decoration: line-through;
  color: var(--text-muted);
}

.card-meta {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: var(--space-3);
}

.card-desc {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: var(--space-6);
  flex-grow: 1;
}

.card-actions {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-color);
}

.btn-action {
  flex: 1;
  padding: var(--space-2) var(--space-3);
  border-radius: 6px;
  border: 1px solid var(--border-color);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  background: white;
  transition: 0.2s;
  white-space: nowrap;
}

.btn-view {
  background: var(--bg-light);
  color: var(--primary);
  border-color: var(--primary);
}

.btn-view:hover {
  background: rgba(102, 68, 255, 0.08);
}

.btn-complete {
  color: #27ae60;
  border-color: rgba(39, 174, 96, 0.3);
}

.btn-complete:hover {
  background: rgba(39, 174, 96, 0.1);
}

.btn-delete {
  color: #e63946;
  border-color: rgba(230, 57, 70, 0.3);
  flex: 0 0 auto;
}

.btn-delete:hover {
  background: rgba(230, 57, 70, 0.1);
}

.empty-state {
  text-align: center;
  padding: var(--space-12);
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--space-4);
  margin-bottom: var(--space-12);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--space-3);
}

.empty-state h3 {
  font-size: 1.4rem;
  margin-bottom: var(--space-2);
}

.empty-state p {
  color: var(--text-muted);
  margin-bottom: var(--space-6);
}

.form-card {
  padding: var(--space-8);
  max-width: 800px;
  margin: 0 auto var(--space-12);
}

.form-header h3 {
  font-size: 1.5rem;
  margin-bottom: var(--space-1);
}

.form-subtitle {
  color: var(--text-muted);
  margin-bottom: var(--space-6);
}

.alert {
  padding: var(--space-3) var(--space-4);
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: var(--space-6);
}

.alert-error {
  background: #ffe3e3;
  color: #c92a2a;
  border: 1px solid #ffa8a8;
}

.alert-success {
  background: #e6fcf5;
  color: #0ca678;
  border: 1px solid #96f2d7;
}

.event-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-group label {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
}

.form-input {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-4);
  margin-top: var(--space-4);
}

.btn-secondary-action {
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  padding: var(--space-3) var(--space-6);
  border-radius: 12px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: 0.2s;
}

.btn-secondary-action:hover {
  background: #e9ecef;
  color: var(--text-main);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
