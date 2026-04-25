import type { Request, Response, NextFunction } from 'express';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import getMiddleware from './index';

const middleware = getMiddleware();

describe('SanitizeUrl suite', () => {
  let req: { originalUrl: string };
  let res: { status: ReturnType<typeof vi.fn>, redirect: ReturnType<typeof vi.fn> };
  let next: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    req = { originalUrl: '' };
    res = { status: vi.fn(), redirect: vi.fn() };
    res.status.mockReturnValue(res);
    next = vi.fn();
  });

  const call = () => middleware(req as unknown as Request, res as unknown as Response, next as unknown as NextFunction);

  it('url with weird characters', () => {
    req.originalUrl += '/%c0%ae%c0%ae';

    call();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(301);
    expect(res.redirect).toHaveBeenCalledWith('/');
  });

  it('url with multiple slashes', () => {
    req.originalUrl += '///lol/kek//////wow';

    call();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(301);
    expect(res.redirect).toHaveBeenCalledWith('/lol/kek/wow');
  });

  it('short url with multiple slashes', () => {
    req.originalUrl += '//////';

    call();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(301);
    expect(res.redirect).toHaveBeenCalledWith('/');
  });

  it('url with multiple slashes and double query string', () => {
    req.originalUrl += '///lol/kek//////wow?query?is=amazing?isnt=it&i=agree&with?this&nonsense';

    call();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(301);
    expect(res.redirect).toHaveBeenCalledWith('/lol/kek/wow?query&is=amazing&isnt=it&i=agree&with&this&nonsense');
  });

  it('url with double query string', () => {
    req.originalUrl += '/some/such?query=yes&more=yes?what=haha&another=query!';

    call();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(301);
    expect(res.redirect).toHaveBeenCalledWith('/some/such?query=yes&more=yes&what=haha&another=query!');
  });

  it('url with empty query string', () => {
    req.originalUrl += '/some/such?';

    call();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(301);
    expect(res.redirect).toHaveBeenCalledWith('/some/such');
  });

  it('regular url', () => {
    req.originalUrl += '/regular/url';

    call();
    expect(res.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
  });

  it('regular url with query string', () => {
    req.originalUrl += '/regular/url?search=things';

    call();
    expect(res.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
  });
});
