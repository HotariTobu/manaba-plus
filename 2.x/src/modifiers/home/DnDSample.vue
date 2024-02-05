<script setup lang="ts">
import { ref } from 'vue'
import { Container, Draggable, DropResult } from "vue3-smooth-dnd";

const items = ref([
  { id: 1, data: "Princess Mononoke" },
  { id: 2, data: "Spirited Away" },
  { id: 3, data: "My Neighbor Totoro" },
  { id: 4, data: "Howl's Moving Castle" }
])

const onDrop = (dropResult: DropResult) => {
  items.value = applyDrag(items.value, dropResult);
}

const applyDrag = (arr: typeof items.value, dragResult: DropResult) => {
  const { removedIndex, addedIndex, payload } = dragResult;

  if (removedIndex === null && addedIndex === null) return arr;
  const result = [...arr];
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }
  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }
  return result;
}
</script>

<template>
  <div>
    <span>Studio Ghibli Tier List</span>
    <Container
      orientation="vertical"
      @drop="onDrop"
    >
      <Draggable
        v-for="(item, i) in items"
        :key="item.id"
      >
        <div>
          {{ i + 1 }} -> {{ item.data }}
        </div>
      </Draggable>
    </Container>
  </div>
</template>
