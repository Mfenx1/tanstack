import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { App } from './App';
import { store } from './store';
import { queryClient } from '$lib';

export const renderApp = (root: HTMLElement | null): void => {
  if (root == null) return;
  ReactDOM.createRoot(root).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <App />
        </Provider>
      </QueryClientProvider>
    </StrictMode>
  );
};

const rootEl = document.getElementById('root');
renderApp(rootEl);
