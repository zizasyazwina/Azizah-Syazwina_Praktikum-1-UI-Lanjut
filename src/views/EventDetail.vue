<script setup>
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
</script>

<template>
  <div class="event-detail-page">
    <button class="btn-back" @click="$router.push('/browse/events')">← Back to Events</button>

    <div class="detail-header">
      <div class="event-category-badge">Workshop & Training</div>
      <h1 class="event-title">Mastering UI/UX: A Hands-on Workshop</h1>
      <div class="meta-info">
        <span class="meta-item">📅 October 12, 2026 / 09:00 AM</span>
        <span class="meta-item">📍 Telkom University, Jakarta</span>
        <span class="meta-item">🎟️ Quota: 150 Seats</span>
      </div>
    </div>

    <div class="grid-asymmetric">
      <div class="main-content">
        <AppCard class="detail-card">
          <h2>About This Event</h2>
          <p>
            Get hands-on with the latest web interface development training event of the year! This
            workshop is crafted to help you master UI/UX and component-based interface design.
          </p>
          <p>
            In this session, we will discuss various current industry challenges, dissect the
            implementation of Single Page Applications (SPA), and practice hands-on UI layout system
            design.
          </p>

          <h2>Event Agenda</h2>
          <ul class="agenda-list">
            <li><strong>09:00 AM</strong> — Registration & Check-in Screening</li>
            <li><strong>10:00 AM</strong> — Session 1: View Hierarchy & Navigation Fundamentals</li>
            <li><strong>11:00 AM</strong> — Coffee Break & Networking</li>
            <li><strong>01:00 PM</strong> — Session 2: Layout System & Grid Implementation</li>
            <li><strong>03:00 PM</strong> — Q&A & Closing Remarks</li>
          </ul>
        </AppCard>
      </div>

      <div class="detail-sidebar">
        <AppCard class="ticket-card sticky-pane">
          <div class="ticket-header">
            <h3>Attendee Registration</h3>
            <p class="ticket-price">Free</p>
            <p>Secure your seat now before the quota is full.</p>
          </div>
          <AppButton variant="primary" class="btn-register"> Register Now </AppButton>
          <p class="ticket-note">Only 12 seats left!</p>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-detail-page {
  animation: fadeIn 0.3s ease;
}

.btn-back {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: var(--space-6);
  color: var(--text-muted);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  transition: color 0.2s;
  padding: 0;
}

.btn-back:hover {
  color: var(--primary);
}

.detail-header {
  background: var(--bg-light);
  border-radius: var(--space-4);
  border: 1px solid var(--border-color);
  padding: var(--space-12) var(--space-8);
  margin-bottom: var(--space-8);
}

.event-category-badge {
  display: inline-block;
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary);
  padding: var(--space-1) var(--space-4);
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: var(--space-4);
}

.event-title {
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--text-main);
  margin: var(--space-2) 0 var(--space-4);
  line-height: 1.2;
}

.meta-info {
  display: flex;
  gap: var(--space-6);
  flex-wrap: wrap;
}

.meta-item {
  color: var(--text-muted);
  font-weight: 500;
  font-size: 1.05rem;
}

/* ASYMMETRICAL GRID */
.grid-asymmetric {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-8);
  align-items: start;
}

.detail-card {
  padding: var(--space-8);
}

.detail-card h2 {
  margin-top: var(--space-6);
  margin-bottom: var(--space-4);
  font-size: 1.6rem;
  color: var(--text-main);
  border-left: 4px solid var(--primary);
  padding-left: var(--space-3);
}

.detail-card h2:first-child {
  margin-top: 0;
}

.detail-card p {
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: var(--space-6);
  font-size: 1.05rem;
}

.agenda-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.agenda-list li {
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 1.05rem;
}

.agenda-list li:last-child {
  border-bottom: none;
}

.ticket-card {
  padding: var(--space-8);
  text-align: center;
}

.sticky-pane {
  position: sticky;
  top: 100px;
}

.ticket-header h3 {
  font-size: 1.5rem;
  color: var(--text-main);
  margin-bottom: var(--space-2);
}

.ticket-price {
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--primary);
  margin: var(--space-2) 0;
}

.ticket-header p {
  color: var(--text-muted);
  margin-bottom: var(--space-6);
}

.btn-register {
  width: 100%;
}

.ticket-note {
  margin-top: var(--space-4);
  color: #e63946;
  font-weight: 600;
  font-size: 0.95rem;
}

@media (max-width: 900px) {
  .grid-asymmetric {
    grid-template-columns: 1fr;
  }
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
