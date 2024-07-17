import { getUserType } from './auth.js';

let currentUserType = getUserType(); // Importa getUserType de auth.js

export function getCurrentUserType() {
  return currentUserType;
}

export function setCurrentUserType(type) {
  if (type === 'usuario' || type === 'proveedor') {
    currentUserType = type;
    setUserType(type); // Actualiza también en localStorage
  } else {
    console.error('Tipo de usuario no válido');
  }
}
