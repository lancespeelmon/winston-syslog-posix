# winston-syslog-posix [![Circle CI](https://circleci.com/gh/lancespeelmon/winston-syslog-posix.svg?style=svg)](https://circleci.com/gh/lancespeelmon/winston-syslog-posix)

A [winston][0] syslog transport based on the [posix][1] module for node.js.

## Installation

``` bash
  $ npm install winston
  $ npm install winston-syslog-posix
```

## Usage

To use the `SyslogPosix` transport in winston, you simply need to require it and
then either add it to an existing winston logger or pass an instance to a new
winston logger:

``` js
  var winston = require('winston');

  //
  // Requiring `winston-syslog-posix` will expose
  // `winston.transports.SyslogPosix`
  //
  require('winston-syslog-posix').SyslogPosix;

  winston.add(winston.transports.SyslogPosix, options);
```

The following options are availble to configure `SyslogPosix`:

* __level:__ Allows you to set a level that specifies the level of messages for this transport (Default `info`).
* __identity:__ The identity of the application (Default: `process.title`).
* __facility:__ Syslog facility to use (Default: `local0`).
* __showPid:__ Display the PID of the process that log messages are coming from (Default `true`).

> Note: Any unmatched level will be mapped to `info`.

[0]: https://www.npmjs.com/package/winston
[1]: https://www.npmjs.com/package/posix
