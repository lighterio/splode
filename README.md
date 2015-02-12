# <a href="http://lighter.io/splode" style="font-size:40px;text-decoration:none;color:#000"><img src="https://cdn.rawgit.com/lighterio/lighter.io/master/public/splode.svg" style="width:90px;height:90px"> Splode</a>
[![NPM Version](https://img.shields.io/npm/v/splode.svg)](https://npmjs.org/package/splode)
[![Downloads](https://img.shields.io/npm/dm/splode.svg)](https://npmjs.org/package/splode)
[![Build Status](https://img.shields.io/travis/lighterio/splode.svg)](https://travis-ci.org/lighterio/splode)
[![Code Coverage](https://img.shields.io/coveralls/lighterio/splode/master.svg)](https://coveralls.io/r/lighterio/splode)
[![Dependencies](https://img.shields.io/david/lighterio/splode.svg)](https://david-dm.org/lighterio/splode)
[![Support](https://img.shields.io/gratipay/Lighter.io.svg)](https://gratipay.com/Lighter.io/)


Splode is a simple utility for handling uncaught exceptions.


### Don't ignore exceptions

If you just ignore exceptions, your server can reach a failing state without
your knowledge - like this:
```
process.on('uncaughtException', function noop (err) {})
```
![](http://media.giphy.com/media/gFwZfXIqD0eNW/giphy.gif)

This can be detrimental to your system, and it's an awful practice... so the
temptation is to simply exit whenever an uncaught exception occurs.

### Don't always exit

Sometimes, exceptions aren't that bad. For example, a function might send
request headers, then another function could attempt to do the same, The
request might have been handled improperly, but it may be desirable for the
server to continue handling requests anyway. This should be possible.

### Example

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


## Acknowledgements

We would like to thank all of the amazing people who use, support,
promote, enhance, document, patch, and submit comments & issues.
Splode couldn't exist without you.

Additionally, huge thanks go to [TUNE](http://www.tune.com) for employing
and supporting [Splode](http://lighter.io/splode) project maintainers,
and for being an epically awesome place to work (and play).


## MIT License

Copyright (c) 2014 Sam Eubank

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


## How to Contribute

We welcome contributions from the community and are happy to have them.
Please follow this guide when logging issues or making code changes.

### Logging Issues

All issues should be created using the
[new issue form](https://github.com/lighterio/splode/issues/new).
Please describe the issue including steps to reproduce. Also, make sure
to indicate the version that has the issue.

### Changing Code

Code changes are welcome and encouraged! Please follow our process:

1. Fork the repository on GitHub.
2. Fix the issue ensuring that your code follows the
   [style guide](http://lighter.io/style-guide).
3. Add tests for your new code, ensuring that you have 100% code coverage.
   (If necessary, we can help you reach 100% prior to merging.)
   * Run `npm test` to run tests quickly, without testing coverage.
   * Run `npm run cover` to test coverage and generate a report.
   * Run `npm run report` to open the coverage report you generated.
4. [Pull requests](http://help.github.com/send-pull-requests/) should be made
   to the [master branch](https://github.com/lighterio/splode/tree/master).

### Contributor Code of Conduct

As contributors and maintainers of Splode, we pledge to respect all
people who contribute through reporting issues, posting feature requests,
updating documentation, submitting pull requests or patches, and other
activities.

If any participant in this project has issues or takes exception with a
contribution, they are obligated to provide constructive feedback and never
resort to personal attacks, trolling, public or private harassment, insults, or
other unprofessional conduct.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, edits, issues, and other contributions
that are not aligned with this Code of Conduct. Project maintainers who do
not follow the Code of Conduct may be removed from the project team.

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by opening an issue or contacting one or more of the project
maintainers.

We promise to extend courtesy and respect to everyone involved in this project
regardless of gender, gender identity, sexual orientation, ability or
disability, ethnicity, religion, age, location, native language, or level of
experience.
