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
      let query = new DpdQuery().login(this.username, this.password)
      if (this.$refs.loginForm.validate()) {
        this.loading = true
        this.$axios.post(`/user/login`, query.get())
          .then((res) => {
            this.loading = false
            this.validateProfile()
          }).catch((err) => {
            this.loading = false
            alert(err.message || JSON.stringify(err.errors))
          })
      }
    },
    validateProfile () {
      this.$axios({
        method: 'get',
        url: '/user/me'
      }).then((res) => {
        let data = res.data
        if (data && data.roles) {
          data.roles.includes('admin') ? this.$router.push('dashboard') : alert('you are not an admin!')
        }
      }).catch((err) => {
        alert(err.message || JSON.stringify(err.errors))
      })
    }
  }
}
</script>
