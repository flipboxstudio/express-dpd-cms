<template>
    <v-select
        v-bind:items="supportedLocales"
        v-model="selectedLocale"
        label="Select Language"
        item-value="id"
        item-text="name"
        single-line
    ></v-select>
</template>

<script>
export default {
  data () {
    return {
      supportedLocales: [
        {name: 'Indonesia', id: 'id'},
        {name: 'English', id: 'en'}
      ],
      selectedLocale: {}
    }
  },
  mounted () {
    this.selectedLocale = this.supportedLocales.find((e) => e.id === process.env.defaultLocale)
  },
  watch: {
    selectedLocale (val) {
      this.$emit('changed', val.id !== undefined ? val.id : val)
    }
  }

}
</script>

