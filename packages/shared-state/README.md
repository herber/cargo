# Cargo's shared state management lib

This library aims to be a simple solution for managing state across multiple renderers and the main process in an electron app.

> This is by no means a full state management library like Redux!

## Usage

### In main

```typescript
import { createStore } from '@cargohq/shared-state';

let store = createStore({
  name: 'a unique name',
  // Specify initial state
  initial: () => ({
    config: {
      theme: 'light',
      adBlocking: true
    },
    windows: {
      ...
    }
  }),
  // Actions, which can be called in the main process or in the renderer
  actions: () => ({
    actionName: (state, params) => {
      return {
        ...
      };
    }
  }),
  // Computed values (get recomputed every time the state changes)
  computed: () => ({
    generated: (state) => {
      return 1 + 2;
    }
  });
});

// Get a state value
let isDarkMode = store.getState().config.theme == 'dark';

// Dispatching an action
store.dispatch('actionName', { param1: true });

// Subscribe to state events
store.subscribe(state => {
  // The state has changed
})
```

### In renderer

```typescript
import { getStore } from '@cargohq/shared-state';

let store = getStore('the store name', 'a unique identifier for this browserWindow');

// Get a state value
let isDarkMode = store.getState().config.theme == 'dark';

// Dispatching an action
store.dispatch('actionName', { param1: true });

// Subscribe to state events
store.subscribe(state => {
  // The state has changed
})
```
