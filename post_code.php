<?php
/**
 * Temp file deals with filtering and sorting out the post code from the input
 *
 */

$errors = [
    0 => "{error: 'Post code was not provided'}",
    1 => "{error: 'Post code was invalid'}",
];

$cache = [];

if(isset($_GET['p']) && $_GET['p'] !== ""){

//    echo "{
//   \"results\" : [
//      {
//         \"address_components\" : [
//            {
//               \"long_name\" : \"M3 5AS\",
//               \"short_name\" : \"M3 5AS\",
//               \"types\" : [ \"postal_code\" ]
//            },
//            {
//               \"long_name\" : \"Salford\",
//               \"short_name\" : \"Salford\",
//               \"types\" : [ \"postal_town\" ]
//            },
//            {
//               \"long_name\" : \"Greater Manchester\",
//               \"short_name\" : \"Greater Manchester\",
//               \"types\" : [ \"administrative_area_level_2\", \"political\" ]
//            },
//            {
//               \"long_name\" : \"England\",
//               \"short_name\" : \"England\",
//               \"types\" : [ \"administrative_area_level_1\", \"political\" ]
//            },
//            {
//               \"long_name\" : \"United Kingdom\",
//               \"short_name\" : \"GB\",
//               \"types\" : [ \"country\", \"political\" ]
//            }
//         ],
//         \"formatted_address\" : \"Salford M3 5AS, UK\",
//         \"geometry\" : {
//            \"bounds\" : {
//               \"northeast\" : {
//                  \"lat\" : 53.48548899999999,
//                  \"lng\" : -2.2459297
//               },
//               \"southwest\" : {
//                  \"lat\" : 53.4845698,
//                  \"lng\" : -2.2480567
//               }
//            },
//            \"location\" : {
//               \"lat\" : 53.48498619999999,
//               \"lng\" : -2.2468198
//            },
//            \"location_type\" : \"APPROXIMATE\",
//            \"viewport\" : {
//               \"northeast\" : {
//                  \"lat\" : 53.4863783802915,
//                  \"lng\" : -2.245644219708498
//               },
//               \"southwest\" : {
//                  \"lat\" : 53.4836804197085,
//                  \"lng\" : -2.248342180291501
//               }
//            }
//         },
//         \"place_id\" : \"ChIJCXQuOMSxe0gRH_cbHEgWekQ\",
//         \"types\" : [ \"postal_code\" ]
//      }
//   ],
//   \"status\" : \"OK\"
//}";exit;
    //  clean input
    $tmp = strip_tags($_GET['p']);
    $cleaned = str_replace(" ", "+", $tmp);

    if (! empty($cache[$cleaned])){
        echo $cache[$cleaned];exit;
    }

    $key = "AIzaSyBdFre_8zjgUxJG8Lhm99kw2Mp7HWmsr_0";
    //$uri = "https://maps.googleapis.com/maps/api/geocode/json?address=$cleaned&key=$key";
    $uri = "https://api.postcodes.io/postcodes/$cleaned";

    //  send request
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $uri);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    $geocodeData = curl_exec($ch);
    $cache[$cleaned] = $geocodeData;

    echo $geocodeData;exit;
}else{
    echo $errors[0];exit;
}

