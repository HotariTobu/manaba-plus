<script setup lang="ts">
import { t } from '@/composables/useT9n';
import { submitAll } from './submit'
import { mdiPlus } from '@mdi/js'

const handleChange = (event: Event) => {
  // Submit files
  const input = event.target as HTMLInputElement
  if (input.files instanceof FileList) {
    submitAll(input.files)
  }
}
</script>

<template lang="pug">
label.me-auto.my-2
  input.hidden(type="file" multiple @change.prevent="handleChange")
  v-card.p-2(link)
    v-icon(:icon="mdiPlus")
    | {{ t.report.addFile }}
</template>

<style scoped>
label {
  display: inline-block;
}
</style>
