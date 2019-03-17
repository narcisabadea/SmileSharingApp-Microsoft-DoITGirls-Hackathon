<template>
  <v-container>
    <v-layout align-center justify-space-around row fill-height>
      <v-flex xs8>
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
      <v-flex xs8>
        <v-card>
          <v-card-title>Scheduled</v-card-title>
          <v-card-text>
            <v-list three-line id="culoare">
              <v-list-tile v-for="(item, index) in rides" :key="index">
                <v-list-tile-content>
                  <v-list-tile-title>
                    <span style="opacity: 0.3;color:grey">From</span>
                    {{item.localityLeave}}
                    <span
                      style="opacity: 0.3;color:grey"
                    >({{item.hourLeave}}:{{item.minLeave}}) to</span>
                    {{item.localityGoing}}
                  </v-list-tile-title>
                  <v-list-tile-sub-title class="text-truncate">Price: {{item.price}}RON</v-list-tile-sub-title>
                  <v-btn depressed small @click="seeDetails(item.id, index)">See details</v-btn>
                  <v-divider></v-divider>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout align-center justify-space-around row fill-height>
      <v-flex xs8>
        <v-card>
          <v-card-title>My rides</v-card-title>
          <v-card-text>
            <v-list three-line id="culoare">
              <v-list-tile v-for="(item, index) in myrides" :key="index">
                <v-list-tile-content>
                  <v-list-tile-title>
                    <span style="opacity: 0.3;color:grey">From</span>
                    {{item.localityLeave}}
                    <span
                      style="opacity: 0.3;color:grey"
                    >({{item.hourLeave}}:{{item.minLeave}}) to</span>
                    {{item.localityGoing}}
                  </v-list-tile-title>
                  <v-list-tile-sub-title class="text-truncate">Price: {{item.price}}RON</v-list-tile-sub-title>
                  <v-btn depressed small @click="seeDetails(item.id, index)">See details</v-btn>
                  <v-divider></v-divider>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
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
      myrides: null
    };
  },
  created() {
    this.data = JSON.parse(localStorage.getItem("details"));
    let rides1 = [];
    this.data.rides.forEach(item => {
      console.log(item)
      firebase.firestore().collection('Requests').doc(item).get()
        .then(obj => {
          console.log(obj)
          console.log(obj.data())
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
            })
          })
        })
        this.rides = rides1
        let rides2 = []
    this.data.myrides.forEach(item => {
      console.log(item)
      firebase.firestore().collection('Requests').doc(item).get()
        .then(obj => {
          console.log(obj)
          console.log(obj.data())
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
            })
          })
        })
        this.myrides = rides2
  }
}
</script>
