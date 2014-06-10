<?php
/**
 * Temp file deals with filtering and sorting out the post code from the input
 *
 */

$errors = array(
    0 => "Post code was not provided.",
    1 => "Post code was invalid",
);

if(isset($_GET['p']) && $_GET['p'] !== ""){

    //  clean input
    $tmp = strip_tags($_GET['p']);
    $cleaned = str_replace(" ", "+", $tmp);

    //  build request uri
    $uri = "http://maps.googleapis.com/maps/api/geocode/json?address=" . $cleaned . "&sensor=false";

    //  send request
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $uri);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $geoloc = json_decode(curl_exec($ch), true);

    //  Check returned results are okay
    if(isset($geoloc['status']) && $geoloc['status'] === "OK" && isset($geoloc['results']) && count($geoloc['results']) > 0){
        $results = $geoloc['results'];

        $geocode = $results[0]['geometry']['location'];
        echo json_encode($geocode);
    }else{
        echo $errors[1];
    }
}else{
    echo $errors[0];
}

