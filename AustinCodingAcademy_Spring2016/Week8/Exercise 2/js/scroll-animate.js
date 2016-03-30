$(document).ready(function () {

    // Sandwich Flip
    $(window).scroll(function () {

        var verticalScroll = $(this).scrollTop();

        if (verticalScroll > 500) {

            $('.my_sandwich').addClass('animated flip');

        }
        console.log(verticalScroll);
    });

    // Four Items Function

    $(window).scroll(function () {

        var verticalScroll = $(this).scrollTop();

        if (verticalScroll > 1050) {

            $('#my_1').addClass('animated fadeInDownBig');
            $('#my_1').removeClass('hide_me');
            $('#my_2').addClass('animated fadeInRightBig');
            $('#my_2').removeClass('hide_me');
            $('#my_3').addClass('animated fadeInLeftBig');
            $('#my_3').removeClass('hide_me');
            $('#my_4').addClass('animated fadeInUpBig');
            $('#my_4').removeClass('hide_me');


        }
    });


});