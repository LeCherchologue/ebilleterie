<template>
  <header class="header">
    <div class="container">
      <router-link to="/" class="logo">
        <span class="logo-e">e</span>
        <span class="logo-billeterie">Billeterie</span>
      </router-link>
      <nav class="nav">
        <router-link to="/" class="nav-link" active-class="active">Accueil</router-link>
        <div class="nav-dropdown">
          <router-link to="/evenements" class="nav-link">
            Évènements
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </router-link>
        </div>
        <router-link to="/mes-tickets" class="nav-link">Mes tickets</router-link>
        <router-link to="/contact" class="nav-link">Contact</router-link>
      </nav>
      <router-link to="/createurs" class="btn-createurs">Créateurs d'évènements</router-link>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Header'
})
</script>

<style lang="scss" scoped>
.header {
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  animation: slideDown 0.5s ease-out;
  transition: background 0.3s ease, box-shadow 0.3s ease;

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }

  .logo {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bold;
    white-space: nowrap;
    text-decoration: none;
    animation: fadeInDown 0.6s ease-out;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }

    .logo-e {
      color: #00d4aa;
      font-size: 1.8rem;
      font-weight: 900;
      animation: pulse 2s ease-in-out infinite;
    }

    .logo-billeterie {
      color: #fff;
      margin-left: 0.5rem;
      letter-spacing: 0.05em;
    }
  }

  .nav {
    display: flex;
    align-items: center;
    gap: 2rem;
    flex: 1;
    justify-content: center;

    .nav-link {
      color: #fff;
      text-decoration: none;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      position: relative;
      animation: fadeInUp 0.6s ease-out backwards;

      @for $i from 1 through 4 {
        &:nth-child(#{$i}) {
          animation-delay: #{$i * 0.1}s;
        }
      }

      &::before {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 2px;
        background: #00d4aa;
        transition: width 0.3s ease;
      }

      &:hover {
        color: #00d4aa;
        transform: translateY(-2px);

        &::before {
          width: 100%;
        }
      }

      &.active {
        color: #00d4aa;
        border-bottom: 2px solid #00d4aa;
        padding-bottom: 0.25rem;

        &::before {
          width: 100%;
        }
      }
    }

    .nav-dropdown {
      position: relative;
    }
  }

  .btn-createurs {
    background: #00d4aa;
    color: #fff;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;
    white-space: nowrap;
    transition: all 0.3s ease;
    animation: fadeInRight 0.6s ease-out;
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
      background: rgba(255, 255, 255, 0.2);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    &:hover {
      background: #00b894;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 212, 170, 0.4);

      &::before {
        width: 300px;
        height: 300px;
      }
    }

    &:active {
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .container {
      flex-wrap: wrap;
      padding: 0 1rem;
    }

    .nav {
      order: 3;
      width: 100%;
      justify-content: space-around;
      gap: 0.5rem;
    }

    .btn-createurs {
      font-size: 0.8rem;
      padding: 0.5rem 1rem;
    }
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>