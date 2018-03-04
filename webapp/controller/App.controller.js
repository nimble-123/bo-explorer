sap.ui.define([
	"jquery.sap.global",
	"dev/bo-explorer/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/ResizeHandler",
	"sap/ui/Device",
	"sap/ui/core/Fragment",
	"sap/ui/core/IconPool",
	"sap/m/SplitAppMode",
	"sap/m/MessageBox",
	"sap/m/library"
], function(jQuery, BaseController, JSONModel, ResizeHandler, Device, Fragment, IconPool, SplitAppMode, MessageBox, mobileLibrary) {
	"use strict";

	return BaseController.extend("dev.bo-explorer.controller.App", {

		onInit: function() {
			BaseController.prototype.onInit.call(this);
			var oViewModel,
				fnSetAppNotBusy,
				oListSelector = this.getOwnerComponent().oListSelector,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				bPhoneSize: false,
				bLandscape: Device.orientation.landscape,
				bHasMaster: true,
				bSearchMode: false,
				bHideEmptySections: window['sap-ui-documentation-hideEmptySections'],
				sAboutInfoSAPUI5: "",
				sAboutInfoOpenUI5: ""
			});
			var oHeaderModel = new JSONModel({
				bShowSubHeader: Device.system.phone
			});
			var sTabNavigationId;

			// Cache view reference
			this._oView = this.getView();

			this.setModel(oViewModel, "appView");

			// set the global header visibility data
			this.setModel(oHeaderModel, "headerView");

			this.oHeader = this._oView.byId("headerToolbar");

			sTabNavigationId = (Device.system.phone) ? "selectHeader" : "tabHeader";
			this._oView.byId(sTabNavigationId).setStashed(false);
			this.oTabNavigation = this._oView.byId(sTabNavigationId);

			// the unstashed control is added as **last child** => correct its position in parent container
			this.oHeader.removeContent(this.oTabNavigation);
			this.oHeader.insertContent(this.oTabNavigation, 1);

			this.oRouter = this.getRouter();

			ResizeHandler.register(this.oHeader, this.onHeaderResize.bind(this));

			fnSetAppNotBusy = function() {
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			};

			this.getOwnerComponent().getModel().metadataLoaded().then(fnSetAppNotBusy);

			// Makes sure that master view is hidden in split app
			// after a new list entry has been selected.
			oListSelector.attachListSelectionChange(function() {
				this.byId("idAppControl").hideMaster();
			}, this);

			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		
		onBeforeRendering: function() {
			Device.orientation.detachHandler(this._onOrientationChange, this);
		},

		onAfterRendering: function() {
			// apply content density mode to the body tag
			// in order to get the controls in the static area styled correctly,
			// such as Dialog and Popover.
			jQuery(document.body).addClass(this.getOwnerComponent().getContentDensityClass());

			Device.orientation.attachHandler(this._onOrientationChange, this);
		},

		onExit: function() {
			Device.orientation.detachHandler(this._onOrientationChange, this);
		},
		
		onHeaderResize: function(oEvent) {
			var iWidth = oEvent.size.width,
				bPhoneSize = Device.system.phone || iWidth < Device.media._predefinedRangeSets[Device.media.RANGESETS.SAP_STANDARD_EXTENDED].points[
					0];

			this.getModel("appView").setProperty("/bPhoneSize", bPhoneSize);

			this._toggleTabHeaderClass();
		},
		
		_onOrientationChange: function() {
			this.getModel("appView").setProperty("/bLandscape", Device.orientation.landscape);

			this._toggleTabHeaderClass();
		},
		
		_isToggleButtonVisible: function() {
			var oViewModel = this.getModel("appView"),
				bHasMaster = oViewModel.getProperty("/bHasMaster"),
				bPhoneSize = oViewModel.getProperty("/bPhoneSize"),
				bLandscape = oViewModel.getProperty("/bLandscape"),
				bSearchMode = oViewModel.getProperty("/bSearchMode");

			return bHasMaster && (bPhoneSize || !bLandscape) && !bSearchMode;
		},

		_toggleTabHeaderClass: function() {
			var th = this.byId("tabHeader");
			if (th.getMetadata().getName() === "sap.ui.core._StashedControl") {
				return;
			}
			if (this._isToggleButtonVisible()) {
				th.addStyleClass("tabHeaderNoLeftMargin");
			} else {
				th.removeStyleClass("tabHeaderNoLeftMargin");
			}
		}

	});

});