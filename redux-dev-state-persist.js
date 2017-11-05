const equals = require('deep-equal')
const localForage = require('localforage')

function persist (appName, store, done) {
  if (!done) done = Function.prototype

  localForage.config({name: appName})
  let shouldReset = false
  store.dispatch({type: '$START'})

  return localForage.getItem('initialState')
    .then(value => {
      shouldReset = !equals(value, store.getState())

      if (shouldReset) {
        const newInitialState = store.getState()

        return Promise.all([
          localForage.setItem('initialState', newInitialState),
          localForage.setItem('savedState', newInitialState)
        ])
          .then(() => {
            subscribeToStore(store)
            done()
            return Promise.resolve()
          })
          .catch(err => done(err))
      } else {
        return localForage.getItem('savedState')
          .then(value => {
            store.dispatch({type: '$LOAD', state: value})
            subscribeToStore(store)
            done()
            return Promise.resolve()
          })
          .catch(err => done(err))
      }
    })
    .catch(err => done(err))
}

function subscribeToStore (store) {
  const writer = bottleneck(() => {
    localForage.setItem('savedState', store.getState())
  }, 500)
  store.subscribe(writer)
}

function bottleneck (func, time) {
  let lastArgs = []
  let pending = false
  function debounced () {
    lastArgs = arguments
    if (pending) {
      clearTimeout(pending)
    }
    pending = setTimeout(() => {
      func.apply({}, lastArgs)
    }, time)
  }
  return debounced
}

module.exports = persist
