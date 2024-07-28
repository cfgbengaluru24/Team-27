import './App.css';
import Dashboard from './Components/Dashboard/Dashboard';
import Login from './Components/Login/Login';
import Orders from './Components/Orders/Orders';
import Explore from './Components/Explore/Explore';
import Products from './Components/Products/Products';
import Register from './Components/Register/Register';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <div><Login /></div>
  },
  {
    path: '/register',
    element: <div><Register /></div>
  },
  {
    path: '/dashboard',
    element: <div><Dashboard /></div>
  },
  {
    path: '/orders',
    element: <div><Orders /></div>
  },
  {
    path: '/explore',
    element: <div><Explore /></div>
  },
  {
    path: '/products',
    element: <div><Products /></div>
  }
])

function App() {

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
