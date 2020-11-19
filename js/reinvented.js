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
      // faqData:[],
      // showMessage: true,
      // index_active:0,
      apiURL: 'https://directus.thegovlab.com/your-education-your-voice',
    }
  },

  created: function created() {

    this.fetchAbout();
    this.fetchPhase();
    // this.toggleMessage();
    // this.fetchQuestions();
  },


  methods: {
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
    fields: ['*.*']
  }
).then(data => {


  self.phaseData = data.data;
})

.catch(error => console.error(error));
    },
    toggleMessage (index) {
      this.index_active = index;
    	this.showMessage = !this.showMessage
    }
   
}
});



