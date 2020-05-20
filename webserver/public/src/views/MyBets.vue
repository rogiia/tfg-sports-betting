<template>
  <div id="mybets">
    <v-container>
      <div v-if="myBets.length === 0">
        No s'ha fet cap aposta
      </div>
      <v-list v-if="myBets.length > 0">
        <v-list-item v-for="(myBet, index) in myBets" :key="index">
          <v-list-item-icon>
            <v-icon>{{myBet.bet.winner === null ? 'mdi-clock' : myBet.bet.winner ? 'mdi-check-circle' : 'mdi-close-circle'}}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-row>
              <v-col cols="4">
                <v-list-item-title v-text="myBet.bet.result === 'L' ? myBet.event.localTeam : myBet.event.visitorTeam"></v-list-item-title>
                <v-list-item-subtitle v-text="`${myBet.event.localTeam} vs ${myBet.event.visitorTeam}`"></v-list-item-subtitle>
              </v-col>
              <v-col cols="4" class="text-center">
                <v-list-item-title v-text="`${myBet.bet.amount.toFixed(2)}€`"></v-list-item-title>
                <v-list-item-subtitle v-text="'Quantitat apostada'"></v-list-item-subtitle>
              </v-col>
              <v-col cols="4" class='text-center'>
                <v-list-item-title v-text="`${myBet.bet.amount * myBet.bet.stake}€`"></v-list-item-title>
                <v-list-item-subtitle v-text="'Premi'"></v-list-item-subtitle>
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import {
  IBet,
  getUserBets
} from '../services/bet-service';
import { IEvent } from '../../../../event-service/src/persistence/models/event.model';
import { getEventDetails } from '../services/event-service';

const initializeMyBets = (): { bet: IBet; event: IEvent }[] => {
  return [];
};

export default Vue.extend({
  data() {
    return {
      myBets: initializeMyBets()
    }
  },
  async created() {
    if (!this.$store.getters['isAuthenticated']) {
      this.$router.push('/');
      return;
    }
    this.myBets = await this.populateEvents(
      await getUserBets(this.$store.getters['getAccessToken'])
    );
  },
  methods: {
    async populateEvents(betList: IBet[]): Promise<{ bet: IBet; event: IEvent }[]> {
      const result = [];
      for (let betIdx = 0; betIdx < betList.length; betIdx++) {
        const bet = betList[betIdx];
        const event = await getEventDetails(bet.eventId);
        if (event) {
          result.push({ bet, event });
        }
      }
      return result;
    }
  }
});
</script>

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