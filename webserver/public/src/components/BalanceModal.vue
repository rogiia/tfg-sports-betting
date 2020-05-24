<template>
  <div>
    <v-dialog
      v-model="open"
      width="500"
      @click:outside="close()"
    >
      <v-card>
        <v-card-title class="headline">Balanç</v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" v-if="$store.getters['balance'] !== null">
                <h1 class="text-center">{{$store.getters['balance'].toFixed(2)}}€</h1>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text>
          <v-container>
            <v-text-field
              label="Afegeix balanç"
              suffix="€"
              v-model.number="newBalance"
            >
            </v-text-field>
            <v-btn
              color="success"
              block
              @click="addBalance(newBalance)"
            >
              AFEGIR
            </v-btn>   
          </v-container>
        </v-card-text>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn
            text
            @click="close()"
          >
            TANCAR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  addBalance
} from '../services/balance-service';

export default Vue.extend({
  props: ['open'],
  created() {
    if (this.$store.getters['balance'] === null) {
      this.close();
    }
  },
  data: () => {
    return {
      newBalance: 0,
    };
  },
  methods: {
    async addBalance(balance: number) {
      if (this.$store.getters['isAuthenticated']) {
        const newBalance = await addBalance(this.$store.getters['getAccessToken'], balance);
        this.$store.commit('setBalance', newBalance);
        this.close();
      } else {
        this.close();
      }
    },
    close() {
      this.$emit('close');
    },
  },
});
</script>

<style scoped>
  h1 {
    color: white;
    font-weight: 500;
  }
</style>
