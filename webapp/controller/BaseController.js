/*global history */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/Device",
	"sap/m/library"
], function(Controller, History, Device, mobileLibrary) {
	"use strict";

	return Controller.extend("dev.bo-explorer.controller.BaseController", {

		// Prerequisites
		_oCore: sap.ui.getCore(),

		onInit: function() {
			// Load <code>versionInfo</code> to ensure the <code>versionData</code> model is loaded.
			if (Device.system.phone || Device.system.tablet) {
				this.getOwnerComponent().loadVersionInfo(); // for Desktop is always loaded in <code>Component.js</code>
			}
		},

		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		},

		/**
		 * Switches the maximum height of the phone image for optimal display in landscape mode
		 * @param {sap.ui.base.Event} oEvent Device orientation change event
		 * @private
		 */
		_onOrientationChange: function(oEvent) {
			if (Device.system.phone) {
				this.byId("phoneImage").toggleStyleClass("phoneHeaderImageLandscape", oEvent.landscape);
			}
		},

		/**
		 * Registers an event listener on device orientation change
		 * @private
		 */
		_registerOrientationChange: function() {
			Device.orientation.attachHandler(this._onOrientationChange, this);
		},

		/**
		 * Deregisters the event listener for device orientation change
		 * @private
		 */
		_deregisterOrientationChange: function() {
			Device.orientation.detachHandler(this._onOrientationChange, this);
		},

		/**
		 * Handles landing image load event and makes landing image headline visible
		 * when the image has loaded.
		 */
		handleLandingImageLoad: function() {
			this.getView().byId("landingImageHeadline").setVisible(true);
		}

	});

});