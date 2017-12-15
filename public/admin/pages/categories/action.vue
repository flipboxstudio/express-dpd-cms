<!-- type of form : view/id, edit/id, create -->
<template>
  <div>
    <v-form>
      <v-card class="pl-3 pr-3 pt-3 pb-3">
        <v-text-field label="Name" v-model="category.name" required :readonly="readonly"></v-text-field>
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
      category: {
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
      /* eslint-disable */
      dpd.category.get(id, (res, err) => {
        this.loading = false
        if(err) {
          this.showError(err)
        } else {
          if(this.validResponse(res)) {
            this.category = res
          } else {
            this.showError(res)
          }
        }
      })
      /* eslint-enable */
    },
    submitData () {
      this.loading = true
      /* eslint-disable */
      dpd.category.post(this.category, (res, err) => {
        this.loading = false
        if(err) {
          this.showError(err)
        } else {
          if(this.validResponse(res)) {
            this.backToList()
          } else {
            this.showError(res)
          }
        }
      })
      /* eslint-enable */
    },
    deleteData (id = this.$route.query.view) {
      this.loading = true
      /* eslint-disable */
        dpd.category.del(id,  (res, err) => {
          this.loading =false
            if(err) {
              this.showError(err)
            } else {
              if(this.validResponse(res)) {
                  this.backToList()
              } else {
                  this.showError(res)
              }
            }
        })
        /* eslint-enable */
    }
  }
}
</script>
