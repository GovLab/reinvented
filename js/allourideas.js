////////////////////////////////////////
// reload page after Forward and back
///////////////////////////////////////

const TYPE_BACK_FORWARD = 2;

function isReloadedPage() {
  return performance.navigation.type === TYPE_BACK_FORWARD;
}

function main() {
  if (isReloadedPage()) {
    window.location.reload();
  }
}
main();

////////////////////////////////////////////////////////////
///// OFFLINE MODE DETECTION
////////////////////////////////////////////////////////////

// Force offline mode - always use local data
window.OFFLINE_MODE = true;
console.log('Offline mode: true (forced)');

// Get data path from global variable or default to 'data/'
function getDataPath() {
  return window.DATA_PATH || 'data/';
}

// Get asset path prefix for subfolders
function getAssetPath() {
  return window.ASSET_PATH || '';
}

////////////////////////////////////////////////////////////
///// TEAM  API REQUEST ` `
////////////////////////////////////////////////////////////


Vue.use(VueMeta);

new Vue({
    
  el: '#home-page',

  data () {
  
    return {
      alertData:[],
      phaseData:[],
      statesData:[],
      aoiData: [],
      aoi_toolData: [],
      other_race: 0,
      other_gender: 0,
      other_school: 0,
      showMessage: true,
      index_active:0,
      active_aoi:0,
      apiURL: 'https://directus.thegovlab.com/your-education-your-voice',
    }
  },

  created: function created() {
    // Load data asynchronously
    this.loadAllData();
  },


  methods: {
    async loadAllData() {
      try {
        await Promise.all([
          this.fetchPhase(),
          this.fetchAlerts(),
          this.fetchAOI(),
          this.fetchStates(),
          this.fetchAOI_tools()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    },
    async fetchPhase() {
      const self = this;
      if (window.OFFLINE_MODE) {
        try {
          console.log('Loading phase data from local JSON...');
          const res = await fetch(getDataPath() + 'phases.json');
          const data = await res.json();
          self.phaseData = data.data || data;
          console.log('Phase data loaded:', self.phaseData);
        } catch (e) { console.error('Offline phase load failed', e); }
        return;
      }
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "your-education-your-voice",
        storage: window.localStorage
      });

      client.getItems(
        'phases',
        { fields: ['*.*','phase_top_banner.alert_junction_id.*','phase_faq.faq_id.*'] }
      ).then(data => {
        self.phaseData = data.data;
      })
      .catch(error => console.error(error));
    },

    async fetchAlerts() {
      const self = this;
      if (window.OFFLINE_MODE) {
        try {
          console.log('Loading alert data from local JSON...');
          const res = await fetch(getDataPath() + 'alert_banner.json');
          const data = await res.json();
          self.alertData = data.data || data;
          console.log('Alert data loaded:', self.alertData);
        } catch (e) { console.error('Offline alert load failed', e); }
        return;
      }
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "your-education-your-voice",
        storage: window.localStorage
      });

      client.getItems(
        'alert_banner',
        { fields: ['*.*'] }
      ).then(data => {
        self.alertData = data.data;
        console.log(self.alertData);
      })
      .catch(error => console.error(error));
    },

    async fetchStates() {
      const self = this;
      if (window.OFFLINE_MODE) {
        try {
          console.log('Loading states data from local JSON...');
          const res = await fetch(getDataPath() + 'states.json');
          const data = await res.json();
          self.statesData = data.data || data;
          console.log('States data loaded:', self.statesData);
        } catch (e) { console.error('Offline states load failed', e); }
        return;
      }
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "your-education-your-voice",
        storage: window.localStorage
      });

      client.getItems(
        'states',
        { fields: ['*.*'] }
      ).then(data => {
        self.statesData = data.data;
        console.log(self.statesData);
      })
      .catch(error => console.error(error));
    },

    async fetchAOI() {
      const self = this;
      if (window.OFFLINE_MODE) {
        try {
          console.log('Loading AOI data from local JSON...');
          const res = await fetch(getDataPath() + 'allourideas.json');
          const data = await res.json();
          self.aoiData = data.data || data;
          console.log('AOI data loaded:', self.aoiData);
        } catch (e) { console.error('Offline AOI load failed', e); }
        return;
      }
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "your-education-your-voice",
        storage: window.localStorage
      });

      client.getItems(
        'allourideas',
        { fields: ['*.*','challenge_items.aoi_list_id.*'] }
      ).then(data => {
        self.aoiData = data.data;
        console.log(self.aoiData);
      })
      .catch(error => console.error(error));
    },

    async fetchAOI_tools() {
      const self = this;
      if (window.OFFLINE_MODE) {
        try {
          console.log('Loading AOI tools data from local JSON...');
          const res = await fetch(getDataPath() + 'aoi_tool.json');
          const data = await res.json();
          self.aoi_toolData = data.data || data;
          console.log('AOI tools data loaded:', self.aoi_toolData);
        } catch (e) { console.error('Offline AOI tools load failed', e); }
        return;
      }
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "your-education-your-voice",
        storage: window.localStorage
      });

      client.getItems(
        'aoi_tool',
        { fields: ['*.*'] }
      ).then(data => {
        self.aoi_toolData = data.data;
      })
      .catch(error => console.error(error));
    },
    toggleMessage (index) {
      this.index_active = index;
    	this.showMessage = !this.showMessage;
    },
    toggleAOI (index) {
      this.active_aoi= index;
      window.location.href = "#framing-section";
    },
    other_race_option(){
      race_other_active = document.getElementById('race9').checked;
      if(race_other_active)
      this.other_race = 1;
      else
      this.other_race = 0;

    },
    other_gender_option(){
      gender_other_active = document.getElementById('gender_other').checked;
      if(gender_other_active)
      this.other_gender = 1;
      else
      this.other_gender = 0;

    },
    other_school_option(){
      school_other_active = document.getElementById('school_other').checked;
      if(school_other_active)
      this.other_school = 1;
      else
      this.other_school = 0;

    }
   
   
}
});



