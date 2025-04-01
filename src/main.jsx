import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <view className="w-full h-full bg-gray-50">
      <App />
    </view>
  </QueryClientProvider>
); 