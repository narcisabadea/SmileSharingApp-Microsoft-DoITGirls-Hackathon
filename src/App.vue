<template>
  <v-app>
    <div class="container-wrapper">
      <div dark class="left-column">
        <div class="toolbar">
          <div class="title">
            Smile Sharing
          </div>
          <div class="title-actions">
            <v-btn
              text
              @click="dialogLoginForm.showDialog = !dialogLoginForm.showDialog"
              v-if="!userDetails"
            >
              Login
            </v-btn>
            <v-btn
              text
              @click="
                dialogCarOfferForm.showDialog = !dialogCarOfferForm.showDialog
              "
              v-if="userDetails"
            >
              Add route
            </v-btn>
            <v-btn
              text
              @click="
                dialogProfileDetails.showDialog = !dialogProfileDetails.showDialog
              "
              v-if="userDetails"
            >
              Account
            </v-btn>
            <v-btn text @click="logout()" v-if="userDetails">
              Log out
            </v-btn>
          </div>
        </div>
        <div class="filters">
          <v-autocomplete
            :items="carSearchDetails.localityLeaveFilter"
            label="Locality leaving"
            v-model="carSearchDetails.selectedLocalityLeave"
          ></v-autocomplete>
          <v-autocomplete
            :items="carSearchDetails.localityGoingFilter"
            label="Locality going"
            v-model="carSearchDetails.selectedlocalityGoing"
          ></v-autocomplete>
          <v-autocomplete
            :items="carSearchDetails.carTypeFilter"
            label="Select car"
            v-model="carSearchDetails.selectedcarType"
          ></v-autocomplete>
        </div>
        <div class="results">
          <div
            v-for="(item, index) in filteredItems"
            :key="index"
            class="result-item"
          >
            <div class="location-wrapper">
              From
              <span class="location-locality">{{ item.localityLeave }}</span>
              ({{ item.hourLeave }}:{{ item.minLeave }}) to
              <span class="location-locality">{{ item.localityGoing }}</span>
            </div>
            <div class="result-price">Price: {{ item.price }}RON</div>
            <div class="result-item-action">
              <v-btn
                depressed
                small
                @click="seeDetails(item.id, index)"
                style="background: #E9C46A"
                >See details</v-btn
              >
            </div>
          </div>
        </div>
      </div>
      <div class="right-column">
        map
      </div>
    </div>
    <v-dialog v-model="dialogLoginForm.showDialog" max-width="80vw">
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
    <v-dialog v-model="dialogProfileDetails.showDialog" max-width="80vw">
      <v-card elevation="2" shaped>
        <v-flex xs12>
          <v-card>
            <v-card-title>Account details</v-card-title>
            <v-card-text>
              <v-text-field
                prepend-icon="account_circle"
                name="nume"
                v-if="dialogProfileDetails.data.name"
                v-model="dialogProfileDetails.data.name"
                label="Name"
                id="nume"
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-text-field
                prepend-icon="account_circle"
                name="prenume"
                label="Surname"
                v-model="dialogProfileDetails.data.surname"
                id="prenume"
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-text-field
                prepend-icon="account_circle"
                name="phone"
                v-model="dialogProfileDetails.data.phone"
                label="Phone no."
                id="phone"
              ></v-text-field>
              <v-text-field
                prepend-icon="account_circle"
                name="email"
                v-model="dialogProfileDetails.data.email"
                label="Email adress"
                id="email"
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12>
          <v-card>
            <v-card-title>Scheduled rides found</v-card-title>
            <v-card-text>
              <v-list three-line id="culoare">
                <v-list-tile
                  v-for="(item, index) in dialogProfileDetails.myrides"
                  :key="index"
                >
                  <v-list-tile-content>
                    <v-list-tile-title
                      >From
                      <span style="color: #0B7A75">{{
                        item.localityLeave
                      }}</span>
                      ({{ item.hourLeave }}:{{ item.minLeave }}) to
                      <span style="color: #0B7A75">{{
                        item.localityGoing
                      }}</span>
                    </v-list-tile-title>
                    <v-list-tile-sub-title class="text-truncate"
                      >Price: {{ item.price }}RON</v-list-tile-sub-title
                    >
                    <v-btn
                      depressed
                      small
                      @click="seeDetails(item.id, index, 'found')"
                      style="background: #E9C46A"
                      >See details</v-btn
                    >
                    <v-divider></v-divider>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12>
          <v-card>
            <v-card-title>Scheduled rides offer</v-card-title>
            <v-card-text>
              <v-list three-line id="culoare">
                <v-list-tile
                  v-for="(item, index) in dialogProfileDetails.rides"
                  :key="index"
                >
                  <v-list-tile-content>
                    <v-list-tile-title
                      >From
                      <span style="color: #0B7A75">{{
                        item.localityLeave
                      }}</span>
                      ({{ item.hourLeave }}:{{ item.minLeave }}) to
                      <span style="color: #0B7A75">{{
                        item.localityGoing
                      }}</span>
                    </v-list-tile-title>
                    <v-list-tile-sub-title class="text-truncate"
                      >Price: {{ item.price }}RON</v-list-tile-sub-title
                    >
                    <v-btn
                      depressed
                      small
                      @click="seeDetails(item.id, index, 'offers')"
                      style="background: #E9C46A"
                      >See details</v-btn
                    >
                    <v-divider></v-divider>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogRideDetails.showDialog" max-width="80vw">
      <v-card elevation="2" shaped>
        <v-toolbar dark style="background: #19535f">
          <v-toolbar-title>Ride details</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="text-xs-center">
          <v-list dense>
            <v-list-tile>
              <v-list-tile-content
                >Car type:
                {{ dialogRideDetails.selectedItem.car }}</v-list-tile-content
              >
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content
                >Date leave:
                {{
                  dialogRideDetails.selectedItem.dateLeave
                }}</v-list-tile-content
              >
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content
                >Drop point:
                {{
                  dialogRideDetails.selectedItem.dropPoint
                }}</v-list-tile-content
              >
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content
                >Leave at: {{ dialogRideDetails.selectedItem.hourLeave }}:{{
                  dialogRideDetails.selectedItem.minLeave
                }}</v-list-tile-content
              >
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content
                >Locality going:
                {{
                  dialogRideDetails.selectedItem.localityGoing
                }}</v-list-tile-content
              >
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content
                >Locality leave:
                {{
                  dialogRideDetails.selectedItem.localityLeave
                }}</v-list-tile-content
              >
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content
                >Meeting point:
                {{
                  dialogRideDetails.selectedItem.meetingPoint
                }}</v-list-tile-content
              >
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content
                >Number of available seats:
                {{
                  dialogRideDetails.selectedItem.noSeats
                }}</v-list-tile-content
              >
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content
                >Phone number:
                {{ dialogRideDetails.selectedItem.phone }}</v-list-tile-content
              >
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content
                >Price:
                {{
                  dialogRideDetails.selectedItem.price
                }}RON</v-list-tile-content
              >
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn
            style="background: #E9C46A"
            @click="add(dialogRideDetails.selectedItem.id)"
            v-if="!dialogRideDetails.send"
            >{{ userDetails ? "I'm interested" : "Login" }}</v-btn
          >
          <v-card v-if="dialogRideDetails.send === true">
            <v-alert :value="true" type="success">Success!</v-alert>
            <v-spacer></v-spacer>
            <v-btn to="/" flat>
              <v-icon left>keyboard_arrow_left</v-icon>Back
            </v-btn>
          </v-card>
        </v-card-actions>
      </v-card>
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
      dialogProfileDetails: {
        showDialog: false,
        data: {
          name: "",
          surname: "",
          phone: "",
          email: "",
          username: "",
        },
        rides: null,
        myrides: null,
        dialog: false,
      },
      dialogRideDetails: {
        showDialog: false,
        selectedItem: {},
        send: false,
      },
      carSearchDetails: {
        items: [],
        localityGoing: [],
        selectedLocalityLeave: "All locations",
        selectedlocalityGoing: "All locations",
        selectedcarType: "All types",
      },
    };
  },
  components: { VueGoogleAutocomplete },
  computed: {
    userDetails() {
      return this.$store.getters.userDetails;
    },
    filteredItems() {
      return this.carSearchDetails.items
        .filter((item) => {
          return this.carSearchDetails.selectedLocalityLeave === "All locations"
            ? true
            : item.localityLeave ===
                this.carSearchDetails.selectedLocalityLeave;
        })
        .filter((item) => {
          return this.carSearchDetails.selectedlocalityGoing === "All locations"
            ? true
            : item.localityGoing ===
                this.carSearchDetails.selectedlocalityGoing;
        })
        .filter((item) => {
          return this.carSearchDetails.selectedcarType === "All types"
            ? true
            : item.car === this.carSearchDetails.selectedcarType;
        });
    },
    localityLeaveFilter() {
      let localityLeaveFilterData = ["All locations"];
      this.carSearchDetails.items.forEach((item) => {
        localityLeaveFilterData.push(item.localityLeave);
      });
      return localityLeaveFilterData;
    },
    localityGoingFilter() {
      let localityGoingFilterData = ["All locations"];
      this.carSearchDetails.items.forEach((item) => {
        localityGoingFilterData.push(item.localityGoing);
      });
      return localityGoingFilterData;
    },
    carTypeFilter() {
      let carTypeData = ["All types"];
      this.carSearchDetails.items.forEach((item) => {
        carTypeData.push(item.car);
      });
      return carTypeData;
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
    seeDetails(id, index, type) {
      this.dialogRideDetails.showDialog = true;
      if (type === "found") {
        this.dialogRideDetails.selectedItem = this.dialogProfileDetails.rides[
          index
        ];
      } else if (type === "offers") {
        this.dialogRideDetails.selectedItem = this.dialogProfileDetails.myrides[
          index
        ];
      } else if (type === "offer") {
        this.dialogRideDetails.selectedItem = this.carSearchDetails.items[
          index
        ];
      }
    },
    getData() {
      let items = [];
      firebase
        .firestore()
        .collection("Requests")
        .onSnapshot((snapshot) => {
          snapshot.forEach((obj) => {
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
              participants: obj.data().participants,
            });
          });
        });
      return items;
    },
    add(id) {
      if (this.userDetails) {
        let newRides = this.userDetails.rides;
        newRides.push(id);
        firebase
          .firestore()
          .collection("Users/")
          .doc(this.userDetails.username)
          .update({
            rides: newRides,
          });
        this.send = true;
      } else {
        this.loginDialog = true;
      }
    },
    getUserData() {
      firebase
        .firestore()
        .collection("Users")
        .doc(this.dialogProfileDetails.data.username)
        .get()
        .then((snapshot) => {
          let details = {
            name: snapshot.data().name,
            surname: snapshot.data().surname,
            email: snapshot.data().email,
            phone: snapshot.data().phone,
            type: snapshot.data().type,
            username: snapshot.id,
            password: snapshot.data().password,
            rides: snapshot.data().rides,
            myrides: snapshot.data().myrides,
          };
          localStorage.setItem("details", JSON.stringify(details));
          this.dialogProfileDetails.data = details;
        });

      let rides1 = [];
      this.dialogProfileDetails.data.rides.forEach((item) => {
        firebase
          .firestore()
          .collection("Requests")
          .doc(item)
          .get()
          .then((obj) => {
            rides1.push({
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
            });
          });
      });
      this.dialogProfileDetails.rides = rides1;
      let rides2 = [];
      this.dialogProfileDetails.data.myrides.forEach((item) => {
        firebase
          .firestore()
          .collection("Requests")
          .doc(item)
          .get()
          .then((obj) => {
            rides2.push({
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
            });
          });
      });
      this.dialogProfileDetails.myrides = rides2;
    },
  },
  created() {
    this.dialogProfileDetails.data =
      localStorage.getItem("details") !== null
        ? JSON.parse(localStorage.getItem("details"))
        : this.dialogProfileDetails.data;
    this.carSearchDetails.items = this.getData();

    if (this.dialogProfileDetails.data.username !== "") {
      this.$store.dispatch("getUserDetails");
      this.getUserData();
    }
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
.container-wrapper {
  display: flex;
  flex-flow: row;
  height: 100vh;
}
.container-wrapper .left-column {
  width: 40vw;
}
.container-wrapper .right-column {
  width: 60vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: lightblue;
}
.container-wrapper .left-column .toolbar {
  display: flex;
  justify-content: space-between;
  flex-flow: row;
  padding: 10px 20px;
}
.container-wrapper .left-column .toolbar .title {
  font-weight: bold;
  font-size: 1.5rem;
}
.container-wrapper .left-column .filters {
  display: flex;
  flex-flow: wrap;
  padding-top: 50px;
  justify-content: center;
  background-color: #d3d3d352;
}
.container-wrapper .left-column .filters .v-input {
  margin: 10px;
  max-width: 140px; 
}
.container-wrapper .left-column .results {
  display: flex;
  height: 100%;
  flex-flow: column;
  overflow-y: auto;
}
.container-wrapper .left-column .results .result-item {
  background-color: white;
  padding: 20px;
}
.container-wrapper .left-column .results .result-item:hover {
  background-color: #d3d3d352;
}
.container-wrapper .left-column .results .result-item .location-wrapper {
  margin: 3px;
}
.container-wrapper
  .left-column
  .results
  .result-item
  .location-wrapper
  .location-locality {
  font-weight: bold;
}
.container-wrapper .left-column .results .result-item .result-price {
  opacity: 0.7;
  margin: 3px;
}
.container-wrapper .left-column .results .result-item .result-item-action {
  text-align: -webkit-right;
  margin: 5px 10px;
}
</style>
