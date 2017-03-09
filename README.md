# middleware-series 

combine multiple express middleware into one middleware,copy from [https://github.com/tjmehta/middleware-flow](https://github.com/tjmehta/middleware-flow) and remove all dependencies

# Installation
```bash
npm install middleware-series
```

# Examples

## series(middlewares...)

```js
const series = require('middleware-series');
const app = require('express')();

app.use(series(mw1, mw2, mw2)); // equivalent to app.use(mw1, mw2, mw3);
```


