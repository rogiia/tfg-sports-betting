<template>
  <div id="home">
    <v-tabs
      fixed-tabs
      v-model="selectedTab"
      @change="onChangeSelectedTab"
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
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
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
      'event-item': EventItem,
    },
    async created() {
      this.events[INITAL_SPORT] = await getEventsBySport(this.sportsTabs[INITAL_SPORT].name);
    },
    data: () => {
      return {
        selectedTab: 'tab-futbol',
        sportsTabs,
        events: {
          futbol: newEmptyEventsList(),
          basquet: newEmptyEventsList(),
          hoquei: newEmptyEventsList(),
        },
      };
    },
    methods: {
      async onChangeSelectedTab(newTab: "futbol" | "basquet" | "hoquei") {
        const result = newTab.match(/^tab-(\w+)$/);
        if (result && result.length === 2) {
          this.events[result[1]] = await getEventsBySport(this.sportsTabs[result[1]].name);
        }
      }
    }
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