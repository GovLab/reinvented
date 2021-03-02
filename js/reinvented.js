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
      aboutData: [],
      phaseData:[],
      phasePageData:[],
      peopleData:[],
      alertData:[],
      commsData:[],
      showMessage: true,
      index_active:0,
      apiURL: 'https://directus.thegovlab.com/your-education-your-voice',
    }
  },

  created: function created() {
    this.phaseslug=window.location.href.split('/');
    this.phaseslug = this.phaseslug[this.phaseslug.length - 1];
    this.fetchAbout();
    this.fetchPhase();
    this.fetchPhaseIndex();
    this.toggleMessage();
    this.fetchPeople();
    this.fetchComms();
    this.fetchAlerts();
  },


  methods: {
    fetchComms() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "your-education-your-voice",
        storage: window.localStorage
      });

      client.getItems(
  'communications',
  {
    fields: ['*.*']
  }
).then(data => {

  self.commsData = data.data;
})
.catch(error => console.error(error));
    },
    fetchPeople() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "your-education-your-voice",
        storage: window.localStorage
      });

      client.getItems(
  'people',
  {
    fields: ['*.*']
  }
).then(data => {

  data.data.sort(function(a, b) {
    
    var textA = a.last_name.toUpperCase();
    var textB = b.last_name.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;

});

  self.peopleData = data.data;
})
.catch(error => console.error(error));
    },
    fetchAbout() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "your-education-your-voice",
        storage: window.localStorage
      });

      client.getItems(
  'about',
  {
    fields: ['*.*']
  }
).then(data => {

//   data.data.sort(function(a, b) {
    
//     var textA = a.name.toUpperCase();
//     var textB = b.name.toUpperCase();
//     return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;

  
// });

  self.aboutData = data.data;
})

.catch(error => console.error(error));
    },
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
    fetchPhaseIndex() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "your-education-your-voice",
        storage: window.localStorage
      });

      client.getItems(
  'phases',
  {
    filter: {
      slug: self.phaseslug
    },
    fields: ['*.*','phase_faq.faq_id.*'],
  }
).then(data => {

self.tempData = data.data;
self.faqData = self.tempData[0].phase_faq;
self.faqData.sort(function(a, b) {
    var textA = a.faq_id.id;
    var textB = b.faq_id.id;
    return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
});
  self.phasePageData = data.data;
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
    toggleMessage (index) {
      this.index_active = index;
    	this.showMessage = !this.showMessage;
    }
   
}
});



