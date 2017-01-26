let posix = require('posix');
let util = require('util');
let winston = require('winston');

let SyslogPosix = winston.transports.SyslogPosix = function(options) {
  if (options == null) { options = {}; }
  this.name = 'SyslogPosix';
  this.level = options.level || 'debug';
  this.identity = options.identity || process.title;
  this.facility = options.facility || 'local0';
  this.unmapped = options.unmapped || 'info';
  this.showPid = options.showPid === undefined ? true : options.showPid;
  return this.showLvl = options.showLvl === undefined ? true : options.showLvl;
};

//
// Inherit from `winston.Transport` so you can take advantage
// of the base functionality and `.handleExceptions()`.
//
util.inherits(SyslogPosix, winston.Transport);

SyslogPosix.prototype.log = function(level, msg, meta, callback) {
  if (this.silent) {
    return callback(null, true);
  }

  // map common debug levels to valid posix syslog values
  let syslogSeverity = level;
  if ((level === 'trace') || (level === 'debug')) {
    syslogSeverity = 'debug';
  } else if (level === 'notice') {
    syslogSeverity = 'notice';
  } else if ((level === 'warn') || (level === 'warning')) {
    syslogSeverity = 'warning';
  } else if (level === 'error') {
    syslogSeverity = 'err';
  } else if ((level === 'crit') || (level === 'critical')) {
    syslogSeverity = 'crit';
  } else if (level === 'alert') {
    syslogSeverity = 'alert';
  } else if ((level === 'fatal') || (level === 'emerg')) {
    syslogSeverity = 'emerg';
  } else {
    syslogSeverity = this.unmapped;
  }

  let message = msg;
  let prepend = '';
  if (this.showLvl === true) {
    prepend = `[${level}] `;
  }
  if (typeof meta === 'string') {
    message += ` ${meta}`;
  } else if (meta && (typeof meta === 'object') && (Object.keys(meta).length > 0)) {
    message += ` ${util.inspect(meta, false, null, false)}`;
  }
  message = message.replace(/\u001b\[(\d+(;\d+)*)?m/g, '');

  // truncate message to a max of 1024 bytes
  let messages = [];
  let maxLength = 1024 - prepend.length;
  while (message.length > maxLength) {
    messages.push(prepend + message.substring(0, maxLength));
    message = message.substring(maxLength);
  }
  messages.push(prepend + message);
  let syslogOptions = {
    cons: true,
    pid: this.showPid
  };
  posix.openlog(this.identity, syslogOptions, this.facility);
  messages.forEach(message => posix.syslog(syslogSeverity, message));
  posix.closelog();
  this.emit('logged');
  return callback(null, true);
};

module.exports = SyslogPosix;
