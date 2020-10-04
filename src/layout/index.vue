<template>
    <transition :name="transitionName" mode="out-in">
        <router-view :key="key" />
    </transition>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      transitionName: 'fade-transform'
    }
  },
  computed: {
    key() {
      return this.$route.path
    },
    name() {
      return this.$route.name
    }
  },
  watch: {
    '$route': {
      handler: function(to, from) {
        console.log(to)
        console.log(from)
        const toDepth = to && to.path.split('/').length
        const fromDepth = from && from.path.split('/').length
        this.transitionName = toDepth < fromDepth ? 'fade-transform' : 'pop-transform'
      },
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
</style>
