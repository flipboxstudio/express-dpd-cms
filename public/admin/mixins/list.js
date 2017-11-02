import DpdQuery from '~/helpers/dpd-query'

export default {
  data () {
    return {
      loading: true,
      search: '',
      totalItems: 0,
      items: [],
      pagination: {
        page: 1,
        rowsPerPage: 5
      }
    }
  },
  watch: {
    pagination: {
      handler () {
        let query = new DpdQuery().limit(this.pagination.rowsPerPage).page(this.pagination.page)
        this.fetchItems(query)
      },
      deep: true
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      this.loading = true
      this.fetchItems(new DpdQuery().limit(this.pagination.rowsPerPage).page(this.pagination.page))
      this.fetchTotalItems()
    },
    fetchItems (query = new DpdQuery().limit(this.pagination.rowsPerPage).page(this.pagination.page)) {
      console.warn('please implement fetchItems inside list')
    },
    fetchTotalItems () {
      console.warn('please implement fetchTotalItems inside list')
    },
    deleteItem (id) {
      console.warn('please implement deleteItem inside list')
    },
    detail (id) {
      this.$router.push(this.$route.path.replace(/\/+$/, '') + '/action/?view=' + id)
    },
    edit (id) {
      this.$router.push(this.$route.path.replace(/\/+$/, '') + '/action/?edit=' + id)
    },
    validResponse (res) {
      if (res && res.statusCode !== 401) {
        return true
      } else {
        return false
      }
    },
    showError (val) {
      alert(val.message || JSON.stringify(val.errors) || 'unknown error!')
    }
  }
}
