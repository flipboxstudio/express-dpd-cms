<!-- type of form : view/id, edit/id, create -->
<template>
  <div>
    <v-form>
      <v-text-field label="Name" v-model="user.username" required :readonly="readonly"></v-text-field>
      <v-select label="Role" :async-loading="loadingRole" :items="roles" v-model="user.roles" item-text="name" item-value="name" return-object :readonly="readonly" v-if="!readonly"></v-select>
      <v-text-field label="Role" v-model="user.roles" readonly v-else></v-text-field>
      
      <v-text-field label="Password" :append-icon="pwdHidden ? 'visibility' : 'visibility_off'" 
                  :append-icon-cb="() => (pwdHidden = !pwdHidden)" :type="pwdHidden ? 'password' : 'text'" v-model="user.password" 
                  :rules="requiredField" required v-if="!readonly"></v-text-field>

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
      let vm = this
      vm.loadingRole = true
      /* eslint-disable */
      dpd.userroles.get(function(res, err) {
        vm.loadingRole = false
        console.log(res, err)
        if(res) {
          vm.roles = res
        } else {
          alert(err.message || JSON.stringify(err.errors))
        }
      })
      /* eslint-enable */
    },
    fetchData (id) {
      let vm = this
      vm.loading = true
      /* eslint-disable */
      dpd.users.get(id, function(res, err) {
        vm.loading = false
        if(res) {
          vm.user = res
        } else {
          alert(err.message || JSON.stringify(err.errors))
        }
      })
      /* eslint-enable */
    },
    submitData () {
      let vm = this
      vm.loading = true
      vm.user.roles = [vm.user.roles.name]
      /* eslint-disable */
      dpd.users.post(vm.user, function(res, err) {
        vm.loading = false
        if(res) {
          vm.backToList()
        } else {
          alert(err.message || JSON.stringify(err.errors))
        }
      })
      /* eslint-enable */
    },
    deleteData (id = this.$route.query.view) {
      let vm = this
      vm.loading = true
      /* eslint-disable */
        dpd.users.del(id, function (res, err) {
          vm.loading =false
            if(res) {
                vm.backToList()
            } else {
                alert(err.message || JSON.stringify(err.errors))
            }
        })
        /* eslint-enable */
    }
  }
}
</script>
