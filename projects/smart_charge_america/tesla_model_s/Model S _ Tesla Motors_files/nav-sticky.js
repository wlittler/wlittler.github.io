/**
 * include this file and it will make specific nav sticky
 * it attaches to elements with class .nav-sticky
 * and uses data attributes of this object:
 * data-sticky-extra="20" || data-sticky-extra-bottom="400"
 * int amount of extra pixels to add to top position before detaching to fixed position
 * data-sticky-top="#top-anchor" can be jquery selectors like:
 * #top-anchor || .top-anchor || [name=top-anchor] || "220px" || "220"
 * position of from where object needs to be detached to fixed position
 * data-sticky-bottom="#bottom-anchor" or data-sticky-disappear="#bottom-anchor"
 *
 * can be jquery selectors like:
 * #bottom-anchor || .bottom-anchor || [name=bottom-anchor] || "240px" || "240"
 *
 * stop following content at this position
 */
(function (window, document, $, Drupal) {
    "use strict";

    Drupal.behaviors.scroll_to_fixed = {
        attach: function () {
            var $win = $(window),
                $stickyObject = $(".nav-sticky"),
                animationEnabled = $stickyObject.hasClass('nav-animate'),
                extraTop = $stickyObject.data('sticky-extra') || 0,
                extraBottom = $stickyObject.data('sticky-extra-bottom') || 0;

            // if you are logged in and the admin bar is present
            if (Drupal.admin !== undefined) {
                extraTop += Drupal.admin.height();
                extraBottom += Drupal.admin.height();
            }

            var getPosition = function($obj, dataAttribute) {
                if ($obj.data(dataAttribute) === undefined) { return null; }
                if ($obj.data(dataAttribute).toString().indexOf('#') === 0 || $obj.data(dataAttribute).toString().indexOf('.') === 0 || $obj.data(dataAttribute).toString().indexOf('[') === 0) {
                    return $($obj.data(dataAttribute)).offset().top;
                } else if ($obj.data(dataAttribute).toString().indexOf('px') !== -1) {
                    return $obj.data(dataAttribute).replace('px', '');
                } else {
                    return $obj.data(dataAttribute);
                }
            };

            var reachedPageBottom = function () {
                return ($win.height() + $win.scrollTop() == $(document).height());
            };

            var scrollCallback = function () {
                var topPosition = $(window).scrollTop(),
                    disappear = false,
                    topPlaceholderPosition = getPosition($stickyObject, 'sticky-top'),
                    bottomPlaceholderPosition = getPosition($stickyObject, 'sticky-bottom');

                // do nothing if required attribute is missing
                if (!topPlaceholderPosition) { return; }

                if (bottomPlaceholderPosition === null) {
                    bottomPlaceholderPosition = getPosition($stickyObject, 'sticky-disappear');
                    if (bottomPlaceholderPosition) { disappear = true; }
                }

                if (topPosition + extraTop > topPlaceholderPosition) {
                    if (bottomPlaceholderPosition !== null
                        && topPosition > (bottomPlaceholderPosition - extraBottom)) {
                        if (!disappear) {
                            $stickyObject.css({
                                position: "fixed",
                                top: extraTop - (topPosition - bottomPlaceholderPosition + extraBottom) + "px"
                            });
                        } else {
                            if (animationEnabled && reachedPageBottom()) {
                                // disabling animation if we reached page bottom and animation was enabled
                                $stickyObject.removeClass('nav-animate');
                            } else if (animationEnabled && !reachedPageBottom()) {
                                // re-enabling animation if it was enabled before
                                $stickyObject.addClass('nav-animate');
                            }

                            $stickyObject.css({position: "fixed", top: "-100px"});
                            $stickyObject.addClass('nav-animate-away');
                        }
                    } else {
                        $stickyObject.css({position: "fixed", top: extraTop + "px"});
                        $stickyObject.addClass('is-stuck').removeClass('nav-animate-away');
                    }
                } else {
                    $stickyObject.css({position: "absolute", top: ""});
                    $stickyObject.removeClass('nav-animate-away').removeClass('is-stuck');
                }
            };
            $(window).scroll(scrollCallback);
            $(window).resize(scrollCallback);
            scrollCallback();
        }
    };
}(this, this.document, this.jQuery, this.Drupal));
