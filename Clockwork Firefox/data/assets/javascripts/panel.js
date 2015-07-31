Clockwork.controller('PanelController', function PanelController($scope, $http, toolbar)
{
	$scope.activeId = null;
	$scope.requests = {};

	$scope.activeCookies = [];
	$scope.activeDatabaseQueries = [];
	$scope.activeEmails = [];
	$scope.activeGetData = [];
	$scope.activeHeaders = [];
	$scope.activeLog = [];
	$scope.activePostData = [];
	$scope.activeRequest = [];
	$scope.activeRoutes = [];
	$scope.activeSessionData = [];
	$scope.activeTimeline = [];
	$scope.activeTimelineLegend = [];
	$scope.activeViews = [];

	$scope.showIncomingRequests = true;

	$scope.init = function(type)
	{
		$('#tabs').tabs();

		if (Glue instanceof Function) {
			this.glue = new Glue(this);
			this.glue.initialize();
		} else {
			$scope.initStandalone();
		}

		this.createToolbar();
	};

	$scope.initStandalone = function()
	{
		// generate a hash of get params from query string (http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values)
		var getParams = (function(a) {
			if (a === '') return {};
			var b = {};
			for (var i = 0; i < a.length; ++i) {
				var p = a[i].split('=');
				if (p.length != 2) continue;
				b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
			}
			return b;
		})(window.location.search.substr(1).split('&'));

		if (getParams['id'] === undefined)
			return;

		$http.get('/__clockwork/' + getParams['id']).success(function(data){
			$scope.addRequest(getParams['id'], data);
		});
	};

	$scope.createToolbar = function()
	{
		toolbar.createButton('ban', 'Clear', function()
		{
			$scope.$apply(function() {
				$scope.clear();
			});
		});

		$('.toolbar').replaceWith(toolbar.render());
	};

	$scope.addRequest = function(requestId, data)
	{
		data.responseDurationRounded = data.responseDuration ? Math.round(data.responseDuration) : 0;
		data.databaseDurationRounded = data.databaseDuration ? Math.round(data.databaseDuration) : 0;

		data.cookies = $scope.createKeypairs(data.cookies);
		data.emails = $scope.processEmails(data.emailsData);
		data.getData = $scope.createKeypairs(data.getData);
		data.headers = $scope.processHeaders(data.headers);
		data.log = $scope.processLog(data.log);
		data.postData = $scope.createKeypairs(data.postData);
		data.sessionData = $scope.createKeypairs(data.sessionData);
		data.timeline = $scope.processTimeline(data);
		data.views = $scope.processViews(data.viewsData);

		data.errorsCount = $scope.getErrorsCount(data);
		data.warningsCount = $scope.getWarningsCount(data);

		$scope.requests[requestId] = data;

		if ($scope.showIncomingRequests) {
			$scope.setActive(requestId);
		}
	};

	$scope.clear = function()
	{
		$scope.requests = {};
		$scope.activeId = null;

		$scope.activeCookies = [];
		$scope.activeDatabaseQueries = [];
		$scope.activeEmails = [];
		$scope.activeGetData = [];
		$scope.activeHeaders = [];
		$scope.activeLog = [];
		$scope.activePostData = [];
		$scope.activeRequest = [];
		$scope.activeRoutes = [];
		$scope.activeSessionData = [];
		$scope.activeTimeline = [];
		$scope.activeTimelineLegend = [];
		$scope.activeViews = [];

		$scope.showIncomingRequests = true;
	};

	$scope.setActive = function(requestId)
	{
		$scope.activeId = requestId;

		$scope.activeCookies = $scope.requests[requestId].cookies;
		$scope.activeDatabaseQueries = $scope.requests[requestId].databaseQueries;
		$scope.activeEmails = $scope.requests[requestId].emails;
		$scope.activeGetData = $scope.requests[requestId].getData;
		$scope.activeHeaders = $scope.requests[requestId].headers;
		$scope.activeLog = $scope.requests[requestId].log;
		$scope.activePostData = $scope.requests[requestId].postData;
		$scope.activeRequest = $scope.requests[requestId];
		$scope.activeRoutes = $scope.requests[requestId].routes;
		$scope.activeSessionData = $scope.requests[requestId].sessionData;
		$scope.activeTimeline = $scope.requests[requestId].timeline;
		$scope.activeTimelineLegend = $scope.generateTimelineLegend();
		$scope.activeViews = $scope.requests[requestId].views;

		var lastRequestId = Object.keys($scope.requests)[Object.keys($scope.requests).length - 1];

		$scope.showIncomingRequests = requestId == lastRequestId;
	};

	$scope.getClass = function(requestId)
	{
		if (requestId == $scope.activeId) {
			return 'selected';
		} else {
			return '';
		}
	};

	$scope.showDatabaseConnectionColumn = function()
	{
		var connections = {};

		$scope.activeDatabaseQueries.forEach(function(query)
		{
			connections[query.connection] = true;
		});

		return Object.keys(connections).length > 1;
	};

	$scope.createKeypairs = function(data)
	{
		var keypairs = [];

		if (!(data instanceof Object)) {
			return keypairs;
		}

		$.each(data, function(key, value){
			keypairs.push({name: key, value: value});
		});

		return keypairs;
	};

	$scope.generateTimelineLegend = function()
	{
		var items = [];

		var maxWidth = $('.data-grid-details').width() - 230;
		var labelCount = Math.floor(maxWidth / 80);
		var step = $scope.activeRequest.responseDuration / (maxWidth - 20);

		for (var j = 2; j < labelCount + 1; j++) {
			items.push({
				left: (j * 80 - 35).toString(),
				time: Math.round(j * 80 * step).toString()
			});
		}

		if (maxWidth - ((j - 1) * 80) > 45) {
			items.push({
				left: (maxWidth - 35).toString(),
				time: Math.round(maxWidth * step).toString()
			});
		}

		return items;
	};

	$scope.processEmails = function(data)
	{
		var emails = [];

		if (!(data instanceof Object)) {
			return emails;
		}

		$.each(data, function(key, value)
		{
			if (!(value.data instanceof Object)) {
				return;
			}

			emails.push({
				'to':      value.data.to,
				'subject': value.data.subject,
				'headers': value.data.headers
			});
		});

		return emails;
	};

	$scope.processHeaders = function(data)
	{
		var headers = [];

		if (!(data instanceof Object)) {
			return headers;
		}

		$.each(data, function(key, value){
			key = key.split('-').map(function(value){
				return value.capitalize();
			}).join('-');

			$.each(value, function(i, value){
				headers.push({name: key, value: value});
			});
		});

		return headers;
	};

	$scope.processLog = function(data)
	{
		if (!(data instanceof Object)) {
			return [];
		}

		$.each(data, function(key, value) {
			value.time = new Date(value.time * 1000);
		});

		return data;
	};

	$scope.processTimeline = function(data)
	{
		var j = 1;
		var maxWidth = $('.data-grid-details').width() - 230 - 20;

		var timeline = [];

		$.each(data.timelineData, function(i, value){
			value.style = 'style' + j.toString();
			value.left = (value.start - data.time) * 1000 / data.responseDuration * 100;
			value.width = value.duration / data.responseDuration * 100;

			value.durationRounded = Math.round(value.duration);

			if (value.durationRounded === 0) {
				value.durationRounded = '< 1';
			}

			if (i == 'total') {
				timeline.unshift(value);
			} else {
				timeline.push(value);
			}

			if (++j > 3) j = 1;
		});

		return timeline;
	};

	$scope.processViews = function(data)
	{
		var views = [];

		if (!(data instanceof Object)) {
			return views;
		}

		$.each(data, function(key, value)
		{
			if (!(value.data instanceof Object)) {
				return;
			}

			views.push({
				'name': value.data.name,
				'data': value.data.data
			});
		});

		return views;
	};

	$scope.getErrorsCount = function(data)
	{
		var count = 0;

		$.each(data.log, function(index, record)
		{
			if (record.level == 'error') {
				count++;
			}
		});

		return count;
	};

	$scope.getWarningsCount = function(data)
	{
		var count = 0;

		$.each(data.log, function(index, record)
		{
			if (record.level == 'warning') {
				count++;
			}
		});

		return count;
	};

	angular.element(window).bind('resize', function() {
		$scope.$apply(function(){
			$scope.activeTimelineLegend = $scope.generateTimelineLegend();
		});
    });
});
