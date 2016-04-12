function initTour(page) {
	if (page == "powers") {
		return new Tour({
				  steps: [
					  {
					    element: "#tipsMain",
					    title: "Tips & tour",
					    content: "This area provides some useful tips and facts. You can make it disappear by clicking the close icon and later reset the tips and tour from the \"Settings\" menu."
					  },
					  {
					    element: "#customSearchBtn",
					    title: "Search profiles",
					    placement: "left",
					    content: "This menu will allow to create a search profile: define your search criteria and click on \"New profile\" to save your choices. You may later recall a profile or delete unused ones."
					  },
					  {
					    element: "#firstBloc",
					    title: "Search criteria",
					    placement: "bottom",
					    content: "This is the crucial interface where you can choose what you wish to search ! Some combinations, like for instance selecting a unique test-case, will allow a \"Compare\" feature. When possible, a blue icon appears that will allow to compute a bargraph to compare the Key Performance Indicator between several boards or kernel configuration for instance."
					  },
					  {
					    element: "#tourKPI",
					    title: "KEY PERFORMANCE INDICATOR (KPI)",
					    placement: "left",
					    content: "Here you can select the default KPI to display when showing results. Nevertheless in most charts, you may freely enable/disable any metrics."
					  },
					  {
					    element: "#tourTest",
					    title: "Test Cases Selection",
					    placement: "left",
					    content: "You can select one or more tests to search, based on a string search in the test description field. When a single test is selected, a blue button appears on the right: you can now compare all results generated for this very test amongst the other criteria! Try it!"
					  },
					  {
					    element: "#compareBtn-test_desc",
					    title: "Compare button",
					    placement: "left",
					    content: "When possible, a blue icon appears that will allow to compute a bargraph to compare the Key Performance Indicator between several boards or kernel configuration for instance."
					  },
					  {
					    element: ".myLine:first",
					    title: "LATEST RESULT POSTED",
					    placement: "top",
					    content: "For a given combination of [kernel-branch + config + device] the latest entry in the data base will show up in bold in the list with an arrow pictogram."
					  },
					  {
					    element: ".selectReg:first",
					    title: "KPI SELECTION FOR PERFORMANCE TREND MONITORING",
					    placement: "right",
					    content: "Here you may select the metric you wish to monitor over different revisions of the kernel sources tested in the same conditions (kernel config, device)."
					  },
					  {
					    element: ".trend:first",
					    title: "TREND PICTOGRAM",
					    placement: "left",
					    content: "This pictogram will show you how this test job compares to its previous execution in the same conditions.<br><br>* Equal: value is unchanged.<br>* Down: value is now lower.<br>* Up : value is now higher.<br>* Dash : first instance of this test, no history yet."
					  },
					  {
					    element: ".details:first",
					    title: "TEST JOB DETAILS",
					    placement: "left",
					    content: "This brings you to the detailed view of the selected test job:<br><br>* temporal chart of the power measurements<br>* Performance Metrics trend charts (when this test was run for different kernel builds)<br>* test job details and link to LAVA result bundle."
					  },
					  {
					    element: ".details:first",
					    title: "TEST JOB DETAILS",
					    placement: "left",
					    content: "This brings you to the detailed view of the selected test job:<br><br>* temporal chart of the power measurements<br>* Performance Metrics trend charts (when this test was run for different kernel builds)<br>* test job details and link to LAVA result bundle.",
					    	path: "power_details?id=5704d2aefe87c9bd48bbbbab"
					  },
					],
					debug: true,
					backdrop: true
				});
	} else {
		throw Exception('Error while loading "' + page + '" tour', false);
	}
}