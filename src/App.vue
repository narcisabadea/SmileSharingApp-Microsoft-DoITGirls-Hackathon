<template>
  <v-app>
    <v-toolbar dark color="primary">
      <v-toolbar-title class="white--text">
        <router-link to="/Home" style="cursor:pointer; color: white;">
          Smile Sharing
        </router-link>
      </v-toolbar-title>
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
    <v-content>
     <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import router from '@/router'

export default {
  name: 'App',
  data () {
    return {
      //
    }
  }
  // components: {
  //     default: HelloWorld    
  //     }
}
</script>
