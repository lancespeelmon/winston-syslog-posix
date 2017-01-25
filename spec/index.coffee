require 'coffee-errors'
chai = require 'chai'
sinon = require 'sinon'

expect = chai.expect

SyslogPosix = require '../lib/index.js'

describe 'SyslogPosix Transport', ->

  it 'initializes with reasonable default options', (done) ->
    syslogPosix = new SyslogPosix()
    expect(syslogPosix.name).to.eql 'SyslogPosix'
    expect(syslogPosix.level).to.eql 'debug'
    expect(syslogPosix.identity).to.eql 'gulp'
    expect(syslogPosix.facility).to.eql 'local0'
    expect(syslogPosix.showPid).to.be.true
    expect(syslogPosix.showLvl).to.be.true
    done()

  it 'initializes with passed options', (done) ->
    syslogPosix = new SyslogPosix
      level: 'trace'
      identity: 'goober'
      facility: 'local7'
      showPid: false
      showLvl: false
    expect(syslogPosix.name).to.eql 'SyslogPosix'
    expect(syslogPosix.level).to.eql 'trace'
    expect(syslogPosix.identity).to.eql 'goober'
    expect(syslogPosix.facility).to.eql 'local7'
    expect(syslogPosix.showPid).to.be.false
    expect(syslogPosix.showLvl).to.be.false
    done()

  it 'logs a short message', (done) ->
    syslogPosix = new SyslogPosix()
    cb = sinon.spy()
    syslogPosix.log 'debug', 'message', 'meta', cb
    expect(cb).to.be.called
    done()

  it 'logs a long message', (done) ->
    syslogPosix = new SyslogPosix()
    cb = sinon.spy()
    message = new Array(1024 * 2).join('x')
    syslogPosix.log 'debug', message, 'meta', cb
    expect(cb).to.be.called
    done()

  it 'logs a meta object', (done) ->
    syslogPosix = new SyslogPosix()
    cb = sinon.spy()
    syslogPosix.log 'debug', 'message', { meta: 'object' }, cb
    expect(cb).to.be.called
    done()

  it 'logs with no meta', (done) ->
    syslogPosix = new SyslogPosix()
    cb = sinon.spy()
    syslogPosix.log 'debug', 'message', undefined, cb
    expect(cb).to.be.called
    done()
