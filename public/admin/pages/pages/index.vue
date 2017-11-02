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
      this.loading = true
      query.sortBy('updatedAt', 'desc')
      /* eslint-disable */
        dpd.pages.get(query.get(),  (res, err) => {
          this.loading = false
          if(err) {
            this.showError(err)
          } else {
            if(this.validResponse(res)) {
                this.items = res
            } else {
                this.showError(res)
            }
          }
        })
      /* eslint-enable */
    },
    fetchTotalItems () {
      /* eslint-disable */
        dpd.pages.get(new DpdQuery().count().get(),  (res, err) => {
          if(err) {
            this.showError(err)
          } else {
            if(this.validResponse(res)) {
                this.totalItems = res.count
            } else {
                this.showError(res)
            }
          }
        })
      /* eslint-enable */
    },
    deleteItem (item) {
      if (item.type === 'static') {
        alert('cannot delete static page ' + item.title)
      } else {
        this.loading = true
        /* eslint-disable */
          dpd.pages.del(item.id,  (res, err) => {
            this.loading = false
            if(err) {
              this.showError(err)
            } else {
              if(this.validResponse(res)) {
                  this.initData()
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
