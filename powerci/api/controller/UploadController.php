<?php
	use Phalcon\Http\Response;

	function UploadController($app) {
		// Adds a new robot
		$app->post('/upload', function () use ($app) {
			
		});

		function forceFilePutContents($filepath, $message) {
		    try {
		        $isInFolder = preg_match("/^(.*)\/([^\/]+)$/", $filepath, $filepathMatches);
		        if ($isInFolder) {
		            $folderName = $filepathMatches[1];
		            $fileName = $filepathMatches[2];
		            if (!is_dir($folderName)) {
		                mkdir($folderName, 0777, true);
		            }
		        }
		        file_put_contents($filepath, $message);
		    } catch (Exception $e) {
		    	throw new Exception("ERR: error writing '$message' to '$filepath', ". $e->getMessage());
		    }
		}

		$app->put('/upload/{path:.*}', function ($path) use ($app) {
			header('Access-Control-Allow-Origin: *');
			$response = new Response();
		    $response->setContentType('application/json', 'UTF-8');
		    $data = $app->request->getRawBody();
		    $size = 0;
	        $response->setStatusCode(201, "Created");
	        if (strlen($data) > 0) {
	        	$size = strlen($data);
	        	try {
	        		forceFilePutContents('./upload/'.$path, $data);
	        		$response->setJsonContent(
			            array(
			                'status' => 'OK',
			                'size'   => $size
			            )
			        );
	        	} catch (Exception $e) {
	        		$response->setJsonContent(
			            array(
			                'status' => 'KO',
			                'message'   => $e->getMessage()
			            )
			        );
	        	}
	        } else {
	        	$response->setJsonContent(
		            array(
		                'status' => 'KO',
		                'message'   => "Empty file .."
		            )
		        );
	        }
	        return $response;
		});
	}
?>