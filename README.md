# Splode

[![NPM Version](https://badge.fury.io/js/splode.png)](http://badge.fury.io/js/splode)
[![Build Status](https://travis-ci.org/zerious/splode.png?branch=master)](https://travis-ci.org/zerious/splode)
[![Code Coverage](https://coveralls.io/repos/zerious/splode/badge.png?branch=master)](https://coveralls.io/r/zerious/splode)
[![Dependencies](https://david-dm.org/zerious/splode.png?theme=shields.io)](https://david-dm.org/zerious/splode)
[![Support](http://img.shields.io/gittip/zerious.png)](https://www.gittip.com/zerious/)

Splode is a simple utility for handling uncaught exceptions.

## Don't ignore exceptions

If you just ignore exceptions, your server can reach a failing state without
your knowledge - like this:
```
process.on(‘uncaughtException’, function noop (err) {})
```
![](http://media.giphy.com/media/gFwZfXIqD0eNW/giphy.gif)

This can be detrimental to your system, and it's an awful practice... so the
temptation is to simply exit whenever an uncaught exception occurs.

## Don't always exit

Sometimes, exceptions aren't that bad. For example, a function might send
request headers, then another function could attempt to do the same, The
request might have been handled improperly, but it may be desirable for the
server to continue handling requests anyway. This should be possible.

## Example

Splode listens for `uncaughtException` and allows callbacks to receive the
exceptions via `splode.listen`. If `splode.recover` is called, Splode will
allow the process to continue, otherwise it will exit.

```javascript
var splode = require('splode');

splode.listen(function (error) {
	// If the error isn't serious, we can `recover`.
	if (/ENOTSERIOUS/.test(error.message)) {
		// When we recover, Splode will log a warning.
		splode.recover();
	}
});
```

## API

#### splode.listen(function callback)
Sets a callback to be called with `callback(err)` when an uncaught exception
occurs.

#### splode.recover()
Tells Splode you are recovering from the error. Otherwise, Splode will call
`process.exit()`.

#### splode.setLogger(Object logger)
Sets a custom logger for Splode to use. Splode uses `console` by default.
A custom logger must expose `logger.error(err)`.


## The Future

The [Node.js documentation](http://nodejs.org/api/process.html#process_event_uncaughtexception)
warns against using process.on('uncaughtException'), but the suggested
alternative ([Domain](http://nodejs.org/api/domain.html)) is not yet stable.
When it stabilizes, Splode will be updated to use the new stuff.
