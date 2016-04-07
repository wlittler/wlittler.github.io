$(document).ready(function () {
    var scroll_start = 0;
    var startchange = $('#startchange');
    var offset = startchange.offset();
    var fadeNav = 'animated fadeInDown navbar-fixed-top';
    //    var navFixed = 'navbar-fixed-top';
    var animatedEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

    if (startchange.length) {
        $(document).scroll(function () {
            scroll_start = $(this).scrollTop();
            if (scroll_start > offset.top) {
                $("nav").addClass(fadeNav);
                $("section.forest_bg").addClass("extend_forest");
            } else {
                $("nav").removeClass("navbar-fixed-top");
                $("section.forest_bg").removeClass("extend_forest");
            }
            //            console.log(scroll_start);
        });

    }






});


//Unmolested code

//if (startchange.length) {
//        $(document).scroll(function () {
//            scroll_start = $(this).scrollTop();
//            if (scroll_start > offset.top) {
//                $("nav").addClass("navbar-fixed-top animated fadeInDown");
//                $("section.forest_bg").addClass("extend_forest");
//            } else {
//                $("nav").removeClass("navbar-fixed-top");
//                $("section.forest_bg").removeClass("extend_forest");
//            }
//            //            console.log(scroll_start);
//        });

//2nd try

//  if (startchange.length) {
//        $(document).scroll(function () {
//            scroll_start = $(this).scrollTop();
//            if (scroll_start > offset.top) {
//                $("nav").addClass(fadeNav).one(animatedEnd, function () {
//                    $(this).removeClass(fadeNav);
//                });
//                $("section.forest_bg").addClass("extend_forest");
//            } else {
//                $("nav").removeClass("navbar-fixed-top");
//                $("section.forest_bg").removeClass("extend_forest");
//            }
//            //            console.log(scroll_start);
//        });
