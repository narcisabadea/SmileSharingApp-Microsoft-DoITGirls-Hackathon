<template>
  <v-container>
    <v-layout>
      <v-flex xs12>
        <v-flex xs4 sm4>
          <v-autocomplete
            :items="localityLeaveFilter"
            label="Locality leaving"
            v-model="selectedLocalityLeave">
          </v-autocomplete>
        </v-flex>
        <v-flex xs4 sm4>
          <v-autocomplete
            :items="localityGoingFilter"
            label="Locality going"
            v-model="selectedlocalityGoing">
          </v-autocomplete>
        </v-flex>
        <v-flex xs4 sm4>
          <v-autocomplete
            :items="carTypeFilter"
            label="Select car"
            v-model="selectedcarType">
          </v-autocomplete>
        </v-flex>
        <v-card-text>
          <v-list three-line id="culoare">
            <v-list-tile v-for="(item, index) in filteredItems" :key="index">
              <v-list-tile-content>
                <v-list-tile-title> <span style="opacity: 0.3;color:grey">From </span> {{item.localityLeave}} <span style="opacity: 0.3;color:grey">({{item.hourLeave}}:{{item.minLeave}}) to </span>{{item.localityGoing}}</v-list-tile-title>
                <v-list-tile-sub-title class="text-truncate">Price: {{item.price}}RON</v-list-tile-sub-title>
                <v-btn depressed small @click="seeDetails(item.id, index)">See details</v-btn>
                <v-divider></v-divider>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog" max-width="30%" class="dialog">
      <v-card class="elevation-12" transparent>
        <v-toolbar dark style="background: #19535f">
          <v-toolbar-title>Ride details</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="text-xs-center">
          <v-list dense>
            <v-list-tile>
              <v-list-tile-content>Car type: {{ selectedItem.car }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Date leave: {{ selectedItem.dateLeave }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Drop point: {{ selectedItem.dropPoint }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Leave at: {{ selectedItem.hourLeave}}:{{selectedItem.minLeave }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Locality going: {{ selectedItem.localityGoing }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Locality leave: {{ selectedItem.localityLeave }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Meeting point: {{ selectedItem.meetingPoint }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Number of available seats: {{ selectedItem.noSeats }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Phone number: {{ selectedItem.phone }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Price: {{ selectedItem.price }}RON</v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-btn color="primary">I'm interested</v-btn>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from '@/firebase'
export default {
  name: 'CarSearch',
  data () {
    return {
      items: [],
      localityGoing: [],
      selectedLocalityLeave: 'All locations',
      selectedlocalityGoing: 'All locations',
      selectedcarType: 'All types',
      dialog: false,
      selectedItem: {}
    }
  },
  computed: {
    filteredItems() {
      return this.items.filter(item => {
        return this.selectedLocalityLeave === 'All locations' ? true : item.localityLeave === this.selectedLocalityLeave
      }).filter(item => {
        return this.selectedlocalityGoing === 'All locations' ? true : item.localityGoing === this.selectedlocalityGoing
      }).filter(item => {
        return this.selectedcarType === 'All types' ? true : item.car === this.selectedcarType
      })
    },
    localityLeaveFilter() {
      let localityLeaveFilterData = ['All locations']
      this.items.forEach(item => {
        localityLeaveFilterData.push(item.localityLeave)
      })
      return localityLeaveFilterData
    },
    localityGoingFilter() {
      let localityGoingFilterData = ['All locations']
      this.items.forEach(item => {
        localityGoingFilterData.push(item.localityGoing)
      })
      return localityGoingFilterData
    },
    carTypeFilter() {
      let carTypeData = ['All types']
      this.items.forEach(item => {
        carTypeData.push(item.car)
      })
      return carTypeData
    }
  },
  methods: {
    getData() {
      let items = []
      firebase.firestore().collection('Requests')
        .onSnapshot(snapshot => {
          snapshot.forEach(obj => {
            items.push({
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
              price: obj.data().price,
              participants: obj.data().participants
            })
          })
        })
      return items
    },
    seeDetails(id, index) {
      this.dialog = true
      this.selectedItem = this.items[index]
    }
  },
  created () {
    this.items = this.getData()
  }
}
</script>

<style>
  #culoare {
    background-color: transparent
  }
  .v-dialog {
    background-color: white;
  }
</style>