export default {
  data () {
    return {
      readonly: false,
      state: '',
      loading: true,

      // todo make helper for validator
      requiredField: [
        (v) => !!v || 'You have to fill this field'
      ],
      requiredEmail: [
        (v) => !!v || 'You have to fill this field',
        (v) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(v) || 'E-mail must be valid' // simple email validator
      ],
      requiredUrl: [
        (v) => !!v || 'You have to fill this field',
        (v) => /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(v) || 'URL must be valid' // simple email validator
      ]
    }
  },
  watch: {
    'this.$route.path' (value) {
      this.checkReadOnly()
      this.checkState()
    }
  },
  mounted () {
    this.initData()
    this.checkState()
  },
  methods: {
    initData () {
      console.warn('using default initData')
      if (this.$route.query.view || this.$route.query.edit) {
        this.fetchData(this.$route.query.view || this.$route.query.edit)
      }
      this.checkReadOnly()
    },
    checkReadOnly () {
      this.readonly = !!(this.$route.query.view)
    },
    checkState () {
      if (this.$route.query.view) {
        this.state = 'view'
      } else if (this.$route.query.edit) {
        this.state = 'edit'
      } else {
        this.state = 'create'
        this.loading = false
      }
    },
    backToList () {
      this.cancel()
    },
    fetchData (id) {
      console.warn('please implement fetchData inside form')
    },
    submitData () {
      console.warn('please implement submitData inside form')
    },
    deleteData (id) {
      console.warn('please implement deleteData inside form')
    },
    cancel () {
      let paths = this.$route.path.split('/')
      // back to list
      this.$router.push(this.$route.path.replace(paths[paths.length - 2] + '/', ''))
    },
    edit () {
      this.$router.push(this.$route.path.replace(/\/+$/, '') + '/?edit=' + this.$route.query.view)
    }
  }
}
