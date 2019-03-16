<template>
<v-container>
  <!-- <v-layout>
        <v-flex xs12>
          <v-card-text>
            <v-list three-line id="culoare">
              <template v-for="(item, index) in dataFilter">
                <v-list-tile
                  :key="index"
                  avatar>
                  <v-list-tile-avatar>
                    <img v-if="selectSearch === 'university'" :src="item.logoUniversity">
                    <img v-if ="selectSearch === 'faculty'" :src="item.logoFaculty">
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <router-link v-if="selectSearch === 'university'" :to="{ name: 'Universitypage', params: { id: item.id }}" tag="li" style="cursor:pointer">
                      <v-list-tile-title v-if="selectSearch === 'university'">{{item.nameUniversity}} <span style="opacity: 0.3;color:grey">- {{item.locationUniversity[0]}} </span></v-list-tile-title> -->
                      <!-- <v-list-tile-sub-title>
                        <v-icon v-for="(item, index1) in roundgreen(item.ratingUniversity)" :key="index1" color="indigo darken-1">
                          star
                          </v-icon>
                          <v-icon v-for="(item, index2) in roundred(item.ratingUniversity)" :key="5 - index2" color="indigo darken-1">
                          star_border
                          </v-icon>
                          {{item.ratingUniversity}}
                        </v-list-tile-sub-title> -->
                      <!-- <v-list-tile-sub-title v-if="selectSearch === 'university'" class="text-truncate">{{item.descriptionUniversity}}...</v-list-tile-sub-title>
                      <v-list-tile-sub-title v-if ="selectSearch === 'faculty'" class="text-truncate">{{item.descriptionFaculty}}...</v-list-tile-sub-title>
                      <v-divider></v-divider>
                    </router-link>
                      <router-link v-if="selectSearch === 'faculty'" :to="{ name: 'Universitypage', params: { id: item.universityId }}" tag="li" style="cursor:pointer">
                      <v-list-tile-title v-if ="selectSearch === 'faculty'" >{{item.nameFaculty}} <span style="opacity: 0.3;color:grey">- {{item.locationFaculty[0]}} </span></v-list-tile-title>
                      <v-list-tile-sub-title v-if ="selectSearch === 'faculty'" class="text-truncate">{{item.descriptionFaculty}}...</v-list-tile-sub-title>
                      <v-divider></v-divider>
                    </router-link>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
          </v-card-text>
        </v-flex>
      </v-layout> -->
</v-container>
</template>

<script>

export default {
  name: 'CarOffer',
  data () {
    return {
      //
    }
  }
}
</script>
