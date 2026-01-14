<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-btn" @click="closeModal">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      
      <div class="modal-header">
        <h2>Acheter des tickets</h2>
        <p class="event-title">{{ event?.title }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="ticket-form">
        <div class="form-group">
          <label for="name">Nom complet *</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Votre nom complet"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="phone">Numéro de téléphone *</label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            placeholder="Entrez le numéro de téléphone tel quel"
            required
            class="form-input"
          />
          <small class="form-hint">Entrez le numéro exactement comme il doit être envoyé à l'API</small>
        </div>

        <div class="form-group">
          <label for="quantity">Nombre de tickets *</label>
          <div class="quantity-selector">
            <button
              type="button"
              class="quantity-btn"
              @click="decreaseQuantity"
              :disabled="form.quantity <= 1"
            >
              −
            </button>
            <input
              id="quantity"
              v-model.number="form.quantity"
              type="number"
              min="1"
              max="10"
              required
              class="quantity-input"
            />
            <button
              type="button"
              class="quantity-btn"
              @click="increaseQuantity"
              :disabled="form.quantity >= 10"
            >
              +
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>Mode de paiement *</label>
          <div class="payment-methods">
            <label class="payment-option" :class="{ active: form.paymentMethod === 'moov' }">
              <input
                v-model="form.paymentMethod"
                type="radio"
                value="moov"
                required
              />
              <div class="payment-content">
                <div class="payment-icon moov">
                  <span>M</span>
                </div>
                <span>Moov Money</span>
              </div>
            </label>
            <label class="payment-option" :class="{ active: form.paymentMethod === 'airtel' }">
              <input
                v-model="form.paymentMethod"
                type="radio"
                value="airtel"
                required
              />
              <div class="payment-content">
                <div class="payment-icon airtel">
                  <span>A</span>
                </div>
                <span>Airtel Money</span>
              </div>
            </label>
          </div>
        </div>

        <div class="total-section">
          <div class="total-line">
            <span>Prix unitaire:</span>
            <span>{{ formatPrice(event?.price || 0) }} FCFA</span>
          </div>
          <div class="total-line">
            <span>Quantité:</span>
            <span>{{ form.quantity }}</span>
          </div>
          <div class="total-line total">
            <span>Total:</span>
            <span class="total-amount">{{ formatPrice(totalPrice) }} FCFA</span>
          </div>
        </div>

        <div v-if="errorMessage" class="error-message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ errorMessage }}
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="closeModal" :disabled="isSubmitting">
            Annuler
          </button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting || !canSubmit">
            <span v-if="!isSubmitting">
              Confirmer l'achat
            </span>
            <span v-else class="loading">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="spinner">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-dasharray="32" stroke-dashoffset="32">
                  <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                  <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                </circle>
              </svg>
              Traitement du paiement...
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, ref, watch } from 'vue'
import type { Event } from '@/types/event'
import { paymentService } from '@/services/api'

interface FormData {
  name: string
  phone: string
  quantity: number
  paymentMethod: 'moov' | 'airtel' | ''
}

export default defineComponent({
  name: 'BuyTicketModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    event: {
      type: Object as () => Event | null,
      default: null
    }
  },
  emits: ['close', 'submit', 'success', 'error'],
  setup(props, { emit }) {
    const form = reactive<FormData>({
      name: '',
      phone: '',
      quantity: 1,
      paymentMethod: ''
    })

    const isSubmitting = ref(false)
    const errorMessage = ref('')

    const totalPrice = computed(() => {
      if (!props.event) return 0
      return props.event.price * form.quantity
    })

    const canSubmit = computed(() => {
      return form.name.trim() !== '' && 
             form.phone.trim() !== '' && 
             form.paymentMethod !== '' &&
             form.quantity > 0 &&
             !isSubmitting.value
    })


    const increaseQuantity = () => {
      if (form.quantity < 10) {
        form.quantity++
      }
    }

    const decreaseQuantity = () => {
      if (form.quantity > 1) {
        form.quantity--
      }
    }

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('fr-FR').format(price)
    }

    const closeModal = () => {
      emit('close')
    }

    const handleSubmit = async () => {
      if (!canSubmit.value) {
        return
      }

      errorMessage.value = ''
      isSubmitting.value = true

      try {
        const paymentData = {
          phone: form.phone.trim(),
          amount: totalPrice.value,
          payerName: form.name,
          reference: `TKT-${props.event?.id}-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          operateur: form.paymentMethod === 'moov' ? 'moov_money' as const : 'airtel_money' as const,
          eventId: props.event?.id,
          eventTitle: props.event?.title,
          quantity: form.quantity
        }

        const result = await paymentService.processPayment(paymentData)

        if (result.success) {
          emit('success', {
            ...paymentData,
            reference: paymentData.reference,
            referenceBp: result.referenceBp, // Utiliser la référence retournée par l'API
            transactionId: result.transactionId,
            response: result
          })
          
          emit('submit', {
            name: form.name,
            phone: form.phone.trim(),
            quantity: form.quantity,
            paymentMethod: form.paymentMethod,
            totalPrice: totalPrice.value,
            event: props.event,
            reference: paymentData.reference,
            referenceBp: result.referenceBp, // Utiliser la référence retournée par l'API
            transactionId: result.transactionId
          })

          // Réinitialiser le formulaire
          form.name = ''
          form.phone = ''
          form.quantity = 1
          form.paymentMethod = ''
          closeModal()
        } else {
          // Afficher un message d'erreur détaillé
          const detailedMessage = result.message || 'Erreur lors du paiement. Veuillez réessayer.'
          errorMessage.value = detailedMessage
          console.error('Erreur de paiement:', result)
          emit('error', result)
        }
      } catch (error: any) {
        // Gérer les erreurs non capturées par le service
        const errorMsg = error.message || 'Une erreur inattendue est survenue. Veuillez réessayer.'
        errorMessage.value = errorMsg
        console.error('Erreur inattendue:', error)
        emit('error', error)
      } finally {
        isSubmitting.value = false
      }
    }

    // Réinitialiser le formulaire quand le modal se ferme
    watch(() => props.isOpen, (isOpen) => {
      if (!isOpen) {
        form.name = ''
        form.phone = ''
        form.quantity = 1
        form.paymentMethod = ''
        errorMessage.value = ''
        isSubmitting.value = false
      }
    })

    return {
      form,
      totalPrice,
      isSubmitting,
      errorMessage,
      canSubmit,
      increaseQuantity,
      decreaseQuantity,
      formatPrice,
      closeModal,
      handleSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: #1a1a1a;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(90deg);
  }
}

.modal-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h2 {
    font-size: 2rem;
    font-weight: 900;
    color: #fff;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #fff 0%, #00d4aa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .event-title {
    color: #999;
    font-size: 1rem;
    margin: 0;
  }
}

.ticket-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 2rem;

  label {
    display: block;
    color: #fff;
    font-weight: 600;
    margin-bottom: 0.75rem;
    font-size: 1rem;
  }
}

.form-hint {
  display: block;
  color: #666;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 1rem;
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00d4aa;
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }

  &::placeholder {
    color: #666;
  }
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quantity-btn {
  width: 45px;
  height: 45px;
  background: #00d4aa;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: #00b894;
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.quantity-input {
  flex: 1;
  padding: 1rem;
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00d4aa;
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }
}

.payment-methods {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.payment-option {
  position: relative;
  cursor: pointer;

  input[type="radio"] {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .payment-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem;
    background: #000;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    transition: all 0.3s ease;
    color: #fff;
    font-weight: 600;
  }

  &:hover .payment-content {
    border-color: #00d4aa;
    background: rgba(0, 212, 170, 0.05);
  }

  &.active .payment-content {
    border-color: #00d4aa;
    background: rgba(0, 212, 170, 0.1);
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.2);
  }

  .payment-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 900;
    color: #fff;

    &.moov {
      background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
    }

    &.airtel {
      background: linear-gradient(135deg, #e60012 0%, #ff1a2e 100%);
    }
  }
}

.total-section {
  background: #000;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.total-line {
  display: flex;
  justify-content: space-between;
  color: #999;
  margin-bottom: 0.75rem;
  font-size: 1rem;

  &:last-child {
    margin-bottom: 0;
  }

  &.total {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 1.2rem;
    font-weight: 600;

    .total-amount {
      color: #00d4aa;
      font-size: 1.5rem;
      font-weight: 900;
    }
  }
}

.error-message {
  background: rgba(255, 107, 53, 0.1);
  border: 1px solid rgba(255, 107, 53, 0.3);
  color: #ff6b35;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  animation: shake 0.5s ease-out;

  svg {
    flex-shrink: 0;
  }
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  animation: spin 1s linear infinite;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: transparent;
  color: #999;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }
}

.btn-submit {
  background: #00d4aa;
  color: #fff;

  &:hover:not(:disabled) {
    background: #00b894;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 212, 170, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
}

.btn-cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }

  .modal-content {
    max-height: 95vh;
  }

  .modal-header {
    padding: 1.5rem 1.5rem 1rem;

    h2 {
      font-size: 1.5rem;
    }
  }

  .ticket-form {
    padding: 1.5rem;
  }

  .payment-methods {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
