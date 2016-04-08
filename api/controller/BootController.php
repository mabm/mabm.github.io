<?php
	use Phalcon\Http\Response;

	function generateShowAs($mime) {
		$graph = array("text");
		$img = array('image');

		foreach ($graph as $key => $value) {
			if (explode('/', $mime)[0] == $value)
				return "GRAPH";
		}
		foreach ($img as $key => $value) {
			if (explode('/', $mime)[0] == $value)
				return "IMAGE";
		}
		return $mime;
	}

	function searchBoot($app, $page) {
		$searchJson = $app->request->getJsonRawBody();
		$p = getPagination();
		if (isset($page) || $page != null)
			$p['page'] = $page;
		$searchArray = array();

		foreach ($searchJson->criterias as $key => $value) {
			$tmp = array();
			foreach ($value as $key2 => $value2) {
				$tmp2 = '';
				$tmp2[$key] = $value2;
				array_push($tmp, $tmp2);
			}
			array_push($searchArray, array('$or' => $tmp));
		}

		if (count($searchArray) > 0) {
			$boots = Boot::find(
				    array(
				    	array(
					    	'$and' => $searchArray
						),
				        "sort"  => array($searchJson->sort->field => (($searchJson->sort->type == "ASC") ? 1 : -1)),
				        "limit" => $p['nbr'],
				        "skip" => (int) ($p['page']) * $p['nbr']
				    )
				);
		} else {
			$boots = Boot::find(
				    array(
				        "sort"  => array($searchJson->sort->field => (($searchJson->sort->type == "ASC") ? 1 : -1)),
				        "limit" => $p['nbr'],
				        "skip" => (int) ($p['page']) * $p['nbr']
				    )
				);
		}
		return $boots;
	}

	function formatBoot($boot) {
		$i = 0;
		if (!property_exists($boot, "power_stats"))
			return $boot;
		foreach ($boot->power_stats as $key => $value) {
			$boot->power_stats[$i]['title'] = explode('.', $key['filename'])[0];

			$headers = get_headers("http://powerci.org:8889/attachments/".$key['data']."/".$key['filename'], 1);

			$boot->power_stats[$i]['show_as'] = generateShowAs($headers['Content-Type']);
			$i++;
		}
		if (!$boot->regression_id) {
			$boot->prev_reg_id = null;
			$boot->lastBuild = true;
		} else {
			$reg_id = ((int) $boot->regression_id - 1);
			$precRegBoot = Boot::findFirst(
								array(
									array(
								    	'$and' => array(array('job' => $boot->job),
								    	array('board' => $boot->board),
								    	array('defconfig_full' => $boot->defconfig_full),
								    	array('test_desc' => $boot->test_desc),
								    	array('regression_id' => $reg_id))
									)
								)
							);
			$lastFromRegression = Boot::findFirst(
									array(
										array(
									    	'$and' => array(array('job' => $boot->job),
									    	array('board' => $boot->board),
									    	array('test_desc' => $boot->test_desc),
									    	array('defconfig_full' => $boot->defconfig_full)
										)
									),
									"sort"  => array(
							            "date" => -1
							        ))
								);
			$boot->lastBuild = false;
			if ($precRegBoot) {
				$boot->regression = array();
				if (property_exists($precRegBoot, "power_stats")) {
					if ($lastFromRegression->getId() == $boot->getId()) {
						$boot->lastBuild = true;
					} else {
						$boot->lastBuild = false;
					}
					$i = 0;
					foreach ($boot->power_stats as $key1 => $value1) {
						$boot->regression[$i] = new stdClass();
						foreach ($value1 as $key => $value) {
							if (array_key_exists($key, $precRegBoot->power_stats[$i])) {
								$original = $boot->power_stats[$i][$key];
								$comparedTo = $precRegBoot->power_stats[$i][$key];
								if ($original < $comparedTo)
									$boot->regression[$i]->{$key} = 'LT';
								else if ($original > $comparedTo)
									$boot->regression[$i]->{$key} = 'GT';
								else
									$boot->regression[$i]->{$key} = 'EQ';
								}
						}
						$i++;
					}
				}
				$boot->prev_reg_id = $precRegBoot->getId();
			} else {
				$boot->prev_reg_id = null;
				$boot->lastBuild = true;
			}
		}
		return $boot;
	}

	function getRegressionID($boot) {
		$id = RegressionIDX::findFirst(
					    array(
					    	array(
						    	'$and' => array(array('job' => $boot->job),
						    	array('board' => $boot->board),
						    	array('test_desc' => $boot->test_desc),
						    	array('defconfig_full' => $boot->defconfig_full))
							)
					    )
					);

		if (!$id) {
			$id = new RegressionIDX();
			$id->job = $boot->job;
			$id->board = $boot->board;
			$id->test_desc = $boot->test_desc;
			$id->defconfig_full = $boot->defconfig_full;
			$id->id = 0;
			$id->save();
			return 0;
		} else {
			$id->id += 1;
			$id->save();
		}
		return $id->id;
	}

	function getPagination() {
		$var = array();

		$var['page'] = ((isset($_GET['p'])) ? $_GET['p'] - 1 : 0);
		$var['nbr'] = ((isset($_GET['nbr'])) ? $_GET['nbr'] : 0);
		return $var;
	}

	function BootController($app) {

		$app->get('/boot', function () {
			$p = getPagination();
			$boots = Boot::find(
			    array(
			        "sort"  => array(
			            "date" => 1
			        ),
			        "limit" => $p['nbr'],
			        "skip" => (int) ($p['page']) * $p['nbr']
			    )
			);

		    $results = array();
		    foreach ($boots as $boot) {
		        $results[] = formatBoot($boot);
		    }
		   return writeOut($results, "Server error.", $results);
		});

		$app->put('/boot/newentry', function () use($app) {
			$p = getPagination();
			$searchJson = $app->request->getJsonRawBody();
			$searchArray = array();

			foreach ($searchJson->criterias as $key => $value) {
				$tmp = array();
				foreach ($value as $key2 => $value2) {
					$tmp2 = '';
					$tmp2[$key] = $value2;
					array_push($tmp, $tmp2);
				}
				array_push($searchArray, array('$or' => $tmp));
			}

			if (count($searchArray) > 0) {
				$boots = Boot::find(
					    array(
					    	array(
						    	'$and' => $searchArray
							),
					        "sort"  => array($searchJson->sort->field => (($searchJson->sort->type == "ASC") ? 1 : -1)),
					        "limit" => $p['nbr'],
					        "skip" => (int) ($p['page']) * $p['nbr']
					    )
					);
			} else {
				$boots = Boot::find(
					    array(
					        "sort"  => array($searchJson->sort->field => (($searchJson->sort->type == "ASC") ? 1 : -1)),
					        "limit" => $p['nbr'],
					        "skip" => (int) ($p['page']) * $p['nbr']
					    )
					);
			}

			$results = array();


			if ($_GET['u'] >= count($boots))
				return writeOut($results, "No more entry", true);
			$i = $_GET['u'];
		    while ($i < count($boots)) {
		        $results[] = formatBoot($boots[$i++]);
		    }
		   return writeOut($results, "Server error.", $results);
		});

		$app->put('/boot/search', function () use($app) {
			$boots = SearchBoot($app, null);

		    $result = array();
		    foreach ($boots as $boot) {
		        $local = formatBoot($boot);
		        $result[] = $local;
		        // $result[] = formatBoot($boot);
		    }
		   return writeOut($result, "Server error.", $result);
		});

		$app->get('/boot/list-content', function () {
			$boots = Boot::find();

		    $results['trees'] = $results['archs'] = $results['kernels'] = $results['boards'] = $results['defconfigs'] = $results['test_desc'] = array();
		    $results['boots_total'] = count($boots);
		    foreach ($boots as $boot) {
		    	if (!in_array($boot->job, $results['trees']))
		        	array_push($results['trees'], $boot->job);
		        if (!in_array($boot->arch, $results['archs']))
		        	array_push($results['archs'], $boot->arch);
		         if (!in_array($boot->kernel, $results['kernels']))
		        	array_push($results['kernels'], $boot->kernel);
		        if (!in_array($boot->board, $results['boards']))
		        	array_push($results['boards'], $boot->board);
		        if (!in_array($boot->defconfig_full, $results['defconfigs']))
		        	array_push($results['defconfigs'], $boot->defconfig_full);
		        if ($boot->test_desc && !in_array($boot->test_desc, $results['test_desc']))
		        	array_push($results['test_desc'], $boot->test_desc);
		    }
		   return writeOut($results, "Server error.", $results);
		});

		$app->put('/graph/boot/compare', function () use ($app) {
			$boots = searchBoot($app, null);
			$graphArray = array();
			$bootPrecs = array(array("data" => array(), "name" => "Energy (mJ)"), 
				array("data" => array(), "name" => "Power Min (mW)"), 
				array("data" => array(), "name" => "Power Max (mW)"), 
				array("data" => array(), "name" => "Power AVG (mW)"), 
				array("data" => array(), "name" => "Current Min (mA)"), 
				array("data" => array(), "name" => "Current Max (mA)"), 
				array("data" => array(), "name" => "Voltage Max (mV)"));
				
		   	$obj = '';
		    $obj['title'] = "Compare Graph";
            $obj['unit'] = "milli-SI";
            $obj['type'] = "column";
            $obj['xAxis'] = array();
            foreach ($boots as $boot) {
				$precBoot = $boot;
				if (property_exists($precBoot, "power_stats")) {
					array_push($bootPrecs[0]['data'], (float) $precBoot->power_stats[0]['energy']);
					array_push($bootPrecs[1]['data'], (float) $precBoot->power_stats[0]['power_min']);
					array_push($bootPrecs[2]['data'], (float) $precBoot->power_stats[0]['power_max']);
					array_push($bootPrecs[3]['data'], (float) $precBoot->power_stats[0]['power_avg']);
					array_push($bootPrecs[4]['data'], (float) $precBoot->power_stats[0]['current_min']);
					array_push($bootPrecs[5]['data'], (float) $precBoot->power_stats[0]['current_max']);
					array_push($bootPrecs[6]['data'], (float) $precBoot->power_stats[0]['vbus_max']);
					array_push($obj['xAxis'], '<a target="_blank" href="power_details?id='.$precBoot->getId().'">'.$precBoot->board.'-'.$precBoot->defconfig_full.'-'.date('d/m/Y', $precBoot->date).'</a>');
				}
			}
            $obj['series'] = $bootPrecs;
            array_push($graphArray, (array) $obj);

		   return simpleWrite($graphArray, "Server error.", $graphArray);
		});

		$app->get('/graph/boot/regression/{id:.*}', function ($id) use ($app) {
			$graphArray = array();
			$bootPrecs = array(array("data" => array(), "name" => "Energy (mJ)"), 
				array("data" => array(), "name" => "Power Min (mW)"), 
				array("data" => array(), "name" => "Power Max (mW)"), 
				array("data" => array(), "name" => "Power AVG (mW)"), 
				array("data" => array(), "name" => "Current Min (mA)"), 
				array("data" => array(), "name" => "Current Max (mA)"), 
				array("data" => array(), "name" => "Voltage Max (mV)"));
			
          
			$boot = Boot::findById($id);
			if (!$boot)
				return simpleWrite(null, "Server error.", null);
			$reg_id = ((int) $boot->regression_id + 1);
			$i = 0;
	
		   	$obj = '';
		    $obj['title'] = "Regression Graph";
            $obj['unit'] = "milli-SI";
            $obj['type'] = "spline";
            $obj['xAxis'] = array();
            while ($i < $reg_id) {
				$precBoot = Boot::findFirst(
								array(
									array(
								    	'$and' => array(array('job' => $boot->job),
								    	array('board' => $boot->board),
								    	array('test_desc' => $boot->test_desc),
								    	array('defconfig_full' => $boot->defconfig_full),
								    	array('regression_id' => $i))
									)
								)
							);
				if (property_exists($precBoot, "power_stats")) {
					array_push($bootPrecs[0]['data'], (float) $precBoot->power_stats[0]['energy']);
					array_push($bootPrecs[1]['data'], (float) $precBoot->power_stats[0]['power_min']);
					array_push($bootPrecs[2]['data'], (float) $precBoot->power_stats[0]['power_max']);
					array_push($bootPrecs[3]['data'], (float) $precBoot->power_stats[0]['power_avg']);
					array_push($bootPrecs[4]['data'], (float) $precBoot->power_stats[0]['current_min']);
					array_push($bootPrecs[5]['data'], (float) $precBoot->power_stats[0]['current_max']);
					array_push($bootPrecs[6]['data'], (float) $precBoot->power_stats[0]['vbus_max']);
					array_push($obj['xAxis'], '<a target="_blank" href="power_details?id='.$precBoot->getId().'">'.date('d/m/Y', $precBoot->date).'</a>');
				}
				$i++;
			}
            $obj['series'] = $bootPrecs;
            array_push($graphArray, (array) $obj);

		   return simpleWrite($graphArray, "Server error.", $graphArray);
		});

		// $app->options('/boot/{id:.*}', function () {
		// 	header('Access-Control-Allow-Headers: authorization, content-type');
		// });

		// Retrieves Boot based on primary key
		$app->get('/boot/search-by-id/{id:.*}', function ($id) use ($app) {
		    $boot = Boot::findById($id);
		   
		   $return = formatBoot($boot);
		   return writeOut($return, "Server error.", $return);
		});

		$app->get('/boot/regression-by-id/{id:.*}', function ($id) use ($app) {
		   $boot = Boot::findById($id);
		   $array = array();
		   if (!$boot)
				return simpleWrite(null, "Server error.", null);
			$reg_id = ((int) $boot->regression_id);
			$i = 0;
			while ($i < $reg_id) {
				$precBoot = Boot::findFirst(
								array(
									array(
								    	'$and' => array(array('job' => $boot->job),
								    	array('board' => $boot->board),
								    	array('test_desc' => $boot->test_desc),
								    	array('defconfig_full' => $boot->defconfig_full),
								    	array('regression_id' => $i))
									)
								)
							);
				if ($precBoot) {
					$obj = new StdClass();
					$obj->id = $precBoot->getId()->{'$id'};
					$obj->kernel = $precBoot->kernel;
					$obj->power_stats = $precBoot->power_stats;
					//$i = 0;
					//while ($i < 20) {
						array_push($array, $obj);
						//$i++;
					//}
				}
				$i++;
				error_log("ici", 0);
			}

		   return simpleWrite($array, "Server error.", $array);
		});

		// Adds a new boot
		$app->post('/boot', function () use ($app) {
			$bootJson = $app->request->getJsonRawBody();
			$boot = new Boot();
			$boot->fillMe($bootJson);
			$boot->regression_id = getRegressionID($boot);

		  	return writeOut(($boot), "Server error.", $boot->save());
		});

		// Updates Boot based on primary key
		$app->put('/boot/{id:[0-9]+}', function () {

		});

		// Deletes Boot based on primary key
		$app->delete('/boot/{id:.*}', function ($id) use($app) {
		    $boot = Boot::findById($id);
		    
		    return writeOut(formatBoot($boot), "Server error.", $boot->delete());
		});
	}
?>