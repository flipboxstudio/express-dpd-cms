<!-- type of form : view/id, edit/id, create -->
<template>
  <div>
    <v-form>
      <v-card class="pl-3 pr-3 pt-3 pb-3">
        <v-text-field label="Name" v-model="user.username" required :readonly="readonly"></v-text-field>
        <v-select label="Role" :async-loading="loadingRole" :items="roles" v-model="user.roles" item-text="name" item-value="name" return-object :readonly="readonly" v-if="!readonly"></v-select>
        <v-text-field label="Role" v-model="user.roles" readonly v-else></v-text-field>
        
        <v-text-field label="Password" :append-icon="pwdHidden ? 'visibility' : 'visibility_off'" 
                    :append-icon-cb="() => (pwdHidden = !pwdHidden)" :type="pwdHidden ? 'password' : 'text'" v-model="user.password" 
                    :rules="requiredField" required v-if="!readonly"></v-text-field>
      </v-card>

      <form-action @submit="submitData" @cancel="cancel" @edit="edit" @remove="deleteData" :state="state" :readonly="readonly" :loading="loading"></form-action>
    </v-form>
  </div>
</template>

<script>
import FormAction from '~/components/FormAction'
import form from '~/mixins/form'

export default {
  layout: 'admin',
  mixins: [form],
  components: {
    FormAction
  },
  data () {
    return {
      user: {
        username: '',
        password: '',
        roles: []
      },
      loadingRole: true,
      roles: [],
      pwdHidden: true
    }
  },
  methods: {
    initData () {
      this.fetchUserRoles()
      if (this.$route.query.view || this.$route.query.edit) {
        this.fetchData(this.$route.query.view || this.$route.query.edit)
      }
      this.checkReadOnly()
    },
    fetchUserRoles () {
      this.loadingRole = true
      this.$axios.get(`/user/role`)
        .then((res) => {
          this.loadingRole = false
          if (this.validResponse(res.data)) {
            this.roles = res.data
          } else {
            this.showError(res.data)
          }
        }).catch((err) => {
          this.loadingRole = false
          this.showError(err.response.data)
        })
    },
    fetchData (id) {
      this.loading = true
      this.$axios.get(`/user/${id}`)
        .then((res) => {
          this.loading = false
          if (this.validResponse(res.data)) {
            this.user = res.data
          } else {
            this.showError(res.data)
          }
        }).catch((err) => {
          this.loading = false
          this.showError(err.response.data)
        })
    },
    submitData () {
      this.loading = true
      this.user.roles = [this.user.roles.name]
      this.$axios.post('/user', this.user)
        .then((res) => {
          this.loading = false
          if (this.validResponse(res)) {
            this.backToList()
          } else {
            this.showError(res)
          }
        }).catch((err) => {
          this.loading = false
          this.showError(err.response.data)
        })
    },
    deleteData (id = this.$route.query.view) {
      this.loading = true
      this.$axios.delete(`/user/${id}`)
        .then((res) => {
          this.loading = false
          if (this.validResponse(res)) {
            this.backToList()
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
