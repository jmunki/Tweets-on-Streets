//  Jack Monk
$(document).ready(function () {

    //  hide tweets div
    $('#info').hide();
    $('#loading_indicator').hide();

    var search_radius = 3;// kilometers

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

    function getPosition(geocode) {
        $('#loading_indicator').show();
        updateTweets(geocode.coords.latitude, geocode.coords.longitude);
    }

    function updateTweets(latitude, longitude) {
        //  perform AJAX request
        $.ajax({
            url: "/authenticate.php?lat=" + latitude + "&lng=" + longitude + "&rad=" + search_radius,
            success: function (data) {
                console.log(data);
                var json_object = $.parseJSON(data);//  Parse string
                console.log(json_object);
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
            console.log(item);
            if(item.created_at !== null){

                var tweet_time = new Date(item.created_at);
                var now = new Date();
                var difference = now - tweet_time;
                var time = calculateTime(difference);

                var theTweet =
                    "<li>" +
                      "<span class='tweet_img'>" +
                        "<img src=" + item.user.profile_image_url + " alt='img_" + item.id + "' />" +
                      "</span>" +
                    "<span class='tweet_data'>" +
                      "<span class='tweet_user'>" +
                        "<a target='_blank' href='https://twitter.com/" + item.user.screen_name + "'>@" + item.user.screen_name + "</a>" +
                      "</span>" +
                    "<span class='tweet_time'>posted " + time + " ago...</span>" +
                    "<p class='tweet_text'>" + item.text + "</p>" +
                    "</span></li>";
                $("ol#tweets").append(theTweet);
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
                var dataJson = $.parseJSON(data);
                console.log(dataJson);
                if (dataJson['status'] != 200) {
                    console.log('Error with the post code lookup.');
                    return;
                }
                var lat = dataJson['result']['latitude'];
                var lng = dataJson['result']['longitude'];
                //createMap(lat, lng);
                updateTweets(lat, lng);
            }
        });
    }


    //setInterval(updateTweets, 180000);// 180 seconds
});
