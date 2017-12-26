<template>
    <div>
        <h3>Users Management</h3>
        <v-btn class="indigo--text" outline @click="$router.push('/users/action/')">Create User</v-btn>
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
                <td>{{props.item.username}}</td>
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
          text: 'User ID',
          align: 'left',
          sortable: false,
          value: 'id'
        },
        {
          text: 'Username',
          align: 'left',
          sortable: false,
          value: 'name'
        }
      ]
    }
  },
  methods: {
    fetchItems (query = new DpdQuery()) {
      this.loading = true
      query.sortBy('id', 'desc')
      this.$axios.get(`/user?${query.toString()}`)
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
      this.$axios.get(`/user`)
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
      this.$axios.delete(`/user/${id}`)
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
