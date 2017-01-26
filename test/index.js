let chai = require('chai');
let sinon = require('sinon');

let { expect } = chai;

let SyslogPosix = require('../lib/index.js');

describe('SyslogPosix Transport', function() {

  it('initializes with reasonable default options', function(done) {
    let syslogPosix = new SyslogPosix();
    expect(syslogPosix.name).to.eql('SyslogPosix');
    expect(syslogPosix.level).to.eql('debug');
    // expect(syslogPosix.identity).to.eql('gulp');
    expect(syslogPosix.facility).to.eql('local0');
    expect(syslogPosix.showPid).to.be.true;
    expect(syslogPosix.showLvl).to.be.true;
    return done();
  });

  it('initializes with passed options', function(done) {
    let syslogPosix = new SyslogPosix({
      level: 'trace',
      identity: 'goober',
      facility: 'local7',
      showPid: false,
      showLvl: false
    });
    expect(syslogPosix.name).to.eql('SyslogPosix');
    expect(syslogPosix.level).to.eql('trace');
    expect(syslogPosix.identity).to.eql('goober');
    expect(syslogPosix.facility).to.eql('local7');
    expect(syslogPosix.showPid).to.be.false;
    expect(syslogPosix.showLvl).to.be.false;
    return done();
  });

  it('logs a short message', function(done) {
    let syslogPosix = new SyslogPosix();
    let cb = sinon.spy();
    syslogPosix.log('debug', 'message', 'meta', cb);
    expect(cb).to.be.called;
    return done();
  });

  it('logs a long message', function(done) {
    let syslogPosix = new SyslogPosix();
    let cb = sinon.spy();
    let message = new Array(1024 * 2).join('x');
    syslogPosix.log('debug', message, 'meta', cb);
    expect(cb).to.be.called;
    return done();
  });

  it('logs a meta object', function(done) {
    let syslogPosix = new SyslogPosix();
    let cb = sinon.spy();
    syslogPosix.log('debug', 'message', { meta: 'object' }, cb);
    expect(cb).to.be.called;
    return done();
  });

  return it('logs with no meta', function(done) {
    let syslogPosix = new SyslogPosix();
    let cb = sinon.spy();
    syslogPosix.log('debug', 'message', undefined, cb);
    expect(cb).to.be.called;
    return done();
  });
});
