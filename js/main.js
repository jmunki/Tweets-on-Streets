//  Jack Monk
$(document).ready(function () {

    //  hide tweets div
    $('#info').hide();
    $('#loading_indicator').hide();

    //  Location of client
    var geocode;

    //  Google map
    var map;
    var zoom_level = 14;
    var search_radius = 1;// kilometers

    //	Check for browser location capability
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition, showError);
    } else {
        $("#error").text("Geolocation is not supported by this browser.");
        $("#error").toggle();
        show_manual_postcode_entry();
    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                $("#error").text("User denied the request for Geolocation.");
                $("#error").toggle();
                break;
            case error.POSITION_UNAVAILABLE:
                $("#error").text("Location information is unavailable.");
                $("#error").toggle();
                break;
            case error.TIMEOUT:
                $("#error").text("The request to get user location timed out.");
                $("#error").toggle();
                break;
            case error.UNKNOWN_ERROR:
                $("#error").text("An unknown error occurred.");
                $("#error").toggle();
                break;
        }
        show_manual_postcode_entry();
    }

    function show_manual_postcode_entry(){
        //	Show postcode input
        $('#post_code').show();

        //  Add form submit listener
        $( "#post_code_form" ).submit(function( event ) {
            post_code_submit();
            event.preventDefault();
        });
    }

    function getPosition(position) {
        $('#loading_indicator').show();

        geocode = position;

        createMap(geocode.coords.latitude, geocode.coords.longitude);

        updateTweets(geocode.coords.latitude, geocode.coords.longitude);
    }

    function createMap(latitude, longitude){
        var center = new google.maps.LatLng(latitude, longitude);

        var mapOptions = {
            center: center,
            zoom: zoom_level,
            mapTypeId: google.maps.MapTypeId.ROADMAP

        };
        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

        //  Set center when browser is resized
        google.maps.event.addDomListener(window, 'resize', function() {
            map.setCenter(center);
        });
    }

    function updateTweets(latitude, longitude) {
        //  perform AJAX request
        $.ajax({
            url: "/authenticate.php?lat=" + latitude + "&lng=" + longitude + "&rad=" + search_radius,
            success: function (data) {
                var json_object = $.parseJSON(data);//  Parse string
                if(json_object !== null){
                    processTweets(json_object['statuses']);//   Ignore meta data on request
                }
            },
            error: function (responseData, textStatus, errorThrown) {
                // SHow error
            }
        });

    }

    function processTweets(json) {
        //  For each tweet
        var count = 1;//  Marker count
        $.each(json, function (i, item) {
            if(item.geo !== null){

                //  Append markers to the map
                var latLng = new google.maps.LatLng(item.geo.coordinates[0], item.geo.coordinates[1]);
                var image = {
                    url: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+ count +'|00ACEE|ffffff',
                    // This marker is 20 pixels wide by 32 pixels tall.
                    size: new google.maps.Size(24, 32),
                    // The origin for this image is 0,0.
                    origin: new google.maps.Point(0,0),
                    // The anchor for this image is the base of the flagpole at 0,32.
                    anchor: new google.maps.Point(0, 32)
                };
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    animation: google.maps.Animation.DROP,
                    icon: image
                });

                //  pop up for markers
                var iw1 = new google.maps.InfoWindow({
                    content: item.text,
                    maxWidth: 300
                });
                google.maps.event.addListener(marker, "click", function (e) { iw1.open(map, this); });


                //  Calculate time since tweet happened
                var tweet_time = new Date(item.created_at);
                var now = new Date();
                var difference = now - tweet_time;
                var time = calculateTime(difference);

                $("ol#tweets").append(
                    "<li><span class='tweet_img'><img src=" + item.user.profile_image_url + " alt='img_" + item.id + "' /></span>" +
                        "<span class='tweet_data'><span class='tweet_user'><a target='_blank' href='https://twitter.com/" + item.user.screen_name + "'>@" + item.user.screen_name + "</a></span>" +
                        "<span class='tweet_time'>posted " + time + " ago...</span>" +
                        "<p class='tweet_text'>" + item.text + "</p>" +
                        "</span></li>"
                );
                count++;//  Marker count
            }
        });

        //  hide loading icon
        $('#loading_indicator').hide();
        $('#info').show();
    }

    function calculateTime(time){
        var seconds = time / 1000;
        var minutes = 0;
        var hours = 0;
        var text = "";

        if(seconds > 60){
            minutes = seconds / 60;
        }else{
            return "less than a minute";
        }
        if(minutes > 60){
            hours = minutes / 60;
            minutes = minutes - (hours * 60);
        }
        if(hours > 0){
            return "over an hour";
        }
        if(minutes > 0){
            text += Math.floor(minutes) + " minute";
            if(Math.floor(minutes)  > 1){
                text += "s ";
            }else{
                text += " ";
            }
        }
        return text;
    }

    function post_code_submit(){
        //  perform AJAX request to retrieve and clean post code data
        $.ajax({
            url: "/post_code.php?p=" + $('#post_code_input').val(),
            success: function (data) {
                $('#post_code').hide();
                $('#loading_indicator').show();

                var loc = $.parseJSON(data);

                createMap(loc['lat'], loc['lng']);
                updateTweets(loc['lat'], loc['lng']);
            }
        });
    }


    //setInterval(updateTweets, 180000);// 180 seconds
});
