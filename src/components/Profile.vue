<template>
  <v-container>
    <v-layout align-center justify-space-around row fill-height>
      <v-flex xs8>
        <v-card>
          <v-card-text>
            <v-text-field
              prepend-icon="account_circle"
              name="nume"
              label="Name"
              id="nume"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-text-field
              prepend-icon="account_circle"
              name="prenume"
              label="Surname"
              id="prenume"
            ></v-text-field>    
            <v-spacer></v-spacer>
            <v-text-field
              prepend-icon="account_circle"
              name="phone"
              label="Phone no."
              id="phone"
            ></v-text-field>   
            <v-text-field
              prepend-icon="account_circle"
              name="email"
              label="Email adress"
              id="email"
            ></v-text-field>  
            <v-btn to="/" flat>
              <v-icon left>keyboard_arrow_left</v-icon>
              Back
            </v-btn>    
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  name: 'Profile',
  data () {
    return {
      //
    }
  }
}
</script>
