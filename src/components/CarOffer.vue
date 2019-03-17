<template>
  <v-container grid-list-sm>
    <v-layout row>
      <v-container>
        <h2>Offer someone a ride</h2>
        <h4>Departure date</h4>
        <v-flex xs8 sm8 md8>
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
        <h4>Leaving from</h4>
        <v-flex xs8 sm8 md8>
          <v-icon left>location_on</v-icon>
          <vue-google-autocomplete
            id="searchMap"
            type= "text"
            types="(cities)"
            classname="input"
            placeholder="Select location"
            @placechanged="getAddressData"
            v-model = "localityLeave">
          </vue-google-autocomplete>
        </v-flex>
        <v-flex xs8 sm8 md8>
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
        <h4>Going to</h4>
        <v-flex xs8 sm8 md8>
           <v-icon left>location_on</v-icon>
          <vue-google-autocomplete
            id="searchMap2"
            type= "text"
            types="(cities)"
            classname="input"
            placeholder="Select going to location"
            @placechanged="getAddressDataFinish"
            v-model = "localityGoing">
          </vue-google-autocomplete>
        </v-flex>
        <v-flex xs8 sm8 md8>
          <v-textarea
            auto-grow
            rows = 1
            prepend-icon="location_on"
            label="Drop off"
            v-model="dropPoint">
          </v-textarea>
        </v-flex>
        Number of seats available
        <v-flex xs8 sm8 md8>
          <v-select
            prepend-icon="email"
            label="Select no. of seats"
            :items="seats"
            v-model="noSeats">
          </v-select>
        </v-flex>
        Car description
        <v-flex xs8 sm8 md8>
          <v-textarea
            auto-grow
            rows = 1
            prepend-icon="location_on"
            label="Short description"
            v-model="car">
          </v-textarea>
        </v-flex>
        Price per person
        <v-flex xs8 sm8 md8>
          <v-textarea
            auto-grow
            rows = 1
            prepend-icon="location_on"
            label="Price (RON)"
            v-model="price">
          </v-textarea>
        </v-flex>
         Telephon number
        <v-flex xs8 sm8 md8>
          <v-textarea
            auto-grow
            rows = 1
            prepend-icon="location_on"
            label="Tel. no."
            v-model="phone">
          </v-textarea>
        </v-flex>
      </v-container>
        <v-container grid-list-sm>
          <v-flex>
            <div id="myMap"></div>
          </v-flex>
          <v-btn
              v-if="send === false"
              flat
              style="background: #0B7A75; color: white"
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
    </v-layout>

  </v-container>
</template>

<script>
import LocalitiesRO from '@/components/LocalitiesRO'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
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
      dateLeave: null,
      myMap: null,
      startLatitude: null,
      startLongitude: null,
      finishLatitude: null,
      finishLongitude: null,
      datasource: '',
      map: null
    }
  },
  components: { VueGoogleAutocomplete },
  methods: {
    getAddressData (addressData, placeResultData, id) {
      this.startLatitude = addressData.latitude
      this.startLongitude = addressData.longitude
      this.maps()
      console.log('start, ', this.startLatitude, this.startLongitude)
    },
    getAddressDataFinish (addressData, placeResultData, id) {
      this.finishLatitude = addressData.latitude
      this.finishLongitude = addressData.longitude
      this.maps()
      console.log('finish, ', this.finishLatitude, this.finishLongitude)
    },
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
          console.error(docRef)
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
        console.log('Error writing document: ', error)
      })
    },
    maps () {
      this.map = new window.atlas.Map('myMap', {
        zoom: 12,
        center: this.startLatitude && this.startLongitude ? [+this.startLongitude, +this.startLatitude] : (this.finishLatitude && this.finishLongitude ? [+this.finishLongitude, +this.finishLatitude] : [+26.10025, +44.4271325]),
        authOptions: {
        authType: 'subscriptionKey',
        subscriptionKey: 'ifkDxBr3Dh85OBBgiv5qg9IcQiCcjs4vRkIUQJO2t1c'
        }
      })
      this.map.events.add('ready',  () => {
      //Create a HTML marker and add it to the map.
      if (this.startLatitude && this.startLongitude && this.finishLatitude && this.finishLongitude) {
        this.route()
      } else if (this.startLatitude && this.startLongitude) {
        console.log(this.startLatitude, this.startLongitude)
        var marker = new window.atlas.HtmlMarker({
          color: 'DodgerBlue',
          text: '0',
          position: [+this.startLongitude, +this.startLatitude],
          popup: new window.atlas.Popup({
            content: '<div style="padding:10px">Start</div>',
            pixelOffset: [0, -30]
          })
        })
        this.map.markers.add(marker)
        //Add a click event to toggle the popup.
        this.map.events.add('click',marker, () => {
          marker.togglePopup()
        })
      } else if (this.finishLatitude && this.finishLongitude) {
        console.log(this.finishLatitude, this.finishLongitude)
        var marker = new window.atlas.HtmlMarker({
          color: 'DodgerBlue',
          text: '0',
          position: [+this.finishLongitude, +this.finishLatitude],
          popup: new window.atlas.Popup({
            content: '<div style="padding:10px">Start</div>',
            pixelOffset: [0, -30]
          })
        })
        this.map.markers.add(marker)
        //Add a click event to toggle the popup.
        this.map.events.add('click',marker, () => {
          marker.togglePopup()
        })
      }
    })
    },
    route () {
       var datasource = new window.atlas.source.DataSource()
    this.map.sources.add(datasource)
    this.map.layers.add(new window.atlas.layer.LineLayer(datasource, null, {
        strokeColor: '#2272B9',
        strokeWidth: 5,
        lineJoin: 'round',
        lineCap: 'round',
        filter: ['==', '$type', 'LineString']
    }), 'labels')
    //Add a layer for rendering point data.
    this.map.layers.add(new window.atlas.layer.SymbolLayer(datasource, null, {
        iconOptions: {
            image: ['get', 'icon'],
            allowOverlap: true
       },
        textOptions: {
            textField: ['get', 'title'],
            offset: [0, 1.2]
        },
        filter: ['==', '$type', 'Point']
    }))
    var startPoint = new window.atlas.data.Feature(new window.atlas.data.Point([+this.startLongitude, +this.startLatitude]), {
      title: "Start",
      icon: "pin-blue"
    })
    var endPoint = new window.atlas.data.Feature(new window.atlas.data.Point([+this.finishLongitude, +this.finishLatitude]), {
        title: "End",
        icon: "pin-round-blue"
    })
    //Add the data to the data source.
    datasource.add([startPoint, endPoint]);
    this.map.setCamera({
        bounds: window.atlas.data.BoundingBox.fromData([startPoint, endPoint]),
        padding: 80
    })
    var subscriptionKeyCredential = new window.atlas.service.SubscriptionKeyCredential(window.atlas.getSubscriptionKey())
    var pipeline = window.atlas.service.MapsURL.newPipeline(subscriptionKeyCredential)
    var routeURL = new window.atlas.service.RouteURL(pipeline)
    //Start and end point input to the routeURL
    var coordinates= [[startPoint.geometry.coordinates[0], startPoint.geometry.coordinates[1]], [endPoint.geometry.coordinates[0], endPoint.geometry.coordinates[1]]];

    //Make a search route request
    routeURL.calculateRouteDirections(window.atlas.service.Aborter.timeout(10000), coordinates).then((directions) => {
      //Get data features from response
      var data = directions.geojson.getFeatures(); 
      datasource.add(data);
    })
    }
  },
  created () {
    this.locations = LocalitiesRO
  },
  mounted () {
    this.maps()
  }
}
</script>

<style>
#myMap {
  width: 100%;
  min-height: 570px;
}
</style>
