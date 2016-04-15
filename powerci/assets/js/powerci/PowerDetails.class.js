var PowerDetails = {
	confLoader 				: ConfLoader,
	tour 					: null,
	profilManager           : Profils,

	init: function() {
		var me = this;

		try {
			this.confLoader.load(configFile).done(function() {
				me.tour = initTour('powerDetails'); // Init powers tour
				me.manageGUI(); // Hide/show elments into DOM and trigger click/change ..
				if (localStorage.getItem('tour_end') != "yes") {
					localStorage.removeItem('tour_current_step');
					me.tour.init();
					me.tour.start();
				}
				me.profilManager.displayProfils();
			}); // Load JSON config file - Promise returned
		} catch (e) {
			throw e;
		}
	},
	launch: function() {
		var me = this;

		$.ajax({
			method: "GET",
			url: this.confLoader.getApiURL() + '/boot/search-by-id/' + getUrlVars('id'),
			headers: {
				"Authorization" : this.confLoader.getApiToken(),
				"Content-Type" :"application/json"
			},
			success: function(data) {
				if (data.result.length < 1) {
					errorMessage('Bad ID parameter !');
					return;
				}

				var result = data.result;
				power_stats = result.power_stats[0];

				me.fillRegTab(); // Fill "previous builds" table
				me.fillDetails(result); // Fill "Details" bloc
				
				// iData = 0;
				$.each(result.power_stats, function(unused, elem) {
					if (elem.show_as == "IMAGE") {
						$('#graphContainer').append('<div class="col-lg-6"><div class="panel panel-flat tourGraph" id=""><div class="panel-heading"><h5 class="panel-title"><b>Boards/lab chart</b></h5><div class="heading-elements"><ul class="icons-list"> <li><a data-action="collapse"></a></li></ul> </div></div><div class="panel-body"><div class="container-fluid"><div class="row"><center><div class="chart"><img src="http://powerci.org:8889/attachments/'+ elem.data + '/' + elem.filename + '" width="100%"></div></center><br><table class="table"> <tr> <td>Power Min</td><td>Power AVG</td><td>Power Max</td><td>Current Min</td><td>Current Max</td><td>Voltage Max</td><td>Energy</td></tr><tr> <td id="pmin_'+unused+'"></td><td id="pavg_'+unused+'"></td><td id="pmax_'+unused+'"></td><td id="cmin_'+unused+'"></td><td id="cmax_'+unused+'"></td><td id="vmax_'+unused+'"></td><td id="nrj_'+unused+'"></td></tr></table></div></div></div></div></div>');
					} else if (elem.show_as == "GRAPH") {
						me.showAsGraph();
					}
					$('#pmin_' + unused).html(elem.power_min);
					$('#pavg_' + unused).html(elem.power_avg);
					$('#pmax_' + unused).html(elem.power_max);
					$('#cmin_' + unused).html(elem.current_min);
					$('#cmax_' + unused).html(elem.current_max);
					$('#vmax_' + unused).html(elem.vbus_max);
					$('#nrj_' + unused).html(elem.energy);
				})
				$.ajax({
					type: "GET",
					async: true,
					headers: {
						"Authorization" :token,
						"Content-Type" :"application/json"
					},
					url: 'http://powerci.org:9999/graph/boot/regression/' + getUrlVars('id'),
					success: function(data) {
						console.log(data);
						$.each(data.result, function(i, elem) {
							$.each(elem.series, function(ii, elemm) {
								$('#graphContainer').append('<div class="col-lg-6"><div class="panel panel-flat tourReg"><div class="panel-heading"><h5 class="panel-title"><b>'+elem.title+' - '+elemm.name+'</b></h5><div class="heading-elements"></div></div><div class="panel-body"><div class="container-fluid"><div class="row"><div class="col-lg-12" id="chartr-'+ii+'">'+elem.unit+'</div></div></div></div></div></div>');
								$('#chartr-'+ii).highcharts({
									chart: {
						                zoomType: 'x',
						                type: 'spline'
						            },
							        title: {
							            text: elem.title + ' - ' + elemm.name,
							            x: -20 //center
							        },
							        xAxis: {
							            categories: elem.xAxis,
							            labels: {
							            	useHTML: true
							            }
							        },
							        yAxis: {
							            title: {
							                text: elem.unit
							            },
							            plotLines: [{
							                value: 0,
							                width: 1,
							                color: '#808080'
							            }]
							        },
							        legend: {
							            layout: 'vertical',
							            align: 'right',
							            verticalAlign: 'middle',
							            borderWidth: 0
							        },
							        series: Array(elemm)
							    });
							});
						})
						
					},
					error: function(data) {
						
					}
				});
			},
			error: function(data) {
				errorMessage('API is maybe down ?');
			}
		});
	},
	fillRegTab: function() {
		$.ajax({
			method: "GET",
			url: this.confLoader.getApiURL() + '/boot/regression-by-id/' + getUrlVars('id'),
			headers: {
				"Authorization" : this.confLoader.getApiToken(),
				"Content-Type" : "application/json"
			},
			success: function(data) {
				$('#prevZone').html('');
				$('#previousBuildTitle').append(' (' + data.count + ')');
				$.each(data.result, function(i, elem) {
					$('#prevTable').append('<tr> <td class="text-center"><a href="power_details?id='+elem.id+'">'+elem.kernel+'</a></td>\
						<td style="background-color:'+((elem.power_stats[0].power_min > power_stats.power_min) ? red : (elem.power_stats[0].power_min < power_stats.power_min) ? green : orange)+'">'+elem.power_stats[0].power_min+'</td>\
						<td style="background-color:'+((elem.power_stats[0].power_avg > power_stats.power_avg) ? red : (elem.power_stats[0].power_avg < power_stats.power_avg) ? green : orange)+'">'+elem.power_stats[0].power_avg+'</td>\
						<td style="background-color:'+((elem.power_stats[0].power_max > power_stats.power_max) ? red : (elem.power_stats[0].power_max < power_stats.power_max) ? green : orange)+'">'+elem.power_stats[0].power_max+'</td>\
						<td style="background-color:'+((elem.power_stats[0].current_min > power_stats.current_min) ? red : (elem.power_stats[0].current_min < power_stats.current_min) ? green : orange)+'">'+elem.power_stats[0].current_min+'</td>\
						<td style="background-color:'+((elem.power_stats[0].current_max > power_stats.current_max) ? red : (elem.power_stats[0].current_max < power_stats.current_max) ? green : orange)+'">'+elem.power_stats[0].current_max+'</td>\
						<td style="background-color:'+((elem.power_stats[0].vbus_max > power_stats.vbus_max) ? red : (elem.power_stats[0].vbus_max < power_stats.vbus_max) ? green : orange)+'">'+elem.power_stats[0].vbus_max+'</td>\
						<td style="background-color:'+((elem.power_stats[0].energy > power_stats.energy) ? red : (elem.power_stats[0].energy < power_stats.energy) ? green : orange)+'"	>'+elem.power_stats[0].energy+'</td></tr>');
				});
			},
			error: function() {
				$('#prevZone').html('<center><b>No previous builds</b></center>');
			}
		});
	},
	fillDetails: function(result) {
		var me = this;

		/* Filling details part */
		$('#dt_lab_name').html(getFromJson(result.lab_name));
		$('#dt_board').html(getFromJson(result.board));
		$('#dt_board_instance').html(getFromJson(result.board_instance));
		$('#dt_tree').html(getFromJson(result.job));
		$('#dt_git_branch').html(getFromJson(result.git_branch));
		$('#dt_git_describe').html(getFromJson(result.git_describe));
		$('#dt_defconfig').html(getFromJson(result.defconfig));
		$('#dt_date').html(moment.unix(getFromJson(result.date)).format("DD/MM/YY HH:mm:ss"));
		$('#dt_dtb').html(getFromJson(result.dtb));
		$('#dt_dtb_address').html(getFromJson(result.dtb_addr));
		$('#dt_load_address').html(getFromJson(result.load_addr));
		$('#dt_initrd').html(getFromJson(result.initrd));
		$('#dt_kernel_image').html(getFromJson(result.kernel_image));
		$('#dt_status').html(((result.status == "PASS") ? '<i class="fa fa-check text-success"></i>' : '<i class="fa fa-times text-danger"></i>'));
		$('#dt_arch').html(getFromJson(result.arch));
		$('#dt_soc').html(getFromJson(result.soc));
		$('#dt_endianness').html(getFromJson(result.endian));
		$('#dt_warnings').html(getFromJson(result.warnings));
		$('#dt_boot_time').html(getFromJson(result.boot_time) + ' seconds');
		$('#dt_boot_lava').html(((result.lava_bundle == undefined || result.lava_bundle == null) ? '<i>N/A</i>' : '<a target="_blank" href="'+me.confLoader.getLavaBaseURL()+'/'+result.lava_bundle+'/">View bundle</a>'));
		$('#dt_boot_test').html(getFromJson(result.test_desc));
		$('#dt_boot_log').html('<a href="http://powerci.org:8889/'+result.job+'/'+result.kernel+'/'+result.defconfig+'/'+result.lab_name+'/boot-'+result.board+'.html"><i class="fa fa-external-link"></i> (HTML)</a>&nbsp;&nbsp;<a href="http://powerci.org:8889/'+result.job+'/'+result.kernel+'/'+result.defconfig+'/'+result.lab_name+'/boot-'+result.board+'.txt"><i class="fa fa-external-link"></i> (TXT)</a>');
		$('#dt_boot_retries').html(getFromJson(result.retries));
		$('#board_name').html(result.board);
		$('#lab_name').html("By " + result.lab_name);
	},
	manageGUI: function() {
		$('#prevZone').html('<center><i class="fa fa-circle-o-notch fa-spin"></i></center>');
		$('#previousBuildsPannel').height($('#staticCntnPannel').height());
		$("[id^=dt_]").html('<i class="fa fa-circle-o-notch fa-spin"></i>');
	}
}