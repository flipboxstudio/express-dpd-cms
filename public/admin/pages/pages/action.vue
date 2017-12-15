<!-- type of form : view/id, edit/id, create -->
<template>
  <div>
    <v-form ref="pageForm">
      <v-card class="pl-3 pr-3 pt-3 pb-3">
        <v-text-field label="Title" v-model="page.title" required :readonly="readonly" :rules="requiredField"></v-text-field>
        <v-text-field label="Slug" v-model="page.slug" required :readonly="readonly" :rules="requiredField"></v-text-field>
        <v-text-field label="Subtitle" v-model="page.content.subtitle" :readonly="readonly"></v-text-field>
      </v-card>

      <text-editor :content="page.content.content" @update="page.content.content = $event" :readonly="readonly" :rules="requiredField"/>

      <form-action @submit="submitData" @cancel="cancel" @edit="edit" @remove="deleteData" :state="state" :readonly="readonly" :loading="loading"></form-action>
    </v-form>
  </div>
</template>

<script>
import FormAction from '~/components/FormAction'
import TextEditor from '~/components/TextEditor'
import form from '~/mixins/form'

export default {
  layout: 'admin',
  mixins: [form],
  components: {
    FormAction,
    TextEditor
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
      this.loading = true
      /* eslint-disable */
      dpd.page.get(id, (res, err) => {
        this.loading = false
        if(err) {
          this.showError(err)
        } else {
          if(this.validResponse(res)) {
            this.page = res
          } else {
            this.showError(res)
          }
        }
      })
      /* eslint-enable */
    },
    submitData () {
      if (this.$refs.pageForm.validate()) {
        this.loading = true
        /* eslint-disable */
        dpd.page.post(this.page, (res, err) => {
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
      }
    },
    deleteData (id = this.$route.query.view) {
      if (this.page.type === 'static') {
        alert('cannot delete static page ' + this.page.title)
      } else {
        this.loading = true
        /* eslint-disable */
          dpd.page.del(id,  (res, err) => {
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
      }
    }
  }
}
</script>
