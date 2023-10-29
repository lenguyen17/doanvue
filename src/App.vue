<template>
  <div>
    <NarBar/>
     <router-view></router-view>
  </div>
</template>

<script>
import NarBar from './components/NarBar.vue'

export default {
  name: 'App',
  components: {
    NarBar
  }
}
</script>
