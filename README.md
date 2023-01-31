[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# Config Parser

Lightweight configuration parser and API for the `.conf` files.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save lightweight-config-parser
```

Install with [yarn](https://yarnpkg.com):

```sh
$ yarn add lightweight-config-parser
```

## Usage

- To use the `Configuration` class in a TypeScript file -

```ts
import { Configuration } from 'lightweight-config-parser';

const config = new Configuration('/path/to/config.conf');
```

- To use the `Configuration` class in a JavaScript file -

```js
const Configuration = require('lightweight-config-parser').Configuration;

const config = new Configuration('/path/to/config.conf');
```

## API

You can get any value

```javascript
config.get('server.port'); // Returns the type that the parser found in the .conf file

config.has('server.bind'); // Returns a boolean of whether that value exists or not
```
