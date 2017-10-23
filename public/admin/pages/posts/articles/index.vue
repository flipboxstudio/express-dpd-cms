<template>
    <div>
        <h3>Articles Management</h3>
        <v-btn class="indigo--text" outline @click="$router.push('/posts/articles/action/')">Create Articles</v-btn>
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
                <td>{{props.item.slug}}</td>
                <td style="min-width: 150px">{{props.item.content.date}}</td>
                <td style="max-width: 550px; overflow-wrap: break-word;"><div v-html="props.item.content.content"></div></td>
                <td>{{props.item.meta.visit}}</td>
                <td>{{props.item.updatedAt}}</td>
                <td style="min-width: 170px" class="text-xs-right">
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
          text: 'Article Title',
          align: 'left',
          sortable: false,
          value: 'title'
        },
        {
          text: 'Slug',
          align: 'left',
          sortable: false,
          value: 'slug'
        },
        { text: 'Date',
          align: 'left',
          sortable: false,
          value: 'date'
        },
        { text: 'Content',
          align: 'left',
          sortable: false,
          value: 'content'
        },
        { text: 'View Count',
          align: 'left',
          sortable: false,
          value: 'viewCount'
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
      query.sortBy('updatedAt', 'desc').filterBy('type', 'article')
      /* eslint-disable */
      dpd.posts.get(query.get(), function (res, err) {
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
      let query = new DpdQuery().filterBy('type', 'article').count()
      /* eslint-disable */
      dpd.posts.get(query.get(), function (res, err) {
        if(res) {
            vm.totalItems = res.count
        } else {
            alert(err.message || JSON.stringify(err.errors))
        }
      })
      /* eslint-enable */
    },
    deleteItem (id) {
      var vm = this
      vm.loading = true
      /* eslint-disable */
      dpd.posts.del(id, function (res, err) {
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
