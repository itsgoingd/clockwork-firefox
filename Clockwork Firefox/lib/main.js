const { Panel } = require('dev/panel');
const { Tool } = require('dev/toolbox');
const { Class } = require('sdk/core/heritage');
const { Request } = require("sdk/request");
const { Cc, Ci } = require('chrome');
const tabs = require("sdk/tabs");

const ClockworkPanel = Class({
	extends: Panel,
	label: 'Clockwork',
	tooltip: 'Devtools panel for PHP development',
	icon: './assets/images/logo-64x64.png',
	url: './app.html',
	setup: function(options)
	{
		this.inspectedTab = tabs.activeTab.id;
	},
	dispose: function()
	{
	},
	onReady: function()
	{
		var panel = this;

		var httpRequestObserver = {
			init: function()
			{
				var observerService = Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService);
				observerService.addObserver(this, 'http-on-examine-response', false);
			},
			observe: function(subject, topic, data)
			{
				if (topic != "http-on-examine-response") {
					return;
				}

				if (!requestIsFromInspectedTab(subject, panel.inspectedTab)) {
					return;
				}

				this.onExamineResponse(subject);
			},
			onExamineResponse: function(request)
			{
				processRequest(request, panel);
			}
		};

		httpRequestObserver.init();
	}
});
exports.ClockworkPanel = ClockworkPanel;

const ClockworkTool = new Tool({
  panels: { repl: ClockworkPanel }
});

function processRequest(request, panel)
{
	var clockworkId, clockworkVersion, clockworkPath;

	try {
		clockworkId = request.getResponseHeader('X-Clockwork-ID');
	} catch (err) {
		return; // required header
	}

	try {
		clockworkVersion = request.getResponseHeader('X-Clockwork-Version');
	} catch (err) {
		return; // required header
	}

	try {
		clockworkPath = request.getResponseHeader('X-Clockwork-Path');
	} catch (err) {
		clockworkPath = '/__clockwork/';
	}

	var baseUrl = request.URI.prePath;

	var clockworkDataUrl = baseUrl + clockworkPath + clockworkId;

	Request({
		url: clockworkDataUrl,
		onComplete: function(response)
		{
			var data = {
				'action': 'new-request',
				'data': response.json
			};

			panel.postMessage(JSON.stringify(data), []);
		}
	}).get();
}

function requestIsFromInspectedTab(subject, inspectedTab)
{
	var oHttp = subject.QueryInterface(Ci.nsIHttpChannel);

	if (!oHttp.notificationCallbacks) {
		return false;
	}

	var interfaceRequestor = oHttp.notificationCallbacks.QueryInterface(Ci.nsIInterfaceRequestor);
	try {
		loadContext = interfaceRequestor.getInterface(Ci.nsILoadContext);
	} catch (ex) {
		return false;
	}

	var contentWindow;
	try {
		contentWindow = loadContext.associatedWindow;
	} catch (ex) {
		return false;
	}
	var aDOMWindow = contentWindow.top.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation).QueryInterface(Ci.nsIDocShellTreeItem).rootTreeItem.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindow);
	var gBrowser = aDOMWindow.gBrowser;
	var aTab = gBrowser._getTabForContentWindow(contentWindow.top);
	var browser = aTab.linkedBrowser;

	if (aTab.linkedPanel !== 'panel' + inspectedTab) {
		return false;
	}

	return true;
}