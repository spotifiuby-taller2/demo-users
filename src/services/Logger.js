const { DATE_FORMAT } = require("../others/constants");
const { getDate } = require("../others/utils");
const simple_node_logger = require('simple-node-logger');

const consoleLogger = simple_node_logger.createSimpleLogger( {
    timestampFormat: DATE_FORMAT,
} );

const fileLogger = simple_node_logger.createSimpleLogger( {
    timestampFormat: DATE_FORMAT,
    logFilePath: '../../logs/' + getDate() + ".log",
} );

const setLevel = (level) => {
    if (! ['debug', 'info', 'warn', 'error'].includes(level)) {
        consoleLogger.setLevel('info');
        fileLogger.setLevel('info');
    } else {
        consoleLogger.setLevel(level);
        fileLogger.setLevel(level);
    }
}

const info = (message) => {
    consoleLogger.info(message);
    fileLogger.info(message);
}

const debug = (message) => {
    consoleLogger.debug(message);
    fileLogger.debug(message);
}

const warn = (message) => {
    consoleLogger.warn(message);
    fileLogger.warn(message);
}

const error = (message) => {
    consoleLogger.error(message);
    fileLogger.error(message);
}

const request = (message) => {
    info("Request a : " + message);
}

module.exports = {
    setLevel,
    info,
    debug,
    warn,
    error,
    request
}
