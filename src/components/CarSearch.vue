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
            label="Locality leaving"
            v-model="selectedlocalityGoing">
          </v-autocomplete>
        </v-flex>
        <v-card-text>
          <v-list three-line id="culoare">
            <v-list-tile v-for="(item, index) in filteredItems" :key="index">
              <v-list-tile-content  >
                <v-list-tile-title> <span style="opacity: 0.3;color:grey">From </span> {{item.localityLeave}} <span style="opacity: 0.3;color:grey">({{item.hourLeave}}:{{item.minLeave}}) to </span>{{item.localityGoing}}</v-list-tile-title>
                <v-list-tile-sub-title class="text-truncate">Price: {{item.price}}RON</v-list-tile-sub-title>
                <v-divider></v-divider>
              </v-list-tile-content>
            </v-list-tile>
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
      items: [],
      localityGoing: [],
      selectedLocalityLeave: 'All locations',
      selectedlocalityGoing: 'All locations'
    }
  },
  computed: {
    filteredItems() {
      return this.items.filter(item => {
        return this.selectedLocalityLeave === 'All locations' ? true : item.localityLeave === this.selectedLocalityLeave
      }).filter(item => {
        return this.selectedlocalityGoing === 'All locations' ? true : item.localityGoing === this.selectedlocalityGoing
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
              price: obj.data().price
            })
          })
        })
      return items
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
</style>