import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

function Protected({ element }) {
  const token = localStorage.getItem('AuthToken');

  return token? element? element : <Outlet/> : <Navigate to="/login" />
}

export default Protected;