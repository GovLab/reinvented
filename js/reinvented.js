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
    this.toggleMessage();
    // Load data asynchronously
    this.loadAllData();
  },


  methods: {
    async loadAllData() {
      try {
        await Promise.all([
          this.fetchAbout(),
          this.fetchPhase(),
          this.fetchPhaseIndex(),
          this.fetchPeople(),
          this.fetchComms(),
          this.fetchAlerts()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    },
    async fetchComms() {
      const self = this;
      if (window.OFFLINE_MODE) {
        try {
          const res = await fetch(getDataPath() + 'communications.json');
          const data = await res.json();
          self.commsData = data.data || data;
        } catch (e) { console.error('Offline comms load failed', e); }
        return;
      }
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "your-education-your-voice",
        storage: window.localStorage
      });
      client.getItems(
        'communications',
        { fields: ['*.*'] }
      ).then(data => {
        self.commsData = data.data;
      })
      .catch(error => console.error(error));
    },
    async fetchPeople() {
      const self = this;
      if (window.OFFLINE_MODE) {
        try {
          const res = await fetch(getDataPath() + 'people.json');
          const data = await res.json();
          self.peopleData = data.data || data;
          // Fix asset URLs for subfolders
          self.peopleData.forEach(person => {
            if (person.photo && person.photo.data && person.photo.data.full_url) {
              if (person.photo.data.full_url.startsWith('assets/')) {
                person.photo.data.full_url = getAssetPath() + person.photo.data.full_url;
              }
            }
          });
          self.peopleData.sort((a, b) => a.last_name.localeCompare(b.last_name));
        } catch (e) { console.error('Offline people load failed', e); }
        return;
      }
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "your-education-your-voice",
        storage: window.localStorage
      });
      client.getItems(
        'people',
        { fields: ['*.*'] }
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
    async fetchAbout() {
      const self = this;
      if (window.OFFLINE_MODE) {
        try {
          console.log('Loading about data from local JSON...');
          const res = await fetch(getDataPath() + 'about.json');
          const data = await res.json();
          self.aboutData = data.data || data;
          console.log('About data loaded:', self.aboutData);
        } catch (e) { console.error('Offline about load failed', e); }
        return;
      }
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "your-education-your-voice",
        storage: window.localStorage
      });
      client.getItems(
        'about',
        { fields: ['*.*'] }
      ).then(data => {
        self.aboutData = data.data;
      })
      .catch(error => console.error(error));
    },
    async fetchPhase() {
      const self = this;
      if (window.OFFLINE_MODE) {
        try {
          const res = await fetch(getDataPath() + 'phases.json');
          const data = await res.json();
          self.phaseData = data.data || data;
          
          // Load FAQ data and merge with phases
          try {
            const faqRes = await fetch(getDataPath() + 'faq.json');
            const faqData = await faqRes.json();
            const faqs = faqData.data || faqData;
            
            // Create a lookup map for FAQs
            const faqMap = {};
            faqs.forEach(faq => {
              faqMap[faq.id] = faq;
            });
            
            // Merge FAQ data into phases
            self.phaseData.forEach(phase => {
              if (phase.phase_faq && phase.phase_faq.length > 0) {
                phase.phase_faq.forEach(phaseFaq => {
                  if (faqMap[phaseFaq.faq_id]) {
                    phaseFaq.faq_id = faqMap[phaseFaq.faq_id];
                  }
                });
              }
            });
          } catch (faqError) {
            console.error('Offline FAQ load failed', faqError);
          }
          
          // Fix asset URLs for subfolders
          self.phaseData.forEach(phase => {
            if (phase.graphic && phase.graphic.data && phase.graphic.data.full_url) {
              if (phase.graphic.data.full_url.startsWith('assets/')) {
                phase.graphic.data.full_url = getAssetPath() + phase.graphic.data.full_url;
              }
            }
          });
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
        console.log(self.phaseData);
      })
      .catch(error => console.error(error));
    },
    async fetchPhaseIndex() {
      const self = this;
      if (window.OFFLINE_MODE) {
        try {
          const res = await fetch(getDataPath() + 'phases.json');
          const data = await res.json();
          // Simulate filter by slug
          const filtered = (data.data || data).filter(p => p.slug === self.phaseslug);
          self.tempData = filtered;
          self.phasePageData = filtered;
        } catch (e) { console.error('Offline phase index load failed', e); }
        return;
      }
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "your-education-your-voice",
        storage: window.localStorage
      });
      client.getItems(
        'phases',
        {
          filter: { slug: self.phaseslug },
          fields: ['*.*','phase_faq.faq_id.*'],
        }
      ).then(data => {
        self.tempData = data.data;
        self.phasePageData = data.data;
      })
      .catch(error => console.error(error));
    },
    async fetchAlerts() {
      const self = this;
      if (window.OFFLINE_MODE) {
        try {
          const res = await fetch(getDataPath() + 'alert_banner.json');
          const data = await res.json();
          self.alertData = data.data || data;
          console.log(self.alertData);
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
    toggleMessage (index) {
      this.index_active = index;
    	this.showMessage = !this.showMessage;
    }
   
}
});



