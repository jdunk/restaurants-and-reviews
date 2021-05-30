import { useState } from 'react'

export default function useFormValues(initialValues) {
  let [values, setValues] = useState(initialValues);

  const setValue = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  return {
    values,
    setValue,
    bindField: (fieldName) => ({
      name: fieldName,
      value: values[fieldName],
      onChange: setValue
    }),
  };
};