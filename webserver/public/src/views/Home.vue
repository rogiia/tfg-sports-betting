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
          <div v-if="events[sport].length === 0">
            No hi ha esdeveniments disponibles ara mateix
          </div>
          <event-item class="tfg-event-card"
            v-for="event in events[sport]" :key="event.eventId"
            :event="event" />
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
  import EventItem from '../components/EventItem.vue';
  import {
    getEventsBySport,
    IEvent,
  } from '../services/event-service';
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
  const INITAL_SPORT = 'futbol';

  const newEmptyEventsList = (): IEvent[] => {
    return [];
  };

  export default Vue.extend({
    components: {
      'bet-modal': BetModal,
      'event-item': EventItem,
    },
    async created() {
      this.events[INITAL_SPORT] = await getEventsBySport(this.sportsTabs[INITAL_SPORT].name);
    },
    data: () => {
      return {
        selectedTab: 'futbol',
        sportsTabs,
        dialogOpen: false,
        events: {
          futbol: newEmptyEventsList(),
          basquet: newEmptyEventsList(),
          hoquei: newEmptyEventsList(),
        },
      };
    },
    watch: {
      async selectedTab(newTab: "futbol" | "basquet" | "hoquei") {
        this.events[newTab] = await getEventsBySport(this.sportsTabs[newTab].name);
      }
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