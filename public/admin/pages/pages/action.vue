<!-- type of form : view/id, edit/id, create -->
<template>
  <div>
    <v-form ref="pageForm">
      <v-text-field label="Title" v-model="page.title" required :readonly="readonly" :rules="requiredField"></v-text-field>
      <v-text-field label="Slug" v-model="page.slug" required :readonly="readonly" :rules="requiredField"></v-text-field>
      <v-text-field label="Subtitle" v-model="page.content.subtitle" :readonly="readonly"></v-text-field>
      <v-text-field label="Content" v-model="page.content.content" required multi-line :readonly="readonly" :rules="requiredField"></v-text-field>

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
      page: {
        title: '',
        slug: '',
        content: {
          subtitle: '',
          content: ''
        }
      }
    }
  },
  methods: {
    initData () {
      this.page.lang = 'en'
      this.page.type = 'dynamic'
      if (this.$route.query.view || this.$route.query.edit) {
        this.fetchData(this.$route.query.view || this.$route.query.edit)
      }
      this.checkReadOnly()
    },
    fetchData (id) {
      let vm = this
      vm.loading = true
      /* eslint-disable */
      dpd.pages.get(id, function(res, err) {
        vm.loading = false
        if(res) {
          vm.page = res
        } else {
          alert(err.message || JSON.stringify(err.errors))
        }
      })
      /* eslint-enable */
    },
    submitData () {
      let vm = this
      if (this.$refs.pageForm.validate()) {
        vm.loading = true
        /* eslint-disable */
        dpd.pages.post(vm.page, function(res, err) {
          vm.loading = false
          if(res) {
            vm.backToList()
          } else {
            // enabling below line result in double execution (??)
            // var error = err.message || res.message || 'Unknown Error'
            alert(err.message || JSON.stringify(err.errors))
          }
        })
        /* eslint-enable */
      }
    },
    deleteData (id = this.$route.query.view) {
      let vm = this
      if (this.page.type === 'static') {
        alert('cannot delete static page ' + this.page.title)
      } else {
        vm.loading = true
        /* eslint-disable */
          dpd.pages.del(id, function (res, err) {
            vm.loading = false
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
}
</script>
