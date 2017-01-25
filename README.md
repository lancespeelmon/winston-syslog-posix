# winston-syslog-posix [![Circle CI](https://circleci.com/gh/lancespeelmon/winston-syslog-posix.svg?style=svg)](https://circleci.com/gh/lancespeelmon/winston-syslog-posix)
[![NPM](https://nodei.co/npm/winston-syslog-posix.png?stars=true)](https://nodei.co/npm/winston-syslog-posix/)

A [winston][0] syslog transport based on the [posix][1] module for node.js.

## Background

In what naively seemed like a trvial task, I set out to have node log to
syslog which our sysadmins have shipping to [logstash][2]. While I was able
to integrate [winston-syslog][3] with relative ease, by the time the messages
made it to logstash, the fields were not mapped correctly. After burning
_nearly an entire day_ trying to fix that problem, I retreated to the safety
of a C library, but I could not find a working posix transport! Argh! _YMMV_

Inspired by tmont's [blog posting][4], this module provides a **fully functional**
winston syslog transport that has been tested on Linux 3.2.x kernel.

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

The following `options` are availble to configure `SyslogPosix`:

* __level:__ Allows you to set a level that specifies the level of messages for this transport (Default `info`).
* __identity:__ The identity of the application (Default: `process.title`).
* __facility:__ Syslog facility to use (Default: `local0`).
* __unmapped:__ Unmatched levels will be mapped to this syslog level (Default: `info`).
* __showPid:__ Display the PID of the process that log messages are coming from (Default `true`).
* __showLvl:__ Display the level of the log messages (Default `true`).

## Log Levels

Because syslog only allows a subset of the levels available in winston, levels
that do not match will be mapped via `options.unmapped`.
Winston levels are mapped by name, and therefore it is _**not**_ required that
you use `winston.config.syslog.levels`; i.e. this is much more forgiving than
what `winston-syslog` [suggests][5].

> Note: if you _do_ choose to use `winston.config.syslog.levels`, then
> you will likely need a patch to `winston` to invert the log level comparisons;
> i.e. like: [0be4007][6].

[0]: https://www.npmjs.com/package/winston
[1]: https://www.npmjs.com/package/posix
[2]: http://logstash.net
[3]: https://github.com/winstonjs/winston-syslog
[4]: http://tmont.com/blargh/2013/12/writing-to-the-syslog-with-winston
[5]: https://github.com/winstonjs/winston-syslog#log-levels
[6]: https://github.com/lancespeelmon/winston/commit/0be4007009fc30a4fe780c0ed4146c81a6b3ac24
