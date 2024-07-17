import config from '../config.js';
import { isUserLoggedIn, validateTokenWithBackend, checkUserSession } from './auth.js';
(() => {
    const App = {
  
      htmlElements: {
        loginForm: document.getElementById("loginForm"),
        username: document.getElementById("username"),
        password: document.getElementById("password"),
        btnRegistrarse: document.getElementById("btnregistrarse"),
        btnRegistrarprov: document.getElementById("btnregistrarprov"),
      },
  
      init() {
        App.bindEvents();
        //check if token exist or not
        //if exist token go to main page
        App.methods.checkLogin();
      },
  
      bindEvents() {
        App.htmlElements.loginForm.addEventListener("submit", App.handlers.onSubmit);
        App.htmlElements.btnRegistrarse.addEventListener(
            "click",
            App.handlers.onClickRegistrarse,
          );
        App.htmlElements.btnRegistrarprov.addEventListener(
            "click",
            App.handlers.onClickRegistrarprov,
          );
      },
  
      handlers: {
        onSubmit(e) {
          e.preventDefault();
          // validate login and send to main page
          App.methods.redirigirAlPerfil();
        },
        onClickRegistrarse(e) {
            e.preventDefault();
            App.methods.registrarse();
            //window.location.href = 'registro.html';
          },
        onClickRegistrarprov(e) {
            e.preventDefault();
            App.methods.registrarprov();
            //window.location.href = 'registro.html';
          },

      },
  
      methods: {

        registrarse() {
            //window.location.href = 'registro.html';
            //parameter tipousuario
            // usuario para clientes
            const tipoUsuario = 'usuario';
            window.location.href = `registro.html?tipousuario=${tipoUsuario}`;
        },

        registrarprov() {
          //window.location.href = 'registro.html';
          //parameter tipousuario
          // usuario para clientes
          const tipoUsuario = 'proveedor';
          window.location.href = `registro.html?tipousuario=${tipoUsuario}`;
        },
        //check if token exist or not
        //if exist token go to main page
        async checkLogin() {
            console.log("entro a checkLogin usuarios");
            const sesionValida = await checkUserSession();
            if (sesionValida && !window.location.pathname.endsWith('index.html')) {
              window.location.href = '../index.html';
            }
            localStorage.removeItem('authToken');
            localStorage.removeItem('tokenExpiration');
            localStorage.removeItem('userType');
            localStorage.removeItem('userName');
            localStorage.removeItem('userId');
             // Si estamos en la página de login y la sesión es válida, redirigir a index.html

            // if (sesionValida) {
            //   window.location.href = 'index.html';
            //   // La redirección ya se maneja en checkUserSession, 
            //   // pero puedes agregar lógica adicional aquí si es necesario
            // }
            // valida si existe usuarioNuevo para agregarlo a usuarios
            // if (localStorage.getItem('usuarioNuevo')) {
            //     const usuarioNuevo = JSON.parse(localStorage.getItem('usuarioNuevo'));
            //     usuarios.push(usuarioNuevo);
            //     localStorage.removeItem('usuarioNuevo');
            // }
            // console.log(usuarios);
            // // Obtener datos del usuario del almacenamiento local
            // const usuarioAutenticado = JSON.parse(localStorage.getItem('usuarioAutenticado'));
  
            // if (usuarioAutenticado) {
            //             // Redirigir a login.html si no hay usuario autenticado
            //             window.location.href = 'index.html';
  
            // }        
        },
         
        // autenticarUsuario(usuarios, username, password) {
        //   return usuarios.find(
        //     (usuario) =>
        //       usuario.usuario.toLowerCase() === username.toLowerCase() &&
        //       usuario.contraseña === this.hashCode(password).toString()
        //   );
        // },
  
        // Función para redirigir al perfil si el usuario está autenticado
        async redirigirAlPerfil() {
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;

          try {
            const result = await App.methods.validateUser(username, password);
            if (result.valid) {
              console.log('Login successful');
              
              window.location.href = '../index.html';
              // Redirect to dashboard or update UI for logged-in state
            } else {
              console.log('Login failed:', result.message);
              // Update UI to show login error
            }
          } catch (error) {
            console.error('Login error:', error);
            // Update UI to show error message
          }
          
/*           // Simular autenticación (en una aplicación real, esto se haría en el servidor)
          const usuarioAutenticado = usuarios.find(
              (usuario) =>
                usuario.usuario.toLowerCase() === username.toLowerCase() &&
                usuario.contraseña === this.hashCode(password).toString()
          );
          // antes decia solo usuarioAutenticado
          if (this.autenticarUsuario(usuarios,username,password)) {
            localStorage.setItem('usuarioAutenticado', JSON.stringify(usuarioAutenticado));
            window.location.href = 'index.html';
          } else {
              alert('Credenciales inválidas');
          } */

        },// fin redirigirAlPerfil
  

        async validateUser(username, password) {
          try {
            //`${config.API_BASE_URL}/api/users/profile`
            //const response = await fetch('http://localhost:3000/api/users/login', {
            const response = await fetch(`${config.API_BASE_URL}/api/users/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                usuario: username,
                contrasena: password
              })
            });
        
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const data = await response.json();
            // Store the token in localStorage
            console.log(data);
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userType', data.tipoUsuario);
            localStorage.setItem('userId', data.UserId);
            localStorage.setItem('userName', data.userName);
            window.location.href = '../index.html';

            return data;
          } catch (error) {
            console.error('Error validating user:', error);
            throw error;
          }
        },
        // fin methods
      },
 
      render(html) {
        App.htmlElements.results.innerHTML += html;
      },
  
    }; // fin de const App
    App.init();
  })();