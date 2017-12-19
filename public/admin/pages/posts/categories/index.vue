<template>
    <div>
        <h3>Post Categories Management</h3>
        <v-btn class="indigo--text" outline @click="$router.push('/posts/categories/action/')">Create Post Category</v-btn>
        <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            :pagination.sync="pagination"
            :total-items="totalItems"
            :loading="loading"
            class="elevation-1">
            <template slot="items" scope="props">
                <td><a @click="detail(props.item.id)" href="javascript:;">{{props.item.id}}</a></td>
                <td>{{props.item.name}}</td>
                <td class="text-xs-right">
                  <list-action :id="props.item.id" @edit="edit" @remove="deleteItem"></list-action>
                </td>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import list from '~/mixins/list'
import ListAction from '~/components/ListAction'
import DpdQuery from '~/helpers/dpd-query'

export default {
  layout: 'admin',
  mixins: [list],
  components: {
    ListAction
  },
  data () {
    return {
      headers: [
        {
          text: 'Category ID',
          align: 'left',
          sortable: false,
          value: 'id'
        },
        {
          text: 'Category Name',
          align: 'left',
          sortable: false,
          value: 'name'
        }
      ]
    }
  },
  methods: {
    fetchItems (query) {
      this.loading = true
      query.sortBy('id', 'desc')
      this.$axios.get(`/post/category?${query.toString()}`)
        .then((res) => {
          this.loading = false
          if (this.validResponse(res.data)) {
            this.items = res.data
          } else {
            this.showError(res.data)
          }
        }).catch((err) => {
          this.loading = false
          this.showError(err.response.data)
        })
    },
    fetchTotalItems () {
      let query = new DpdQuery().count()
      this.$axios.get(`/post/category?${query.toString()}`)
        .then((res) => {
          if (this.validResponse(res)) {
            this.totalItems = res.count
          } else {
            this.showError(res)
          }
        }).catch((err) => {
          this.showError(err.response.data)
        })
    },
    deleteItem (id) {
      this.loading = true
      this.$axios.delete(`/post/category/${id}`)
        .then((res) => {
          this.loading = false
          if (this.validResponse(res)) {
            this.initData()
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
