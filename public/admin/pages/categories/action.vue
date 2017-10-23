<!-- type of form : view/id, edit/id, create -->
<template>
  <div>
    <v-form>
      <v-text-field label="Name" v-model="category.name" required :readonly="readonly"></v-text-field>

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
      let vm = this
      vm.loading = true
      /* eslint-disable */
      dpd.categories.get(id, function(res, err) {
        vm.loading = false
        if(res) {
          vm.category = res
        } else {
          alert(err.message || JSON.stringify(err.errors))
        }
      })
      /* eslint-enable */
    },
    submitData () {
      let vm = this
      vm.loading = true
      /* eslint-disable */
      dpd.categories.post(vm.category, function(res, err) {
        vm.loading = false
        if(res) {
          vm.backToList()
        } else {
          // enabling below line result in double execution (??)
          // let error = err.message || res.message || 'Unknown Error'
          alert(err.message || JSON.stringify(err.errors))
        }
      })
      /* eslint-enable */
    },
    deleteData (id = this.$route.query.view) {
      let vm = this
      vm.loading = true
      /* eslint-disable */
        dpd.categories.del(id, function (res, err) {
          vm.loading =false
            if(res) {
                vm.backToList()
            } else {
                alert(err.message || JSON.stringify(err.errors))
            }
        })
        /* eslint-enable */
    }
  }
}
</script>
