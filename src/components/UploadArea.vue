<script lang="ts" setup>
const emit = defineEmits<{
  upload: [files: FileList]
}>()

const handleChange = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    if (event.target.files === null) {
      return
    }

    emit('upload', event.target.files)
  }
}

const handleDragover = (event: DragEvent) => {
  if (event.dataTransfer === null) {
    return
  }

  const types = event.dataTransfer.types.join()
  if (/file/i.test(types)) {
    event.dataTransfer.dropEffect = 'copy'
  }
  else {
    event.dataTransfer.dropEffect = 'none'
  }
}

const handleDrop = (event: DragEvent) => {
  if (event.dataTransfer === null) {
    return
  }

  if (event.dataTransfer.files.length === 0) {
    return
  }

  emit('upload', event.dataTransfer.files)
}
</script>

<template>
  <label
    @dragover.prevent="handleDragover"
    @drop.prevent="handleDrop"
  >
    <input
      class="hidden"
      type="file"
      multiple
      @change="handleChange"
    >
    <slot />
  </label>
</template>

<style scoped>
label {
  display: block;
}

/* input {
  display: none;
} */
</style>
