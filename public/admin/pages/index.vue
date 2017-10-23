<template>
  <v-layout row justify-center>
    <v-flex xs12 sm8 md6 lg6 pt-5>
      <div class="text-xs-center">
        <img src="~/assets/logo.png" class="mb-5"/>
      </div>
      <v-card xs12 sm12 md6 lg6>
        <v-container>
          <v-layout>
            <v-flex>
              <v-form v-model="valid" ref="loginForm">
                <v-text-field label="Username" v-model="username" 
                  :rules="usernameRules" required></v-text-field>
                <v-text-field label="Password" :append-icon="pwdHidden ? 'visibility' : 'visibility_off'" 
                  :append-icon-cb="() => (pwdHidden = !pwdHidden)" :type="pwdHidden ? 'password' : 'text'" v-model="password" 
                  :rules="passwordRules" required @keyup.enter="submitLogin"></v-text-field>
                <v-btn @click="submitLogin" class="secondary" :loading="loading">Log In</v-btn>
              </v-form>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import DpdQuery from '~/helpers/dpd-query'
export default {
  data () {
    return {
      loading: false,
      username: '',
      usernameRules: [
        (v) => !!v || 'Username is required'
      ],
      pwdHidden: true,
      password: '',
      passwordRules: [
        (v) => !!v || 'Password is required'
      ],
      valid: ''
    }
  },
  mounted () {
    this.validateProfile()
  },
  methods: {
    submitLogin () {
      let vm = this
      let query = new DpdQuery().login(vm.username, vm.password)
      if (this.$refs.loginForm.validate()) {
        vm.loading = true
        /* eslint-disable */
        dpd.users.login(query.get(), function(result, error) {
          vm.loading = false
          if(result) {
            vm.validateProfile()
          } else {
            alert(error.message || JSON.stringify(error.errors))
          }
        })
        /* eslint-enable */
      }
    },
    validateProfile () {
      let vm = this
      /* eslint-disable */
        dpd.users.me(function(result, error) {
          if(result && result.roles) {
            result.roles.includes("admin") ? vm.$router.push('dashboard') : alert('you are not an admin!')
          } else {
            alert(error.message || JSON.stringify(error.errors))
          }
        })
        /* eslint-enable */
    }
  }
}
</script>
