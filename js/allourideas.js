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
    this.fetchPhase();
    this.fetchAlerts();
    this.fetchAOI();
    this.fetchStates();
    this.fetchAOI_tools();
  },


  methods: {

    fetchPhase() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "your-education-your-voice",
        storage: window.localStorage
      });

      client.getItems(
  'phases',
  {
    fields: ['*.*','phase_top_banner.alert_junction_id.*','phase_faq.faq_id.*']
  }
).then(data => {

  self.phaseData = data.data;
})

.catch(error => console.error(error));
    },

    fetchAlerts() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "your-education-your-voice",
        storage: window.localStorage
      });

      client.getItems(
  'alert_banner',
  {
    fields: ['*.*']
  }
).then(data => {
  self.alertData = data.data;
  console.log(self.alertData);
})

.catch(error => console.error(error));
    },

    fetchStates() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "your-education-your-voice",
        storage: window.localStorage
      });

      client.getItems(
  'states',
  {
    fields: ['*.*']
  }
).then(data => {
  self.statesData = data.data;
  console.log(self.alertData);
})

.catch(error => console.error(error));
    },

    fetchAOI() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "your-education-your-voice",
        storage: window.localStorage
      });

      client.getItems(
  'allourideas',
  {
    fields: ['*.*','challenge_items.aoi_list_id.*']
  }
).then(data => {
  self.aoiData = data.data;
  console.log(self.alertData);
})

.catch(error => console.error(error));
    },

    fetchAOI_tools() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "your-education-your-voice",
        storage: window.localStorage
      });

      client.getItems(
  'aoi_tool',
  {
    fields: ['*.*']
  }
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



