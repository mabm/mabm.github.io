<?php

use Phalcon\Mvc\Micro;
use Phalcon\Loader;
use Phalcon\Di\FactoryDefault;
include('controller/utils.php');
include('controller/BootController.php');
include('controller/TokenController.php');
include('controller/UploadController.php');
include('controller/LogController.php');

/*
** Load our models by dir
*/
$loader = new Loader();

$loader->registerDirs(
    array(
        __DIR__ . '/model/'
    )
)->register();

/*
** Create MongoDB Instanciation
*/
$di = new FactoryDefault();
$di->set('mongo', function () {
    $mongo = new MongoClient();
    return $mongo->selectDB("powerci");
}, true);

/*
** Instanciate our collectionManager for MongoDB
*/
$di->set('collectionManager', function(){
    return new Phalcon\Mvc\Collection\Manager();
}, true);

/*
** Creating our MicroApp
*/
$app = new Micro($di);

/*
** Check for valid Token
*/
$app->before(function () use ($app, $di) {
	$log = new Log();
	$log->json = $app->request->getJsonRawBody();
	$di->log = $log;
	$di->startTime = getMillis();
	$header = $app->request->getHeader('Authorization');

	$origin = $app->request->getHeader("ORIGIN") ? $app->request->getHeader("ORIGIN") : '*';

	$app->response->setHeader("Access-Control-Allow-Origin", $origin)
	      ->setHeader("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE,OPTIONS')
	      ->setHeader("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Range, Content-Disposition, Content-Type, Authorization')
	      ->setHeader("Access-Control-Allow-Credentials", true);

	if ($app->request->isOptions())
		return true;

	$token = checkToken($header, $app->request);
	//$app->token = $token;
	$di->G_TOKEN = $token;
	if ($log->fillMe($_SERVER["REQUEST_URI"], $token->token))
		$log->save();
	$lab_name = $token->lab_name;
    if ($lab_name == null) {
		$response = new \Phalcon\Http\Response();
		$response->setContentType('application/json', 'UTF-8');
		$response->setStatusCode(401, "Unauthorized");
		$response->setJsonContent(
		            array(
		                'status'   => 'KO',
		                'message' =>  'Invalid Token !'
		            )
		        );
		$response->send();
        return false;
    }
    return true;
});

$app->options('/{catch:(.*)}', function() use ($app) { 
    $app->response->setStatusCode(200, "OK")->send();
});

$app->after(function () use ($app, $di) {
    $di->log->time = (getMillis() - $app->getDI()->startTime);
    $di->log->save();
});

/*
** Define behavior for undefined page call
*/
$app->notFound(function () use ($app) {
    $app->response->setStatusCode(404, "Not Found")->sendHeaders();
    echo 'This is crazy, but this page was not found!';
});

/*
** Calling our controllers
*/
BootController($app);
UploadController($app);
LogController($app);

/*
** Handling our controllers API Page based
*/
$app->handle();
?>