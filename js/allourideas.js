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
      aoiData: [],
      aoi_toolData: [],
      showMessage: true,
      index_active:0,
      active_aoi:20,
      apiURL: 'https://directus.thegovlab.com/your-education-your-voice',
    }
  },

  created: function created() {
    this.fetchPhase();
    this.fetchAlerts();
    this.fetchAOI();
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
    fields: ['*.*']
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
    }
   
}
});


