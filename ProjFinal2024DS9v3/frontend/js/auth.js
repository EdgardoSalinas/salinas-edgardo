// auth.js
import config from '../config.js';
export function setUserType(type) {
  if (type === 'usuario' || type === 'proveedor') {
    localStorage.setItem('userType', type);
  } else {
    console.error('Tipo de usuario no válido');
  }
}

export function getUserType() {
  return localStorage.getItem('userType') || 'usuario'; // 'usuario' como valor por defecto
}


export function isUserLoggedIn() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return false;
    }
    
    //disable temporaly
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    if (tokenExpiration && new Date().getTime() > parseInt(tokenExpiration)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiration');
      return false;
    }
    return true;
  }
  
  export async function validateTokenWithBackend() {
    try {
      //`${config.API_BASE_URL}
      //      const response = await fetch('http://localhost:3000/api/users/validate-token', {
      const response = await fetch(`${config.API_BASE_URL}/api/users/validate-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (!response.ok) {
        throw new Error('Token validation failed');
      }
      const data = await response.json();
      return data.isValid;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }


  
  export async function checkUserSession() {
    if (!isUserLoggedIn()) {
      //window.location.href = 'login.html';
      return false;
    }
    
    //disable
    const isTokenValid = await validateTokenWithBackend();
    if (!isTokenValid) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiration');
      //window.location.href = '/login.html';
      return false;
    }
    return true;
  }


  