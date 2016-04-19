(function ($) {
    "use strict";

    Drupal.behaviors.request_callback_form = {
        attach: function (context, settings) {
            var $form = $('#callback-form');
            $('#edit-submit-request-callback').click(function(e){
                var reg = new RegExp("(^|&)bd=([^&]*)(&|$)", "i");
                var param = window.location.search.substr(1).match(reg); 
                var $adword;
                if (param != null) $adword = unescape(param[2]);
                var cookie = $.cookie('bd');

                if ($adword != null) {
                    $.cookie('bd', $adword, {expires : 30});
                    $('input[name=ad_word_request_callback]').val($adword);
                } else {
                    if (cookie != null && cookie != '') {
                        $('input[name=ad_word_request_callback]').val(cookie);
                    }
                }
            });
            if ($form.length) {
                $form.parsley().destroy();
                $form.parsley();

                $('#request-callback-modal').once(
                    function(){
                        // do this once - start
                        $('#request-callback-modal').on('show.bs.modal', function (event) {
                            debug.log('on show.bs.modal | GTM: form-interaction, view-open, Request Callback, User Requested');
                            window.dataLayer.push({
                                'event': 'form-interaction',
                                'interaction': 'view-open',
                                'formType': 'Request Callback',
                                'engagementType': 'User Requested',
                            });
                        });
                        // do this once - end
                    }
                );

                //Stop the submit of the form if it is not valid
                $('#edit-submit-request-callback', '#callback-form').click(function (e) {
                    e.preventDefault(); //prevent default form submit
                    var valid = $form.parsley().validate();
                    if (valid) {
                        $('#request-callback-modal .modal-throbber').removeClass('hidden');
                        $(this).trigger('submit_form');
                    }
                });

                //Regenerate the modal (form) on close AND when it is displaying the thank you page
                $('#request-callback-modal').on('hide.bs.modal', function (e) {
                    //var mymodal = $(this);
                    if ($('#request-callback-modal .thanks').length) {
                        //e.preventDefault();
                        var country = (_.indexOf(['en_US', 'zh_CN'], Drupal.settings.tesla.locale) === -1) ? "/" + Drupal.settings.tesla.locale : '';
                        $('.modal-body', '#request-callback-modal').load(country + "/tesla_request_callback/regenerate", function () {
                            Drupal.attachBehaviors();
                            // wait until the form have been created
                            //mymodal.modal('hide');
                        });
                    }
                });
            }
        }
    };

})(jQuery);

/*
 * Helper function that will select a quote for the modal, this require that the link to the modal have a new attribute
 * onclick="multiple_choice( $('#name-of-the-quote-to-select')
 *
 * Possible values for the quotes are:
 *
 * edit-request-leasing-request-callback == Leasing
 * edit-request-financing-request-callback == Financing
 * edit-request-trade-in-request-callback == Trade In
 * edit-request-callback-request-callback == Request Callback (US only)
 * */
var multiple_choice = function (the_checkbox) {
    $('.sending-options').find(':checkbox').attr('checked', false);
    the_checkbox.attr('checked', true);
};

