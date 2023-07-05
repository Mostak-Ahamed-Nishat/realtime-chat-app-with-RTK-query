import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// eslint-disable-next-line react/prop-types
export default function PrivateRoute({children}) {
    const isLoggedIn = useAuth();
    return isLoggedIn?children:<Navigate to="/" />;
    
}