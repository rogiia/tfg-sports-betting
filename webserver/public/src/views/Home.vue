<template>
  <div id="home">
    <v-tabs
      fixed-tabs
      dark>
      <v-tab
        v-for="sport in Object.keys(sportsTabs)"
        :key="sport"
        :href="'#tab-' + sport">
        <v-icon>mdi-{{sportsTabs[sport].icon}}</v-icon>&nbsp;
        {{sportsTabs[sport].name}}
      </v-tab>
      <v-tab-item
        v-for="sport in Object.keys(sportsTabs)"
        :key="sport"
        :value="'tab-' + sport">
        <v-container fluid>
          <v-card class="mx-auto tfg-event-card">
            <v-container fluid>
              <v-row>
                <v-col cols="6">
                  <v-icon>mdi-tshirt-crew-outline</v-icon>&nbsp;
                  F.C. BARCELONA
                </v-col>
                <v-col cols="3">
                  2
                </v-col>
                <v-col cols="3">
                  <v-btn class="float-right" @click="toggleDialog()">1.30</v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-icon>mdi-tshirt-crew-outline</v-icon>&nbsp;
                  VILLAREAL
                </v-col>
                <v-col cols="3">
                  1
                </v-col>
                <v-col cols="3">
                  <v-btn class="float-right">3.10</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
          <v-card class="mx-auto tfg-event-card">
            <v-container fluid>
              <v-row>
                <v-col cols="6">
                  <v-icon>mdi-tshirt-crew-outline</v-icon>&nbsp;
                  F.C. BARCELONA
                </v-col>
                <v-col cols="3">
                  2
                </v-col>
                <v-col cols="3">
                  <v-btn class="float-right">1.30</v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-icon>mdi-tshirt-crew-outline</v-icon>&nbsp;
                  VILLAREAL
                </v-col>
                <v-col cols="3">
                  1
                </v-col>
                <v-col cols="3">
                  <v-btn class="float-right">3.10</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-container>
      </v-tab-item>
    </v-tabs>
    <bet-modal
      :open="dialogOpen"
      @close="dialogOpen = false"
    ></bet-modal>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import BetModal from '../components/BetModal.vue';
  const sportsTabs = {
    futbol: {
      name: 'Futbol',
      icon: 'soccer',
    },
    basquet: {
      name: 'Basquetbol',
      icon: 'basketball',
    },
    hoquei: {
      name: 'Hoquei',
      icon: 'hockey-sticks',
    },
  };
  export default Vue.extend({
    components: {
      'bet-modal': BetModal,
    },
    data: () => {
      return {
        selectedTab: 'futbol',
        sportsTabs,
        dialogOpen: false,
      };
    },
    methods: {
      toggleDialog() {
        this.dialogOpen = !this.dialogOpen;
      },
    },
  });
</script>

<style scoped>
#home {
  width: 100%;
  height: 100%;
}
.tfg-event-card {
  font-weight: 500;
  margin-bottom: 8px;
  background-color: #636363;
}
.tfg-event-card .row:nth-child(1) .col {
  padding-bottom: 4px;
}
.tfg-event-card .row:nth-child(2) .col {
  padding-top: 0;
  padding-bottom: 4px;
}
</style>