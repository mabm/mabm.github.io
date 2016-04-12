<?php
	use Phalcon\Http\Response;

	function checkToken($token, $requestType, $admin = false) {
		$isValid = false;

		if (strlen($token) <= 0)
			return null;
		$token = Token::findFirst(
			    array(
			    	"conditions" => array("token" => $token)
			    )
			);
	    if (!$token)
	    	return null;
	    if (($requestType->isPost() or $requestType->isDelete()) and $token->write) {
	    	$isValid = true;
	    } else if (($requestType->isGet() or $requestType->isPut()) and $token->read) {
	    	$isValid = true;
	    }
	    return ($isValid) ? $token : null;
	}

	function TokenController($app) {

		$app->get('/token', function () {
			$tokens = Token::find();
		   
		   	$return = $tokens;
		   	return writeOut($return, "Server error.", $return);
		});

		// Searches for Boot with $name in their name
		$app->get('/token/search/{name}', function ($name) {

		});

		// Retrieves Boot based on primary key
		$app->get('/token/{id:[0-9]+}', function ($id) {

		});

		// Adds a new robot
		$app->post('/token', function () use ($app) {

		});

		// Updates Boot based on primary key
		$app->put('/token/{id:[0-9]+}', function () {

		});

		// Deletes Boot based on primary key
		$app->delete('/token/{id:[0-9]+}', function () {

		});
	}
?>