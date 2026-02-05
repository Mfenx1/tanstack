import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary, PageSkeleton, ProtectedRoute } from '$components';
import { AuthProvider } from '$context';
import { ROUTES } from '$constants';

const Login = lazy(() => import('$pages/Login'));
const Products = lazy(() => import('$pages/Products'));

export const App = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route
              path={ROUTES.PRODUCTS}
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to={ROUTES.PRODUCTS} replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
);
