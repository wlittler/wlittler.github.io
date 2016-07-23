$(document).ready();
function chevronToggle(){
  if ($('#wrapper').hasClass("toggled")) {
    $(".toggleSwitch").removeClass("glyphicon-chevron-left");
    $(".toggleSwitch").addClass("glyphicon-chevron-right");
  }
  else {
    $(".toggleSwitch").removeClass("glyphicon-chevron-right");
    $(".toggleSwitch").addClass("glyphicon-chevron-left");
  }
}

// Menu toggle //
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        chevronToggle();
    });
// Nav menu click handler and menu content object
var menuContent = {
  scrubs: '<h2>Sugar scrubs!</h2><img src=img/sugar_scrub_1.jpg class="img-responsive product">',
  ingredients: '<h2>Ingredients!</h2>',
  about: '',
  title: '<h1>AmaZen Skin</h1><h2>Made to order sugar scrubs using certified organic ingredients</h2><h3>Safe for even the most sensitive skin and gentle enough to use daily, anywhere on the body</h3>',
}

    $('.menuItem').click(function(e) {
      e.preventDefault();
      if ($(window).width() <= 768) {
        $("#wrapper").toggleClass("toggled");
      }
      chevronToggle();
      var target = $(this).data('contentid');
      $('.herobox').html(menuContent[target]);

    });

// Background fade trigger
// var elem = document.getElementsByClassName('herobox');
// var img = elem.getElementsByTagName('img');
//
// while ($('.herobox').html())
