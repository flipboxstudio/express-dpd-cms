<template>
    <div>
        <h3>Post Categories Management</h3>
        <v-btn class="indigo--text" outline @click="$router.push('/categories/action/')">Create Category</v-btn>
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
      let vm = this
      vm.loading = true
      query.sortBy('id', 'desc')
      /* eslint-disable */
        dpd.categories.get(query.get(), function (res, err) {
          vm.loading = false
          if(res) {
              vm.items = res
          } else {
              alert(err.message || JSON.stringify(err.errors))
          }
        })
      /* eslint-enable */
    },
    fetchTotalItems () {
      let vm = this
      let query = new DpdQuery().count()
      /* eslint-disable */
        dpd.categories.get(query.get(), function (res, err) {
          if(res) {
              vm.totalItems = res.count
          } else {
              alert(err.message || JSON.stringify(err.errors))
          }
        })
      /* eslint-enable */
    },
    deleteItem (id) {
      let vm = this
      vm.loading = true
      /* eslint-disable */
        dpd.categories.del(id, function (res, err) {
          vm.loading = false
          if(res) {
              vm.initData()
          } else {
              alert(err.message || JSON.stringify(err.errors))
          }
        })
        /* eslint-enable */
    }
  }
}
</script>
