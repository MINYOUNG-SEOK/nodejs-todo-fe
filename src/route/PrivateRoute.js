import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ user, children }) => {
  // user가 null이면 로그인 페이지로, user가 있으면 children 렌더링
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
