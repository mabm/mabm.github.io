<?php
use Phalcon\Http\Response;

define('STATUS_OK', "OK");
define('STATUS_KO', "KO");

function getMillis() {
    return (float) (explode(" ", microtime())[0]);
}

function objWrapper($obj) {
    if (is_array($obj)) {
        $i = 0;
        foreach ($obj as &$key) {
            $obj[$i]->_id = $obj[$i]->getId()->{'$id'};  
            $i++; 
        }
    } else
        $obj->_id = $obj->getId()->{'$id'};
    return $obj;
}

function writeOut($obj, $errorMsg, $cond) {
    $response = new Response();
    $response->setContentType('application/json', 'UTF-8');
    $response->setHeader('Access-Control-Allow-Origin', '*')->setHeader("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE,OPTIONS')
      ->setHeader("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Range, Content-Disposition, Content-Type, Authorization')
      ->setHeader("Access-Control-Allow-Credentials", true);;

	if ($cond) {
        $response->setJsonContent(
            array(
                'status' => STATUS_OK,
                'count' => count($obj),
                'result' => $obj
                //'result' => objWrapper($obj)
            )
        );
    } else {
        // Change the HTTP status
        $response->setStatusCode(409, "Conflict");

        $errors = "Unknown error";
        if ($errorMsg)
        	$errors = $errorMsg;

        $response->setJsonContent(
            array(
                'status'   => STATUS_KO,
                'message' => $errors
            )
        );
    }
    return $response;
}

function simpleWrite($obj, $errorMsg, $cond) {
    $response = new Response();
    $response->setContentType('application/json', 'UTF-8');
    $response->setHeader('Access-Control-Allow-Origin', '*');

    if ($cond) {
        $response->setJsonContent(
            array(
                'status' => STATUS_OK,
                'count' => count($obj),
                'result' => $obj
            )
        );
    } else {
        // Change the HTTP status
        $response->setStatusCode(409, "Conflict");

        $errors = "Unknown error";
        if ($errorMsg)
            $errors = $errorMsg;

        $response->setJsonContent(
            array(
                'status'   => STATUS_KO,
                'message' => $errors
            )
        );
    }
    return $response;
}

function objectToArray( $object )
    {
        if( !is_object( $object ) && !is_array( $object ) )
        {
            return $object;
        }
        if( is_object( $object ) )
        {
            $object = get_object_vars( $object );
        }
        return array_map( 'objectToArray', $object );
    }

?>