<template>
    <div>
        <h3>Pages Management</h3>
        <v-btn class="indigo--text" outline @click="$router.push('/pages/action/')">Create Pages</v-btn>
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
                <td>{{props.item.type}}</td>
                <td>{{props.item.content.subtitle}}</td>
                <td>{{props.item.updatedAt}}</td>
                <td class="text-xs-right">
                    <list-action :id="props.item.id" @edit="edit(props.item.translationId)" @remove="deleteItem(props.item)"></list-action>
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
    switchLocale (val) {
      this.lang = val
      this.initData()
    },
    fetchItems (query) {
      this.loading = true
      query.sortBy('updatedAt', 'desc').filterBy('lang', this.lang)

      this.$axios.get(`/page?${query.toString()}`)
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
      let query = new DpdQuery().filterBy('lang', this.lang).count()
      this.$axios.get(`/page?${query.toString()}`)
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
    deleteItem (item) {
      if (item.type === 'static') {
        alert('cannot delete static page ' + item.title)
      } else {
        this.loading = true
        this.$axios.delete(`/page/${item.id}`)
          .then((res) => {
            this.loading = false
            if (this.validResponse(res.data)) {
              this.initData()
            } else {
              this.showError(res.data)
            }
          }).catch((err) => {
            this.loading = false
            this.showError(err.response.data)
          })
      }
    }
  }
}
</script>
