let Clockwork = angular.module('Clockwork', [])
	.config($sceProvider => $sceProvider.enabled(false))
	.factory('requests', () => new Requests)
	.factory('updateNotification', () => new UpdateNotification)
