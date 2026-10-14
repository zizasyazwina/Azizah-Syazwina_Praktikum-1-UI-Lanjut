<template>
  <AppButton :variant="variant" @click="$emit('click')">
    <slot />
  </AppButton>
</template>

<script setup>
import AppButton from '@/components/ui/AppButton.vue'

defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
})
defineEmits(['click'])
</script>
