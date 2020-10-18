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
                dialogProfileDetails.showDialog = !dialogProfileDetails.showDialog
              "
              v-if="userDetails"
            >
              Account
            </v-btn>
            <v-btn
              @click="
                dialogCarOfferForm.showDialog = !dialogCarOfferForm.showDialog
              "
              v-if="userDetails"
            >
              Add route
            </v-btn>
            <v-btn text @click="logout()" v-if="userDetails">
              Log out
            </v-btn>
          </div>
        </div>
        <div clas="bottom-part">
          <div class="filters">
            <v-autocomplete
              :items="localityLeaveFilter"
              label="Locality leaving"
              v-model="carSearchDetails.selectedLocalityLeave"
            ></v-autocomplete>
            <v-autocomplete
              :items="localityGoingFilter"
              label="Locality going"
              v-model="carSearchDetails.selectedlocalityGoing"
            ></v-autocomplete>
            <v-select
              v-model="carSearchDetails.selectedcarType"
              :items="carTypeFilter"
              label="Select car"
            >
              <template v-slot:item="slotProps">
                <img
                  class="filter-image"
                  v-if="slotProps.item === 'All types'"
                  src="../src/assets/car-icon.png"
                />
                <img
                  class="filter-image"
                  v-if="slotProps.item === 'bmw'"
                  src="../src/assets/car-logos/bmw.png"
                />
                <img
                  class="filter-image"
                  v-if="slotProps.item === 'fiat'"
                  src="../src/assets/car-logos/fiat.png"
                />
                <img
                  class="filter-image"
                  v-if="slotProps.item === 'ford'"
                  src="../src/assets/car-logos/ford.png"
                />
                <img
                  class="filter-image"
                  v-if="slotProps.item === 'matiz'"
                  src="../src/assets/car-logos/matiz.png"
                />
                <img
                  class="filter-image"
                  v-if="slotProps.item === 'opel'"
                  src="../src/assets/car-logos/opel.png"
                />
                <img
                  class="filter-image"
                  v-if="slotProps.item === 'volkswagen'"
                  src="../src/assets/car-logos/volkswagen.png"
                />
                {{ slotProps.item }}
              </template>
            </v-select>
          </div>
          <div class="results">
            <div
              v-for="(item, index) in filteredItems"
              :key="index"
              class="result-item"
            >
              <div class="result-info">
                <div class="result-image">
                  <img v-if="!item.car" src="../src/assets/car-icon.png" />
                  <img
                    v-if="item.car === 'bmw'"
                    src="../src/assets/car-logos/bmw.png"
                  />
                  <img
                    v-if="item.car === 'fiat'"
                    src="../src/assets/car-logos/fiat.png"
                  />
                  <img
                    v-if="item.car === 'ford'"
                    src="../src/assets/car-logos/ford.png"
                  />
                  <img
                    v-if="item.car === 'matiz'"
                    src="../src/assets/car-logos/matiz.png"
                  />
                  <img
                    v-if="item.car === 'opel'"
                    src="../src/assets/car-logos/opel.png"
                  />
                  <img
                    v-if="item.car === 'volkswagen'"
                    src="../src/assets/car-logos/volkswagen.png"
                  />
                </div>
                <div class="result-text-info">
                  <div>
                    Date leave:
                    <span class="bold-value"> {{ item.dateLeave }}</span>
                  </div>
                  <div>
                    From
                    <span class="bold-value">{{ item.localityLeave }}</span
                    >, {{ item.meetingPoint }} ({{ item.hourLeave }}:{{
                      item.minLeave
                    }}) to
                    <span class="bold-value">{{ item.localityGoing }}</span
                    >, {{ item.dropPoint }}
                  </div>
                  <div>
                    Seats available:
                    <span class="bold-value">{{
                      item.noSeats -
                        (item.participants ? item.participants.length : 0)
                    }}</span
                    >/{{ item.noSeats }}
                  </div>
                  <div>
                    Price:
                    <span class="bold-value">{{ item.price }}</span> RON
                  </div>
                  <div>
                    Phone:
                    <span class="bold-value">{{ item.phone }}</span>
                  </div>
                </div>
              </div>
              <div class="result-item-action">
                <v-btn text @click="seeMapRoute(item)"
                  >View recommended route</v-btn
                >
                <v-btn
                  :disabled="userParticipate(item)"
                  depressed
                  @click="apply(item)"
                  >{{
                    userParticipate(item)
                      ? "Participating"
                      : "Go with this driver"
                  }}</v-btn
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-column">
        <div
          class="error-route"
          v-if="showRouteError && !showInformationalText"
        >
          Error in loading map. Please select another course, this one seems to
          not have all the informations filled.
        </div>
        <div
          v-if="showInformationalText && !showRouteError"
          class="information-text"
        >
          Select a result to see the recommended route. This can depend on the
          driver, please get in touch.
        </div>
        <div id="map"></div>
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
          <v-btn type="submit" @click="login()">
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
                <v-flex xs4 sm4 md4>
                  <v-menu
                    v-model="dialogCarOfferForm.menu1"
                    :close-on-content-click="false"
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
                </v-flex>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="4" align-self="center">
                Leaving from
              </v-col>
              <v-col cols="12" sm="8">
                <v-flex xs12 sm12 md12>
                  <vue-google-autocomplete
                    style="border-bottom: 1px solid black; width: 100%"
                    id="searchMap"
                    type="text"
                    types="(cities)"
                    class="input"
                    placeholder="Enter location"
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
                    style="border-bottom: 1px solid black; width: 100%"
                    type="text"
                    types="(cities)"
                    class="input"
                    placeholder="Enter location"
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
                  <v-radio-group v-model="dialogCarOfferForm.noSeats" row>
                    <v-radio
                      v-for="n in 5"
                      :key="n"
                      :label="`${n}`"
                      :value="n"
                    ></v-radio>
                  </v-radio-group>
                </v-flex>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="4" align-self="center">
                Car model
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

          <v-btn
            v-if="dialogCarOfferForm.send === false"
            @click="sendRequest"
            class="postButton"
            >Post it!</v-btn
          >
          <div v-if="dialogCarOfferForm.send === true" class="successAlert">
            <v-alert :value="true" type="success">Success!</v-alert>
          </div>
        </v-card>
      </v-container>
      <v-container grid-list-sm>
        <v-flex>
          <div id="map"></div>
        </v-flex>
      </v-container>
    </v-dialog>
    <v-dialog v-model="dialogProfileDetails.showDialog" max-width="80vw">
      <v-container>
        <v-card elevation="2" shaped>
          <v-card-title>Account details</v-card-title>
          <v-card-text>
            <v-row no-gutters>
              
              <v-col cols="12" sm="4" align-self="center" style="padding-left: 30px">
                Name
              </v-col>
              <v-col cols="12" sm="8">
                <v-flex xs4 sm4 md4>
                  <v-text-field
                    name="nume"
                    v-if="dialogProfileDetails.data.name"
                    v-model="dialogProfileDetails.data.name"
                    id="nume"
                  ></v-text-field>
                </v-flex>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="4" align-self="center" style="padding-left: 30px">
                Surname
              </v-col>
              <v-col cols="12" sm="8">
                <v-flex xs4 sm4 md4>
                  <v-text-field
                    name="prenume"
                    v-model="dialogProfileDetails.data.surname"
                    id="prenume"
                  ></v-text-field>
                </v-flex>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="4" align-self="center" style="padding-left: 30px">
                Phone no.
              </v-col>
              <v-col cols="12" sm="8">
                <v-flex xs4 sm4 md4>
                  <v-text-field
                    name="phone"
                    v-model="dialogProfileDetails.data.phone"
                    id="phone"
                  ></v-text-field>
                </v-flex>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="4" align-self="center" style="padding-left: 30px">
                Email address
              </v-col>
              <v-col cols="12" sm="8">
                <v-flex xs4 sm4 md4>
                  <v-text-field
                    name="email"
                    v-model="dialogProfileDetails.data.email"
                    id="email"
                  ></v-text-field>
                </v-flex>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" sm="6">
                <v-flex xs12>
                  <v-card-title>Rides where I am a passenger</v-card-title>
                  <v-card-text>
                    <v-list three-line id="culoare">
                      <template
                        v-for="(item, index) in dialogProfileDetails.myrides"
                      >
                        <v-card  :key="index">
                          <v-list-item style="margin-bottom: 10px">
                            <v-list-item-content>
                              <v-list-item-title
                                >From
                                <span>{{ item.localityLeave }}</span>
                                ({{ item.hourLeave }}:{{ item.minLeave }}) ->
                                <span>{{ item.localityGoing }}</span>
                              </v-list-item-title>
                              <v-list-item-subtitle class="text-truncate"
                                >Price:
                                {{ item.price }} RON</v-list-item-subtitle
                              >
                              <div>
                                <v-btn
                                  depressed
                                  small
                                  @click="seeDetails(item.id, index, 'found')"
                                  >See details</v-btn
                                >
                              </div>
                            </v-list-item-content>
                          </v-list-item>
                        </v-card>
                      </template>
                    </v-list>
                  </v-card-text>
                </v-flex>
              </v-col>
              <v-col cols="12" sm="6">
                <v-flex xs12>
                  <v-card-title>Rides where I am the driver</v-card-title>
                  <v-card-text>
                    <v-list three-line id="culoare">
                      <template
                        v-for="(item, index) in dialogProfileDetails.rides"
                        
                      >
                        <v-card :key="index"> 
                          <v-list-item style="margin-bottom: 10px">
                            <v-list-item-content>
                              <v-list-item-title
                                >From
                                <span>{{ item.localityLeave }}</span>
                                ({{ item.hourLeave }}:{{ item.minLeave }}) ->
                                <span>{{ item.localityGoing }}</span>
                              </v-list-item-title>
                              <v-list-item-subtitle class="text-truncate"
                                >Price:
                                {{ item.price }} RON</v-list-item-subtitle
                              >
                              <div>
                                <v-btn
                                  depressed
                                  small
                                  @click="seeDetails(item.id, index, 'offers')"
                                  >See details</v-btn
                                >
                              </div>
                            </v-list-item-content>
                          </v-list-item>
                        </v-card>
                      </template>
                    </v-list>
                  </v-card-text>
                </v-flex>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </v-dialog>

    <v-dialog v-model="dialogRideDetails.showDialog" max-width="80vw">
      <v-container>
      <v-card elevation="2" shaped>
         <v-card-title>Ride details </v-card-title>
        <v-card-text>
             <v-card-text>
            <v-row no-gutters>
              <v-col cols="12" sm="4" align-self="center">
                Departure date
              </v-col>
              <v-col cols="12" sm="8">
                <v-flex xs4 sm4 md4>
                  <v-textarea
                    auto-grow
                    rows="1"
                    v-model="dialogRideDetails.selectedItem.dateLeave"
                  ></v-textarea>
                </v-flex>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="4" align-self="center">
                Leaving from
              </v-col>
              <v-col cols="12" sm="8">
                <v-flex xs12 sm12 md12>
                 <v-textarea
                    auto-grow
                    rows="1"
                    v-model="dialogRideDetails.selectedItem.localityLeave"
                  ></v-textarea>
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
                    <v-textarea
                    auto-grow
                    rows="1"
                    v-model="dialogRideDetails.selectedItem.hourLeave"
                  ></v-textarea>
                  </v-col>
                  <v-col cols="12" sm="6" align-self="center">
                     <v-textarea
                    auto-grow
                    rows="1"
                    v-model="dialogRideDetails.selectedItem.minLeave"
                  ></v-textarea>
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
                    v-model="dialogRideDetails.selectedItem.meetingPoint"
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
                      <v-textarea
                    auto-grow
                    rows="1"
                    v-model="dialogRideDetails.selectedItem.localityGoing"
                  ></v-textarea>
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
                    v-model="dialogRideDetails.selectedItem.dropPoint"
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
                 <v-textarea
                    auto-grow
                    rows="1"
                    v-model="dialogRideDetails.selectedItem.noSeats"
                  ></v-textarea>
                </v-flex>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="4" align-self="center">
                Car model
              </v-col>
              <v-col cols="12" sm="8">
                <v-flex xs12 sm12 md12>
                  <v-textarea
                    auto-grow
                    rows="1"
                    label="Short description"
                    v-model="dialogRideDetails.selectedItem.car"
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
                    v-model="dialogRideDetails.selectedItem.price"
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
                    v-model="dialogRideDetails.selectedItem.phone"
                  ></v-textarea>
                </v-flex>
              </v-col>
            </v-row>
          </v-card-text>

        </v-card-text>
       
      </v-card>
      </v-container>
    </v-dialog>
  </v-app>
</template>

<script>
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
      showInformationalText: true,
      showRouteError: false,
      directions: {
        service: null,
        display: null,
        start: null,
        end: null,
      },
    };
  },
  components: { VueGoogleAutocomplete },
  computed: {
    userDetails() {
      return this.$store.getters.userDetails;
    },
    requestsDetails() {
      return this.$store.getters.requestsDetails;
    },
    filteredItems() {
      return this.requestsDetails
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
      this.requestsDetails.forEach((item) => {
        localityLeaveFilterData.push(item.localityLeave);
      });
      return localityLeaveFilterData;
    },
    localityGoingFilter() {
      let localityGoingFilterData = ["All locations"];
      this.requestsDetails.forEach((item) => {
        localityGoingFilterData.push(item.localityGoing);
      });
      return localityGoingFilterData;
    },
    carTypeFilter() {
      let carTypeData = ["All types"];
      this.requestsDetails.forEach((item) => {
        if (item.car) {
          carTypeData.push(item.car);
        }
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
    seeMapRoute(item) {
      this.showInformationalText = false;
      var map = document.getElementById("map");
      if (
        item &&
        item.startLatitude &&
        item.startLongitude &&
        item.finishLatitude &&
        item.finishLongitude
      ) {
        this.showRouteError = false;
        map.style.display = "unset";
        this.dialogCarOfferForm.map = new window.google.maps.Map(map, {
          center: {
            lat: +item.startLatitude,
            lng: +item.startLongitude,
          },
          zoom: 16,
        });
        // DIRECTIONS
        this.directions.service = new window.google.maps.DirectionsService();
        this.directions.display = new window.google.maps.DirectionsRenderer();
        this.directions.start = new window.google.maps.LatLng(
          item.startLatitude,
          item.startLongitude
        );
        this.directions.end = new window.google.maps.LatLng(
          item.finishLatitude,
          item.finishLongitude
        );
        this.directions.display.setMap(this.dialogCarOfferForm.map);

        // render directions
        if (this.directions.service) {
          const request = {
            origin: this.directions.start,
            destination: this.directions.end,
            travelMode: "DRIVING",
          };
          this.directions.service.route(request, (response, status) => {
            if (status === "OK") {
              this.directions.display.setDirections(response);
            } else {
              console.warn("Directions request failed due to " + status);
            }
          });
        }
      } else {
        this.showRouteError = true;
        map.style.display = "none";
      }
    },
    seeDetails(id, index, type) {
      this.dialogProfileDetails.showDialog = false;
      this.dialogRideDetails.showDialog = true;
      if (type === "found") {
        this.dialogRideDetails.selectedItem = this.dialogProfileDetails.myrides[
          index
        ];
      } else if (type === "offers") {
        this.dialogRideDetails.selectedItem = this.dialogProfileDetails.rides[
          index
        ];
      } else if (type === "offer") {
        this.dialogRideDetails.selectedItem = this.requestsDetails[index];
      }
    },
    userParticipate(ride) {
      return ride.participants
        ? ride.participants.includes(this.userDetails.username)
        : false;
    },
    apply(ride) {
      if (this.userDetails) {
        const newRides = this.userDetails.rides ? this.userDetails.rides : [];
        firebase
          .firestore()
          .collection("Users/")
          .doc(this.userDetails.username)
          .update({
            rides: [...newRides, ride.id],
          });
        const newParticipants = ride.participants ? ride.participants : [];
        firebase
          .firestore()
          .collection("Requests/")
          .doc(ride.id)
          .update({
            participants: [...newParticipants, this.userDetails.username],
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

    if (this.dialogProfileDetails.data.username !== "") {
      this.$store.dispatch("getUserDetails");
      this.getUserData();
    }

    this.$store.dispatch("getRequestsData");
  },
};
</script>
<style>
:root {
  --primary: #4b0082;
  --primary-low-opacity: #4b00820d;
  --background-light: #d3d3d336;
  --background-white: white;
}
@font-face {
  font-family: "dancingscript";
  src: url("../src/assets/font-files/dancingscript/dancingscript-variablefont_wght-webfont.woff2")
      format("woff2"),
    url("../src/assets/font-files/dancingscript/dancingscript-variablefont_wght-webfont.woff")
      format("woff");
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: "eliseregular";
  src: url("../src/assets/font-files/eliseregular/elsie-regular-webfont.woff2")
      format("woff2"),
    url("../src/assets/font-files/eliseregular/elsie-regular-webfont.woff")
      format("woff");
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: "robotoregular";
  src: url("../src/assets/font-files/robotoregular/roboto-regular-webfont.woff2")
      format("woff2"),
    url("../src/assets/font-files/robotoregular/roboto-regular-webfont.woff")
      format("woff");
  font-weight: normal;
  font-style: normal;
}
#map {
  height: 100%;
  width: 100%;
  display: none;
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
  background-color: var(--background-light);
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}
.container-wrapper .right-column {
  width: 60vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-white);
}
.container-wrapper .left-column .toolbar {
  display: flex;
  background: url("./assets/road.jpeg");
  background-size: cover;
  background-position: bottom;
  justify-content: space-between;
  flex-flow: row;
  height: 100%;
  padding: 10px 20px;
}
.container-wrapper .left-column .toolbar .title {
  font-weight: bold;
  font-size: 2.2rem !important;
  color: var(--primary);
  font-family: "dancingscript" !important;
}
.container-wrapper .left-column .filters {
  display: flex;
  flex-flow: wrap;
  padding-top: 15px;
  justify-content: center;
  background-color: var(--background-light);
}
.container-wrapper .left-column .filters .v-input {
  margin: 10px;
  max-width: 140px;
}
.v-btn__content {
  font-size: 0.8rem;
  text-transform: inherit;
}
.filter-image {
  width: 25px;
  height: 25px;
  margin-right: 5px;
}
.theme--light.v-text-field > .v-input__control > .v-input__slot:before {
  border-color: var(--primary) !important;
}
.mdi-menu-down::before {
  color: var(--primary) !important;
}
.information-text {
  margin: 0 20%;
  text-align: center;
  opacity: 0.3;
}
.error-route {
  margin: 0 20%;
  text-align: center;
  opacity: 0.3;
  color: red;
}
.theme--light.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background-color: var(--primary) !important;
  color: var(--background-white);
  text-transform: capitalize;
}
.v-btn--flat .v-btn__content {
  color: var(--primary);
}
.container-wrapper .left-column .results {
  display: flex;
  height: -webkit-fill-available;
  flex-flow: column;
  overflow-y: auto;
  max-height: 55vh;
}
.container-wrapper .left-column .results .result-item {
  background-color: var(--background-white);
  padding: 20px 25px;
}
.container-wrapper .left-column .results .result-item:hover {
  background-color: var(--primary-low-opacity);
  border-right: 5px solid var(--primary);
  border-left: 5px solid var(--primary);
  padding: 20px 20px;
}
.container-wrapper .left-column .results .result-item .result-info {
  display: flex;
  flex-flow: row;
}
.container-wrapper
  .left-column
  .results
  .result-item
  .result-info
  .result-image {
  width: 70px;
  height: 70px;
  align-self: center;
  text-align: center;
  margin-right: 15px;
}
.container-wrapper
  .left-column
  .results
  .result-item
  .result-info
  .result-image
  img {
  width: 100%;
  height: auto;
}
.bottom-part {
  height: 100%;
}
.container-wrapper
  .left-column
  .results
  .result-item
  .result-info
  .result-text-info {
  display: flex;
  flex-flow: column;
}
.bold-value {
  font-weight: bold;
  font-family: "robotoregular";
  color: var(--primary);
}
.container-wrapper .left-column .results .result-item .result-item-action {
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;
}
.postButton {
  margin-left: 50px;
  margin-bottom: 30px;
}
.successAlert {
  margin-left: 30px;
  margin-right: 30px;
}
</style>
