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
        'oauth_access_token'        => "49458304-kAjNn3aQpebEb72Dly7IOntcoRJCbM5XsNJfPGoer",
        'oauth_access_token_secret' => "se2CTDs1NkVAImzseHRTMu7W0ondS5AVbAV6Y4",
        'consumer_key'              => "BjpBYwpnEiC6IgOOFSXw",
        'consumer_secret'           => "nxCNcRKjn6kRNPaSgZ59pmM9h3I7Ye4qqJ4VUGcDESg"
    );

    //  URL search
    $url = "https://api.twitter.com/1.1/search/tweets.json";
    //$getfield = '?q=#baseball&result_type=recent';
    $getfield =
        "?geocode=" .
        $latitude . "," . $longitude . "," . $radius . "km" .
        "&lang=en" .
        "&result_type=recent";
    $requestMethod = 'GET';

    $twitter = new TwitterAPIExchange($settings);
    echo $twitter->setGetfield($getfield)->buildOauth($url, $requestMethod)->performRequest();
}

