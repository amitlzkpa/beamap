<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <router-link to="/" class="navbar-brand">BeaMap</router-link>

      <div class="mr-auto">
      </div>

      <div @click="toggleSidebarClicked">
        <span class="navbar-toggler-icon"></span>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  props: ["sidebarClick"],
  methods: {
    toggleSidebarClicked: function() {
      this.$emit("sidebarClick");
    }
  }
}
</script>

<style scoped>

</style>