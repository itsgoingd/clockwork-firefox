Glue = function($scope)
{
	this.$scope = $scope;
};

Glue.prototype.initialize = function()
{
	var self = this;

	window.addEventListener('message', function(event)
	{
		var data = JSON.parse(event.data);

		if (data.action == 'new-request') {
			self.newRequest(data.data);
		}
	});
};

Glue.prototype.newRequest = function(data)
{
	var $scope = this.$scope;

	$scope.$apply(function()
	{
		$scope.addRequest(data.id, data);
	});
};
