# Redux Dev State Persist

_Redux Dev State Persist_ (RDSP) provides hot-reloading without having to use any sort of Browserify or
Webpack plugin- and no mucking about with specific hot-reloading integrations API.
Just persist your state!

### Installation

`npm install --save-dev @abradley2/redux-dev-state-persist`

### Motivation

When using Redux, all that you really need for the "hot-reloading" functionality
is to save your store's state between reloads. This module does exactly that.

It uses `localforage` as the persistence engine, which will default to indexedDB
if available. So if you wish to clear your state you can do so by using your
browsers development tools and clearing indexedDB  

**Smart state-reloading**  
It is super annoying when persistence reloads old state
even though you've changed what initial state a store will have. RDSP will
automatically refresh your reloaded state instead of overwriting if it detects
you've made changes to what your store's initial state is. If you divide your
state between modules, this is on a per-module basis.


### Usage

Initiate RDSP by providing a namespace to keep in story ("myReduxAppState" or something)
and as the second argument your Redux store.

Initialization returns a promise that resolves when it is finished, or you can provide a
callback as the final argument. Be sure you do not dispatch anything between the start and end
of initialization.

```
const rdsp = require('redux-dev-state-persist')
const store = require('./store')
const ReactDOM = require('react-dom')
const App = require('./App')

const startApp = () => ReactDOM.render(<App />, document.body)

rdsp('myReduxAppState', store)
  .then(startApp)
  .catch(err => {
    console.error('some error loading state!')
    startApp()
  })
```

### Caveats
You store's state should be entirely serializable as JSON.

Redux technically allows you to add whatever into your store- even objects
that aren't serializable as JSON. This will be persisted differently in
indexedDB than in your store, which is not desirable behavior.


### Production

You probably don't want to use this in production, so I recommend
conditionally assigning RDSP to an empty Promise resolving function

```
const persistStore = () => proces.env.NODE_ENV === 'development'
  ? require('redux-dev-state-persist')
  : () => Promise.resolve()
```

You can add in environment variables via Webpack, or Browserify (for Browserify,
check out [envify](https://github.com/hughsk/envify)).

### License
[MIT](http://unlicense.org/)