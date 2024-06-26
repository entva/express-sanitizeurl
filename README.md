@entva/express-sanitizeurl
==========================

ExpressJS middleware that checks request URL for potentially breaking things, such as:
 - Unparsable query string sequences that would crash on attempt to parse on the client side
 - Double question mark in URL
 - Multiple slashes

After one of the above checks fails the middleware attempts to guess a safe variant of the url and redirect there.

## Options:
 - `redirectTo (string)`: When url contains breaking character sequences and is impossible to parse, redirect to this URL, default: `'/'`

## Usage:

```javascript
app.use(require('@entva/express-sanitizeurl')());
```
