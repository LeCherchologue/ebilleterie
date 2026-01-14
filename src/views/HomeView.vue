<template>
  <div class="home">
    <HeroSection />
    <EventSection 
      title="CONCERTS / SHOW"
      description="Assurez-vous de ne pas manquer ces événements"
      :events="allEvents"
      category=""
    />
    <EventSection 
      title="CINÉMA / THÉATRE / EXPO"
      description="Assurez-vous de ne pas manquer ces films"
      :events="allEvents"
      category=""
    />
    <EventSection 
      title="SPORTS"
      description="Assurez-vous de ne pas manquer ces rencontres"
      :events="allEvents"
      category=""
    />
    <section class="past-events">
      <div class="container">
        <h2 class="section-title">Évènements passés</h2>
        <div class="events-grid">
          <EventCard 
            v-for="event in pastEvents" 
            :key="event.id" 
            :event="event"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import type { Event } from '@/types/event'
import HeroSection from '@/components/HeroSection.vue'
import EventSection from '@/components/EventSection.vue'
import EventCard from '@/components/EventCard.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    HeroSection,
    EventSection,
    EventCard
  },
  setup() {
    const store = useStore()

    const allEvents = computed(() => store.getters.allEvents)

    const pastEvents = computed(() => {
      const now = new Date()
      return allEvents.value
        .filter((event: Event) => new Date(event.date) < now)
        .slice(0, 12)
    })

    return {
      allEvents,
      pastEvents
    }
  }
})
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  background: #000;
}

.past-events {
  background: #000;
  padding: 4rem 2rem;

  .container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .section-title {
    font-size: 2.5rem;
    font-weight: 900;
    color: #fff;
    margin-bottom: 3rem;
  }

  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
  }

  @media (max-width: 768px) {
    padding: 3rem 1rem;

    .section-title {
      font-size: 2rem;
    }

    .events-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }
}
</style>