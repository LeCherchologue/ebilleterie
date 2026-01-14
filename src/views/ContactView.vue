<template>
  <div class="contact">
    <div class="page-header">
      <div class="container">
        <h1>Contact</h1>
        <p>Nous sommes là pour vous aider</p>
      </div>
    </div>
    <div class="contact-container">
      <div class="container">
        <div class="contact-content">
          <div class="contact-info">
            <h2>Contactez-nous</h2>
            <p>Une question ? Un problème ? N'hésitez pas à nous contacter.</p>
            <div class="contact-methods">
              <div class="contact-method">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div>
                  <strong>Email</strong>
                  <p>contact@ebilleterie.com</p>
                </div>
              </div>
              <div class="contact-method">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div>
                  <strong>Téléphone</strong>
                  <p>+241 XX XX XX XX</p>
                </div>
              </div>
              <div class="contact-method">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2"/>
                </svg>
                <div>
                  <strong>Adresse</strong>
                  <p>Libreville, Gabon</p>
                </div>
              </div>
            </div>
          </div>
          <div class="contact-form">
            <h2>Envoyez-nous un message</h2>
            <form @submit.prevent="submitForm">
              <div class="form-group">
                <label for="name">Nom complet</label>
                <input type="text" id="name" v-model="form.name" required />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="form.email" required />
              </div>
              <div class="form-group">
                <label for="subject">Sujet</label>
                <input type="text" id="subject" v-model="form.subject" required />
              </div>
              <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" v-model="form.message" rows="6" required></textarea>
              </div>
              <button type="submit" class="btn-submit">Envoyer</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ContactView',
  setup() {
    const form = ref({
      name: '',
      email: '',
      subject: '',
      message: ''
    })

    const submitForm = () => {
      // Ici, vous pouvez ajouter la logique pour envoyer le formulaire
      alert('Message envoyé ! (Fonctionnalité à implémenter)')
      form.value = {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    }

    return {
      form,
      submitForm
    }
  }
})
</script>

<style lang="scss" scoped>
.contact {
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

.contact-container {
  padding: 4rem 2rem;

  .container {
    max-width: 1400px;
    margin: 0 auto;
  }
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}

.contact-info {
  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #fff;
  }

  > p {
    color: #999;
    margin-bottom: 3rem;
    font-size: 1.1rem;
  }
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact-method {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  color: #fff;

  svg {
    color: #00d4aa;
    flex-shrink: 0;
    margin-top: 0.25rem;
  }

  strong {
    display: block;
    margin-bottom: 0.5rem;
    color: #00d4aa;
  }

  p {
    color: #999;
    margin: 0;
  }
}

.contact-form {
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 8px;

  h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #fff;
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

  input,
  textarea {
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

    &::placeholder {
      color: #666;
    }
  }

  textarea {
    resize: vertical;
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

@media (max-width: 968px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 3rem 1rem;

    h1 {
      font-size: 2rem;
    }
  }

  .contact-container {
    padding: 3rem 1rem;
  }

  .contact-form {
    padding: 1.5rem;
  }
}
</style>