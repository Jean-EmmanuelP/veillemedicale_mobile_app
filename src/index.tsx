import { root } from '@lynx-js/react';
import './tailwind.css';
import { MemoryRouter } from 'react-router';
import { App } from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      <App />
    </MemoryRouter>
  </QueryClientProvider>,
);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
