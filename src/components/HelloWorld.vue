<template>
  <v-container>
    <!-- <router-link to="/CarOffer" style="cursor:pointer; color: white;"> -->
    <v-btn
      flat
      to="CarOffer"
      slot="activator">
     Car Offer
    </v-btn>
    <!-- </router-link>
     <router-link to="/Home" style="cursor:pointer; color: white;"> -->
    <v-btn
      flat
      to="CarSearch"
      slot="activator">
     Search for a car
    </v-btn>
     <!-- </router-link> -->
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
