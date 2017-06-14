browser.webRequest.onCompleted.addListener(
	function (request) {
		browser.runtime.sendMessage({ action: 'requestCompleted', request: request })
	},
	{ urls: [ '<all_urls>' ] },
	[ 'responseHeaders' ]
);
