<?php
	function formatLog($log) {
		return $log;
	}

	function LogController($app) {

		$app->options('/log', function () {
			header('Access-Control-Allow-Headers: authorization, content-type');
		});

		$app->options('/log/{id:.*}', function () {
			header('Access-Control-Allow-Headers: authorization, content-type');
		});

		/* Get all log */
		$app->get('/log', function () {
			$logs = Log::find(
			    array(
			        "sort"  => array(
			            "date" => 1
			        )
			    )
			);
			foreach ($logs as $key => $value) {
				if (!property_exists($value, 'message') || !property_exists($value, 'date') || !property_exists($value, 'token') || !property_exists($value, 'time'))
				{
					$value->delete();
				}
				if ($value->time < 0)
					$value->delete();
			}
			return writeOut($logs, "Server error", $logs);
		});

		$app->get('/stats/log', function () {
			$graphArray = array();

			$logs = Log::find(
			    array(
			        "sort"  => array(
			            "date" => 1
			        )
			    )
			);

			/* Route calls by date */
			$obj = '';
			$obj['title'] = "Route's calls number";
			$obj['unit'] = "Calls";
			$obj['type'] = "areaspline";
			$data = array();
			$obj['xAxis'] = array();
			foreach ($logs as $key => $value) {
				if (!in_array(date('d/m/Y', $value->date), $obj['xAxis']))
					array_push($obj['xAxis'], date('d/m/Y', $value->date));
			}
			foreach ($logs as $key => $value) {
				$isOk = false;
				$tmp = explode('/', $value->message);
				if (preg_match('~[0-9]~', $tmp[count($tmp) - 1])) {
					$tmp = array_merge(array_diff($tmp, array($tmp[count($tmp) - 1])));
				}
				$tmp2 = implode('/', $tmp);
				if (substr($tmp2, -1) == "/")
					$tmp2 = substr($tmp2, -1);
				foreach ($data as $key2 => $value2) {
					if ($value2->name == $tmp2) {
						$data[$key2]->data[array_search(date('d/m/Y', $value->date), $obj['xAxis'])] += 1;
						$isOk = true;
					}
				}

				if (!$isOk) {
					$sub = new stdClass();
					$sub->name = $tmp2;
					$sub->data = array();
					$i = 0;
					while ($i < count($obj['xAxis']))
						$sub->data[$i++] = 0;
					$sub->data[array_search(date('d/m/Y', $value->date), $obj['xAxis'])] = 1;
					array_push($data, $sub);
				}
			}
			$obj['series'] = $data;
			array_push($graphArray, objectToArray($obj));

			/* Route time response by route by date */
			$obj = '';
			$obj['title'] = "Route's time response";
			$obj['unit'] = "Time (ms)";
			$obj['type'] = "spline";
			$data = array();
			$obj['xAxis'] = array();
			foreach ($logs as $key => $value) {
				if (!in_array(date('d/m/Y', $value->date), $obj['xAxis']))
					array_push($obj['xAxis'], date('d/m/Y', $value->date));
			}
			foreach ($logs as $key => $value) {
				$isOk = false;
				$tmp = explode('/', $value->message);
				if (preg_match('~[0-9]~', $tmp[count($tmp) - 1])) {
					$tmp = array_merge(array_diff($tmp, array($tmp[count($tmp) - 1])));
				}
				$tmp2 = implode('/', $tmp);
				if (substr($tmp2, -1) == "/")
					$tmp2 = substr($tmp2, -1);
				foreach ($data as $key2 => $value2) {
					if ($value2->name == $tmp2) {
						$data[$key2]->data[array_search(date('d/m/Y', $value->date), $obj['xAxis'])] = ($data[$key2]->data[array_search(date('d/m/Y', $value->date), $obj['xAxis'])] + $value->time) / 2;
						$isOk = true;
					}
				}

				if (!$isOk) {
					$sub = new stdClass();
					$sub->name = $tmp2;
					$sub->data = array();
					$i = 0;
					while ($i < count($obj['xAxis']))
						$sub->data[$i++] = 0;
					$sub->data[array_search(date('d/m/Y', $value->date), $obj['xAxis'])] = $value->time;
					array_push($data, $sub);
				}
			}
			$obj['series'] = $data;
			array_push($graphArray, objectToArray($obj));

			return simpleWrite($graphArray, "Server error", $graphArray);
		});

		/* Get log by ID */
		$app->get('/log/{id:.*}', function ($id) use ($app) {
		    $log = Log::findById($id);
		    
		    return writeOut($log, "Log with ID ".$id." does not exist.", $log);
		});

		/* Add new Log entry */
		$app->post('/log', function () use ($app) {
			$jsonBody = $app->request->getJsonRawBody();

			$log = new Log();
			$log->fillMe($jsonBody);

			return writeOut($log, "Server error.", $log->save());
		});

		/* Modify log */
		$app->put('/log/{id:[0-9]+}', function () {

		});

		/* Delete an existant log */
		$app->delete('/log/{id:.*}', function ($id) use($app) {
		    $log = Log::findById($id);
		    
		    return writeOut($log, "Log with ID ".$id." does not exist.", $log->delete());
		});
	}
?>