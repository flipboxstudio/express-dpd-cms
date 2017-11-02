<template>
  <v-app>
    <v-navigation-drawer
      persistent
      clipped
      v-model="drawer"
      enable-resize-watcher
      app
    >
      <v-list dense>
        <v-list-tile
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="logout">
          <v-list-tile-action>
            <v-icon>power</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
              <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <main>
      <v-content>
        <v-container fluid>
          <nuxt class="content-spacing" />
        </v-container>
      </v-content>
    </main>
    <v-footer fixed>
      <span>Flipbox &copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: true,
      items: [
        { to: '/dashboard', title: 'Dashboard', icon: 'apps' },
        { to: '/users', title: 'Users', icon: 'folder' },
        { to: '/pages', title: 'Pages', icon: 'folder' },
        { to: '/categories', title: 'Categories', icon: 'folder' },
        { to: '/posts/events', title: 'Events', icon: 'folder' },
        { to: '/posts/articles', title: 'Articles', icon: 'folder' }
      ],
      title: 'FBX Admin Panel'
    }
  },
  methods: {
    logout () {
      /* eslint-disable */
        dpd.users.logout((result, error) => {
          if(!error) {
            this.$router.push('/')
          } else {
            alert(error.message)
          }
        })
      /* eslint-enable */
    }
  }
}
</script>

<style scoped>
.content-spacing {
  margin-bottom: 40px;
  margin-top: 10px;
}
</style>
