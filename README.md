Clockwork
=========

Clockwork is a Firefox extension for PHP development, extending Developer Tools with a new panel providing all kinds of information useful for debugging and profiling your PHP scripts, including information on request, headers, GET and POST data, cookies, session data, database queries, routes, visualisation of application runtime and more.
Clockwork includes out of the box support for Laravel and Slim 2 based applications, you can add support for any other or a custom framework via an extensible API.

**Not a Firefox user?** Check out [Chrome version](http://github.com/itsgoingd/clockwork-chrome) or [embeddable web app version of Clockwork](http://github.com/itsgoingd/clockwork-web), supporting many modern browsers along Firefox with out of the box support for Laravel and Slim.
There are also a third-party [Firebug extension](https://github.com/sidorovich/clockwork-firebug) and a [CLI client app](https://github.com/ptrofimov/clockwork-cli) available.

![](https://dl-web.dropbox.com/get/Screenshots/Screenshot%202015-02-18%2001.15.57.png)

This extension is based on [RailsPanel](https://github.com/dejan/rails_panel), a Chrome extension for Ruby development by [Dejan Simic](http://rors.org/).

## Installation

To use this extension you need to install a [server-side component](http://github.com/itsgoingd/clockwork).

**This extension is currently in beta**, if you would like to help with testing you can [download](https://dl.dropboxusercontent.com/u/9846387/Clockwork%200.9.xpi) and install it manually. It will be available on [addons.mozilla.org](http://addons.mozilla.org/) as soon as a stable version is released.

## Licence

Copyright (c) 2013 Miroslav Rigler

MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.