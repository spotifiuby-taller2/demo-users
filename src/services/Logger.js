const { DATE_FORMAT } = require("../others/constants");
const { getDate } = require("../others/utils");
const simple_node_logger = require('simple-node-logger');
const path = require('path');

const logFile = path.resolve(__dirname, "")
                    .replace("src/services", "")
                + "logs/" + getDate() + ".log";

// If the file does not exists, it will be created.
const fileLogger = simple_node_logger.createSimpleLogger( {
    timestampFormat: DATE_FORMAT,
    logFilePath: logFile,
} );

const setLevel = (level) => {
    if (! ['debug', 'info', 'warn', 'error'].includes(level)) {
        fileLogger.setLevel('info');
        fileLogger.info("Nivel de logueo: info.");
    } else {
        fileLogger.setLevel(level);
        fileLogger.info("Nivel de logueo: " + level + ". ");
    }
}

const info = (message) => {
    fileLogger.info(message);
}

const debug = (message) => {
    fileLogger.debug(message);
}

const warn = (message) => {
    fileLogger.warn(message);
}

const error = (message) => {
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
