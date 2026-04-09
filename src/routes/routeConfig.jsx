import Dashboard from "../pages/dashboard/Dashboard";
import Home from '../pages/Home';
import SettingsLayout from "../components/SettingsLayout";
import Appearance from "../pages/settings/Appearance";
import SettingsMain from "../pages/settings/SettingsMain";
import DashboardLayout from "../components/DashboardLayout";
import Event from "../pages/dashboard/Event";
import Task from "../pages/dashboard/Task";


const routeConfig = [
 
  {
    path: "/dashboard",
    auth: true,
    navbar:false,
    redirectUrl: '/dashboard',
    isPageActive: true,
    spinner:true,
    element: <DashboardLayout />,
    children:[
      {
        path:"",
        index:true,
        element: <Dashboard />
      },
      {
        path:"event",
        element: <Event />
      },
      {
        path:"task",
        element: <Task/>
      }
    ]
  },

    {
    path: "/",
    auth: false,
    spinner:true,
    navbar:true,
    isPageActive: false,
    element: <Home />,
  },

     {
    path: "/settings",
    auth: true,
    spinner:true,
    navbar:false, 
    element: <SettingsLayout />,
     children: [
       {
      path:"",
      index:true,
      element: <SettingsMain />
    },
    {
      path:"appearance",
      element: <Appearance />
    },
  ]
  },
];





export default routeConfig;