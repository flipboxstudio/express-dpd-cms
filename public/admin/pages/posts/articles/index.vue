<template>
    <div>
        <h3>Articles Management</h3>
        <v-btn class="indigo--text" outline @click="$router.push('/posts/articles/action/')">Create Articles</v-btn>
        <v-flex md3 xs4 offset-md9 offset-xs8>
          <locale-dropdown @changed="switchLocale($event)"></locale-dropdown>
        </v-flex>
        <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            :pagination.sync="pagination"
            :total-items="totalItems"
            :loading="loading"
            class="elevation-1">
            <template slot="items" scope="props">
                <td><a @click="detail(props.item.translationId)" href="javascript:;">{{props.item.title}}</a></td>
                <td>{{props.item.slug}}</td>
                <td style="min-width: 150px">{{props.item.content.date}}</td>
                <td style="max-width: 550px; overflow-wrap: break-word;"><div v-html="props.item.content.content"></div></td>
                <td>{{props.item.meta.visit}}</td>
                <td>{{props.item.updatedAt}}</td>
                <td style="min-width: 170px" class="text-xs-right">
                  <list-action :id="props.item.id" @edit="edit(props.item.translationId)" @remove="deleteItem"></list-action>
                </td>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import list from '~/mixins/list'
import ListAction from '~/components/ListAction'
import LocaleDropdown from '~/components/LocaleDropdown'
import DpdQuery from '~/helpers/dpd-query'

export default {
  layout: 'admin',
  mixins: [list],
  components: {
    ListAction,
    LocaleDropdown
  },
  data () {
    return {
      lang: process.env.defaultLocale,
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
    switchLocale (val) {
      this.lang = val
      this.initData()
    },
    fetchItems (query) {
      this.loading = true
      query.sortBy('updatedAt', 'desc').filterBy('type', 'article').filterBy('lang', this.lang)
      this.$axios.get(`/post?${query.toString()}`)
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
      let query = new DpdQuery().filterBy('type', 'article').filterBy('lang', this.lang).count()
      this.$axios.get(`/post?${query.toString()}`)
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
      this.$axios.delete(`/post/${id}`)
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
