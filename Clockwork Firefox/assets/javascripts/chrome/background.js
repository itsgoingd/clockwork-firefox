let api = chrome || browser
let lastClockworkRequestPerTab = {}

api.runtime.onMessage.addListener((message, sender, callback) => {
	if (message.action == 'getJSON') {
		let xhr = new XMLHttpRequest()

		xhr.open(message.method || 'GET', message.url, true)

		xhr.onreadystatechange = function() {
			if (xhr.readyState != 4) return

			if (xhr.status != 200 && xhr.status != 403) {
				return callback({ error: 'Server returned an error response.' })
			}

			let data

			try {
				data = JSON.parse(xhr.responseText)
			} catch (e) {
				return callback({ error: 'Server returned an invalid JSON.' })
			}

			if (xhr.status == 403) {
				return callback({ error: 'requires-authentication', message: data.message, requires: data.requires })
			}

			if (! (data instanceof Object) || ! Object.keys(data).length) {
				return callback({ error: 'Server returned an empty metadata.' })
			}

			callback({ data })
		}

		Object.keys(message.headers || {}).forEach(headerName => {
			xhr.setRequestHeader(headerName, message.headers[headerName])
		})

		let formData = new FormData
		Object.keys(message.data).forEach(key => formData.append(key, message.data[key]))

		xhr.send(formData)
	} else if (message.action == 'getTabUrl') {
		api.tabs.get(message.tabId, tab => callback(tab.url))
	} else if (message.action == 'getLastClockworkRequestInTab') {
		callback(lastClockworkRequestPerTab[message.tabId])
	}

	return true
})

// listen to http requests and send them to the app
api.webRequest.onHeadersReceived.addListener(
	request => {
		// ignore requests executed from the extension itself
		if (request.documentUrl && request.documentUrl.match(new RegExp('^moz-extension://'))) return

		// track last clockwork-enabled request per tab
		if (request.responseHeaders.find(x => x.name.toLowerCase() == 'x-clockwork-id')) {
			lastClockworkRequestPerTab[request.tabId] = request
		}

		api.runtime.sendMessage({ action: 'requestCompleted', request })
	},
	{ urls: [ '<all_urls>' ] },
	[ 'responseHeaders' ]
)

// listen to before navigate events and send tem to the app (used for preserve log feature)
api.webNavigation.onBeforeNavigate.addListener(details => {
	api.runtime.sendMessage({ action: 'navigationStarted', details })
})

// clean up last request when tab is closed
api.tabs.onRemoved.addListener(tabId => delete lastClockworkRequestPerTab[tabId])
