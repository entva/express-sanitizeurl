import type { Request, Response, NextFunction } from 'express';

const getSafeUrl = (originalUrl: string) => {
  const [href, ...qs] = originalUrl.split('?');

  const safeHref = href.replace(/\/+/g, '/');
  const safeQs = qs.join('&');

  let url = safeHref;
  if (safeQs.length) url += `?${safeQs}`;

  return url;
};

export type SanitizeUrlOptions = {
  redirectTo: string,
  logger?: (...args: unknown[]) => void,
};

const defaults = {
  redirectTo: '/',
};

const createSanitizeUrl = (params?: SanitizeUrlOptions) => {
  const options = { ...defaults, ...params };
  const { logger, redirectTo } = options;

  const middleware = (req: Request, res: Response, next: NextFunction) => {
    const { originalUrl } = req;

    try {
      decodeURIComponent(originalUrl);
    } catch (err) {
      logger?.(`couldn't parse ${originalUrl}, redirecting to ${redirectTo}`);
      return res.status(301).redirect(redirectTo);
    }

    const safeUrl = getSafeUrl(originalUrl);

    if (originalUrl !== safeUrl) {
      logger?.(`${originalUrl} isn't valid, redirecting to ${safeUrl}`);
      return res.status(301).redirect(safeUrl);
    }

    next();
  };

  return middleware;
};

export default createSanitizeUrl;
