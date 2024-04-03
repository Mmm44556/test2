
import { lazy } from 'react';
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Authentication from "@authentication/index.jsx";
import Login from "@authentication/Login/index.jsx";
// import Register from "@authentication/Register";
import DashBoard from '@components/DashBoard/index.jsx';
import Employees from '@pages/Employees/index.jsx';
import NotFound from '@error/404.jsx';
import { sessionCheck } from "./js/sessionPrefetch";
import { loginAction, registerAction, saveUserInfoAction } from "./js/actions";

const DataList = lazy(() => import("@pages/dataList/index.jsx"));
const Uploader = lazy(() => import("@pages/Uploader/index.jsx"));
const Profile = lazy(() => import("@pages/Profile/index.jsx"));
const Type = lazy(() => import("@pages/dataList/Type/index.jsx"));
const Departments = lazy(() => import("@pages/Departments/index.jsx"));
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    shouldRevalidate() {
      return false
    },
    children: [
      {
        path: 'DashBoard',
        element: <DashBoard />,
        children: [
          {
            path: 'dataList',
            Component: DataList,
            children: [
              {
                path: '',
                Component: Departments,
              },
              {
                path: 'type/*',
                Component: Type,
              }
            ]
          },
          // {
          //   path: 'uploader/*',
          //   Component: Uploader,

          // },
          {
            path: 'user/:id',
            Component: Profile,
            action: saveUserInfoAction,
            shouldRevalidate() {
              return false
            },

          },
          {
            path: 'employees/*',
            element: <Employees />,
            action: registerAction
          }
        ]
      },
      {
        path: '/',
        element: <Authentication />,
        shouldRevalidate() {
          return false
        },
        errorElement: <h1>請確保網路連線正常!</h1>,
        children: [
          // {
          //   path: 'sign-up/*',
          //   element: <Register />,
          //   action: registerAction,
          //   errorElement: <h1>網路連接失敗，請確保網路是否正常!</h1>,

          // },
          {
            path: 'sign-in/*',
            element: <Login />,
            loader: sessionCheck,
            action: loginAction,
            errorElement: <h1>網路連接失敗，請確保網路是否正常!</h1>,

          }
        ]
      },
    ]
  },

  {
    path: "*",
    element: <NotFound />,

  }

])
export { router }
