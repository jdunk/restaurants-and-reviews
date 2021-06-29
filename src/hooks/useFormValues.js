import { useState } from 'react'

export default function useFormValues(initialValues) {
  let [values, setValues] = useState(initialValues);

  const setValue = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const setValueDirect = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  return {
    values,
    setValue,
    setValueDirect,
    bindField: (fieldName) => ({
      name: fieldName,
      value: values[fieldName],
      onChange: setValue
    }),
  };
};