$(document).ready(function () {
    var scroll_start = 0;
    var startchange = $('#startchange');
    var offset = startchange.offset();
    if (startchange.length) {
        $(document).scroll(function () {
            scroll_start = $(this).scrollTop();
            if (scroll_start > offset.top) {
                $("nav").addClass("navbar-fixed-top");
                $("section.forest_bg").addClass("extend_forest");
            } else {
                $("nav").removeClass("navbar-fixed-top");
                $("section.forest_bg").removeClass("extend_forest");
            }
            //            console.log(scroll_start);
        });
    }
});
