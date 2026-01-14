<template>
  <div class="evenement-detail" v-if="event">
    <div class="hero-image">
      <img :src="event.image" :alt="event.title" />
      <div class="hero-overlay">
        <div class="container">
          <h1>{{ event.title }}</h1>
        </div>
      </div>
    </div>
    <div class="detail-content">
      <div class="container">
        <div class="content-grid">
          <div class="main-content">
            <div class="event-info-card">
              <h2>À propos de l'événement</h2>
              <p>{{ event.description }}</p>
            </div>
            <div class="event-details-card">
              <h2>Détails</h2>
              <div class="detail-item">
                <strong>Date:</strong>
                <span>{{ formatDate(event.date) }}</span>
              </div>
              <div class="detail-item">
                <strong>Lieu:</strong>
                <span>{{ event.location }}</span>
              </div>
              <div class="detail-item">
                <strong>Catégorie:</strong>
                <span>{{ formatCategory(event.category) }}</span>
              </div>
              <div class="detail-item">
                <strong>Vues:</strong>
                <span>{{ event.views }}</span>
              </div>
            </div>
          </div>
          <div class="sidebar">
            <div class="ticket-box">
              <div class="price">
                <span class="amount">{{ formatPrice(event.price) }}</span>
                <span class="currency">FCFA</span>
              </div>
              <button class="btn-buy" @click="openBuyModal">Acheter un ticket</button>
              <div class="ticket-info">
                <p>✓ Billet électronique</p>
                <p>✓ Annulation gratuite</p>
                <p>✓ Support 24/7</p>
              </div>
            </div>
            <div v-if="isCheckingStatus" class="status-loader">
              <div class="spinner"></div>
              <div class="status-text">{{ statusCheckMessage || 'Vérification du statut de la transaction...' }}</div>
            </div>
            <div v-else-if="statusCheckMessage" class="status-result">
              {{ statusCheckMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <BuyTicketModal
      :is-open="isModalOpen"
      :event="event"
      @close="closeModal"
      @submit="handlePurchase"
      @success="handlePaymentSuccess"
      @error="handlePaymentError"
    />
  </div>
  <div v-else class="not-found">
    <div class="container">
      <h1>Événement non trouvé</h1>
      <router-link to="/" class="btn-back">Retour à l'accueil</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import BuyTicketModal from '@/components/BuyTicketModal.vue'
import { paymentService } from '@/services/api'

export default defineComponent({
  name: 'EvenementDetailView',
  components: {
    BuyTicketModal
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const isModalOpen = ref(false)
    const isCheckingStatus = ref(false)
    const statusCheckMessage = ref('')

    const event = computed(() => {
      const id = route.params.id as string
      return store.getters.eventById(id)
    })

    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const formatCategory = (category: string) => {
      const categories: Record<string, string> = {
        concert: 'Concert',
        show: 'Show',
        cinema: 'Cinéma',
        theatre: 'Théâtre',
        sport: 'Sport',
        exposition: 'Exposition'
      }
      return categories[category] || category
    }

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('fr-FR').format(price)
    }

    const openBuyModal = () => {
      isModalOpen.value = true
    }

    const closeModal = () => {
      isModalOpen.value = false
    }

    const handlePurchase = (purchaseData: any) => {
      // Cette fonction est appelée après un paiement réussi
    }

    const handlePaymentSuccess = async (paymentData: any) => {
      const transactionId = paymentData.transactionId
      const reference = paymentData.reference
      const referenceBp = paymentData.referenceBp // Référence retournée par l'API

      // Afficher un message de succès initial
      const message = `Paiement initié avec succès!\n\n` +
        `Nom: ${paymentData.payerName || paymentData.customerName}\n` +
        `Téléphone: ${paymentData.phone || paymentData.phoneNumber}\n` +
        `Quantité: ${paymentData.quantity}\n` +
        `Total: ${formatPrice(paymentData.totalPrice)} FCFA\n` +
        `Mode de paiement: ${paymentData.operateur === 'moov_money' ? 'Moov Money' : paymentData.operateur === 'airtel_money' ? 'Airtel Money' : paymentData.paymentMethod}\n` +
        `Référence BP: ${referenceBp || 'N/A'}\n` +
        `Transaction ID: ${transactionId || 'N/A'}\n\n` +
        `Veuillez confirmer le paiement sur votre téléphone.`

      alert(message)

      // Vérifier le statut de la transaction en utilisant la référence BP retournée par l'API
      if (referenceBp) {
        try {
          isCheckingStatus.value = true
          statusCheckMessage.value = 'Vérification du statut de la transaction...'

          const statusResult = await paymentService.checkTransactionStatus(referenceBp)
          if (statusResult.success) {
            const status =
              statusResult.status ||
              statusResult.data?.transaction?.status ||
              statusResult.data?.status

            if (status === 'create' || status === 'completed' || statusResult.data?.transaction?.code === 200) {
              statusCheckMessage.value = statusResult.data?.transaction?.message || 'Paiement confirmé.'
            } else {
              statusCheckMessage.value = `Statut de la transaction: ${status || 'inconnu'}`
            }
          } else {
            statusCheckMessage.value = statusResult.message || 'Impossible de récupérer le statut.'
          }
        } catch (error) {
          statusCheckMessage.value = 'Erreur lors de la vérification du statut.'
          console.error('Erreur lors de la vérification du statut:', error)
        } finally {
          isCheckingStatus.value = false
        }
      } else {
        console.warn('Référence BP non disponible pour vérifier le statut')
      }

      // Optionnel: Rediriger vers la page "Mes tickets"
      // router.push('/mes-tickets')
    }

    const handlePaymentError = (error: any) => {
      // L'erreur est déjà affichée dans le modal
      console.error('Erreur de paiement:', error)
    }

    return {
      event,
      isModalOpen,
      isCheckingStatus,
      statusCheckMessage,
      formatDate,
      formatCategory,
      formatPrice,
      openBuyModal,
      closeModal,
      handlePurchase,
      handlePaymentSuccess,
      handlePaymentError
    }
  }
})
</script>

<style lang="scss" scoped>
.evenement-detail {
  min-height: 100vh;
  background: #000;
}

.hero-image {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hero-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
    padding: 4rem 2rem 2rem;

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    h1 {
      font-size: 3rem;
      font-weight: 900;
      color: #fff;
    }
  }
}

.detail-content {
  padding: 4rem 2rem;

  .container {
    max-width: 1400px;
    margin: 0 auto;
  }
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.event-info-card,
.event-details-card {
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 8px;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #fff;
  }

  p {
    color: #999;
    line-height: 1.6;
    font-size: 1.1rem;
  }
}

.event-details-card {
  .detail-item {
    display: flex;
    justify-content: space-between;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    &:last-child {
      border-bottom: none;
    }

    strong {
      color: #00d4aa;
    }

    span {
      color: #fff;
    }
  }
}

.sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.ticket-box {
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;

  .price {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 2rem;

    .amount {
      font-size: 3rem;
      font-weight: 900;
      color: #00d4aa;
    }

    .currency {
      font-size: 1.5rem;
      color: #999;
    }
  }

  .btn-buy {
    width: 100%;
    background: #00d4aa;
    color: #fff;
    padding: 1.25rem;
    border: none;
    border-radius: 4px;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
    margin-bottom: 2rem;

    &:hover {
      background: #00b894;
    }
  }

  .ticket-info {
    text-align: left;
    color: #999;

    p {
      margin: 0.75rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
}

.status-loader {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #fff;

  .spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.2);
    border-top: 3px solid #00d4aa;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .status-text {
    font-size: 0.95rem;
  }
}

.status-result {
  margin-top: 1rem;
  padding: 0.9rem 1rem;
  background: rgba(0, 212, 170, 0.1);
  border: 1px solid rgba(0, 212, 170, 0.4);
  border-radius: 8px;
  color: #00d4aa;
  font-size: 0.95rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;

  .container {
    max-width: 600px;
  }

  h1 {
    font-size: 3rem;
    margin-bottom: 2rem;
    color: #fff;
  }

  .btn-back {
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

@media (max-width: 968px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .hero-image {
    height: 300px;

    .hero-overlay {
      padding: 2rem 1rem 1rem;

      h1 {
        font-size: 2rem;
      }
    }
  }

  .detail-content {
    padding: 3rem 1rem;
  }

  .event-info-card,
  .event-details-card,
  .ticket-box {
    padding: 1.5rem;
  }

  .ticket-box .price .amount {
    font-size: 2rem;
  }
}
</style>