<template>
  <v-app>
    <v-toolbar dark color="primary">
      <v-toolbar-title class="white--text">
        <router-link to="/Home" style="cursor:pointer; color: white;">
          Smile Sharing
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="dialogLogIn = !dialogLogIn" flat>
        Login
      </v-btn>
      <v-menu offset-y v-if="userDetails">
        <v-btn
          flat
          slot="activator">
          <v-icon left>account_circle</v-icon>Account
        </v-btn>
        <v-list>
          <v-list-tile>
            <router-link to="/Profile" tag="li" style="cursor:pointer">
              <v-list-tile-title>Account details</v-list-tile-title>
            </router-link>
          </v-list-tile>
          <v-list-tile>
              <v-list-tile-title style="cursor:pointer" @click="logout()">Log out</v-list-tile-title>
          </v-list-tile>
          <v-divider></v-divider>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content>
     <router-view></router-view>
    </v-content>
    <v-dialog v-model="dialogLogIn" max-width="80%" class="dialog">
      <v-container fluid grid-list-xl>
        <v-layout align-center justify-space-around row>
          <v-flex xs12 md3>
            <v-card class="elevation-0 transparent">
              <v-card-text class="text-xs-center">
                <v-icon x-large color="indigo darken-1">account_circle</v-icon>
              </v-card-text>
              <v-card-text>
                <v-text-field
                  v-model="email"
                  label="Adresa de email">
                </v-text-field>
                <v-text-field
                  v-model="password"
                  label="Parola"
                  :append-icon="show ? 'visibility_off' : 'visibility'"
                  :type="show ? 'text' : 'password'"
                  @click:append="show = !show">
                </v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn flat color="indigo darken-1" type="submit"> Am uitat parola
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn type="submit" color="indigo darken-1 white--text" @click="login()"> Intra in cont
                </v-btn>
              </v-card-actions>
            </v-card>
            <!-- <v-alert
              :value="true"
              type="error"
              v-if="error !== null"
            >
              {{error}}
            </v-alert> -->
          </v-flex>
        </v-layout>
      </v-container>
    </v-dialog>
  </v-app>
</template>

<script>
import firebase from '@/firebase'
export default {
  name: 'App',
  data () {
    return {
      dialogLogIn: false,
      email: '',
      password: '',
      menu: false,
      show: false,
    }
  },
  computed: {
    userDetails () {
      return this.$store.getters.userDetails
    }
  },
  methods: {
    login () {
      this.$store.dispatch('login', {username: this.email, password: this.password})
    },
    logout(){
      this.$store.dispatch('logout')
    }
  },
  created() {
    this.$store.dispatch('getUserDetails')
  }
}
</script>
