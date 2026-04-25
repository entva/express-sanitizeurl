import { describe, it, expect, beforeEach, vi } from 'vitest';
import getMiddleware from '../esm/index.mjs';

const middleware = getMiddleware();

describe('SanitizeUrl suite', () => {
  let req: { originalUrl: string };
  let res: { redirect: ReturnType<typeof vi.fn> };
  let next: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    req = { originalUrl: '' };
    res = { redirect: vi.fn() };
    next = vi.fn();
  });

  it('url with weird characters', () => {
    req.originalUrl += '/%c0%ae%c0%ae';

    middleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledOnce();
    expect(res.redirect).toHaveBeenCalledWith(301, '/');
  });

  it('url with multiple slashes', () => {
    req.originalUrl += '///lol/kek//////wow';

    middleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledOnce();
    expect(res.redirect).toHaveBeenCalledWith(301, '/lol/kek/wow');
  });

  it('short url with multiple slashes', () => {
    req.originalUrl += '//////';

    middleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledOnce();
    expect(res.redirect).toHaveBeenCalledWith(301, '/');
  });

  it('url with multiple slashes and double query string', () => {
    req.originalUrl += '///lol/kek//////wow?query?is=amazing?isnt=it&i=agree&with?this&nonsense';

    middleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledOnce();
    expect(res.redirect).toHaveBeenCalledWith(301, '/lol/kek/wow?query&is=amazing&isnt=it&i=agree&with&this&nonsense');
  });

  it('url with double query string', () => {
    req.originalUrl += '/some/such?query=yes&more=yes?what=haha&another=query!';

    middleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledOnce();
    expect(res.redirect).toHaveBeenCalledWith(301, '/some/such?query=yes&more=yes&what=haha&another=query!');
  });

  it('url with empty query string', () => {
    req.originalUrl += '/some/such?';

    middleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledOnce();
    expect(res.redirect).toHaveBeenCalledWith(301, '/some/such');
  });

  it('regular url', () => {
    req.originalUrl += '/regular/url';

    middleware(req, res, next);
    expect(res.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
  });

  it('regular url with query string', () => {
    req.originalUrl += '/regular/url?search=things';

    middleware(req, res, next);
    expect(res.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
  });
});
