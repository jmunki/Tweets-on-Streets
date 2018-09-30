<?php
/**
 *
 * Temp server file for creating oauth request to twitter API
 *
 */

require_once('TwitterAPIExchange.php');

//  Check we retrieved appropriate lat/longitude
if(is_numeric($_GET['lat']) && is_numeric($_GET['lng']) && is_numeric($_GET['rad'])){
    $latitude = $_GET['lat'];
    $longitude = $_GET['lng'];
    $radius = $_GET['rad'];

    if($radius <= 0 || $radius > 1000){
        $radius = 5;//  Prevent extremes
    }

    $settings = array(
        'oauth_access_token'        => "49458304-76vuhHVjWe7f24j1wcYtftbfuH0GnjqjnwYQA5ybX",
        'oauth_access_token_secret' => "OIHmQZShKeQdtz2Am2zJy7a5INLqCXyh10azVDhGGv4mA",
        'consumer_key'              => "lYPmgVk5hOexNlyC8u8vT6hIb",
        'consumer_secret'           => "vkegzfpncmuYr0zKukiqnEIqtvjCmS7ztztUGkbDWhQV8tyWTZ"
    );

    //  URL search
    $url = "https://api.twitter.com/1.1/search/tweets.json";
    $getfield =
        "?geocode=" .
        $latitude . "," . $longitude . "," . $radius . "km" .
        "&lang=en" .
        "&result_type=recent";
    $requestMethod = 'GET';

    try {
        $twitter = new TwitterAPIExchange($settings);
        echo $twitter->setGetfield($getfield)->buildOauth($url, $requestMethod)->performRequest();
    } catch (\Exception $e){
        echo $e->getMessage();
    }
}

