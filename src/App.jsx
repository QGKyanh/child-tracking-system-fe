import { Route, Routes } from 'react-router-dom';
import routes from './configs/routes';
import NotFound from '@/pages/NotFound';
import AuthProvider from '@/components/Auth/AuthProvider';
import AuthCheck from '@/components/Auth/AuthCheck';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {routes.map((route, i) => {
          const Layout = route.layout;

          return (
            <Route key={i} element={<Layout />}>
              {route.data.map(item => {
                const Component = item.component;
                return (
                  <Route
                    key={item.path}
                    path={item.path}
                    element={
                      <AuthCheck
                        shouldLogin={item?.authSlice?.shouldLogin}
                        shouldLogout={item?.authSlice?.shouldLogout}
                      >
                        <Component />
                      </AuthCheck>
                    }
                  />
                );
              })}
            </Route>
          );
        })}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
