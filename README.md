[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# Lightweight Config Parser

Lightweight configuration parser and API for the `.conf` files.

## Install

Install with [npm](https://www.npmjs.com/):

```sh

$  npm  install  --save  lightweight-config-parser

```

Install with [yarn](https://yarnpkg.com):

```sh

$  yarn  add  lightweight-config-parser

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

### Config Values: Environmental vs. Static

Our configuration system can have both environmental and static values for a given path.

Use the `isEnvironmental` parameter to specify the desired value type:

- `true`: Fetch the environmental value.
- `false` (default): Fetch the static value. If only an environmental value exists, it will be returned.

#### Config file example

```
server {
	port = 8080
	port = ${?PORT_ENV_VARIABLE}
	bind = ${?BIND_ENV_VARIABLE}
	bind = "test_bind"
}
```

#### Fetching values

```javascript
config.get('server.port', true); // Gets environmental value
config.get('server.port'); // Gets static value, or environmental if no static exists
```

#### Checking values existence

```javascript
config.has('server.bind', true); // Checks if environmental value exists
config.has('server.bind'); // Checks if static value exists
```
