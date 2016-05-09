(function (window, document, $, Drupal) {
    "use strict";

    Drupal.behaviors.range_calculator = {
        attach: function(context,settings){
            var configJson,
                configJsonPath = "/tesla_theme/js/models/data/config.json",
                rangeData = {},
                rangeSettings = {},
                Drupal = {},
                needIeFallback,
                thisLocale,
                drupalLocale = settings.tesla.locale || 'en_US';

            Drupal.settings = {};
            Drupal.settings.tesla = {};

            // lets find the locale class so we can properly switch the settings
            thisLocale = document.getElementsByTagName("body")[0].className.match(/i18n-\w*/)[0];

            switch (thisLocale) {
                case 'i18n-en_GB':
                    Drupal.settings.tesla.unit = 'hybrid';
                    break;
                case 'i18n-es_US':
                case 'i18n-en_EU':
                case 'i18n-en_AU':
                case 'i18n-en_HK':
                case 'i18n-zh_HK':
                case 'i18n-en_MO':
                case 'i18n-zh_MO':
                case 'i18n-en_CA':
                case 'i18n-fr_CA':
                case 'i18n-es_MX':
                case 'i18n-fr':
                case 'i18n-fr_BE':
                case 'i18n-fr_CH':
                case 'i18n-da':
                case 'i18n-de':
                case 'i18n-de_AT':
                case 'i18n-de_CH':
                case 'i18n-fi_FI':
                case 'i18n-it':
                case 'i18n-it_CH':
                case 'i18n-ja_JP':
                case 'i18n-nl':
                case 'i18n-nl_BE':
                case 'i18n-no':
                case 'i18n-sv_SE':
                case 'i18n-zh_CN':
                    Drupal.settings.tesla.unit = 'metric';
                    break;
                default:
                    Drupal.settings.tesla.unit = 'imperial';
                    break;
            }

            $(document).ready(function() {

                needIeFallback = $('html').hasClass('lt-ie9');

                // get the configuration data based on locale
                $.getJSON( configJsonPath, function( data ) {
                    configJson = data[Drupal.settings.tesla.unit];
                })
                .done(function() {
                    initializeRangeData();

                    // default settings
                    rangeSettings.wheelFPS   = configJson.wheelFPS;
                    rangeSettings.speedIndex = configJson.speedIndex;
                    rangeSettings.speed      = configJson.speed;
                    rangeSettings.tempIndex  = configJson.temperatureIndex;
                    rangeSettings.temp       = configJson.temperature;
                    rangeSettings.ac         = configJson.ac.replace("ac","").toLowerCase();
                    rangeSettings.wheels     = configJson.wheels.replace("Wheels","");
                    rangeSettings.windows    = configJson.windows.replace("Windows","").toLowerCase();
                    rangeSettings.season     = configJson.season;
                    rangeSettings.road       = configJson.road;
                    rangeSettings.lights     = configJson.lights.replace("Lights","").toLowerCase();
                });
            });


            // ***********************
            // grab the range data JSON files and set into local obj
            function initializeRangeData() {
                var jsonDir = "/tesla_theme/js/models/data/";
                var region = Drupal.settings.tesla.unit;

                // grab the 4 json file data for imperial unit countries
                $.when( $.getJSON(jsonDir + region + '70Miles.json'),
                        $.getJSON(jsonDir + region + '70DMiles.json'),
                        $.getJSON(jsonDir + region + '85Miles.json'),
                        $.getJSON(jsonDir + region + '90DMiles.json'),
                        $.getJSON(jsonDir + region + 'P90DMiles.json') )

                // set global data for later use
                .done(function( json1, json2, json3, json4, json5 ) {
                        rangeData.rangedata_70  = json1[0];
                        rangeData.rangedata_70D    = json2[0];
                        rangeData.rangedata_85     = json3[0];
                        rangeData.rangedata_90D    = json4[0];
                        rangeData.rangedata_P90D   = json5[0];
                })
                // update the UI
                .then(function() {
                    initDefaultData();
                    updateUI();
                    initButtons();
                });
            }


            // ***********************
            // Update the UI elements after calculations
            function updateUI() {

                rangeSettings.speedIndex    = $(".range-controls--speed .spinner-number").data('oldvalue');
                rangeSettings.tempIndex     = $(".range-controls--climate .spinner-number").data('oldvalue');
                rangeSettings.ac            = $(".climate-controller .controls-data").data('value');

                rangeSettings.speed         = configJson.speedRange[rangeSettings.speedIndex];
                rangeSettings.temp          = configJson.outsideTemps[rangeSettings.tempIndex];
                rangeSettings.wheels        = $(".range-controls--wheels input:checked").val();

                $(".battery-option.BT70 .battery-range-content").html(getRangesForBatteries("70"));
                $(".battery-option.BT70D .battery-range-content").html(getRangesForBatteries("70D"));
                // $(".battery-option.BT85 .battery-range-content").html(getRangesForBatteries("85"));
                $(".battery-option.BT90D .battery-range-content").html(getRangesForBatteries("90D"));
                $(".battery-option.P90D .battery-range-content").html(getRangesForBatteries("P90D"));
                $(".battery-option.BT70 .battery-range-units").html(configJson.speedLabel.toUpperCase());
                $(".battery-option.BT70D .battery-range-units").html(configJson.speedLabel.toUpperCase());
                // $(".battery-option.BT85 .battery-range-units").html(configJson.speedLabel.toUpperCase());
                $(".battery-option.BT90D .battery-range-units").html(configJson.speedLabel.toUpperCase());
                $(".battery-option.P90D .battery-range-units").html(configJson.speedLabel.toUpperCase());

                $(".range-controls--speed .spinner-number").text(rangeSettings.speed);

                var speed_measurement = configJson.measurement;

                if(configJson.measurement.hasOwnProperty(drupalLocale)) {
                    speed_measurement = configJson.measurement[drupalLocale];
                }
                else if (Drupal.settings.tesla.unit == "metric") {
                    speed_measurement = configJson.measurement['default'];
                }
                else {
                    speed_measurement = configJson.measurement;
                }

                $(".range-controls--speed .spinner-unit").text(speed_measurement);

                $(".range-controls--climate .spinner-number").text(rangeSettings.temp);

                if (rangeSettings.wheels == '19') {
                    $(".wheels-front").removeClass("wheels-twentyone").addClass("wheels-nineteen");
                    $(".wheels-rear").removeClass("wheels-twentyone").addClass("wheels-nineteen");
                } else {
                    $(".wheels-front").removeClass("wheels-nineteen").addClass("wheels-twentyone");
                    $(".wheels-rear").removeClass("wheels-nineteen").addClass("wheels-twentyone");
                }

                // speed spinner
                var increaseSpeedRangeSpinner = $(".range-controls--speed .spinner-controls--increase"),
                    decreaseSpeedRangeSpinner = $(".range-controls--speed .spinner-controls--decrease");

                if (parseInt(rangeSettings.speedIndex) === configJson.speedRange.length - 1) {
                    if(needIeFallback) {
                        increaseSpeedRangeSpinner.addClass("disabled");
                    } else {
                        increaseSpeedRangeSpinner.attr("disabled", "disabled");
                    }
                } else if (parseInt(rangeSettings.speedIndex) === 0) {
                    if(needIeFallback) {
                        decreaseSpeedRangeSpinner.addClass("disabled");
                    } else {
                        decreaseSpeedRangeSpinner.attr("disabled", "disabled");
                    }
                } else {
                    if(needIeFallback) {
                        increaseSpeedRangeSpinner.removeClass("disabled");
                        decreaseSpeedRangeSpinner.removeClass("disabled");
                    } else {
                        increaseSpeedRangeSpinner.removeAttr("disabled");
                        decreaseSpeedRangeSpinner.removeAttr("disabled");
                    }
                }

                // temperature spinner
                var increaseTemperatureRangeSpinner = $(".range-controls--climate .spinner-controls--increase"),
                    decreaseTemperatureRangeSpinner = $(".range-controls--climate .spinner-controls--decrease");

                if (parseInt(rangeSettings.tempIndex) === configJson.outsideTemps.length - 1) {
                    if(needIeFallback) {
                        decreaseTemperatureRangeSpinner.addClass("disabled");
                    } else {
                        decreaseTemperatureRangeSpinner.attr("disabled", "disabled");
                    }
                } else if (parseInt(rangeSettings.tempIndex) === 0) {
                    if(needIeFallback) {
                        increaseTemperatureRangeSpinner.addClass("disabled");
                    } else {
                        increaseTemperatureRangeSpinner.attr("disabled", "disabled");
                    }
                } else {
                    if(needIeFallback) {
                        increaseTemperatureRangeSpinner.removeClass("disabled");
                        decreaseTemperatureRangeSpinner.removeClass("disabled");
                    } else {
                        increaseTemperatureRangeSpinner.removeAttr("disabled");
                        decreaseTemperatureRangeSpinner.removeAttr("disabled");
                    }
                }

                setClimateLabel($(".climate-controller .controls-data").data('value'));

                $(".climate-controller .controls-text").text(rangeSettings.climateLabel);

                // air conditioning spinner
                if (rangeSettings.tempIndex >= 3) {

                    if(rangeSettings.ac === "on") {
                        $(".climate-controller").removeClass('climate-on climate-off climate-heat climate-ac').addClass('climate-on climate-heat');
                    } else {
                        $(".climate-controller").removeClass('climate-on climate-off climate-heat climate-ac').addClass('climate-off climate-heat');
                    }
                } else {

                    if(rangeSettings.ac === "on") {
                        $(".climate-controller").removeClass('climate-on climate-off climate-heat climate-ac').addClass('climate-on climate-ac');
                    } else {
                        $(".climate-controller").removeClass('climate-on climate-off climate-heat climate-ac').addClass('climate-off climate-ac');
                    }
                }
            }


            // ***********************
            // get the range data from the battery specific JSON
            // @batteryId => battery type [70, 70D, 85, 85D, P85D]
            // @speed => current speed selected by user
            function getRangesForBatteries(batteryId, speed) {

                var tmpRangeData = rangeData["rangedata_" + batteryId];
                var miles;

                _.each(tmpRangeData, function(v, k) {
                    if (v.ac == rangeSettings.ac && v.lights == rangeSettings.lights && v.windows == rangeSettings.windows && v.temp == rangeSettings.temp && v.wheelsize == rangeSettings.wheels) {
                        _.each(v.hwy, function(vv, kk) {
                            if (rangeSettings.speed == vv.mph) {
                                miles = vv.miles;
                            }
                        });
                    }
                });

                return Math.round(miles);
            }


            // ***********************
            // initialize the click handlers for controls
            function initButtons() {
                if ($(".range-controls--speed .spinner-controls--increase").length) {
                    $(".range-controls--speed .spinner-controls--increase").unbind("click");
                    $(".range-controls--speed .spinner-controls--increase").click(function() {
                        setSpeedIndex($(".range-controls--speed .spinner-number").data('oldvalue'), "up");
                    });
                }
                if ($(".range-controls--speed .spinner-controls--decrease").length) {
                    $(".range-controls--speed .spinner-controls--decrease").unbind("click");
                    $(".range-controls--speed .spinner-controls--decrease").click(function() {
                        setSpeedIndex($(".range-controls--speed .spinner-number").data('oldvalue'), "down");
                    });
                }
                if ($(".range-controls--climate .spinner-controls--increase").length) {
                    $(".range-controls--climate .spinner-controls--increase").unbind("click");
                    $(".range-controls--climate .spinner-controls--increase").click(function() {
                        setTemperature($(".range-controls--climate .spinner-number").data('oldvalue'), "up");
                    });
                }
                if ($(".range-controls--climate .spinner-controls--decrease").length) {
                    $(".range-controls--climate .spinner-controls--decrease").unbind("click");
                    $(".range-controls--climate .spinner-controls--decrease").click(function() {
                        setTemperature($(".range-controls--climate .spinner-number").data('oldvalue'), "down");
                    });
                }
                if ($(".climate-controller .controls-data").length) {
                    $(".climate-controller .controls-data").unbind("click");
                    $(".climate-controller .controls-data").click(function() {
                        setAC($(".climate-controller .controls-data").data('value'));
                    });
                }

                if ($(".range-controls--wheels input").length) {
                    $(".range-controls--wheels input").unbind("click");
                    $(".range-controls--wheels input").click(function() {
                        setWheels($(this));
                    });
                }
            }


            // ***********************
            // initialize default values for controls
            function initDefaultData() {
                $(".range-controls--speed .spinner-number").data('oldvalue', configJson.speedIndex);
                $(".range-controls--climate .spinner-number").data('oldvalue', configJson.temperatureIndex);

                $(".climate-controller .controls-data").data('value', rangeSettings.ac)
                $(".range-controls--wheels input").data('value', rangeSettings.wheels);
            }


            // ***********************
            // set the current speed from user selection
            function setSpeedIndex(currentSpeed, direction) {

                // set speed index
                var newSpeedIndex = direction === "up" ? parseInt(currentSpeed) + 1 : parseInt(currentSpeed) - 1;

                if (newSpeedIndex > configJson.speedRange.length - 1) {
                    newSpeedIndex = currentSpeed;
                }

                if (newSpeedIndex < 0) {
                    newSpeedIndex = 0;
                }

                rangeSettings.speedIndex = newSpeedIndex;
                $(".range-controls--speed .spinner-number").data('oldvalue', newSpeedIndex);

                updateUI();
            }


            // ***********************
            // set the current temperature based on user selection
            function setTemperature(currentTemp, direction) {

                var newTempIndex = direction === "up" ? parseInt(currentTemp) - 1 : parseInt(currentTemp) + 1;

                if (newTempIndex > configJson.outsideTemps.length - 1) {
                    newTempIndex = currentTemp;
                }
                if (newTempIndex < 0) {
                    newTempIndex = 0;
                }

                rangeSettings.tempIndex = newTempIndex;
                $(".range-controls--climate .spinner-number").data('oldvalue', newTempIndex);

                updateUI();
            }

            function setClimateLabel(climateOnOff) {
                if (climateOnOff === "off") {
                    if(rangeSettings.tempIndex >= 3) {
                        rangeSettings.climateLabel = Tesla.Smartling._heatOff;
                    } else {
                        rangeSettings.climateLabel = Tesla.Smartling._acOff;
                    }
                } else {
                    if(rangeSettings.tempIndex >= 3) {
                        rangeSettings.climateLabel = Tesla.Smartling._heatOn;
                    } else {
                        rangeSettings.climateLabel = Tesla.Smartling._acOn;
                    }
                }
            }


            // ***********************
            // set the current data based on AC button selection
            function setAC(climateOnOff) {

                if (climateOnOff === "on") {
                    $(".climate-controller .controls-data").prop('checked', false);

                    setClimateLabel(climateOnOff);

                    rangeSettings.ac = "off";
                }
                else {
                    $(".climate-controller .controls-data").prop('checked', true);
                    setClimateLabel(climateOnOff);

                    rangeSettings.ac = "on";
                }

                $(".climate-controller .controls-data").data('value', rangeSettings.ac);

                updateUI();
            }


            // ***********************
            // set the current wheels based on user selection
            function setWheels(wheelSize) {

                rangeSettings.wheels = wheelSize.val();
                $('.controls-wheelsize label').removeClass('selected');

                if(wheelSize.val() == '19') {
                    $(".wheelsize-nineteen").addClass('selected');
                } else {
                    $(".wheelsize-twentyone").addClass('selected');
                }



                updateUI();
            }
        }
    };

}(this, this.document, this.jQuery, this.Drupal));

