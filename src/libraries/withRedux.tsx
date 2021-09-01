import React from 'react';
import { Provider } from 'react-redux';
import { createStore, compose } from 'redux';
import PropTypes from 'prop-types';
import reducers from '@/reducers/index';

/* eslint-disable no-underscore-dangle */
const devtools = (window as any).__REDUX_DEVTOOLS_EXTENSION__
  ? (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  : (f: any) => f;

const initializeStore = (initialState: any) => {
  return createStore(reducers, initialState, compose(devtools));
};

const withRedux = (PageComponent: any) => {
  const ssr = true;

  const WithRedux = ({ initialReduxState, ...props }: any) => {
    const store = getOrInitializeStore(initialReduxState); // eslint-disable-line
    return (
      <Provider store={store}>
        <PageComponent {...props} />
      </Provider>
    );
  };

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== 'production') {
    const displayName = PageComponent.displayName || PageComponent.name || 'Component';

    WithRedux.displayName = `withRedux(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps) {
    WithRedux.getInitialProps = async (context: any) => {
      // Get or Create the store with `undefined` as initialState
      // This allows you to set a custom default initialState
      const reduxStore = getOrInitializeStore(); // eslint-disable-line

      // Provide the store to getInitialProps of pages
      context.reduxStore = reduxStore; // eslint-disable-line

      // Run getInitialProps from HOCed PageComponent
      const pageProps =
        typeof PageComponent.getInitialProps === 'function'
          ? await PageComponent.getInitialProps(context)
          : {};

      // Pass props to PageComponent
      return {
        ...pageProps,
        initialReduxState: reduxStore.getState(),
      };
    };
  }

  WithRedux.propTypes = {
    initialReduxState: PropTypes.object, //eslint-disable-line
  };
  return WithRedux;
};

let reduxStore: any;
const getOrInitializeStore = (initialState?: any) => {
  // Always make a new store if server, otherwise state is shared between requests
  if (typeof window === 'undefined') {
    return initializeStore(initialState);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!reduxStore) {
    reduxStore = initializeStore(initialState);
  }

  return reduxStore;
};

export default withRedux;
