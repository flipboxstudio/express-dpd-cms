<!-- type of form : view/id, edit/id, create -->
<template>
  <div>
    <v-form>
      <v-card class="pl-3 pr-3 pt-3 pb-3">
        <v-text-field label="Name" v-model="careerType.name" required :readonly="readonly"></v-text-field>
      </v-card>

      <form-action @submit="submitData" @cancel="cancel" @edit="edit" @remove="deleteData" :state="state" :readonly="readonly" :loading="loading"></form-action>
    </v-form>
  </div>
</template>

<script>
import FormAction from '~/components/FormAction'
import form from '~/mixins/form'

export default {
  layout: 'admin',
  mixins: [form],
  components: {
    FormAction
  },
  data () {
    return {
      careerType: {
        name: ''
      }
    }
  },
  methods: {
    initData () {
      if (this.$route.query.view || this.$route.query.edit) {
        this.fetchData(this.$route.query.view || this.$route.query.edit)
      }
      this.checkReadOnly()
    },
    fetchData (id) {
      this.loading = true
      this.$axios.get(`/post/category/${id}`)
        .then((res) => {
          this.loading = false
          if (this.validResponse(res.data)) {
            this.careerType = res.data
          } else {
            this.showError(res.data)
          }
        }).catch((err) => {
          this.loading = false
          this.showError(err.response.data)
        })
    },
    submitData () {
      this.loading = true
      this.$axios.post('/post/category', this.careerType)
        .then((res) => {
          this.loading = false
          if (this.validResponse(res)) {
            this.backToList()
          } else {
            this.showError(res)
          }
        }).catch((err) => {
          this.loading = false
          this.showError(err.response.data)
        })
    },
    deleteData (id = this.$route.query.view) {
      this.loading = true

      this.$axios.delete(`/post/category/${id}`)
        .then((res) => {
          this.loading = false
          if (this.validResponse(res)) {
            this.backToList()
          } else {
            this.showError(res)
          }
        }).catch((err) => {
          this.loading = false
          this.showError(err.response.data)
        })
    }
  }
}
</script>
