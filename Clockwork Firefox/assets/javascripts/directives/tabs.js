Clockwork.directive('tabs', function ($parse) {
	return {
		link: function (scope, element, attrs) {
			$(element).find('[tab-name]').on('click', function()
			{
				var tabs = $(this).parents('[tabs]');
				var tabName = $(this).attr('tab-name');

				tabs.find('[tab-name]').removeClass('active');
				$(this).addClass('active');

				tabs.find('[tab-content]').hide();
				tabs.find('[tab-content="' + tabName + '"]').show();
			});

			$(element).find('[tab-name].active').click();
		}
	};
});
