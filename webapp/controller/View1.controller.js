sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("ZMockServer.controller.View1", {

		onInit: function() {

			//标题字段名数据
			this.oAppData = {
				"Title": "",
				"Field1": "Email",
				"Field2": "Firstname",
				"Field3": "Lastname",
				"Field4": "Age",
				"Field5": "Address"
			};

			//弹出输入框数据
			this.oEntry = {};

			// 根据输出可见oAppData为Object，而Title为其属性，可以直接引用
			//console.log(this.oAppData);
			var oModel = new sap.ui.model.json.JSONModel(this.oAppData);
			this.getView().setModel(oModel, "test2");
		},

		////这种获取用户选择的方式不是很好，间隔操作，无法获取选择行内容
		// getRowSelection: function(oEvent) {

		// 	//Model
		// 	var oRowContext = oEvent.getParameter("rowContext");
		// 	//JSON Object
		// 	var oJSONData = oRowContext.getObject();
		// 	this.oEntry.Email = oJSONData.Email;
		// 	this.oEntry.Firstname = oJSONData.Firstname;
		// 	this.oEntry.Lastname = oJSONData.Lastname;
		// 	this.oEntry.Age = oJSONData.Age;
		// 	this.oEntry.Address = oJSONData.Address;
		// 	//console.log(this.oEntry);
		// },

		openDialog: function() {
			/*Instantiate and Component Style Class for the Fragment*/
			if (!this._oUserInfoDialog) {
				this._oUserInfoDialog = sap.ui.xmlfragment("ZMockServer.view.UserInfoDialog", this);
				this.getView().addDependent(this._oUserInfoDialog);
				// forward compact/cozy style into Dialog
				//this._oUserInfoDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			}
			this._oUserInfoDialog.open();
		},

		userCreate: function(oEvent) {
			this.openDialog();
			var dialogUser = sap.ui.getCore().byId("dialogUser");
			//设置Email输入框可编辑
			dialogUser.getContent()[0].getContent()[1].setEditable(true);

			var oModel1 = new sap.ui.model.json.JSONModel();
			this.oAppData.Title = "Create User";
			oModel1.setData(this.oAppData);
			this._oUserInfoDialog.setModel(oModel1, "test1");

			this.oEntry = {};
			var oModel2 = new sap.ui.model.json.JSONModel();
			oModel2.setData(this.oEntry);
			this._oUserInfoDialog.setModel(oModel2, "data");
		},

		userUpdate: function(oEvent) {
			this.openDialog();

			var dialogUser = sap.ui.getCore().byId("dialogUser");
			//设置Email输入框不可编辑
			dialogUser.getContent()[0].getContent()[1].setEditable(false);

			var oModel1 = new sap.ui.model.json.JSONModel();
			this.oAppData.Title = "Update User";
			oModel1.setData(this.oAppData);
			this._oUserInfoDialog.setModel(oModel1, "test1");

			//this.oEntry = {};
			var oTab = this.getView().byId("tab");
			var idx = oTab.getSelectedIndex();
			if (idx == -1) {
				this.oEntry = {};
			} else {
				var rows = oTab.getRows();
				var user = rows[idx].getCells();
				//console.log(idx);
				//console.log(rows);
				//console.log(user[0].getText());

				this.oEntry.Email = user[0].getText();
				this.oEntry.Firstname = user[1].getText();
				this.oEntry.Lastname = user[2].getText();
				this.oEntry.Age = user[3].getText();
				this.oEntry.Address = user[4].getText();
			}

			var oModel2 = new sap.ui.model.json.JSONModel();
			oModel2.setData(this.oEntry);
			this._oUserInfoDialog.setModel(oModel2, "data");
		},

		userDelete: function(oEvent) {
			/*Instantiate and Component Style Class for the Fragment*/
			if (!this._oUserInfoDialog) {
				this._oUserInfoDialog = sap.ui.xmlfragment("ZMockServer.view.UserInfoDialogDel", this);
				this.getView().addDependent(this._oUserInfoDialog);
				// forward compact/cozy style into Dialog
				//this._oUserInfoDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			}
			this._oUserInfoDialog.open();
		},

		fnSuccess: function(oData, oResponse) {
			sap.m.MessageToast.show("Successful");
			console.log("Response", oResponse);
		},

		fnError: function(oError) {
			sap.m.MessageToast.show("Failure");
			console.log("Error", oError);
		},

		userSubmit: function(oEvent) {

			function fnSuccess_in(oData, oResponse) {
				sap.m.MessageToast.show("Successful");
				console.log("Response", oResponse);
			}

			function fnError_in(oError) {
				sap.m.MessageToast.show("Failure");
				console.log("Error", oError);
			}

			var dialogUser = sap.ui.getCore().byId("dialogUser");
			var comp = dialogUser.getContent()[0].getContent();

			// console.log(comp[1].getValue());
			// console.log(comp[3].getValue());
			// console.log(comp[5].getValue());
			// console.log(comp[7].getValue());
			// console.log(comp[9].getValue());

			var userModel = this.getOwnerComponent().getModel();

			//sap.ui.model.json.JSONModel-->getJSON()返回String
			console.log(dialogUser.getModel("test1").getJSON());

			//sap.ui.model.ClientModel-->getData()返回JSON Object, 而Title为其属性，可以直接引用
			console.log(dialogUser.getModel("test1").getData());
			console.log(dialogUser.getModel("test1").getData().Title);

			//sap.ui.base.ManagedObject-->getModel返回为sap.ui.model.Model返回为为
			//sap.ui.model.Model-->getProperty，其参数为sPath，返回为oContext，属性绑定为sPath = "/Title",聚合绑定为sPath = "Title"
			console.log(dialogUser.getModel("test1").getProperty("/Title"));

			//if (dialogUser.getModel("test1").getData().Title === "Create User") {
			if (this.oAppData.Title === "Create User") {

				this.oEntry.Email = comp[1].getValue();
				this.oEntry.Firstname = comp[3].getValue();
				this.oEntry.Lastname = comp[5].getValue();
				this.oEntry.Age = comp[7].getValue();
				this.oEntry.Address = comp[9].getValue();

				userModel.create("/UserSet", this.oEntry, {
					success: this.fnSuccess,
					error: this.fnError
				});

			} else {
				userModel.update("/UserSet('" + this.oEntry.Email + "')", this.oEntry, {
					success: fnSuccess_in,
					error: fnError_in
				});
			}

			userModel.refresh();
			dialogUser.close();
			//dialogUser.destroy();
		},

		userSubmitDel: function(oEvent) {

			//this.oEntry = {};
			var oTab = this.getView().byId("tab");
			var idx = oTab.getSelectedIndex();
			if (idx !== -1) {
				var dialogUserDel = sap.ui.getCore().byId("dialogUserDel");
				var userModel = this.getOwnerComponent().getModel();

				var rows = oTab.getRows();
				var user = rows[idx].getCells();
				var oEmail = user[0].getText();

				userModel.remove("/UserSet('" + oEmail + "')", {
					success: this.fnSuccess,
					error: this.fnError
				});

			}
			oTab.setSelectedIndex(-1);
			userModel.refresh();
			dialogUserDel.close();
		},

		userCancel: function(oEvent) {
			sap.ui.getCore().byId("dialogUser").close();
			//sap.ui.getCore().byId("dialogUser").destroy();
		}
	});
});