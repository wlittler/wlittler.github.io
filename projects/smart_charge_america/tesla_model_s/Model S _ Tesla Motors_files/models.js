(function (window, document, $, Drupal) {
    "use strict";

    Drupal.behaviors.chassis_explorer = {
        attach: function(){

            var slickOptions = {
                initialSlide: 1,
                speed: 0,
                useCSS: false,
                easing: false,
                fade: true,
                cssEase: false,
                responsive: [
                    {
                        breakpoint: 480,
                        settings: {
                            arrows: true,
                            initialSlide: 1,
                            speed: 300,
                            useCSS: false,
                            fade: false
                        }
                    }
                ],
                onAfterChange: function(e) {
                    var $activeNav = $('.nav-link[data-slide="' + e.currentSlide + '"]'),
                        toggle = $activeNav.data('toggle'),
                        $slideContainer = $('.motor-slide[data-toggle="' + toggle + '"]'),
                        $activeSlideVideo = $slideContainer.find('video');

                    $activeNav.parent().siblings().removeClass('nav-selected');
                    $activeNav.parent().addClass('nav-selected');

                    // check if browser supports video playback
                    if (Modernizr.video) {

                        // stop all videos if playing anything
                        $('.section-chassis-explorer').find('video').each(function() {
                            if (!this.paused) this.pause();
                        });

                        // play active video
                        if ($activeSlideVideo.length && $activeSlideVideo.get(0).paused) {
                            $activeSlideVideo.get(0).play();
                        }
                    }
                }
            };

            var $carousel = $('.slick-slider-container');

            if (!$carousel.hasClass('slick-initialized')) {
                $carousel.slick(slickOptions);
            }

            $('#engineering').on('click', '.nav-link', function(e) {

                var $this = $(e.target);

                // only target links, and only target those with hashes in the href.
                if ($this.is('[href]') && $this.attr('href').indexOf("#") >= 0) {
                    e.preventDefault();
                }

                var thisParent = $this.parent('.nav-item'),
                    allSiblings = thisParent.siblings(),
                    slideContent = $('.chassis-container').find('.chassis-slide, .slide-content'),
                    motorSlides = $('.motor-slide');

                if(thisParent.closest('.motortype-nav').length) {
                    for (var i = 0; i < motorSlides.length; i++) {
                        if(!$(motorSlides[i]).hasClass('hidden')) {
                            $(motorSlides[i]).addClass('hidden');
                        }
                    }
                    $('.chassis-slide').find('[data-toggle="' + $this.data('toggle') + '"]').removeClass('hidden');
                    $carousel.slickGoTo($this.data('slide'));
                }

                // only remove and add classes if necessary
                if(!thisParent.hasClass('nav-selected')) {
                    allSiblings.removeClass('nav-selected');
                    thisParent.addClass('nav-selected');
                }
            });
        }
    }

    Drupal.behaviors.local_scroll = {
        attach: function(){
            if($('body').hasClass('browser-notcar')) {
                $.localScroll({
                    queue: true,
                    hash: false
                });
            }
        }
    }

    Drupal.behaviors.toggleBatteryOptions = {
        attach: function(){
            $('.show-rwd').click(
                function(e){
                    e.preventDefault();
                    $('.battery-data--70d').hide().addClass('hidden').removeAttr('style');
                    $('.battery-data--70').fadeIn('slow', function() {
                        $(this).removeClass('hidden').removeAttr('style');
                    });
                }
            );
            $('.show-awd').click(
                function(e){
                    e.preventDefault();
                    $('.battery-data--70').hide().addClass('hidden').removeAttr('style');
                    $('.battery-data--70d').fadeIn('slow', function() {
                        $(this).removeClass('hidden').removeAttr('style');
                    });
                }
            );
        }
    };

}(this, this.document, this.jQuery, this.Drupal));
