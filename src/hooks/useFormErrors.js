import { useState } from 'react'

export default function useFormErrors() {
  let [fieldErrors, setFieldErrors] = useState([]);

  const fieldsWithErrors = fieldErrors.map(([fieldName]) => fieldName);

  const fieldHasError = (fieldName) => {
    return fieldsWithErrors.includes(fieldName);
  };

  const errorMessageFor = (fieldName) => {
    const found = fieldErrors.find(([fn]) => fieldName === fn);

    return !found ? undefined : found[1];
  };

  return {
    setFieldErrors,
    fieldsWithErrors,
    fieldHasError,
    errorMessageFor
  };
};