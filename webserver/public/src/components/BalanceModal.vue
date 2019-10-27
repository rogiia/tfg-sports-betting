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
              <v-col cols="12">
                <h1 class="text-center">1500.00€</h1>
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
              v-model="newBalance"
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

export default Vue.extend({
  props: ['open'],
  data: () => {
    return {
      newBalance: 0,
    };
  },
  methods: {
    addBalance(balance: number) {
      console.log(balance);
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
