jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 BusinessObjects in the list
// * All 3 BusinessObjects have at least one Nodes

sap.ui.require([
	"sap/ui/test/Opa5",
	"dev/bo-explorer/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"dev/bo-explorer/test/integration/pages/App",
	"dev/bo-explorer/test/integration/pages/Browser",
	"dev/bo-explorer/test/integration/pages/Master",
	"dev/bo-explorer/test/integration/pages/Detail",
	"dev/bo-explorer/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "dev.bo-explorer.view."
	});

	sap.ui.require([
		"dev/bo-explorer/test/integration/MasterJourney",
		"dev/bo-explorer/test/integration/NavigationJourney",
		"dev/bo-explorer/test/integration/NotFoundJourney",
		"dev/bo-explorer/test/integration/BusyJourney"
	], function () {
		QUnit.start();
	});
});