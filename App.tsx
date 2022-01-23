import React from 'react';
import { SafeAreaView } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Home } from './src/home';

const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "whilte" }}>
        <Home />
      </SafeAreaView>
    </QueryClientProvider>
  );
}
