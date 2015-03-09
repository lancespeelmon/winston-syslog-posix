posix = require 'posix'
util = require 'util'
winston = require 'winston'

SyslogPosix = winston.transports.SyslogPosix = (options = {}) ->
  @name = 'SyslogPosix'
  @level = options.level or 'debug'
  @identity = options.identity or process.title
  @facility = options.facility or 'local0'
  @showPid = if options.showPid == undefined then true else options.showPid

#
# Inherit from `winston.Transport` so you can take advantage
# of the base functionality and `.handleExceptions()`.
#
util.inherits SyslogPosix, winston.Transport

SyslogPosix::log = (level, msg, meta, callback) ->
  if @silent
    return callback null, true

  # map common debug levels to valid posix syslog values
  syslogSeverity = level
  if level == 'trace'
    syslogSeverity = 'debug'
  else if level == 'warn'
    syslogSeverity = 'warning'
  else if level == 'error'
    syslogSeverity = 'err'
  else if level == 'fatal'
    syslogSeverity = 'emerg'
  else
    syslogSeverity = 'info'

  message = msg
  prepend = '[' + level + '] '
  if typeof meta == 'string'
    message += ' ' + meta
  else if meta and typeof meta == 'object' and Object.keys(meta).length > 0
    message += ' ' + util.inspect(meta, false, null, false)
  message = message.replace(/\u001b\[(\d+(;\d+)*)?m/g, '')

  # truncate message to a max of 1024 bytes
  messages = []
  maxLength = 1024 - prepend.length
  while message.length > maxLength
    messages.push prepend + message.substring(0, maxLength)
    message = message.substring(maxLength)
  messages.push prepend + message
  syslogOptions =
    cons: true
    pid: @showPid
  posix.openlog @identity, syslogOptions, @facility
  messages.forEach (message) ->
    posix.syslog syslogSeverity, message
  posix.closelog()
  @emit 'logged'
  callback null, true

module.exports = exports = SyslogPosix
