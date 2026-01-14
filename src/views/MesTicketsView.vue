<template>
  <div class="mes-tickets">
    <div class="page-header">
      <div class="container">
        <h1>Mes tickets</h1>
        <p>Gérez vos billets achetés</p>
      </div>
    </div>
    <div class="tickets-container">
      <div class="container">
        <div v-if="tickets.length === 0" class="no-tickets">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 9C2 7.89543 2.89543 7 4 7H20C21.1046 7 22 7.89543 22 9V15C22 16.1046 21.1046 17 20 17H4C2.89543 17 2 16.1046 2 15V9Z" stroke="currentColor" stroke-width="2"/>
            <path d="M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7" stroke="currentColor" stroke-width="2"/>
            <path d="M9 11H15M9 13H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <h2>Aucun ticket</h2>
          <p>Vous n'avez pas encore acheté de tickets.</p>
          <router-link to="/evenements" class="btn-primary">Voir les événements</router-link>
        </div>
        <div v-else class="tickets-list">
          <div v-for="ticket in tickets" :key="ticket.id" class="ticket-card">
            <div class="ticket-image">
              <img :src="ticket.event.image" :alt="ticket.event.title" />
            </div>
            <div class="ticket-info">
              <h3>{{ ticket.event.title }}</h3>
              <p class="ticket-location">{{ ticket.event.location }}</p>
              <p class="ticket-date">{{ formatDate(ticket.event.date) }}</p>
              <div class="ticket-details">
                <span class="ticket-code">Code: {{ ticket.code }}</span>
                <span class="ticket-price">{{ formatPrice(ticket.event.price) }} FCFA</span>
              </div>
            </div>
            <div class="ticket-actions">
              <button class="btn-download">Télécharger</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

interface Ticket {
  id: string
  code: string
  event: any
}

export default defineComponent({
  name: 'MesTicketsView',
  setup() {
    const store = useStore()

    // Pour l'instant, on simule des tickets vides
    // Dans une vraie app, cela viendrait du store ou d'une API
    const tickets = computed<Ticket[]>(() => {
      return []
    })

    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('fr-FR').format(price)
    }

    return {
      tickets,
      formatDate,
      formatPrice
    }
  }
})
</script>

<style lang="scss" scoped>
.mes-tickets {
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

.tickets-container {
  padding: 4rem 2rem;

  .container {
    max-width: 1400px;
    margin: 0 auto;
  }
}

.no-tickets {
  text-align: center;
  padding: 4rem 2rem;
  color: #999;

  svg {
    color: #666;
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #fff;
  }

  p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .btn-primary {
    display: inline-block;
    background: #00d4aa;
    color: #fff;
    padding: 1rem 2rem;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 600;
    transition: background 0.3s;

    &:hover {
      background: #00b894;
    }
  }
}

.tickets-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.ticket-card {
  background: #1a1a1a;
  border-radius: 8px;
  padding: 2rem;
  display: flex;
  gap: 2rem;
  align-items: center;

  .ticket-image {
    width: 150px;
    height: 150px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .ticket-info {
    flex: 1;

    h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      color: #fff;
    }

    .ticket-location {
      color: #999;
      margin-bottom: 0.5rem;
    }

    .ticket-date {
      color: #00d4aa;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .ticket-details {
      display: flex;
      gap: 2rem;
      align-items: center;

      .ticket-code {
        color: #999;
        font-size: 0.9rem;
      }

      .ticket-price {
        color: #00d4aa;
        font-weight: 600;
        font-size: 1.1rem;
      }
    }
  }

  .ticket-actions {
    .btn-download {
      background: #00d4aa;
      color: #fff;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.3s;

      &:hover {
        background: #00b894;
      }
    }
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 3rem 1rem;

    h1 {
      font-size: 2rem;
    }
  }

  .tickets-container {
    padding: 3rem 1rem;
  }

  .ticket-card {
    flex-direction: column;
    text-align: center;

    .ticket-image {
      width: 100%;
      height: 200px;
    }

    .ticket-details {
      flex-direction: column;
      gap: 1rem;
    }
  }
}
</style>