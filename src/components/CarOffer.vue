<template>
  <v-container grid-list-sm>
    <v-layout row>
      <v-container>
        <v-card elevation="2" shaped>
          <v-card-title>Add a trip</v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="12" sm="2" align-self="center">
                Departure date
              </v-col>
              <v-col cols="12" sm="4">
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="dateLeave"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="date"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="date"
                    @input="menu1 = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="2" align-self="center">
                Leaving from
              </v-col>
              <v-col cols="12" sm="4">
                <v-flex xs8 sm8 md8>
                  <vue-google-autocomplete
                    id="searchMap"
                    type="text"
                    types="(cities)"
                    class="input"
                    placeholder="Select location"
                    @placechanged="getAddressData"
                  ></vue-google-autocomplete>
                </v-flex>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="2" align-self="center">
                Leaving time
              </v-col>
              <v-col cols="12" sm="4">
                <v-row>
                  <v-col cols="12" sm="6" align-self="center">
                    <v-autocomplete
                      label="Hour"
                      :items="hour"
                      v-model="hourLeave"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" align-self="center">
                    <v-autocomplete
                      label="Minutes"
                      :items="minutes"
                      v-model="minLeave"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="2" align-self="center">
                Meeting point
              </v-col>
              <v-col cols="12" sm="6">
                <v-flex xs8 sm8 md8>
                  <v-textarea
                    auto-grow
                    rows="1"
                    v-model="meetingPoint"
                  ></v-textarea>
                </v-flex>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="2" align-self="center">
                Going to
              </v-col>
              <v-col cols="12" sm="4">
                <v-flex xs8 sm8 md8>
                  <vue-google-autocomplete
                    id="searchMap2"
                    type="text"
                    types="(cities)"
                    class="input"
                    placeholder="Select going to location"
                    @placechanged="getAddressDataFinish"
                  ></vue-google-autocomplete>
                </v-flex>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="2" align-self="center">
                Drop off
              </v-col>
              <v-col cols="12" sm="6">
                <v-flex xs8 sm8 md8>
                  <v-textarea
                    auto-grow
                    rows="1"
                    v-model="dropPoint"
                  ></v-textarea>
                </v-flex>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="2" align-self="center">
                Seats available
              </v-col>
              <v-col cols="12" sm="6">
                <v-flex xs8 sm8 md8>
                  <!-- <v-radio-group v-model="row" row>
                    <v-radio label="Option 1" value="radio-1"></v-radio>
                    <v-radio label="Option 2" value="radio-2"></v-radio>
                  </v-radio-group> -->

                  <v-select
                label="Select no. of seats"
                :items="seats"
                v-model="noSeats"
              ></v-select>
                </v-flex>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="2" align-self="center">
                Car description
              </v-col>
              <v-col cols="12" sm="6">
                <v-flex xs8 sm8 md8>
                  <v-textarea
                    auto-grow
                    rows="1"
                    label="Short description"
                    v-model="car"
                  ></v-textarea>
                </v-flex>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="2" align-self="center">
                Price per person
              </v-col>
              <v-col cols="12" sm="6">
                <v-flex xs8 sm8 md8>
                  <v-textarea
                    auto-grow
                    rows="1"
                    label="Price (RON)"
                    v-model="price"
                  ></v-textarea>
                </v-flex>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="2" align-self="center">
                Phone number
              </v-col>
              <v-col cols="12" sm="6">
                <v-flex xs8 sm8 md8>
                  <v-textarea
                    auto-grow
                    rows="1"
                    label="Tel. no."
                    v-model="phone"
                  ></v-textarea>
                </v-flex>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
      <v-container grid-list-sm>
        <v-flex>
          <div id="myMap"></div>
        </v-flex>
        <v-btn
          v-if="send === false"
          flat
          style="background: #0B7A75; color: white"
          @click="sendRequest"
          >Post it!</v-btn
        >
        <v-card v-if="send === true">
          <v-alert :value="true" type="success">Success!</v-alert>
          <v-spacer></v-spacer>
          <v-btn to="/" flat>
            <v-icon left>keyboard_arrow_left</v-icon>Back
          </v-btn>
        </v-card>
      </v-container>
    </v-layout>
    <v-dialog v-model="loginDialog" class="dialog" max-width="30%">
      <v-card class="elevation-12" transparent>
        <v-card-text class="text-xs-center">
          <v-icon x-large color="indigo darken-1">account_circle</v-icon>
        </v-card-text>
        <v-icon>mdi-home</v-icon>
        <v-card-text>
          <v-text-field v-model="email" label="Username"></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            :append-icon="show ? 'visibility_off' : 'visibility'"
            :type="show ? 'text' : 'password'"
            @click:append="show = !show"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            type="submit"
            color="indigo darken-1 white--text"
            @click="login()"
            >Login</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import LocalitiesRO from "@/components/LocalitiesRO";
import VueGoogleAutocomplete from "vue-google-autocomplete";
import firebase from "@/firebase";
export default {
  name: "HelloWorld",
  data() {
    return {
      seats: ["1", "2", "3", "4", "5"],
      hour: [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
      ],
      minutes: ["00", "15", "30", "45"],
      date: new Date().toISOString().substr(0, 10),
      time: null,
      menu1: false,
      menu2: false,
      send: false,
      show: false,
      localityLeave: "",
      localityGoing: "",
      hourLeave: "",
      minLeave: "",
      meetingPoint: "",
      dropPoint: "",
      noSeats: "",
      car: "",
      price: "",
      phone: "",
      dateLeave: null,
      myMap: null,
      startLatitude: null,
      startLongitude: null,
      finishLatitude: null,
      finishLongitude: null,
      datasource: "",
      map: null,
      loginDialog: false,
      email: "",
      password: "",
    };
  },
  components: { VueGoogleAutocomplete },
  computed: {
    userDetails() {
      return this.$store.getters.userDetails;
    },
  },
  methods: {
    login() {
      this.$store.dispatch("login", {
        username: this.email,
        password: this.password,
      });
      this.loginDialog = false;
    },
    getAddressData(addressData, placeResultData, id) {
      console.log(placeResultData, id);
      this.startLatitude = addressData.latitude;
      this.startLongitude = addressData.longitude;
      this.localityLeave = addressData.locality;
      this.maps();
      console.log("start, ", this.startLatitude, this.startLongitude);
    },
    getAddressDataFinish(addressData, placeResultData, id) {
      console.log(placeResultData, id);
      this.finishLatitude = addressData.latitude;
      this.finishLongitude = addressData.longitude;
      this.localityGoing = addressData.locality;
      this.maps();
      console.log("finish, ", this.finishLatitude, this.finishLongitude);
    },
    sendRequest() {
      if (this.userDetails) {
        firebase
          .firestore()
          .collection("Requests")
          .add({
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
            phone: this.phone,
            startLatitude: this.startLatitude,
            startLongitude: this.startLongitude,
            finishLatitude: this.finishLatitude,
            finishLongitude: this.finishLongitude,
          })
          .then((docRef) => {
            let newRides = this.userDetails.myrides;
            newRides.push(docRef.id);
            firebase
              .firestore()
              .collection("Users/")
              .doc(this.userDetails.username)
              .update({
                myrides: newRides,
              });

            this.date = "";
            this.localityLeave = "";
            this.hourLeave = "";
            this.minLeave = "";
            this.meetingPoint = "";
            this.localityGoing = "";
            this.dropPoint = "";
            this.noSeats = "";
            this.car = "";
            this.price = "";
            this.phone = "";
            this.send = true;
          })
          .catch((error) => {
            console.log("Error writing document: ", error);
          });
      } else {
        this.loginDialog = true;
      }
    },
    maps() {
      this.map = new window.atlas.Map("myMap", {
        zoom: 12,
        center:
          this.startLatitude && this.startLongitude
            ? [+this.startLongitude, +this.startLatitude]
            : this.finishLatitude && this.finishLongitude
            ? [+this.finishLongitude, +this.finishLatitude]
            : [+26.10025, +44.4271325],
        authOptions: {
          authType: "subscriptionKey",
          subscriptionKey: "ifkDxBr3Dh85OBBgiv5qg9IcQiCcjs4vRkIUQJO2t1c",
        },
      });
      this.map.events.add("ready", () => {
        //Create a HTML marker and add it to the map.
        if (
          this.startLatitude &&
          this.startLongitude &&
          this.finishLatitude &&
          this.finishLongitude
        ) {
          this.route();
        } else if (this.startLatitude && this.startLongitude) {
          console.log(this.startLatitude, this.startLongitude);
          var marker = new window.atlas.HtmlMarker({
            color: "DodgerBlue",
            text: "0",
            position: [+this.startLongitude, +this.startLatitude],
            popup: new window.atlas.Popup({
              content: '<div style="padding:10px">Start</div>',
              pixelOffset: [0, -30],
            }),
          });
          this.map.markers.add(marker);
          //Add a click event to toggle the popup.
          this.map.events.add("click", marker, () => {
            marker.togglePopup();
          });
        } else if (this.finishLatitude && this.finishLongitude) {
          console.log(this.finishLatitude, this.finishLongitude);
          var marker2 = new window.atlas.HtmlMarker({
            color: "DodgerBlue",
            text: "0",
            position: [+this.finishLongitude, +this.finishLatitude],
            popup: new window.atlas.Popup({
              content: '<div style="padding:10px">Start</div>',
              pixelOffset: [0, -30],
            }),
          });
          this.map.markers.add(marker2);
          //Add a click event to toggle the popup.
          this.map.events.add("click", marker2, () => {
            marker2.togglePopup();
          });
        }
      });
    },
    route() {
      var datasource = new window.atlas.source.DataSource();
      this.map.sources.add(datasource);
      this.map.layers.add(
        new window.atlas.layer.LineLayer(datasource, null, {
          strokeColor: "#2272B9",
          strokeWidth: 5,
          lineJoin: "round",
          lineCap: "round",
          filter: ["==", "$type", "LineString"],
        }),
        "labels"
      );
      //Add a layer for rendering point data.
      this.map.layers.add(
        new window.atlas.layer.SymbolLayer(datasource, null, {
          iconOptions: {
            image: ["get", "icon"],
            allowOverlap: true,
          },
          textOptions: {
            textField: ["get", "title"],
            offset: [0, 1.2],
          },
          filter: ["==", "$type", "Point"],
        })
      );
      var startPoint = new window.atlas.data.Feature(
        new window.atlas.data.Point([
          +this.startLongitude,
          +this.startLatitude,
        ]),
        {
          title: "Start",
          icon: "pin-blue",
        }
      );
      var endPoint = new window.atlas.data.Feature(
        new window.atlas.data.Point([
          +this.finishLongitude,
          +this.finishLatitude,
        ]),
        {
          title: "End",
          icon: "pin-round-blue",
        }
      );
      //Add the data to the data source.
      datasource.add([startPoint, endPoint]);
      this.map.setCamera({
        bounds: window.atlas.data.BoundingBox.fromData([startPoint, endPoint]),
        padding: 80,
      });
      var subscriptionKeyCredential = new window.atlas.service.SubscriptionKeyCredential(
        window.atlas.getSubscriptionKey()
      );
      var pipeline = window.atlas.service.MapsURL.newPipeline(
        subscriptionKeyCredential
      );
      var routeURL = new window.atlas.service.RouteURL(pipeline);
      //Start and end point input to the routeURL
      var coordinates = [
        [
          startPoint.geometry.coordinates[0],
          startPoint.geometry.coordinates[1],
        ],
        [endPoint.geometry.coordinates[0], endPoint.geometry.coordinates[1]],
      ];

      //Make a search route request
      routeURL
        .calculateRouteDirections(
          window.atlas.service.Aborter.timeout(10000),
          coordinates
        )
        .then((directions) => {
          //Get data features from response
          var data = directions.geojson.getFeatures();
          datasource.add(data);
        });
    },
  },
  created() {
    this.locations = LocalitiesRO;
  },
  mounted() {
    this.maps();
  },
};
</script>

<style>
#myMap {
  width: 100%;
  min-height: 570px;
}
</style>
