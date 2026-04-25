import { expect } from 'chai';
import sinon from 'sinon';
import getMiddleware from '../esm/index.mjs';

const middleware = getMiddleware();


describe('SanitizeUrl suite', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      originalUrl: '',
    };

    res = {
      redirect: sinon.spy(),
    };

    next = sinon.spy();
  });

  it('url with weird characters', () => {
    req.originalUrl += '/%c0%ae%c0%ae';

    middleware(req, res, next);
    expect(next.notCalled).to.be.true;
    expect(res.redirect.calledOnce).to.be.true;
    expect(res.redirect.calledWith(301, '/')).to.be.true;
  });

  it('url with multiple slashes', () => {
    req.originalUrl += '///lol/kek//////wow';

    middleware(req, res, next);
    expect(next.notCalled).to.be.true;
    expect(res.redirect.calledOnce).to.be.true;
    expect(res.redirect.calledWith(301, '/lol/kek/wow')).to.be.true;
  });

  it('short url with multiple slashes', () => {
    req.originalUrl += '//////';

    middleware(req, res, next);
    expect(next.notCalled).to.be.true;
    expect(res.redirect.calledOnce).to.be.true;
    expect(res.redirect.calledWith(301, '/')).to.be.true;
  });

  it('url with multiple slashes and double query string', () => {
    req.originalUrl += '///lol/kek//////wow?query?is=amazing?isnt=it&i=agree&with?this&nonsense';

    middleware(req, res, next);
    expect(next.notCalled).to.be.true;
    expect(res.redirect.calledOnce).to.be.true;
    expect(res.redirect.calledWith(301, '/lol/kek/wow?query&is=amazing&isnt=it&i=agree&with&this&nonsense')).to.be.true;
  });

  it('url with double query string', () => {
    req.originalUrl += '/some/such?query=yes&more=yes?what=haha&another=query!';

    middleware(req, res, next);
    expect(next.notCalled).to.be.true;
    expect(res.redirect.calledOnce).to.be.true;
    expect(res.redirect.calledWith(301, '/some/such?query=yes&more=yes&what=haha&another=query!')).to.be.true;
  });

  it('url with empty query string', () => {
    req.originalUrl += '/some/such?';

    middleware(req, res, next);
    expect(next.notCalled).to.be.true;
    expect(res.redirect.calledOnce).to.be.true;
    expect(res.redirect.calledWith(301, '/some/such')).to.be.true;
  });

  it('regular url', () => {
    req.originalUrl += '/regular/url';

    middleware(req, res, next);
    expect(res.redirect.notCalled).to.be.true;
    expect(next.calledOnce).to.be.true;
  });

  it('regular url with query string', () => {
    req.originalUrl += '/regular/url?search=things';

    middleware(req, res, next);
    expect(res.redirect.notCalled).to.be.true;
    expect(next.calledOnce).to.be.true;
  });
});
