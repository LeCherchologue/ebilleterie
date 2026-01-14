<template>
  <div class="event-card" :class="{ visible: isVisible }" @click="goToEvent" ref="cardRef">
    <div class="event-image">
      <img :src="event.image" :alt="event.title" />
      <div class="event-date">
        <span class="date-day">{{ day }}</span>
        <span class="date-month">{{ month }}</span>
      </div>
      <div class="event-views">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3C4.5 3 1.73 5.11 0 8C1.73 10.89 4.5 13 8 13C11.5 13 14.27 10.89 16 8C14.27 5.11 11.5 3 8 3ZM8 11C6.34 11 5 9.66 5 8C5 6.34 6.34 5 8 5C9.66 5 11 6.34 11 8C11 9.66 9.66 11 8 11Z" fill="currentColor"/>
          <path d="M8 6.5C7.17 6.5 6.5 7.17 6.5 8C6.5 8.83 7.17 9.5 8 9.5C8.83 9.5 9.5 8.83 9.5 8C9.5 7.17 8.83 6.5 8 6.5Z" fill="currentColor"/>
        </svg>
        {{ event.views }}
      </div>
    </div>
    <div class="event-info">
      <h3 class="event-title">{{ event.title }}</h3>
      <p class="event-location">{{ event.location }}</p>
      <div class="event-footer">
        <span class="event-badge" v-if="event.popular">GRAND</span>
        <span class="event-price">{{ formatPrice(event.price) }} FCFA</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Event } from '@/types/event'

export default defineComponent({
  name: 'EventCard',
  props: {
    event: {
      type: Object as () => Event,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const isVisible = ref(false)
    const cardRef = ref<HTMLElement | null>(null)

    const day = computed(() => {
      const date = new Date(props.event.date)
      return date.getDate()
    })

    const month = computed(() => {
      const date = new Date(props.event.date)
      const months = ['Janv', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc']
      return months[date.getMonth()]
    })

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('fr-FR').format(price)
    }

    const goToEvent = () => {
      router.push(`/evenement/${props.event.id}`)
    }

    onMounted(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              isVisible.value = true
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1 }
      )

      if (cardRef.value) {
        observer.observe(cardRef.value)
      }
    })

    return {
      day,
      month,
      formatPrice,
      goToEvent,
      isVisible,
      cardRef
    }
  }
})
</script>

<style lang="scss" scoped>
.event-card {
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  animation: fadeInUp 0.6s ease-out backwards;
  opacity: 0;

  @for $i from 1 through 10 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.1}s;
    }
  }

  &.visible {
    opacity: 1;
  }

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 15px 40px rgba(0, 212, 170, 0.3);
    background: #222;
  }

  .event-image {
    position: relative;
    width: 100%;
    height: 250px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    &:hover img {
      transform: scale(1.15);
    }

    .event-date {
      position: absolute;
      top: 1rem;
      left: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 2;

      .date-day {
        background: #00d4aa;
        color: #fff;
        padding: 0.5rem 0.75rem;
        font-weight: bold;
        font-size: 1.2rem;
        border-radius: 4px 4px 0 0;
        animation: pulse 2s ease-in-out infinite;
      }

      .date-month {
        background: #ff6b35;
        color: #fff;
        padding: 0.25rem 0.75rem;
        font-size: 0.8rem;
        font-weight: 600;
        border-radius: 0 0 4px 4px;
        transition: transform 0.3s ease;
      }
    }

    .event-views {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      padding: 0.5rem 0.75rem;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      z-index: 2;
    }
  }

  .event-info {
    padding: 1.5rem;

    .event-title {
      color: #fff;
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      line-height: 1.4;
    }

    .event-location {
      color: #999;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .event-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .event-badge {
        background: #ff6b35;
        color: #fff;
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        animation: bounce 2s ease-in-out infinite;
        display: inline-block;
      }

      .event-price {
        color: #00d4aa;
        font-weight: 600;
        font-size: 1rem;
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.1);
        }
      }
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

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>