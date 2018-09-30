<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Tweets from your Streets</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1" name="viewport">
    <link href="css/default.css" type="text/css" rel="stylesheet">
    <link href="css/tablet.css" type="text/css" rel="stylesheet">
    <link href="css/mobile.css" type="text/css" rel="stylesheet">
    <script src="js/jquery-1.11.0.min.js"></script>
    <script src="js/main.js"></script>
</head>
<body>
<div id="site_wrap">
    <div id="error"></div>

    <header><h1>Tweets from your Streets!</h1></header>

    <div id="main">
        <div id="post_code">
            <form id="post_code_form" action="/">
                <label id="post_code_label" for="post_code">Enter your location</label>
                <input id="post_code_input" type="text" name="post_code"/>
                <button id="post_code_btn" type="submit">></button>
            </form>
        </div>

        <div id="loading_indicator">
            <img src="imgs/loading_indicator.gif" alt="loading_indicator"/>
        </div>

        <div id="info">
            <h2>Tweets</h2>
            <ol id="tweets"></ol>
        </div>
    </div>
</div>
</body>
</html>