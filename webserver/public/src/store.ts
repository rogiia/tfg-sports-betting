import Vue from 'vue';
import Vuex from 'vuex';
import {
  CONFIG
} from './config/config';
import {
  getUserBalance
} from './services/balance-service';

Vue.use(Vuex);

interface IState {
  accessToken: string | null;
  userInfo?: {
    balance: number | null
  };
};

const INITIAL_STATE: IState = {
  accessToken: null
};
const appData = sessionStorage.getItem('appData');
const store = new Vuex.Store({
  state: appData ? JSON.parse(appData) : INITIAL_STATE,
  getters: {
    getAccessToken(state: IState) {
      return state.accessToken;
    },
    isAuthenticated(state: IState) {
      return !!state.accessToken;
    },
    balance(state: IState) {
      return state.userInfo ? state.userInfo.balance : null;
    }
  },
  mutations: {
    setAccessToken(state: IState, accessToken: string | null) {
      state.accessToken = accessToken;
    },
    setBalance(state: IState, balance: number | null) {
      if (state.userInfo) {
        state.userInfo.balance = balance;
      } else {
        state.userInfo = {
          balance
        };
      }
    }
  },
  actions: {
    doAuthentication() {
      window.location.replace(`https://tfg-sports-betting.auth.eu-west-1.amazoncognito.com/login?response_type=code&client_id=${CONFIG.cognitoClientId}&redirect_uri=${CONFIG.redirectUri}`);
    },
    async populateToken({ commit, dispatch }, code: string) {
      var body = new URLSearchParams();
      body.append('grant_type', 'authorization_code');
      body.append('client_id', CONFIG.cognitoClientId);
      body.append('code', code);
      body.append('redirect_uri', CONFIG.redirectUri);
      const response = await fetch(`https://tfg-sports-betting.auth.eu-west-1.amazoncognito.com/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${CONFIG.apiKey}`
        },
        body
      });
      if (response.status === 200) {
        const result = await response.json();
        if (result && result['access_token']) {
          commit('setAccessToken', result['access_token']);
          dispatch('fetchBalance');
        }
      }
    },
    doLogout({ commit }) {
      commit('setAccessToken', null);
    },
    async fetchBalance({ commit }) {
      if (this.state.accessToken) {
        const balance = await getUserBalance(this.state.accessToken);
        commit('setBalance', balance);
      }
    }
  },
});

store.subscribe((payload, state) => {
  sessionStorage.setItem('appData', JSON.stringify(state));
});

export default store;
