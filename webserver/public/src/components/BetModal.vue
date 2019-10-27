<template>
  <div>
    <v-dialog
      v-model="open"
      @click:outside="cancel()"
      width="500"
    >
      <v-card>
        <v-card-title class="headline">Col·loca una aposta</v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
                <h3 class="selectedBet">F.C. BARCELONA</h3>
              </v-col>
              <v-col cols="6">
                <h3>VILLARREAL</h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <p>Fes la teva aposta</p>
              </v-col>
              <v-col cols="6">
                <strong class="float-right" id="betAmount">{{betAmount}}€</strong>
              </v-col>
            </v-row>
            <v-slider
              v-model="betAmount"
              :step="0.5"
              :max="50"
              :min="0.5"
            ></v-slider>
            <p>Pots guanyar un premi de</p>
            <strong id="winningsAmount">{{winningsAmount}}€</strong>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn
            text
            @click="cancel()"
          >
            CANCELAR
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="placeBet()"
          >
            COL·LOCAR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: ['open'],
  data: () => {
    return {
      betAmount: 1,
    };
  },
  computed: {
    winningsAmount() {
      return (this.betAmount * 1.21).toFixed(2);
    },
  },
  methods: {
    placeBet() {
      this.$emit('close');
    },
    cancel() {
      this.$emit('close');
    },
  },
});
</script>

<style scoped>
  h3 {
    text-align: center;
  }
  h3.selectedBet {
    color: white;
    font-size: 1.5em;
    font-weight: 500;
  }
  #betAmount {
    font-size: 1.5em;
    font-weight: 500;
  }
  #winningsAmount {
    display: block;
    width: 100%;
    font-size: 2.5em;
    font-weight: 500;
    color: white;
    text-align: center;
  }
</style>
