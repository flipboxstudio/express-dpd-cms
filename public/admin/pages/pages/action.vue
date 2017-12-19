<!-- type of form : view/id, edit/id, create -->
<template>
  <div>
    <v-form ref="pageForm">
      <v-flex md3 xs4>
        <locale-dropdown @changed="switchLocale($event)"></locale-dropdown>
      </v-flex>
      <v-card class="pl-3 pr-3 pt-3 pb-3">
        <v-text-field label="Title" v-model="page.title" required :readonly="readonly" :rules="requiredField"></v-text-field>
        <v-text-field label="Slug" v-model="page.slug" required :readonly="readonly" :rules="requiredField"></v-text-field>
        <v-text-field label="Subtitle" v-model="page.content.subtitle" :readonly="readonly"></v-text-field>
        <v-text-field label="Content" v-model="page.content.content" required multi-line :readonly="readonly" :rules="requiredField"></v-text-field>
      </v-card>
      <form-action @submit="submitData" @cancel="cancel" @edit="edit(page.translationId)" @remove="deleteData" :state="state" :readonly="readonly" :loading="loading"></form-action>
    </v-form>
  </div>
</template>

<script>
import FormAction from '~/components/FormAction'
import LocaleDropdown from '~/components/LocaleDropdown'
import DpdQuery from '~/helpers/dpd-query'
import form from '~/mixins/form'

export default {
  layout: 'admin',
  mixins: [form],
  components: {
    FormAction,
    LocaleDropdown
  },
  data () {
    return {
      lang: process.env.defaultLocale,
      page: {
        title: '',
        lang: process.env.defaultLocale,
        slug: '',
        content: {
          subtitle: '',
          content: ''
        }
      }
    }
  },
  methods: {
    switchLocale (lang) {
      this.lang = lang
      this.page.lang = lang
      this.initData()
    },
    initData () {
      this.page.type = 'dynamic'
      if (this.$route.query.view || this.$route.query.edit) {
        this.fetchData(this.$route.query.view || this.$route.query.edit)
      }
      this.checkReadOnly()
    },
    fetchData (id) {
      this.loading = true
      let query = new DpdQuery().filterBy('translationId', id).filterBy('lang', this.lang)

      this.$axios.get(`/page?${query.toString()}`)
        .then((res) => {
          this.loading = false
          if (this.validResponse(res.data[0])) {
            this.page = res.data[0]
          } else {
            this.page.id = ''
            this.page.title = ''
            this.page.content.content = ''
            this.showError({message: `No translation found (${this.lang})`})
          }
        }).catch((err) => {
          this.loading = false
          this.page.id = ''
          this.page.title = ''
          this.page.content.content = ''
          this.showError(err.response.data)
        })
    },
    submitData () {
      if (this.$refs.pageForm.validate()) {
        this.loading = true
        this.$axios.post('/page', this.page)
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
    },
    deleteData (id = this.$route.query.view) {
      if (this.page.type === 'static') {
        alert('cannot delete static page ' + this.page.title)
      } else {
        this.loading = true
        this.$axios.delete(`/page/${id}`)
          .then((res) => {
            this.loading = false
            if (this.validResponse(res.data)) {
              this.backToList()
            } else {
              this.showError(res.data)
            }
          }).catch((err) => {
            this.loading = false
            this.showError(err.response.data)
          })
      }
    }
  }
}
</script>
