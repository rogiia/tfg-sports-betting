<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense>
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-soccer</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Esdeveniments esportius</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/my-bets" v-if="$store.getters['isAuthenticated']">
          <v-list-item-action>
            <v-icon>mdi-ticket</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Les meves apostes</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title id="app-title">
        <router-link to="/">Apostes esportives</router-link> 
      </v-toolbar-title>
      <div class="flex-grow-1"></div>

      <v-btn @click="signin()"
        v-if="!$store.getters['isAuthenticated']"
        color="primary">
        ENTRAR
      </v-btn>

      <div id="balance" v-if="$store.getters['isAuthenticated'] && $store.getters['balance'] !== null" @click="balanceModal = true">
        <v-icon>mdi-coin</v-icon>
        {{$store.getters['balance'].toFixed(2)}}€
      </div>
      <div id="account" v-if="$store.getters['isAuthenticated']">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn
              text
              v-on="on"
            >
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="logout()">
              <v-list-item-title>Sortir</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <router-view></router-view>
      </v-container>
    </v-content>
    <balance-modal
      :open="balanceModal"
      @close="balanceModal = false"
    >
    </balance-modal>
  </v-app>
</template>

<script>
  import BalanceModal from './components/BalanceModal.vue';
  export default {
    components: {
      'balance-modal': BalanceModal,
    },
    props: {
      source: String,
    },
    data: () => ({
      drawer: null,
      balanceModal: false,
    }),
    created() {
      this.$vuetify.theme.dark = true;
      if (this.$store.getters['isAuthenticated']) {
        this.$store.dispatch('fetchBalance');
      }
    },
    methods: {
      signin() {
        this.$store.dispatch('doAuthentication');
      },
      logout() {
        this.$store.dispatch('doLogout');
      }
    },
  };
</script>

<style scoped>
#app-title a {
  color: white;
  text-decoration: none;
}
#balance {
  font-weight: 500;
  margin-right: 1em;
  cursor: pointer;
}
#account {
  font-weight: 500;
}
</style>