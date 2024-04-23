<script setup lang="ts" generic="T extends Record<string, unknown>">
const props = defineProps<{
  name: string
  data: Array<T>
  searchKey: keyof T
  valueKey: keyof T
  max?: number
}>()
const model = defineModel<Array<string>>()

const search = ref('')
const selected = ref<Array<string>>(model.value ?? [])
const selectedItems = computed(() => {
  return selected.value.map(
    (value) =>
      props.data.find((item) => item[props.valueKey] === value) ??
      ({
        [props.valueKey]: value,
        [props.searchKey]: value,
      } as T)
  )
})
const filteredOptions = computed(() => {
  if (!search.value) return []
  const regex = new RegExp(search.value, 'i')
  return props.data
    .filter(
      (option) =>
        regex.test((option[props.searchKey] as string).toLowerCase()) &&
        !selected.value.includes(option[props.valueKey] as string)
    )
    .filter((_, i) => i < 10)
})
const haveReachedMax = computed(() => {
  return !!props.max && selected.value.length >= props.max
})

function handleItemSelect(item: T) {
  selected.value = [...selected.value, item[props.valueKey] as string]
}
function handleRemoveItem(item: T) {
  selected.value = selected.value.filter(
    (selectedItem) => selectedItem !== item[props.valueKey]
  )
}
function getItemLabel(item: T) {
  return item[props.searchKey] as string
}
watch(selected, (newValue) => {
  model.value = newValue
})
</script>

<template>
  <div>
    <ul>
      <li
        v-for="(item, i) in selectedItems"
        :key="`${name}-selected-${i}`"
        @click="handleRemoveItem(item)"
      >
        {{ getItemLabel(item) }}
      </li>
    </ul>
    <label for="search">Search {{ name }}:</label>
    <input
      id="search"
      v-model="search"
      placeholder="Search..."
      type="text"
      :disabled="haveReachedMax"
    />
    <ul v-if="filteredOptions.length && !haveReachedMax">
      <li
        v-for="(option, i) in filteredOptions"
        :key="`${name}-option-${i}`"
        @click="handleItemSelect(option)"
      >
        {{ getItemLabel(option) }}
      </li>
    </ul>
  </div>
</template>
