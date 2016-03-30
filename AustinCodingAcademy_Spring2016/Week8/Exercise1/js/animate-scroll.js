$(document).ready(function () {

    $(window).scroll(function () {

        var verticalScroll = $(this).scrollTop();

        if (verticalScroll >= 200) {
            //            console.log(verticalScroll);
            $('#pancakes').addClass('animated infinite flipInX');
        }

    });



    $(window).scroll(function () {

        var verticalScroll = $(this).scrollTop();

        if (verticalScroll >= 1000) {
            $('#my_jello').addClass('animated infinite jello');
        }

        console.log(verticalScroll);

    });
});