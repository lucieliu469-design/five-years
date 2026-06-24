import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider } from '@/store'
import AppRoutes from '@/routes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </QueryClientProvider>
  )
}
