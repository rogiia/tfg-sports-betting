<template>
  <div id="mybets">
    <v-container>
      <v-list>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-clock</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-row>
              <v-col cols="4">
                <v-list-item-title v-text="'F.C. BARCELONA'"></v-list-item-title>
                <v-list-item-subtitle v-text="'F.C. Barcelona vs Villareal'"></v-list-item-subtitle>
              </v-col>
              <v-col cols="4" class="text-center">
                <v-list-item-title v-text="'5.00€'"></v-list-item-title>
                <v-list-item-subtitle v-text="'Quantitat apostada'"></v-list-item-subtitle>
              </v-col>
              <v-col cols="4" class='text-center'>
                <v-list-item-title v-text="'6.00€'"></v-list-item-title>
                <v-list-item-subtitle v-text="'Premi'"></v-list-item-subtitle>
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="winner-bet">
          <v-list-item-icon>
            <v-icon>mdi-check-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-row>
              <v-col cols="4">
                <v-list-item-title v-text="'F.C. BARCELONA'"></v-list-item-title>
                <v-list-item-subtitle v-text="'F.C. Barcelona vs Villareal'"></v-list-item-subtitle>
              </v-col>
              <v-col cols="4" class="text-center">
                <v-list-item-title v-text="'5.00€'"></v-list-item-title>
                <v-list-item-subtitle v-text="'Quantitat apostada'"></v-list-item-subtitle>
              </v-col>
              <v-col cols="4" class='text-center'>
                <v-list-item-title v-text="'6.00€'"></v-list-item-title>
                <v-list-item-subtitle v-text="'Premi'"></v-list-item-subtitle>
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="loser-bet">
          <v-list-item-icon>
            <v-icon>mdi-close-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-row>
              <v-col cols="4">
                <v-list-item-title v-text="'F.C. BARCELONA'"></v-list-item-title>
                <v-list-item-subtitle v-text="'F.C. Barcelona vs Villareal'"></v-list-item-subtitle>
              </v-col>
              <v-col cols="4" class="text-center">
                <v-list-item-title v-text="'5.00€'"></v-list-item-title>
                <v-list-item-subtitle v-text="'Quantitat apostada'"></v-list-item-subtitle>
              </v-col>
              <v-col cols="4" class='text-center'>
                <v-list-item-title v-text="'6.00€'"></v-list-item-title>
                <v-list-item-subtitle v-text="'Premi'"></v-list-item-subtitle>
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
  </div>
</template>

<style scoped>
#mybets {
  width: 100%;
  height: 100%;
  font-weight: 500;
}
.winner-bet * {
  color: greenyellow;
}
.loser-bet * {
  color: red;
}
.v-list-item__icon {
  height: 80px;
  margin-top: 0;
  margin-bottom: 0;
}
</style>