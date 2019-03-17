<template>
  <v-container>
    <v-layout align-center justify-space-around row fill-height>
      <v-flex xs12>
        <v-card>
          <v-card-title>Account details</v-card-title>
          <v-card-text>
            <v-text-field
              prepend-icon="account_circle"
              name="nume"
              v-model="data.name"
              label="Name"
              id="nume"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-text-field
              prepend-icon="account_circle"
              name="prenume"
              label="Surname"
              v-model="data.surname"
              id="prenume"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-text-field
              prepend-icon="account_circle"
              name="phone"
              v-model="data.phone"
              label="Phone no."
              id="phone"
            ></v-text-field>
            <v-text-field
              prepend-icon="account_circle"
              name="email"
              v-model="data.email"
              label="Email adress"
              id="email"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout align-center justify-space-around row fill-height>
      <v-flex xs12>
        <v-card>
          <v-card-title>Scheduled rides found</v-card-title>
          <v-card-text>
            <v-list three-line id="culoare">
              <v-list-tile v-for="(item, index) in rides" :key="index">
                <v-list-tile-content>
                  <v-list-tile-title>From
                    <span style="color: #0B7A75">{{item.localityLeave}}</span>
                    ({{item.hourLeave}}:{{item.minLeave}}) to
                    <span style="color: #0B7A75">{{item.localityGoing}}</span>
                  </v-list-tile-title>
                  <v-list-tile-sub-title class="text-truncate">Price: {{item.price}}RON</v-list-tile-sub-title>
                  <v-btn
                    depressed
                    small
                    @click="seeDetails(item.id, index, 'found')"
                    style="background: #E9C46A"
                  >See details</v-btn>
                  <v-divider></v-divider>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout align-center justify-space-around row fill-height>
      <v-flex xs12>
        <v-card>
          <v-card-title>Scheduled rides offer</v-card-title>
          <v-card-text>
            <v-list three-line id="culoare">
              <v-list-tile v-for="(item, index) in myrides" :key="index">
                <v-list-tile-content>
                  <v-list-tile-title>From
                    <span style="color: #0B7A75">{{item.localityLeave}}</span>
                    ({{item.hourLeave}}:{{item.minLeave}}) to
                    <span style="color: #0B7A75">{{item.localityGoing}}</span>
                  </v-list-tile-title>
                  <v-list-tile-sub-title class="text-truncate">Price: {{item.price}}RON</v-list-tile-sub-title>
                  <v-btn
                    depressed
                    small
                    @click="seeDetails(item.id, index, 'offers')"
                    style="background: #E9C46A"
                  >See details</v-btn>
                  <v-divider></v-divider>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
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
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from "@/firebase";
export default {
  name: "Profile",
  data() {
    return {
      data: null,
      myrides: null,
      rides: null,
      myrides: null,
      dialog: false,
      selectedItem: {}
    };
  },
  methods: {
    seeDetails(id, index, type) {
      this.dialog = true;
      if (type === "found") {
        this.selectedItem = this.rides[index];
      } else if (type === "offers") {
        this.selectedItem = this.myrides[index];
      }
    }
  },
  created() {
    this.data = JSON.parse(localStorage.getItem("details"));

  firebase.firestore().collection('Users').doc(this.data.username).get()
      .then(snapshot => {
        let details = {
          name: snapshot.data().name,
          surname: snapshot.data().surname,
          email: snapshot.data().email,
          phone: snapshot.data().phone,
          type: snapshot.data().type,
          username: snapshot.id,
          password: snapshot.data().password,
          rides: snapshot.data().rides,
          myrides: snapshot.data().myrides
        }
          localStorage.setItem('details', JSON.stringify(details))
          this.data = JSON.parse(localStorage.getItem('details'))
      })


    let rides1 = [];
    this.data.rides.forEach(item => {
      console.log(item);
      firebase
        .firestore()
        .collection("Requests")
        .doc(item)
        .get()
        .then(obj => {
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
            price: obj.data().price
          });
        });
    });
    this.rides = rides1;
    let rides2 = [];
    this.data.myrides.forEach(item => {
      firebase
        .firestore()
        .collection("Requests")
        .doc(item)
        .get()
        .then(obj => {
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
            price: obj.data().price
          });
        });
    });
    this.myrides = rides2;
  }
};
</script>
