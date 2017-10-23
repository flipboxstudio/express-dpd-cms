<template>
    <div>
        <h3>Pages Management</h3>
        <v-btn class="indigo--text" outline @click="$router.push('/pages/action/')">Create Pages</v-btn>
        <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            :pagination.sync="pagination"
            :total-items="totalItems"
            :loading="loading"
            class="elevation-1">
            <template slot="items" scope="props">
                <td><a @click="detail(props.item.id)" href="javascript:;">{{props.item.title}}</a></td>
                <td>{{props.item.type}}</td>
                <td>{{props.item.content.subtitle}}</td>
                <td>{{props.item.updatedAt}}</td>
                <td class="text-xs-right">
                    <list-action :id="props.item.id" @edit="edit" @remove="deleteItem(props.item)"></list-action>
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
          text: 'Page Title',
          align: 'left',
          sortable: false,
          value: 'title'
        },
        {
          text: 'Page Type',
          align: 'left',
          sortable: false,
          value: 'title'
        },
        { text: 'Content',
          align: 'left',
          sortable: false,
          value: 'content'
        },
        { text: 'Updated At',
          align: 'left',
          sortable: false,
          value: 'updated'
        }
      ]
    }
  },
  methods: {
    fetchItems (query) {
      let vm = this
      vm.loading = true
      query.sortBy('updatedAt', 'desc')
      /* eslint-disable */
        dpd.pages.get(query.get(), function (res, err) {
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
      /* eslint-disable */
        dpd.pages.get(new DpdQuery().count().get(), function (res, err) {
          if(res) {
              vm.totalItems = res.count
          } else {
              alert(err.message || JSON.stringify(err.errors))
          }
        })
      /* eslint-enable */
    },
    deleteItem (item) {
      var vm = this
      if (item.type === 'static') {
        alert('cannot delete static page ' + item.title)
      } else {
        vm.loading = true
        /* eslint-disable */
          dpd.pages.del(item.id, function (res, err) {
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
}
</script>
