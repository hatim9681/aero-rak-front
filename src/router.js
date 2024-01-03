import Sidebar from "./components/Sidebar";
import Factures from "./components/Factures";
import Marches from "./components/Marchés/Marches";
import Login from "./components/Login";
import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import Users from "./components/Users";
import Alertes from "./components/Alertes";
import Prestataires from "./components/Prestataires/Prestataires";
import Bdc from "./components/BDC";
import MarcheDetails from "./components/Marchés/MarcheDetails";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/sidebar",
        element: <Sidebar/>,
        children: [
            {
                path: "",
                element: <Dashboard/>,
            },
            {
                path: "factures",
                element: <Factures />,
            },
            {
                path: "marches",
                element: <Marches />,
            },
            {
                path: "prestataires",
                element: <Prestataires />,
            },
            {
                path: "bdc",
                element: <Bdc/>,
            },
            {
                path: "alertes",
                element: <Alertes />,
            },
            {
                path: "users",
                element: <Users />,
            },
            {
                path: "settings",
                element: <Settings />,
            },
            {
                path: "detailsMA/:id",
                element: <MarcheDetails />,
            },

            

        ]
      
        
    },
    
]);

export default router;