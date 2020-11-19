$(document).ready(function() {
  var target = $('.animate-text').hide(),
      items = $('.animate-text').children(),
      counter = 0;
  function bannerFade() {
      target.fadeIn(1000).delay( 1800 ).fadeOut(1000,function() {
          bannerFade();
      }).html(items[counter++]);
      if (counter == items.length) {
          counter = 0;
      } 
  }
  bannerFade();
});