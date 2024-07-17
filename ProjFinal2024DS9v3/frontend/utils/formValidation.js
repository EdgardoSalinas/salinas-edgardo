// utils/formValidation.js

export const validateForm = (form) => {
    const requiredFields = ['nombre', 'apellido', 'email', 'numerodecelular'];
    let isValid = true;
    let errorMessages = [];
  
    requiredFields.forEach(field => {
      const element = form[field];
      if (!element || !element.value.trim()) {
        isValid = false;
        errorMessages.push(`${field} es requerido`);
      }
    });
  
    // Validación específica para el email
    const emailField = form['email'];
    if (emailField && emailField.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value.trim())) {
        isValid = false;
        errorMessages.push('El formato del email no es válido');
      }
    }
  
    // Validación específica para el número de celular
    // const celularField = form['numerodecelular'];
    // if (celularField && celularField.value.trim()) {
    //   const celularRegex = /^\d{8}$/; // Asume un número de 10 dígitos, ajusta según tus necesidades
    //   if (!celularRegex.test(celularField.value.trim())) {
    //     isValid = false;
    //     errorMessages.push('El número de celular debe tener 10 dígitos');
    //   }
    // }
  
    // Si hay errores, mostrarlos al usuario
    if (!isValid) {
      alert(errorMessages.join('\n'));
    }
  
    return isValid;
  };
  
  // Puedes añadir más funciones de validación específicas si lo necesitas
  export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  export const validateCelular = (celular) => {
    const regex = /^\d{10}$/;
    return regex.test(celular);
  };