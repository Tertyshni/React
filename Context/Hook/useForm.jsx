import { useState } from "react";

function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setValues({
      ...values,
      [name]: value
    });
  }

  function validate() {
    const newErrors = {};

    Object.keys(values).forEach(key => {
      if (!values[key]) {
        newErrors[key] = "Заповніть це поле";
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  return {
    values,
    errors,
    handleChange,
    validate
  };
}

export default useForm;