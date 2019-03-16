<template>
  <v-app>
    <v-toolbar dark color="primary">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Smile Sharing</v-toolbar-title>
      <v-spacer></v-spacer>
       <v-menu offset-y>
        <v-btn
          flat
          slot="activator">
          <v-icon left>account_circle</v-icon>Cont
        </v-btn>
        <v-list>
          <v-list-tile>
            <router-link to="/Profile" tag="li" style="cursor:pointer">
              <v-list-tile-title>Detalii cont</v-list-tile-title>
            </router-link>
          </v-list-tile>
          <v-list-tile>
              <v-list-tile-title style="cursor:pointer">Iesire cont</v-list-tile-title>
          </v-list-tile>
          <v-divider></v-divider>
        </v-list>
      </v-menu>
    </v-toolbar>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data () {
    return {
      //
    }
  }
}
</script>
