var splode = module.exports = {};

/**
 * Expose the splode version.
 */
splode.version = require('./package.json').version;

/**
 * Aggregate callbacks here.
 */
splode._callbacks = [];

/**
 * Count the number of exceptions we've caught.
 */
splode._exceptionCount = 0;

/**
 * Allow users to listen for uncaught exceptions.
 */
splode.listen = function (callback) {
  splode._callbacks.push(callback);
}

/**
* Tell Splode not to exit the process.
*/
splode.recover = function () {
  splode._isRecoverable = true;
};

/**
 * Log to the console by default.
 */
splode._logger = console;

/**
 * Set a custom logger.
 */
splode.setLogger = function (logger) {
  if (typeof logger.error != 'function') {
    process.emit('uncaughtException', new Error("Splode logger must have an error method."));
    return;
  }
  if (typeof logger.warn != 'function') {
    process.emit('uncaughtException', new Error("Splode logger must have a warn method."));
    return;
  }
  splode._logger = logger;
};

/**
 * Uniquely listen for uncaught exceptions.
 */
process.removeAllListeners('uncaughtException');
process.on('uncaughtException', function SPLODE_LISTENER(error) {
  ++splode._exceptionCount;
  splode._isRecoverable = false;
  try {
    splode._callbacks.forEach(function (callback) {
      callback(error);
    });
  }
  catch (e) {
    splode._logger.error('Splode detected an error in an error handler.');
    splode._isRecoverable = true;
  }
  if (splode._isRecoverable) {
      splode._logger.warn(error);
  }
  else {
    splode._logger.error(error);
    process.exit();
  }
  delete splode._isRecoverable;
});
