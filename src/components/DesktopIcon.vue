<template>
  <div class="desktop-icon" @click="$emit('click')">
    <div class="icon" :class="iconClass"></div>
    <span>{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: 'DesktopIcon',
  props: {
    label: {
      type: String,
      required: true
    },
    iconClass: {
      type: String,
      default: ''
    }
  }
}
</script>
