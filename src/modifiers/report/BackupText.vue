<script setup lang="ts">
import use from "@/composables/use";
import { mapFrom } from './backup-text'
import { o } from "@/stores/options"
import { sha256 } from '@/utils/hash'
import { t } from "@/composables/useT9n";

// Restore backup text from the storage.
const { data: text } = use(async () => {
  const backupTextMap = mapFrom(o.assignments.backupText.value)
  const hash = await sha256(location.href)

  const text = backupTextMap.get(hash)
  if (typeof text === 'undefined') {
    return null
  }
  else {
    return text
  }
})
</script>

<template lang="pug">
v-expansion-panel(v-if="text !== null" :title="t.report.backupText" :text="text")
</template>
