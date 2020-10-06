<template>
  <v-app>
    <v-toolbar dark style="background: #19535F">
      <v-toolbar-title class="white--text">
        <router-link to="/Home" style="cursor:pointer; color: white;">
          Smile Sharing
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        @click="dialogLoginForm.showDialog = !dialogLoginForm.showDialog"
      >
        Login
      </v-btn>
      <v-btn
        @click="dialogCarOfferForm.showDialog = !dialogCarOfferForm.showDialog"
      >
        Add route
      </v-btn>
      <v-menu offset-y v-if="userDetails">
        <v-btn slot="activator">
          Account
        </v-btn>
        <v-list>
          <v-list-tile>
            <router-link to="/Profile" tag="li" style="cursor:pointer">
              <v-list-tile-title>Account details</v-list-tile-title>
            </router-link>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-title style="cursor:pointer" @click="logout()"
              >Log out</v-list-tile-title
            >
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-main>
      meh
    </v-main>
    <v-dialog
      v-model="dialogLoginForm.showDialog"
      class="dialog"
      max-width="80vw"
    >
      <v-card elevation="2" shaped>
        <v-card-title>
          Login
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="dialogLoginForm.email" label="Username">
          </v-text-field>
          <v-text-field
            v-model="dialogLoginForm.password"
            label="Password"
            :type="dialogLoginForm.show ? 'text' : 'password'"
            @click:append="dialogLoginForm.show = !dialogLoginForm.show"
          >
          </v-text-field>
        </v-card-text>
        <v-container grid-list-sm>
          <v-btn
            type="submit"
            style="background: #0B7A75; color: white"
            @click="login()"
          >
            Login
          </v-btn>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogCarOfferForm.showDialog" max-width="80vw">
      <v-container>
        <v-card elevation="2" shaped>
          <v-card-title>Add a trip</v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="12" sm="4" align-self="center">
                Departure date
              </v-col>
              <v-col cols="12" sm="8">
                <v-menu
                  v-model="dialogCarOfferForm.menu1"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="dialogCarOfferForm.dateLeave"
                  transition="scale-transition"
                  offset-y
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="dialogCarOfferForm.date"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dialogCarOfferForm.date"
                    @input="dialogCarOfferForm.menu1 = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="4" align-self="center">
                Leaving from
              </v-col>
              <v-col cols="12" sm="8">
                <v-flex xs12 sm12 md12>
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
              <v-col cols="12" sm="4" align-self="center">
                Leaving time
              </v-col>
              <v-col cols="12" sm="8">
                <v-row>
                  <v-col cols="12" sm="6" align-self="center">
                    <v-autocomplete
                      label="Hour"
                      :items="dialogCarOfferForm.hour"
                      v-model="dialogCarOfferForm.hourLeave"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" align-self="center">
                    <v-autocomplete
                      label="Minutes"
                      :items="dialogCarOfferForm.minutes"
                      v-model="dialogCarOfferForm.minLeave"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="4" align-self="center">
                Meeting point
              </v-col>
              <v-col cols="12" sm="8">
                <v-flex xs12 sm12 md12>
                  <v-textarea
                    auto-grow
                    rows="1"
                    v-model="dialogCarOfferForm.meetingPoint"
                  ></v-textarea>
                </v-flex>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="4" align-self="center">
                Going to
              </v-col>
              <v-col cols="12" sm="8">
                <v-flex xs12 sm12 md12>
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
              <v-col cols="12" sm="4" align-self="center">
                Drop off
              </v-col>
              <v-col cols="12" sm="8">
                <v-flex xs12 sm12 md12>
                  <v-textarea
                    auto-grow
                    rows="1"
                    v-model="dialogCarOfferForm.dropPoint"
                  ></v-textarea>
                </v-flex>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="4" align-self="center">
                Seats available
              </v-col>
              <v-col cols="12" sm="8">
                <v-flex xs12 sm12 md12>
                  <!-- <v-radio-group v-model="row" row>
                    <v-radio label="Option 1" value="radio-1"></v-radio>
                    <v-radio label="Option 2" value="radio-2"></v-radio>
                  </v-radio-group> -->

                  <v-select
                    label="Select no. of seats"
                    :items="dialogCarOfferForm.seats"
                    v-model="dialogCarOfferForm.noSeats"
                  ></v-select>
                </v-flex>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="4" align-self="center">
                Car description
              </v-col>
              <v-col cols="12" sm="8">
                <v-flex xs12 sm12 md12>
                  <v-textarea
                    auto-grow
                    rows="1"
                    label="Short description"
                    v-model="dialogCarOfferForm.car"
                  ></v-textarea>
                </v-flex>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="4" align-self="center">
                Price per person
              </v-col>
              <v-col cols="12" sm="8">
                <v-flex xs12 sm12 md12>
                  <v-textarea
                    auto-grow
                    rows="1"
                    label="Price (RON)"
                    v-model="dialogCarOfferForm.price"
                  ></v-textarea>
                </v-flex>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="4" align-self="center">
                Phone number
              </v-col>
              <v-col cols="12" sm="8">
                <v-flex xs12 sm12 md12>
                  <v-textarea
                    auto-grow
                    rows="1"
                    label="Tel. no."
                    v-model="dialogCarOfferForm.phone"
                  ></v-textarea>
                </v-flex>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
      <v-container grid-list-sm>
        <!-- <v-flex>
          <div id="myMap"></div>
        </v-flex> -->
        <v-btn
          v-if="dialogCarOfferForm.send === false"
          style="background: #0B7A75; color: white"
          @click="sendRequest"
          >Post it!</v-btn
        >
        <v-card v-if="dialogCarOfferForm.send === true">
          <v-alert :value="true" type="success">Success!</v-alert>
          <v-spacer></v-spacer>
          <v-btn to="/"> <v-icon left>keyboard_arrow_left</v-icon>Back </v-btn>
        </v-card>
      </v-container>
    </v-dialog>
  </v-app>
</template>

<script>
// import LocalitiesRO from "./LocalitiesRO";
import VueGoogleAutocomplete from "vue-google-autocomplete";
import firebase from "@/firebase";
export default {
  name: "App",
  data() {
    return {
      dialogLoginForm: {
        showDialog: false,
        email: "",
        password: "",
        menu: false,
        show: false,
      },
      dialogCarOfferForm: {
        showDialog: false,
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
        menu: false,
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
      },
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
        username: this.dialogLoginForm.email,
        password: this.dialogLoginForm.password,
      });
      this.dialogLoginForm.showDialog = false;
    },
    logout() {
      this.$store.dispatch("logout");
    },
    getAddressData(addressData, placeResultData, id) {
      console.warn("getAddressData", { addressData, placeResultData, id });
      this.dialogCarOfferForm.startLatitude = addressData.latitude;
      this.dialogCarOfferForm.startLongitude = addressData.longitude;
      this.dialogCarOfferForm.localityLeave = addressData.locality;
      this.maps();
    },
    getAddressDataFinish(addressData, placeResultData, id) {
      console.warn("getAddressDataFinish", {
        addressData,
        placeResultData,
        id,
      });
      this.dialogCarOfferForm.finishLatitude = addressData.latitude;
      this.dialogCarOfferForm.finishLongitude = addressData.longitude;
      this.dialogCarOfferForm.localityGoing = addressData.locality;
      this.maps();
    },
    sendRequest() {
      if (this.userDetails) {
        firebase
          .firestore()
          .collection("Requests")
          .add({
            dateLeave: this.dialogCarOfferForm.date,
            localityLeave: this.dialogCarOfferForm.localityLeave,
            hourLeave: this.dialogCarOfferForm.hourLeave,
            minLeave: this.dialogCarOfferForm.minLeave,
            meetingPoint: this.dialogCarOfferForm.meetingPoint,
            localityGoing: this.dialogCarOfferForm.localityGoing,
            dropPoint: this.dialogCarOfferForm.dropPoint,
            noSeats: this.dialogCarOfferForm.noSeats,
            car: this.dialogCarOfferForm.car,
            price: this.dialogCarOfferForm.price,
            phone: this.dialogCarOfferForm.phone,
            startLatitude: this.dialogCarOfferForm.startLatitude,
            startLongitude: this.dialogCarOfferForm.startLongitude,
            finishLatitude: this.dialogCarOfferForm.finishLatitude,
            finishLongitude: this.dialogCarOfferForm.finishLongitude,
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

            this.dialogCarOfferForm.date = "";
            this.dialogCarOfferForm.localityLeave = "";
            this.dialogCarOfferForm.hourLeave = "";
            this.dialogCarOfferForm.minLeave = "";
            this.dialogCarOfferForm.meetingPoint = "";
            this.dialogCarOfferForm.localityGoing = "";
            this.dialogCarOfferForm.dropPoint = "";
            this.dialogCarOfferForm.noSeats = "";
            this.dialogCarOfferForm.car = "";
            this.dialogCarOfferForm.price = "";
            this.dialogCarOfferForm.phone = "";
            this.dialogCarOfferForm.send = true;
          })
          .catch((error) => {
            console.log("Error writing document: ", error);
          });
      } else {
        this.loginDialog = true;
      }
    },
    maps() {
      this.dialogCarOfferForm.map = new window.atlas.Map("myMap", {
        zoom: 12,
        center:
          this.dialogCarOfferForm.startLatitude &&
          this.dialogCarOfferForm.startLongitude
            ? [
                +this.dialogCarOfferForm.startLongitude,
                +this.dialogCarOfferForm.startLatitude,
              ]
            : this.dialogCarOfferForm.finishLatitude &&
              this.dialogCarOfferForm.finishLongitude
            ? [
                +this.dialogCarOfferForm.finishLongitude,
                +this.dialogCarOfferForm.finishLatitude,
              ]
            : [+26.10025, +44.4271325],
        authOptions: {
          authType: "subscriptionKey",
          subscriptionKey: "ifkDxBr3Dh85OBBgiv5qg9IcQiCcjs4vRkIUQJO2t1c",
        },
      });
      this.dialogCarOfferForm.map.events.add("ready", () => {
        //Create a HTML marker and add it to the map.
        if (
          this.dialogCarOfferForm.startLatitude &&
          this.dialogCarOfferForm.startLongitude &&
          this.dialogCarOfferForm.finishLatitude &&
          this.dialogCarOfferForm.finishLongitude
        ) {
          this.route();
        } else if (
          this.dialogCarOfferForm.startLatitude &&
          this.dialogCarOfferForm.startLongitude
        ) {
          console.log(
            this.dialogCarOfferForm.startLatitude,
            this.dialogCarOfferForm.startLongitude
          );
          var marker = new window.atlas.HtmlMarker({
            color: "DodgerBlue",
            text: "0",
            position: [
              +this.dialogCarOfferForm.startLongitude,
              +this.dialogCarOfferForm.startLatitude,
            ],
            popup: new window.atlas.Popup({
              content: '<div style="padding:10px">Start</div>',
              pixelOffset: [0, -30],
            }),
          });
          this.dialogCarOfferForm.map.markers.add(marker);
          //Add a click event to toggle the popup.
          this.dialogCarOfferForm.map.events.add("click", marker, () => {
            marker.togglePopup();
          });
        } else if (
          this.dialogCarOfferForm.finishLatitude &&
          this.dialogCarOfferForm.finishLongitude
        ) {
          console.log(
            this.dialogCarOfferForm.finishLatitude,
            this.dialogCarOfferForm.finishLongitude
          );
          var marker2 = new window.atlas.HtmlMarker({
            color: "DodgerBlue",
            text: "0",
            position: [
              +this.dialogCarOfferForm.finishLongitude,
              +this.dialogCarOfferForm.finishLatitude,
            ],
            popup: new window.atlas.Popup({
              content: '<div style="padding:10px">Start</div>',
              pixelOffset: [0, -30],
            }),
          });
          this.dialogCarOfferForm.map.markers.add(marker2);
          //Add a click event to toggle the popup.
          this.dialogCarOfferForm.map.events.add("click", marker2, () => {
            marker2.togglePopup();
          });
        }
      });
    },
    route() {
      var datasource = new window.atlas.source.DataSource();
      this.dialogCarOfferForm.map.sources.add(datasource);
      this.dialogCarOfferForm.map.layers.add(
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
      this.dialogCarOfferForm.map.layers.add(
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
          +this.dialogCarOfferForm.startLongitude,
          +this.dialogCarOfferForm.startLatitude,
        ]),
        {
          title: "Start",
          icon: "pin-blue",
        }
      );
      var endPoint = new window.atlas.data.Feature(
        new window.atlas.data.Point([
          +this.dialogCarOfferForm.finishLongitude,
          +this.dialogCarOfferForm.finishLatitude,
        ]),
        {
          title: "End",
          icon: "pin-round-blue",
        }
      );
      //Add the data to the data source.
      datasource.add([startPoint, endPoint]);
      this.dialogCarOfferForm.map.setCamera({
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
    this.$store.dispatch("getUserDetails");
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
.v-dialog {
  background-color: transparent !important;
  box-shadow: none !important;
}
</style>
