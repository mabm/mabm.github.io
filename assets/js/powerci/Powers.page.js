var Powers = {
	/* Attributes */
	confLoader : ConfLoader,
	tour: null,
	load: false,
	page: 1,
	resultPerPage: 10,
	defaultTestPlan: "power",
	totalEntry: 0,
	defaultRegressionPicto: '<i class="fa fa-minus"></i>',
	totalResults: 0,
	offset: null,
	canScroll: true,
	profilManager: Profils,
	searchQuery: null,

	/* Methods */
	init: function(configFile) {
		var me = this;

		try {
			this.confLoader.load(configFile).done(function() {
				me.tour = initTour('powers'); // Init powers tour
				showTips('#tipsMain'); // Call function which will show or not tips by reading SessionStorage
				me.tour.init(); // Init tour AFTER "showTips" cause 
				me.manageTips();
				me.manageGUI();
				me.profilManager.displayProfils();
			}); // Load JSON config file - Promise returned
		} catch (e) {
			throw e;
		}
	},
	launch: function() {
		try {
			this.listContent();
		} catch (e) {
			throw e;
		}
	},
	getTour: function() {
		return this.tour;
	},
	manageTips: function() {
		$('#closeTips1').click(function() {
			localStorage.setItem('powerci_tips', 'no');
		})

		$('#closeTips2').click(function() {
			localStorage.setItem('powerci_tips', 'no');
		})
	},
	manageGUI: function() {
		var me = this;

		$("[id^=compareBtn]").hide();
		$('#compareView').hide();

		$('.more').click(function() {
			me.loadBoots(++(me.page), false, false);
		});

		$('#page_select').change(function() {
			me.resultPerPage = $(this).val();
		});

		$('#searchBtn').click(function() {
			me.processRequest($(this), true);
		});
	},
	manageBeforeLoading: function() {
		$('#noResult').hide();
		$('.loadmore').show();
		$('.more').hide();
	},
	manageRegressionSelect: function(elem) {
		var me = this;

		$('.select-'+elem._id.$id).change(function() {
			if (!elem.regression || elem.regression.length <= 0)
				return;
			regPicto = me.defaultRegressionPicto;
			target = $(this).attr('target');
			$('#'+target+'_reg').html('<i class="fa fa-circle-o-notch fa-spin"></i>');

			if (elem.regression[0][$(this).val()] == "GT")
				regPicto = '<i class="text-success icon-stairs-up"></i>';
			else if (elem.regression[0][$(this).val()] == 'LT')
				regPicto = '<i class="text-danger icon-stairs-down"></i>';
			else if (elem.regression[0][$(this).val()] == 'EQ')
				regPicto = '<i class="text-warning fa fa-equal"></i>';
			$('#'+target+'_reg').html(regPicto);
		})
	},
	calculateCurrentRegression: function(elem, dKPIField) {
		regPicto = this.defaultRegressionPicto;
		if (elem.regression) {
			if (elem.regression.length == 0)
				regPicto = '<i class="text-warning fa fa-question"></i>';
			else if (elem.regression[0][dKPIField] == "GT")
				regPicto = '<i class="text-success icon-stairs-up"></i>';
			else if (elem.regression[0][dKPIField] == 'LT')
				regPicto = '<i class="text-danger icon-stairs-down"></i>';
			else if (elem.regression[0][dKPIField] == 'EQ')
				regPicto = '<i class="text-warning fa fa-equal"></i>';
		}
		$('#'+elem._id.$id+'_reg').html(regPicto);
		$('.selectReg option[value="'+dKPIField+'"]').attr("selected", true);
	},
	updateResultCounter: function() {
		$('#fixed1').html(this.totalEntry + '/' + this.totalResults);
		$('#fixed2').html(Math.round(eval(this.totalEntry * 100 / this.totalResults)) + '%');
	},
	updateInvertedTabHeader: function() {
		for (j = 0; j < 14; j++) {
			$('#fc' + j).width($('#c' + j).width());
		}
	},
	listContent: function() {
		var me = this;

		$.ajax({
			method: "GET",
			url: this.confLoader.getApiURL() + '/boot/list-content',
			headers: {
				"Authorization" : this.confLoader.getApiToken(),
				"Content-Type" :"application/json"
			},
			success: function(data) {
				me.searchQuery = {'sort':{'field': 'date', 'type':'DESC'}, 'criterias':{}};
				me.searchQuery.criterias['arch'] = Array();
				$.each(data.result.archs, function(i, elem) {
					me.searchQuery.criterias['arch'].push(elem);
					$('#select-archs').append('<option selected="selected">' + elem + '</option>');
				});
				me.searchQuery.criterias['kernel'] = Array();
				$.each(data.result.kernels, function(i, elem) {
					me.searchQuery.criterias['kernel'].push(elem);
					$('#select-kernels').append('<option selected="selected">' + elem + '</option>');
				});
				me.searchQuery.criterias['job'] = Array();
				$.each(data.result.trees, function(i, elem) {
					me.searchQuery.criterias['job'].push(elem);
					$('#select-job').append('<option selected="selected">' + elem + '</option>');
				});
				me.searchQuery.criterias['defconfig_full'] = Array();
				$.each(data.result.defconfigs, function(i, elem) {
					me.searchQuery.criterias['defconfig_full'].push(elem);
					$('#select-defconfigs').append('<option selected="selected">' + elem + '</option>');
				});
				me.searchQuery.criterias['board'] = Array();
				$.each(data.result.boards, function(i, elem) {
					me.searchQuery.criterias['board'].push(elem);
					$('#select-boards').append('<option selected="selected">' + elem + '</option>');
				});
				me.searchQuery.criterias['test_desc'] = Array();
				$.each(data.result.test_desc, function(i, elem) {
					me.searchQuery.criterias['test_desc'].push(elem);
					$('#select-test_desc').append('<option selected="selected">' + elem + '</option>');
				});
				me.generateTab();
				$(".select-icons").select2();
				// $("[id^=select-]").each(function(i, elem) {
				// 	me.changeTest($(elem).attr('id'), $(elem).attr('field'));
				// });
				me.totalResults = data.result.boots_total;
				$('#searchBtn').html('<i class="fa fa-refresh"></i> Search among ' + me.totalResults + ' records');
			}
		});
	},
	initInfiniteScroll: function() {
		var offset = $('.myLine:last').offset(); 
		var me = this;
	 
		$(window).scroll(function() {
			
			if (isScrolledIntoView("#tableHeader")) {
				$('#tableHeaderFixed').hide();
			} else if ($(window).scrollTop() > $('#firstBloc').height()) {
				$('#tableHeaderFixed').show();
				$('#tableHeaderFixed').width($('.table-responsive').width());
			}

			me.updateInvertedTabHeader();

			if ((offset.top - $(window).height() <= $(window).scrollTop()) && !me.load && 
				($('.myLine').size() >= 5) && me.canScroll) {
					me.loadBoots(++(me.page), false, false);
			}
		});
	},
	generateCriterias: function(generateQuery) {
		var me = this;

		if (generateQuery) {
			this.searchQuery = {'sort':{'field': $('#sort_select').val().split("_")[0], 'type':$('#sort_select').val().split("_")[1]}, 'criterias':{}};
			$("[id^=select-]").each(function(i, elem) {
				if ($(elem).val())
					me.searchQuery.criterias[$(elem).attr('field')] = $(elem).val();
			});
		}
	},
	generateTab: function() {
		$('#mainTab').html('');
		this.loadBoots(1, true, true);
	},
	processRequest: function(me, generateQuery) {
		$('#mainTab').html('');

		if (this.load) {
			me.effect( "highlight", {color: 'red'}, 400);
			return;
		}
		this.page = 1;
		this.load = false;
		this.offset = null;
		this.canScroll = true;
		this.generateCriterias(generateQuery);
		me.html('<i class="fa fa-cog fa-spin"></i> Search in progreess ...');
		this.totalEntry = 0;
		this.loadBoots(1, false, true);
	},
	updateInfiniteScroll: function(data) {
		$('.myLine:last').after(data);
		this.offset = $('.myLine:last').offset();
	},
	loadBoots: function(page, first, second) {
		var me = this;

		this.load = true;
		this.manageBeforeLoading();
		$.ajax({
			method: "PUT",
			data: JSON.stringify(this.searchQuery),
			url: this.confLoader.getApiURL() + '/boot/search?nbr=' + this.resultPerPage + '&p=' + this.page,
			headers: {
				"Authorization" : this.confLoader.getApiToken(),
				"Content-Type" : "application/json"
			},
			success: function(data) {
				$.each(data.result, function(i, elem) {
					var dKPIField = $('#default_kpi').val(); // Get default KPI selected by user
					$('.dKPITab').html($('#default_kpi option:selected').text()); // Set column name to selected KPI

					if (elem.test_plan == me.defaultTestPlan && elem.boot_result == "PASS") {
						me.totalEntry++; // Count total entry
						if (!elem.power_stats) // Fetched boot does not have power values
							return;

						var meCumulNRJ = 0;
						$.each(elem.power_stats, function(ii, ps) {
							if (ps[dKPIField] == "00.00")
								return;
							meCumulNRJ += eval(ps[dKPIField]);
							if (ii >= 4)
								return false;
						});
						// Add each boots into tab
						$('#mainTab').append('<tr '+((elem.lastBuild) ? 'style="font-weight: bold;"' : '')+' id="'+elem._id.$id+'" class="myLine '+((elem.lastBuild) ? '' : '')+'" ><td class="hidden-md hidden-sm hidden-xs" id="'+elem._id.$id+'"><i class="fa fa-'+((elem.lastBuild) ? 'arrow-right' : 'child')+'"></i></td><td>'+elem.job+'</td><td>'+elem.kernel+'</td><td>'+elem.board+'</td><td><span data-toggle="tooltip" data-placement="top" title="'+elem.defconfig_full+'">'+elem.defconfig+'</span></td><td>'+getFromJson(elem.test_desc)+'</td><td>'+meCumulNRJ+'</td><td class="hidden-md hidden-sm hidden-xs">'+elem.arch+'</td><td class="text-center"><select target="'+elem._id.$id+'" class="selectReg select-'+elem._id.$id+'" class="form-control"> <option value="energy">Energy</option> <option value="power_min">Power Min</option> <option value="power_avg">Power AVG</option> <option value="power_max">Power Max</option> <option value="current_min">Current Min</option> <option value="current_max">Current Max</option> <option value="vbus_max">Voltage Max</option></select></td><td id="'+elem._id.$id+'_reg" class="text-center trend"><i class="fa fa-circle-o-notch fa-spin"></i></td><td class="hidden-md hidden-sm hidden-xs">'+elem.lab_name+'</td><td class="hidden-md hidden-sm hidden-xs">'+moment.unix(elem.date).format("DD/MM/YY HH:mm:ss")+'</td><td class="text-center details"><a href="power_details?id='+elem._id.$id+'"><i class="icon-search4"></i> Details</a></td></tr>');
						
						me.manageRegressionSelect(elem); // Call this function to change regression picto when select changes
						me.calculateCurrentRegression(elem, dKPIField); // Call this function to set regression picto for actual regression
					}
				});
				
				me.updateResultCounter();
				me.updateInvertedTabHeader(); // Update columns width for the inverted table's header
				
				$('[data-toggle="tooltip"]').tooltip(); // Enable tooltips for defconfig_full

				if (first) me.initInfiniteScroll(); // Enable infinite scroll if this is first call

				$('.loadmore').fadeOut(500, function() {
					$('.more').fadeIn(500);
				});

				$('#searchBtn').html('<i class="fa fa-refresh"></i> Search among ' + me.totalResults + ' records');

				me.updateInfiniteScroll(data);

				me.load = false;
			},
			error: function(data) {
				me.canScroll = false;
				me.load = false;

				$('.loadmore').fadeOut(500);
				$('.more').hide();

				if (second) {
					$('#noResult').show();
					$('#searchBtn').html('<i class="fa fa-refresh"></i> Search among ' + me.totalResults + ' records');
				} else if (first) {
					swal({
						title: "Oops...",
						text: "Something went wrong!<br>Reason: API is maybe down ?",
						confirmButtonColor: "#EF5350",
						html: true,
						type: "error"
					});
				}
			}
		});
	}
}