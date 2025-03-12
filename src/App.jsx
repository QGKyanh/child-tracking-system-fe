import { Route, Routes } from "react-router-dom"
import routes from "./configs/routes"

function App() {
  return (
    <>
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
                      <Component />
                    }
                  />
                );
              })}
            </Route>
          );
        })}
      </Routes>
    </>
  )
}

export default App
