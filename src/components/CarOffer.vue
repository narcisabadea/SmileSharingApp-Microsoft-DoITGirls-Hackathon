<template>
  <v-container>
    <v-layout align-center justify-space-between row wrap>
      <v-container>
        <h2>Find yourself a ride</h2>
        Departure date
        <v-flex xs12 sm6 md4>
          <v-menu
            v-model="menu1"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="dateLeave"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="date"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" @input="menu1 = false"></v-date-picker>
          </v-menu>
        </v-flex>
        Leaving from
        <v-flex xs12 sm6 md4>
          <v-autocomplete
            prepend-icon="location_on"
            label="Select location"
            :items="locations"
            v-model = "localityLeave">
          </v-autocomplete>
          <v-autocomplete
            prepend-icon="access_time"
            label="Select hour of departure"
            :items="hour"
            v-model="hourLeave">
          </v-autocomplete>
          <v-autocomplete
            prepend-icon="access_time"
            label="Select minutes"
            :items="minutes"
            v-model="minLeave">
          </v-autocomplete>
          <v-textarea
            auto-grow
            rows = 1
            prepend-icon="location_on"
            label="Meeting point"
            v-model="meetingPoint">
          </v-textarea>
        </v-flex>
        Going to
        <v-flex xs12 sm6 md4>
          <v-autocomplete
            prepend-icon="location_on"
            label="Select location"
            :items="locations"
            v-model = "localityGoing">
          </v-autocomplete>
          <v-textarea
            auto-grow
            rows = 1
            prepend-icon="location_on"
            label="Drop off"
            v-model="dropPoint">
          </v-textarea>
        </v-flex>
        Number of seats available
        <v-flex xs12 sm6 md4>
          <v-select
            prepend-icon="email"
            label="Select no. of seats"
            :items="seats"
            v-model="noSeats">
          </v-select>
        </v-flex>
        Car description
        <v-flex xs12 sm6 md4>
          <v-textarea
            auto-grow
            rows = 1
            prepend-icon="location_on"
            label="Short description"
            v-model="car">
          </v-textarea>
        </v-flex>
        Price per person
        <v-flex xs12 sm6 md4>
          <v-textarea
            auto-grow
            rows = 1
            prepend-icon="location_on"
            label="Price (RON)"
            v-model="price">
          </v-textarea>
        </v-flex>
         Telephon number
        <v-flex xs12 sm6 md4>
          <v-textarea
            auto-grow
            rows = 1
            prepend-icon="location_on"
            label="Tel. no."
            v-model="phone">
          </v-textarea>
        </v-flex>
      </v-container>
    </v-layout>
    <v-btn
      v-if="send === false"
      color="primary"
      flat
      @click="sendRequest">
      Post it!
    </v-btn>
    <v-card v-if="send === true">
      <v-alert :value="true" type="success">
        Success!
      </v-alert>
      <v-spacer></v-spacer>
      <v-btn to="/" flat>
        <v-icon left>keyboard_arrow_left</v-icon>
        Back
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
import LocalitiesRO from '@/components/LocalitiesRO'
import firebase from '@/firebase'
export default {
  name: 'HelloWorld',
  data () {
    return {
      seats: ['1', '2', '3', '4', '5'],
      hour: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10','11' ,'12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
      minutes: ['00', '15', '30', '45'],
      date: new Date().toISOString().substr(0, 10),
      time: null,
      menu1: false,
      menu2: false,
      send: false,
      localityLeave: '',
      localityGoing: '',
      hourLeave: '',
      minLeave: '',
      meetingPoint: '',
      dropPoint:'',
      noSeats: '',
      car: '',
      price: '',
      phone: '',
      dateLeave: null      
    }
  },
  methods: {
    sendRequest () {
      firebase.firestore().collection('Requests').add({
        dateLeave: this.date,
        localityLeave: this.localityLeave,
        hourLeave: this.hourLeave,
        minLeave: this.minLeave,
        meetingPoint: this.meetingPoint,
        localityGoing: this.localityGoing,
        dropPoint: this.dropPoint,
        noSeats: this.noSeats,
        car: this.car,
        price: this.price,
        phone: this.phone
      }).then(docRef => {
          this.date = ''
          this.localityLeave = ''
          this.hourLeave = ''
          this.minLeave = ''
          this.meetingPoint = ''
          this.localityGoing = ''
          this.dropPoint = ''
          this.noSeats = ''
          this.car = ''
          this.price = ''
          this.phone = ''
          this.send = true
      }).catch(error => {
        console.error('Error writing document: ', error)
      })

    },
  },
  created () {
    this.locations = LocalitiesRO
  },
}
</script>
