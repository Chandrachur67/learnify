import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AuthContext from "./store/auth-context";

export const SignupLoginProtected = () => {
  const { userdata } = useContext(AuthContext);

  return userdata ? <Navigate to="/" /> : <Outlet />;
};

export const AdminProtected = () => {
  const { userdata } = useContext(AuthContext);
  return userdata.role === "admin" ? <Outlet /> : <Navigate to="/" />;
};

export const InstructorProtected = () => {
  const { userdata } = useContext(AuthContext);
  return userdata.role === "instructor" ? <Outlet /> : <Navigate to="/" />;
};
