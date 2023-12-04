<template>
  <div>
    <iframe class="book" :src="pdfUrl" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  name: 'preview',
  data() {
    return {
      pdfUrl: '',
    }
  },

  mounted() {
    this.pdfUrl = localStorage.getItem('pdfUrl')
  },

  methods: {
    getParams() {},
  },
}
</script>

<style lang="scss" scoped>
.book {
  width: 100vw;
  height: 99vh;
  overflow: hidden;
}
</style>
