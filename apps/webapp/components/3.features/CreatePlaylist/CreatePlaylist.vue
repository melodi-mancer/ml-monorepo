<script setup lang="ts">
const playlistStore = usePlaylistStore()
const playlistName = ref('')
const runTime = ref(0)
const algorithm = ref<AlgorithmsAvailable>('default')
const availableAlgorithms = PlaylistFiltersKeys

async function handleGeneratePlaylistClick() {
  const playlistId = await playlistStore.createPlaylist({
    name: playlistName.value,
    runTime: runTime.value,
    algorithm: algorithm.value,
  })
  console.log('playlistId: ', playlistId)
  navigateTo(`/app/playlist/${playlistId}`)
}
</script>

<template>
  <div>
    <h2>Generate Playlist</h2>
    <div>
      <label for="playlistName">Playlist Name:</label>
      <input type="text" id="playlistName" v-model="playlistName" />
    </div>
    <div>
      <label for="algorithm">Select an algorithm:</label>
      <select id="algorithm" v-model="algorithm">
        <option
          v-for="algorithm in availableAlgorithms"
          :key="algorithm"
          :value="algorithm"
        >
          {{ algorithm }}
        </option>
      </select>
    </div>
    <div>
      <label for="runTime">Run Time:</label>
      <input type="number" min="0" v-model="runTime" />
    </div>
    <ElButton title="Generate Playlist" @click="handleGeneratePlaylistClick" />
  </div>
</template>
