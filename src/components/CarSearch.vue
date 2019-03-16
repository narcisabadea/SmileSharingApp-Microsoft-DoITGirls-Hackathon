<template>
  <v-container>
    <v-layout>
      <v-flex xs12>
        <v-card-text>
          <v-list three-line id="culoare">
            <template v-for="(item, index) in getData">
              <v-list-tile :key="index">
                <v-list-tile-content>
                  <v-list-tile-title> <span style="opacity: 0.3;color:grey">From </span> {{item.localityLeave}} <span style="opacity: 0.3;color:grey">({{item.hourLeave}}:{{item.minLeave}}) to </span>{{item.localityGoing}}</v-list-tile-title>
                  <v-list-tile-sub-title class="text-truncate">Price: {{item.price}}RON</v-list-tile-sub-title>
                  <v-divider></v-divider>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-card-text>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from '@/firebase'
export default {
  name: 'CarSearch',
  data () {
    return {
      //
    }
  },
  computed: {
    getData() {
      let data = []
      firebase.firestore().collection('Requests')
        .onSnapshot(snapshot => {
          snapshot.forEach(obj => {
            data.push({
              id: obj.id,
              car: obj.data().car,
              dateLeave: obj.data().dateLeave,
              dropPoint: obj.data().dropPoint,
              hourLeave: obj.data().hourLeave,
              localityGoing: obj.data().localityGoing,
              localityLeave: obj.data().localityLeave,
              meetingPoint: obj.data().meetingPoint,
              minLeave: obj.data().minLeave,
              noSeats: obj.data().noSeats,
              phone: obj.data().phone,
              price: obj.data().price
            })
          })
        })
      return data
    }
  }
}
</script>

<style>
  #culoare {
    background-color: transparent
  }
</style>