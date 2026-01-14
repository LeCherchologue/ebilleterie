<template>
  <section class="event-section">
    <div class="container">
      <div class="section-header">
        <div class="section-title-group">
          <h2 class="section-title">{{ title }}</h2>
          <p class="section-description">{{ description }}</p>
        </div>
        <div class="filter-buttons">
          <button 
            class="filter-btn" 
            :class="{ active: currentFilter === 'populaires' }"
            @click="setFilter('populaires')"
          >
            Populaires
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: currentFilter === 'recents' }"
            @click="setFilter('recents')"
          >
            Récents
          </button>
        </div>
      </div>
      <div class="events-grid" v-if="filteredEvents.length > 0">
        <EventCard 
          v-for="event in filteredEvents" 
          :key="event.id" 
          :event="event"
        />
      </div>
      <div v-else class="no-events">
        <p>Aucun événement disponible pour le moment.</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import EventCard from './EventCard.vue'
import type { Event, EventFilter } from '@/types/event'

export default defineComponent({
  name: 'EventSection',
  components: {
    EventCard
  },
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    events: {
      type: Array as () => Event[],
      required: true
    },
    category: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const currentFilter = ref<EventFilter>('populaires')

    const filteredEvents = computed(() => {
      let filtered = [...props.events]

      if (props.category) {
        filtered = filtered.filter(e => e.category === props.category)
      }

      if (currentFilter.value === 'populaires') {
        filtered = filtered.filter(e => e.popular).sort((a, b) => b.views - a.views)
      } else {
        filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      }

      return filtered.slice(0, 4)
    })

    const setFilter = (filter: EventFilter) => {
      currentFilter.value = filter
    }

    return {
      currentFilter,
      filteredEvents,
      setFilter
    }
  }
})
</script>

<style lang="scss" scoped>
.event-section {
  background: #000;
  padding: 4rem 2rem;
  animation: fadeIn 0.8s ease-out;

  .container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 3rem;
    gap: 2rem;
    animation: slideInLeft 0.8s ease-out;
  }

  .section-title-group {
    flex: 1;
  }

  .section-title {
    font-size: 2.5rem;
    font-weight: 900;
    color: #fff;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #fff 0%, #00d4aa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .section-description {
    color: #999;
    font-size: 1rem;
  }

  .filter-buttons {
    display: flex;
    gap: 1rem;
  }

  .filter-btn {
    padding: 0.75rem 1.5rem;
    border: 1px solid #fff;
    background: transparent;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    white-space: nowrap;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(0, 212, 170, 0.2);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    &.active {
      background: #00d4aa;
      border-color: #00d4aa;
      color: #fff;
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(0, 212, 170, 0.3);
    }

    &:hover {
      background: rgba(0, 212, 170, 0.2);
      border-color: #00d4aa;
      transform: translateY(-2px);

      &::before {
        width: 300px;
        height: 300px;
      }
    }
  }

  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
    animation: fadeIn 1s ease-out 0.3s backwards;
  }

  .no-events {
    text-align: center;
    padding: 4rem 2rem;
    color: #999;
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    padding: 3rem 1rem;

    .section-header {
      flex-direction: column;
      gap: 1.5rem;
    }

    .section-title {
      font-size: 2rem;
    }

    .filter-buttons {
      width: 100%;
      justify-content: space-between;
    }

    .filter-btn {
      flex: 1;
    }

    .events-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
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

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>