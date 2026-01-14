<template>
  <div class="evenements">
    <div class="page-header">
      <div class="container">
        <h1>Évènements</h1>
        <p>Découvrez tous nos événements</p>
      </div>
    </div>
    <div class="filters-section">
      <div class="container">
        <div class="category-filters">
          <button 
            v-for="category in categories" 
            :key="category.value"
            class="category-filter"
            :class="{ active: selectedCategory === category.value }"
            @click="selectedCategory = category.value"
          >
            {{ category.label }}
          </button>
        </div>
        <div class="filter-buttons">
          <button 
            class="filter-btn" 
            :class="{ active: currentFilter === 'populaires' }"
            @click="currentFilter = 'populaires'"
          >
            Populaires
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: currentFilter === 'recents' }"
            @click="currentFilter = 'recents'"
          >
            Récents
          </button>
        </div>
      </div>
    </div>
    <div class="events-container">
      <div class="container">
        <div class="events-grid" v-if="filteredEvents.length > 0">
          <EventCard 
            v-for="event in filteredEvents" 
            :key="event.id" 
            :event="event"
          />
        </div>
        <div v-else class="no-events">
          <p>Aucun événement disponible pour cette catégorie.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'
import EventCard from '@/components/EventCard.vue'
import type { EventCategory, EventFilter } from '@/types/event'

export default defineComponent({
  name: 'EvenementsView',
  components: {
    EventCard
  },
  setup() {
    const store = useStore()
    const selectedCategory = ref<EventCategory | ''>('')
    const currentFilter = ref<EventFilter>('populaires')

    const categories = [
      { value: '', label: 'Tous' },
      { value: 'concert', label: 'Concerts' },
      { value: 'show', label: 'Shows' },
      { value: 'cinema', label: 'Cinéma' },
      { value: 'theatre', label: 'Théâtre' },
      { value: 'sport', label: 'Sports' },
      { value: 'exposition', label: 'Expositions' }
    ]

    const filteredEvents = computed(() => {
      let events = store.getters.allEvents as any[]

      if (selectedCategory.value) {
        events = events.filter((e: any) => e.category === selectedCategory.value)
      }

      if (currentFilter.value === 'populaires') {
        events = events.filter((e: any) => e.popular).sort((a: any, b: any) => b.views - a.views)
      } else {
        events = events.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      }

      return events
    })

    return {
      categories,
      selectedCategory,
      currentFilter,
      filteredEvents
    }
  }
})
</script>

<style lang="scss" scoped>
.evenements {
  min-height: 100vh;
  background: #000;
}

.page-header {
  background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
  padding: 4rem 2rem;
  text-align: center;

  .container {
    max-width: 1400px;
    margin: 0 auto;
  }

  h1 {
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: #999;
  }
}

.filters-section {
  background: #1a1a1a;
  padding: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .container {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .category-filters {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .category-filter {
    padding: 0.75rem 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: transparent;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s;

    &.active {
      background: #00d4aa;
      border-color: #00d4aa;
      color: #fff;
    }

    &:hover {
      background: rgba(0, 212, 170, 0.2);
      border-color: #00d4aa;
    }
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
    transition: all 0.3s;

    &.active {
      background: #00d4aa;
      border-color: #00d4aa;
      color: #fff;
    }

    &:hover {
      background: rgba(0, 212, 170, 0.2);
      border-color: #00d4aa;
    }
  }
}

.events-container {
  padding: 4rem 2rem;

  .container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
  }

  .no-events {
    text-align: center;
    padding: 4rem 2rem;
    color: #999;
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 3rem 1rem;

    h1 {
      font-size: 2rem;
    }
  }

  .filters-section {
    padding: 1.5rem 1rem;

    .container {
      flex-direction: column;
      align-items: stretch;
    }

    .category-filters {
      justify-content: center;
    }

    .filter-buttons {
      width: 100%;
      justify-content: space-between;
    }

    .filter-btn {
      flex: 1;
    }
  }

  .events-container {
    padding: 3rem 1rem;

    .events-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>