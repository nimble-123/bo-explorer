/*global location */
sap.ui.define([
	"dev/bo-explorer/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"dev/bo-explorer/model/formatter",
	"sap/ui/Device",
	"sap/ui/core/routing/History"
], function(BaseController, JSONModel, formatter, Device, History) {
	"use strict";

	return BaseController.extend("dev.bo-explorer.controller.Node", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});

			this.getRouter().getRoute("node").attachPatternMatched(this._onNodeMatched, this);

			this.getRouter().getTargets().getTarget("node").attachDisplay(null, this._onNodeMatched, this);

			this.setModel(oViewModel, "nodeView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler for the list selection event
		 * @param {sap.ui.base.Event} oEvent the list selectionChange event
		 * @public
		 */
		onNodesListSelectionChange: function(oEvent) {
			// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
			this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash();
			var sObjectId = this.getModel("nodeView").getProperty("/rootKey");

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("object", {
				    objectId: sObjectId
				}, true);
			}
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Binds the view to the node path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'node'
		 * @private
		 */
		_onNodeMatched: function(oEvent) {
			var sNodeKey;
			if (oEvent.getId() === "display") {
				sNodeKey = oEvent.getParameter("data").nodeKey;
			} else {
				sNodeKey = oEvent.getParameter("arguments").nodeKey;
			}
			this.getModel().metadataLoaded().then(function() {
				var sNodePath = this.getModel().createKey("Nodes", {
					NodeKey: sNodeKey
				});
				this._bindView("/" + sNodePath);
			}.bind(this));

		},

		/**
		 * Binds the view to the node path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sNodePath path to the node to be bound to the view.
		 * @private
		 */
		_bindView: function(sNodePath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("nodeView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);
			var sParentKey = this.getModel().getObject(sNodePath).ParentKey;
			var sRootKey = this.getModel().getObject(sNodePath).RootKey;
			this.getModel("nodeView").setProperty("/parentKey", sParentKey);
			this.getModel("nodeView").setProperty("/rootKey", sRootKey);
			

			this.getView().bindElement({
				path: sNodePath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function() {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if node could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			var sPath = oElementBinding.getPath(),
				oResourceBundle = this.getResourceBundle(),
				oObject = oView.getModel().getObject(sPath),
				sObjectId = oObject.NodeKey,
				sObjectName = oObject.Name,
				oViewModel = this.getModel("nodeView");

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);
		},

		/**
		 * Shows the selected item on the detail page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showDetail: function(oItem) {
			var bReplace = !Device.system.phone;
			var sObjectId = this.getModel("nodeView").getProperty("/parentKey");
			var sNodeKey = oItem.getBindingContext().getProperty("NodeKey");
			this.getRouter().navTo("node", {
				objectId: sObjectId,
				nodeKey: sNodeKey
			}, bReplace);
		},

		_onMetadataLoaded: function() {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("nodeView");

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		}

	});

});