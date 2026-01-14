<template>
  <section class="hero">
    <div class="hero-content">
      <h1 class="hero-title">Achète ton ticket</h1>
      <div class="hero-categories">
        <span class="category active">Ciné</span>
        <span class="category">Concert</span>
        <span class="category">Show privé</span>
        <span class="category">Théatre</span>
        <span class="category">Sport</span>
        <span class="category">Exposition</span>
      </div>
      <p class="hero-subtitle">Se procurer un ticket n'a jamais été aussi simple !</p>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HeroSection'
})
</script>

<style lang="scss" scoped>
.hero {
  background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
  position: relative;
  padding: 6rem 2rem;
  text-align: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(0, 212, 170, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    animation: fadeInUp 0.8s ease-out;
  }

  .hero-title {
    font-size: 4rem;
    font-weight: 900;
    color: #fff;
    margin-bottom: 2rem;
    line-height: 1.2;
    animation: fadeInUp 1s ease-out 0.2s backwards;
    background: linear-gradient(135deg, #fff 0%, #00d4aa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-categories {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .category {
    color: #fff;
    font-size: 1.2rem;
    font-weight: 600;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    animation: fadeInUp 0.8s ease-out backwards;

    @for $i from 1 through 6 {
      &:nth-child(#{$i}) {
        animation-delay: #{$i * 0.1 + 0.4}s;
      }
    }

    &.active {
      color: #00d4aa;
      transform: scale(1.1);
      
      &::after {
        content: '';
        position: absolute;
        right: -0.5rem;
        top: 50%;
        transform: translateY(-50%);
        width: 2px;
        height: 20px;
        background: #fff;
        animation: blink 1s ease-in-out infinite;
      }
    }

    &:hover {
      color: #00d4aa;
      transform: translateY(-3px) scale(1.05);
    }
  }

  .hero-subtitle {
    font-size: 1.2rem;
    color: #fff;
    opacity: 0.9;
    animation: fadeInUp 1s ease-out 1s backwards;
  }

  @media (max-width: 768px) {
    padding: 4rem 1rem;

    .hero-title {
      font-size: 2.5rem;
    }

    .category {
      font-size: 1rem;
      padding: 0.4rem 0.8rem;
    }

    .hero-subtitle {
      font-size: 1rem;
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}
</style>