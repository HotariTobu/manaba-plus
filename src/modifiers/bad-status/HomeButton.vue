<script setup lang="ts">
import transition, { invalidUrl } from './transition'
import { o } from "@/stores/options"
</script>

<template lang="pug">
v-btn(color="primary" :disabled="invalidUrl" @click.once="transition")
  | {{ o.timeout.timeoutButtonLabel.value }}
</template>

<style scoped>
</style>
