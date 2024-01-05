import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Home from './routes/home.tsx'
import Login from './routes/login.tsx'
import Signin from './routes/signin.tsx'
import PostAdd from './routes/postadd.tsx'
import ViewPost from './routes/viewpost.tsx'
import Search from './routes/search.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    path:"/login",
    element:<Login></Login>,
  },
  {
    path:"/signin",
    element:<Signin></Signin>,
  },
  {
    path:"/postadd",
    element:<PostAdd></PostAdd>
  },
  {
    path:"/post/:id",
    element:<ViewPost></ViewPost>,
  },
  {
    path:"/search",
    element:<Search></Search>,
  },
  {
    path:"/post/:id",
    element:<ViewPost></ViewPost>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
