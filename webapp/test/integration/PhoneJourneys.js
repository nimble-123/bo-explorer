jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

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
		"dev/bo-explorer/test/integration/NavigationJourneyPhone",
		"dev/bo-explorer/test/integration/NotFoundJourneyPhone",
		"dev/bo-explorer/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});