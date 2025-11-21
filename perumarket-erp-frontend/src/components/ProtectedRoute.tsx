import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  const isLogged = localStorage.getItem("logged");

  return isLogged ? children : <Navigate to="/login" replace />;
}
