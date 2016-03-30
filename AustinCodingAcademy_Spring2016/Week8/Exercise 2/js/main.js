$(document).ready(function () {

    var animatedName = 'animated shake';

    var animatedEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

    $('.my_button').click(function () {

        $('.my_shake').addClass(animatedName).one(animatedEnd, function () {

            $(this).removeClass(animatedName);

        });

    });


});