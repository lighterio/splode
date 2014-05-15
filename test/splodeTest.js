var assert = require('assert-plus');

require('zeriousify').test();

var splode = require('../splode');

var exit = process.exit;
var exits = 0;
var mochaHandler;

process.exit = function () {
	exits++;
};

var splodeListener;
var otherListeners = [];
var blackHoleLogger = {
	error: function () {},
	warn: function () {},
	IS_BLACK_HOLE: true
};
var AppendLogger = function () {
	var logger = this;
	logger.ERR = [];
	logger.error = function (message) {
		logger.ERR.push(message);
	},
	logger.WRN = [];
	logger.warn = function (message) {
		logger.WRN.push(message);
	}
};

function listenUniquely() {
	splode._callbacks.pop();
	while (listener = process.listeners('uncaughtException').pop()) {
			process.removeListener('uncaughtException', listener);
			if (listener.name == 'SPLODE_LISTENER') {
				splodeListener = listener;
			} else {
				otherListeners.push(listener);
			}
	}
	if (splodeListener) {
		process.addListener('uncaughtException', splodeListener);
	}
}

describe('splode', function () {

	describe('.setLogger', function () {

			it('should be a function', function () {
				assert.equal(typeof splode.setLogger, 'function');
			});

			it('should set a logger', function () {
					splode.setLogger(new AppendLogger());
					assert.equal(splode._logger.ERR.length, 0);
			});

			it('should require .error and .warn', function () {
				listenUniquely();
				var logger = splode._logger;
				splode.setLogger(blackHoleLogger);
				splode.listen(function (err) {
					if (/Splode logger/.test(err.message)) {
						splode.recover();
					}
				});
				var doNothing = function() {};
				splode.setLogger({});
				splode.setLogger({warn: doNothing});
				splode.setLogger({error: doNothing});
				splode.setLogger({error: 1, warn: doNothing});
				splode.setLogger({error: doNothing, warn: 1});
				assert.equal(splode._logger.IS_BLACK_HOLE, true);
				splode.setLogger(logger);
			});

	});

	describe('.listen', function () {

		it('should be a function', function () {
			assert.equal(typeof splode.listen, 'function');
		});

		it('should listen for errors', function (done) {
			listenUniquely();
			exits = 0;
			splode.listen(function (err) {
				setTimeout(function () {
					assert.equal(err, 'Error: error');
					assert.equal(exits, 1);
					done();
				}, 10);
			});
			process.emit('uncaughtException', new Error('error'));
		});

		it('should prevent circular errors', function () {
			listenUniquely();
			splode.listen(function (err) {
				throw 'circular';
			});
			process.emit('uncaughtException', new Error());
		});

	});

	describe('.recover', function () {

		it('should be a function', function () {
			assert.equal(typeof splode.recover, 'function');
		});

		it('should recover from an error', function (done) {
			listenUniquely();
			exits = 0;
			splode.listen(function (err) {
				if (/BBQ/.test(err.message)) {
					splode.recover();
				}
				setImmediate(function () {
					assert.equal(exits, 0);
					done();
				});
			});
			process.emit('uncaughtException', new Error('OMGWTFBBQ'));
		});

	});

});
