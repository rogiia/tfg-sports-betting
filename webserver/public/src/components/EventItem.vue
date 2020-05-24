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
            <v-btn class="float-right" @click="placeBet('L')">{{odds.local}}</v-btn>
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
            <v-btn class="float-right" @click="placeBet('V')">{{odds.visitor}}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <bet-modal v-if="dialogOpen"
      :event="event"
      :bet="bet"
      :open="dialogOpen"
      @close="dialogOpen = false"
    ></bet-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BetModal from './BetModal.vue';
import {
  subscribeEventResult
} from '../services/live-result-service';
import {
  getEventOdds
} from '../services/odds-service';
import {
  IBet
} from '../services/bet-service';

const getDefaultResult = (): number | null => {
  return null;
};
const INITIAL_BET: Partial<IBet> = {};
let unsubscribe: Function;

export default Vue.extend({
  components: {
    'bet-modal': BetModal,
  },
  props: ['event'],
  data() {
    return {
      dialogOpen: false,
      bet: INITIAL_BET,
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
  },
  methods: {
    placeBet(team: 'L' | 'V') {
      if (this.$store.getters['isAuthenticated']) {
        const stake = team === 'L' && this.odds.local !== null ? this.odds.local :
          team === 'V' && this.odds.visitor !== null ? this.odds.visitor : undefined;
        this.bet = {
          eventId: this.event.eventId,
          userId: this.$store.getters['getAccessToken'],
          result: team,
          stake
        };
        this.dialogOpen = !this.dialogOpen;
      } else {
        alert('Primer has d`iniciar sessió!');
      }
    }
  }
});
</script>