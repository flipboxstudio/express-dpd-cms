<template>
    <div>
        <h3>Events Management</h3>
        <v-btn class="indigo--text" outline @click="$router.push('/posts/events/action/')">Create Events</v-btn>
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
                <td style="min-width: 150px">{{props.item.content.startDate}}</td>
                <td style="min-width: 150px">{{props.item.content.endDate}}</td>
                <td style="max-width: 550px; overflow-wrap: break-word;"><div v-html="props.item.content.content"></div></td>
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
          text: 'Event Title',
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
        { text: 'Start Date',
          align: 'left',
          sortable: false,
          value: 'startDate'
        },
        { text: 'End Date',
          align: 'left',
          sortable: false,
          value: 'endDate'
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
      query.sortBy('updatedAt', 'desc').filterBy('type', 'event')
      /* eslint-disable */
      dpd.posts.get(query.get(), (res, err) => {
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
      let query = new DpdQuery().filterBy('type', 'event').count()
      /* eslint-disable */
      dpd.posts.get(query.get(),  (res, err) => {
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
    deleteItem (id) {
      this.loading = true
      /* eslint-disable */
      dpd.posts.del(id,  (res, err) => {
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
</script>
