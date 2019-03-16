<template>
  <v-container>
    <v-layout align-center justify-space-around row fill-height>
      <v-flex xs8>
        <v-card>
          <v-card-text>
            <v-text-field
              prepend-icon="account_circle"
              name="nume"
              label="Nume"
              id="nume"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-text-field
              prepend-icon="account_circle"
              name="prenume"
              label="Prenume"
              id="prenume"
            ></v-text-field>            
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
