<template>
  <div>
    <v-card class="mx-auto">
      <v-container fluid>
        <v-row>
          <v-col cols="6">
            <v-icon>mdi-tshirt-crew-outline</v-icon>&nbsp;
            {{event.localTeam}}
          </v-col>
          <v-col cols="3">
            {{result.local}}
          </v-col>
          <v-col cols="3" v-if="odds.local">
            <v-btn class="float-right" @click="toggleDialog()">{{odds.local}}</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-icon>mdi-tshirt-crew-outline</v-icon>&nbsp;
            {{event.visitorTeam}}
          </v-col>
          <v-col cols="3">
            {{result.visitor}}
          </v-col>
          <v-col cols="3" v-if="odds.visitor">
            <v-btn class="float-right">{{odds.visitor}}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  subscribeEventResult
} from '../services/live-result-service';
import {
  getEventOdds
} from '../services/odds-service';

const getDefaultResult = (): number | null => {
  return null;
};
let unsubscribe: Function;

export default Vue.extend({
  props: ['event'],
  data() {
    return {
      result: {
        local: getDefaultResult(),
        visitor: getDefaultResult()
      },
      odds: {
        local: getDefaultResult(),
        visitor: getDefaultResult(),
        draw: getDefaultResult(),
      },
    };
  },
  created() {
    unsubscribe = subscribeEventResult(this.event.eventId, async(result) => {
      this.result.local = result.localTeamResult;
      this.result.visitor = result.visitorTeamResult;

      const odds = await getEventOdds(this.event.sport, this.event.localTeam, result.localTeamResult, this.event.visitorTeam, result.visitorTeamResult);
      if (odds) {
        this.odds.local = odds.localOdds;
        this.odds.draw = odds.drawOdds;
        this.odds.visitor = odds.visitorOdds;
      }
    });
  },
  destroyed() {
    unsubscribe();
  }
});
</script>