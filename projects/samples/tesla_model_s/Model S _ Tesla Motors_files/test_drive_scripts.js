// hack to make localizeDate() work
if (typeof curCarInfo == 'undefined') {
    curCarInfo = {};
}

$(function() {
    // Initialize BrowserDetect object if it hasn't already been done
    if (typeof(BrowserDetect) !== "undefined" && typeof(BrowserDetect.summary) === "undefined") {
        BrowserDetect.init();
    }
    // WEB-24227
    if (BrowserDetect.summary.browser == 'Explorer' && BrowserDetect.summary.version == 8) {
        $('input[name="post-submit"]').removeClass('hide-on-desk').addClass('hide-on-mobile');
        $('input[name="ajax-submit"]').removeClass('hide-on-mobile').addClass('hide-on-desk');
    }
});

(function (window, document, $, Drupal) {
    "use strict";
    Drupal.behaviors.test_drive_form = {
        attach: function () {

            var $form = $('#test-drive-form');

            $('#edit-submit-td-ajax').on('click', function(e) {
                var reg = new RegExp("(^|&)bd=([^&]*)(&|$)", "i");
                var param = window.location.search.substr(1).match(reg);
                var $adword;
                if (param != null) $adword = unescape(param[2]);
                var cookie = $.cookie('bd');

                if ($adword != null) {
                    $.cookie('bd', $adword, {expires : 30});
                    $('input[name=ad_word_td]').val($adword);
                } else {
                    if (cookie != null && cookie != '') {
                        $('input[name=ad_word_td]').val(cookie);
                    }
                }
            });
            var $zip_code = $('#edit-zipcode-td');
            var $ajax_country = true;
            if ($form.length) {
                $form.parsley().destroy();
                $form.parsley();

                $('#test-drive-modal').on('show.bs.modal', function (event) {
                    debug.log('on show | GTM: form-interaction, view-open, Test Drive, User Requested');
                    window.dataLayer.push({
                        'event': 'form-interaction',
                        'interaction': 'view-open',
                        'formType': 'Test Drive',
                        'engagementType': 'User Requested',
                    });
                });

                $('#test-drive-modal').on('hide.bs.modal', function (event) {

                    //var mymodal = $(this);
                    if ($('#test-drive-modal .thanks').length) {

                        //e.preventDefault();
                        var country = (_.indexOf(['en_US', 'zh_CN'], Drupal.settings.tesla.locale) === -1) ? "/" + Drupal.settings.tesla.locale : '';
                        $('.modal-body', '#test-drive-modal').load(country + "/models/drive/ajax", function () {
                            Drupal.attachBehaviors();
                        });
                        $('#test-drive-modal .modal-title').html(Drupal.t('Test Drive'));

                    }

                });

                $('.btn-ajax', '#test-drive-form').click(function (event) {
                    event.preventDefault(); //prevent default form submit
                    var valid = $form.parsley().validate();
                    if (valid && $ajax_country) {
                        $('#test-drive-modal .modal-throbber').removeClass('hidden');
                        $(this).trigger('submit_form');
                    }
                });

                //check whenever the dropdown menu change and ask the backend for the new regex and message to display
                $('#edit-countries-td').change(function (event) {
                    //disable the submit button meanwhile the ajax is begin processed
                    $ajax_country = false;
                    //get the actual url with Drupal settings
                    var url = (Drupal.settings.tesla.locale != 'en_US') ? "/" + Drupal.settings.tesla.locale : '';
                    var country = $('#edit-countries-td').val();
                    $.ajax({
                        url: url + '/regex/' + country,
                        dataType: "json"
                    }).success(function (data, textStatus, jqXHR) {
                        //Little hack to change the regex and message that parsley will do
                        $zip_code.attr('data-parsley-pattern', ((data.regex) ? (data.regex) : ('/^[a-zA-Z0-9\-\s]{1,}$/')));
                        $zip_code.attr('data-parsley-pattern-message', ((data.message) ? (data.message) : (Drupal.t('contains one or more illegal characters'))));
                        $(':input[name="phonenumber_td"]').val(data.phone_code);
                        //Reactivate the parsley validation
                        $zip_code.focusout();
                    }).done(function (data, textStatus, jqXHR) {
                        //enable the submit button
                        $ajax_country = true;
                    })
                });

                //prepre china dropdowns
                $('.china-regions:not(.ajax-processed)').addClass('ajax-processed').once(function () {
                    // Get default values for selects
                    var $province = $(this).find('#edit-provinces-td');
                    var $city = $(this).find('#edit-cities-td');
                    
                    $(this).china_dropdowns({
                        default_province: '',
                        default_city: '',
                        default_district: null,
                        json: Drupal.settings.basePath + 'sites/all/libraries/tesla_lib/js/province_city_district_map.json',
                        init_value_city: '市（区）',
                        show_district: false
                    }, $province, $city);
                });

                //update appointment dates when location is changed
                $('#edit-location').change(function() {
                    var date_select_disabled = true;
                    var location_id = $(this).val();
                    var locations = $.parseJSON($('#appointment_dates').html());
                    $('#edit-preferred-date').html('');
                    $('#edit-preferred-time').html('');
                    $('#map-address').html('');
                    for (var i in locations) {
                        var location = locations[i];
                        if (location.id == location_id) {
                            $('#map-address').html('<strong>' + Drupal.t('Tesla !location_name', {'!location_name': $('#edit-location option[value="' + location_id + '"]').text()}) + '</strong><br>' + location.map_address + '<br><a class="driving-directions" href="/' + location.service_id + '" target="_blank">' + Drupal.t('Hours and directions') + '</a>');
                            for (var j in location.dates) {
                                var date = j.split('-');
                                $('#edit-preferred-date').append('<option value="' + j + '">' + localizeDay(parseInt(date[1]), date[2], date[0]) + '</option>');
                                date_select_disabled = false;
                            }
                        }
                    }
                    $('#edit-preferred-date').change();
                    //$('#edit-preferred-date').prop('disabled', date_select_disabled);
                    //$('#edit-preferred-time').prop('disabled', true);
                    //$('#edit-submit-td-ajax--2').prop('disabled', true);
                });

                //update appointment times when date is changed
                $('#edit-preferred-date').change(function() {
                    var time_select_disabled = true;
                    var selected_date = $(this).val();
                    var location_id = $('#edit-location').val();
                    var locations = $.parseJSON($('#appointment_dates').html());
                    $('#edit-preferred-time').html('');
                    for (var i in locations) {
                        var location = locations[i];
                        if (location.id == location_id) {
                            for (var j in location.dates) {
                                if (j == selected_date) {
                                    var times = location.dates[j];
                                    for (var k in times) {
                                        var time = times[k];
                                        $('#edit-preferred-time').append('<option value="' + time + '">' + time + '</option>');
                                        time_select_disabled = false;
                                    }
                                }
                            }
                        }
                    }
                });

                // enable or disable submit button
                $('#edit-preferred-time').change(function() {
                    var btn_disabled = $(this).val() ? false : true;
                });

                //set skip val and submit form on click
                $('#specialists-btn').click(function() {
                    $(this).closest('form').append('<input type="hidden" name="skip_to_confirmation" value="1" />').find('#edit-submit-td-ajax--2').click();
                });

                // Add browser values to form
                if (typeof(BrowserDetect) !== "undefined" && typeof(BrowserDetect.summary) === "undefined") {
                    BrowserDetect.init();
                }
                $('#test-drive-form').append('<input type="hidden" name="browser_type" value="' + BrowserDetect.summary.browser + '">').
                    append('<input type="hidden" name="browser_version" value="' + BrowserDetect.summary.version + '">').
                    append('<input type="hidden" name="browser_os" value="' + BrowserDetect.summary.OS + '">');
                $('#test-drive-form input[type="text"]').keypress(function(e) {
                    if (e.keyCode == 13) {
                        e.stopPropagation();
                        var btn1 = $('#edit-submit-td-ajax');
                        var btn2 = $('#edit-submit-td-ajax--2');
                        if (btn1) {
                            btn1.click();
                        }
                        else if (btn2) {
                            btn2.click();
                        }
                        return false;
                    }
                });
                $('#edit-location').change();

                $('#edit-schedule-type-ambassador').click(function(){
                    var checked = $(this).is(':checked');
                    $('#edit-schedule-type-in-store').prop('checked', !checked);
                    $('#edit-location').prop('disabled', checked);
                    $('#edit-preferred-date').prop('disabled', checked);
                    $('#edit-preferred-time').prop('disabled', checked);
                });
                $('#edit-schedule-type-in-store').click(function(){
                    var checked = $(this).is(':checked');
                    $('#edit-schedule-type-ambassador').prop('checked', !checked);
                    $('#edit-location').prop('disabled', !checked);
                    $('#edit-preferred-date').prop('disabled', !checked);
                    $('#edit-preferred-time').prop('disabled', !checked);
                });
            }
        }
    };

    Drupal.behaviors.test_drive_form_zipcode_notice = {
        // by default notice should not be displayed
        display_notice: false,

        is_other_eu_country: function(country) {
            return (country != '' && $.inArray(country, Drupal.settings.tesla.other_eu_countries) !== -1);
        },

        attach: function() {
            // Only for Other Europe
            if (Drupal.settings.tesla.locale !== "en_EU" || typeof Drupal.settings.tesla.other_eu_countries == 'undefined') {
                return;
            }

            var self = this,
                $zipcode = $('#edit-zipcode-td'),
                $countries = $('#edit-countries-td'),
                $notice = $('#zipcode_notice'),
                current_country = $countries.val();

            if (this.is_other_eu_country(current_country)) {
                this.display_notice = true;
            }

            $countries.change(function() {
                self.display_notice = false;
                current_country = $countries.val();
                if (self.is_other_eu_country(current_country)) {
                    self.display_notice = true;
                }
            });

            $zipcode.on("blur", function() {
                if (!$notice.hasClass("hidden")) {
                    $notice.addClass("hidden");
                }
            });
            $zipcode.on("focus", function() {
                if (self.display_notice && $notice.hasClass("hidden")) {
                    $notice.removeClass("hidden");
                }
            });
        }
    };

}(this, this.document, this.jQuery, this.Drupal));
