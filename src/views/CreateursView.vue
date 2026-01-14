<template>
  <div class="createurs">
    <div class="page-header">
      <div class="container">
        <h1>Créateurs d'évènements</h1>
        <p>Créez et gérez vos événements facilement</p>
      </div>
    </div>
    <div class="createurs-content">
      <div class="container">
        <div class="features">
          <div class="feature-card">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h3>Gestion simple</h3>
            <p>Créez et gérez vos événements en quelques clics</p>
          </div>
          <div class="feature-card">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h3>Statistiques détaillées</h3>
            <p>Suivez vos ventes et vos performances en temps réel</p>
          </div>
          <div class="feature-card">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <h3>Paiement sécurisé</h3>
            <p>Recevez vos paiements de manière sécurisée</p>
          </div>
        </div>
        <div class="cta-section">
          <h2>Prêt à créer votre premier événement ?</h2>
          <p>Rejoignez des centaines de créateurs qui font confiance à eBilleterie</p>
          <button class="btn-primary" @click="showForm = true">Créer un compte</button>
        </div>
        <div v-if="showForm" class="signup-form">
          <h2>Créer un compte créateur</h2>
          <form @submit.prevent="submitSignup">
            <div class="form-group">
              <label for="name">Nom complet</label>
              <input type="text" id="name" v-model="form.name" required />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="form.email" required />
            </div>
            <div class="form-group">
              <label for="phone">Téléphone</label>
              <input type="tel" id="phone" v-model="form.phone" required />
            </div>
            <div class="form-group">
              <label for="organization">Organisation</label>
              <input type="text" id="organization" v-model="form.organization" required />
            </div>
            <button type="submit" class="btn-submit">S'inscrire</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'CreateursView',
  setup() {
    const showForm = ref(false)
    const form = ref({
      name: '',
      email: '',
      phone: '',
      organization: ''
    })

    const submitSignup = () => {
      // Ici, vous pouvez ajouter la logique d'inscription
      alert('Inscription réussie ! (Fonctionnalité à implémenter)')
      showForm.value = false
      form.value = {
        name: '',
        email: '',
        phone: '',
        organization: ''
      }
    }

    return {
      showForm,
      form,
      submitSignup
    }
  }
})
</script>

<style lang="scss" scoped>
.createurs {
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

.createurs-content {
  padding: 4rem 2rem;

  .container {
    max-width: 1400px;
    margin: 0 auto;
  }
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.feature-card {
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;

  svg {
    color: #00d4aa;
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #fff;
  }

  p {
    color: #999;
    line-height: 1.6;
  }
}

.cta-section {
  text-align: center;
  padding: 4rem 2rem;
  background: #1a1a1a;
  border-radius: 8px;
  margin-bottom: 3rem;

  h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #fff;
  }

  p {
    color: #999;
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }

  .btn-primary {
    background: #00d4aa;
    color: #fff;
    padding: 1rem 2rem;
    border: none;
    border-radius: 4px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: #00b894;
    }
  }
}

.signup-form {
  background: #1a1a1a;
  padding: 3rem;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;

  h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #fff;
    text-align: center;
  }
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #fff;
    font-weight: 600;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    background: #000;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    color: #fff;
    font-size: 1rem;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: #00d4aa;
    }
  }
}

.btn-submit {
  width: 100%;
  background: #00d4aa;
  color: #fff;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #00b894;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 3rem 1rem;

    h1 {
      font-size: 2rem;
    }
  }

  .createurs-content {
    padding: 3rem 1rem;
  }

  .features {
    grid-template-columns: 1fr;
  }

  .cta-section {
    padding: 3rem 1.5rem;

    h2 {
      font-size: 2rem;
    }
  }

  .signup-form {
    padding: 2rem 1.5rem;
  }
}
</style>