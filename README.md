@entva/express-sanitizeurl
==========================

ExpressJS middleware that checks request URL for potentially breaking things, such as:
 - Unparsable percent-encoded sequences
 - Double question mark in URL
 - Multiple slashes

After one of the above checks fails the middleware attempts to guess a safe variant of the url and redirect there with a 301.

## Options:
 - `redirectTo (string)`: When url contains breaking character sequences and is impossible to parse, redirect to this URL, default: `'/'`
 - `logger (function)`: Called with a message when a redirect occurs, useful for debugging

## Usage:

```javascript
import sanitizeUrl from '@entva/express-sanitizeurl';

app.use(sanitizeUrl());
```
