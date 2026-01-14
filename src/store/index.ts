import { createStore } from 'vuex'
import type { Event } from '@/types/event'

interface State {
  events: Event[]
}

export default createStore<State>({
  state: {
    events: [
      {
        id: '1',
        title: 'Grand show à l\'occasion du lancement de l\'inter-classe',
        description: 'Un événement exceptionnel avec de nombreux artistes',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
        date: '2024-01-16',
        location: 'Épi de Nzeng Ayong',
        category: 'show',
        price: 100,
        popular: true,
        views: 1250
      },
      {
        id: '2',
        title: 'Concert de musique urbaine',
        description: 'Les plus grands artistes du moment',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        date: '2024-02-20',
        location: 'Palais des Sports',
        category: 'concert',
        price: 100,
        popular: true,
        views: 2100
      },
      {
        id: '3',
        title: 'Match de football - Championnat',
        description: 'Finale du championnat national',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
        date: '2024-02-15',
        location: 'Stade de Nzeng',
        category: 'sport',
        price: 100,
        popular: true,
        views: 1800
      },
      {
        id: '4',
        title: 'Projection cinéma - Avant-première',
        description: 'Découvrez le dernier film à succès',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
        date: '2024-01-25',
        location: 'Cinéma ABC',
        category: 'cinema',
        price: 100,
        popular: false,
        views: 450
      },
      {
        id: '5',
        title: 'Pièce de théâtre - Comédie',
        description: 'Une soirée de rires garantis',
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400',
        date: '2024-02-10',
        location: 'Théâtre National',
        category: 'theatre',
        price: 100,
        popular: false,
        views: 320
      },
      {
        id: '6',
        title: 'Exposition d\'art contemporain',
        description: 'Découvrez les œuvres des artistes locaux',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
        date: '2024-02-05',
        location: 'Musée National',
        category: 'exposition',
        price: 100,
        popular: false,
        views: 280
      },
      {
        id: '7',
        title: 'Show privé - Soirée VIP',
        description: 'Une soirée exclusive avec accès VIP',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
        date: '2024-02-28',
        location: 'Villa Bar',
        category: 'show',
        price: 100,
        popular: true,
        views: 950
      },
      {
        id: '8',
        title: 'Tournoi de basket-ball',
        description: 'Compétition inter-écoles',
        image: 'https://images.unsplash.com/photo-1519869325931-2815731502c1?w=400',
        date: '2024-02-12',
        location: 'Palais des Sports',
        category: 'sport',
        price: 100,
        popular: false,
        views: 380
      }
    ]
  },
  getters: {
    allEvents: (state) => state.events,
    eventsByCategory: (state) => (category: string) => {
      return state.events.filter(event => event.category === category)
    },
    popularEvents: (state) => {
      return state.events.filter(event => event.popular).sort((a, b) => b.views - a.views)
    },
    recentEvents: (state) => {
      return [...state.events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    },
    eventById: (state) => (id: string) => {
      return state.events.find(event => event.id === id)
    }
  },
  mutations: {
    addEvent(state, event: Event) {
      state.events.push(event)
    },
    updateEvent(state, updatedEvent: Event) {
      const index = state.events.findIndex(e => e.id === updatedEvent.id)
      if (index !== -1) {
        state.events[index] = updatedEvent
      }
    }
  },
  actions: {
    addEvent({ commit }, event: Event) {
      commit('addEvent', event)
    },
    updateEvent({ commit }, event: Event) {
      commit('updateEvent', event)
    }
  },
  modules: {
  }
})