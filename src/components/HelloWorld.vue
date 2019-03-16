<template>
  <v-container bg fill-height grid-list-md text-xs-center>
    <v-layout row wrap align-center>

        <v-container fill-height>
          <v-layout align-center>
            <v-flex>
              <v-btn flat to="CarOffer" slot="activator">Car Offer</v-btn>
              <v-btn flat to="CarSearch" slot="activator">Search for a car</v-btn>
            </v-flex>
          </v-layout>
        </v-container>

    </v-layout>
  </v-container>
</template>

<script>

export default {
  name: 'HelloWorld',
  data () {
    return {
      //
    }
  }
}
</script>

<style>
</style>
