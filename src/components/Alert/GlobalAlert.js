import React from 'react';
import { Alert } from 'react-bootstrap';
import { useAlertContext } from './AlertContext';

export const GlobalAlert = () => {
  const { alert, hideAlert } = useAlertContext();

  if (!alert) {
    return null;
  }

  return (
    <Alert className="fixed-top mx-auto w-50 mt-5" variant={alert.variant} onClose={hideAlert} dismissible>
        <Alert.Heading>{alert.heading}</Alert.Heading>
        <p> {alert.message} </p>
    </Alert>
  );
};
