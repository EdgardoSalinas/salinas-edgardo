import config from '../config.js';

// const config = require('../config');
import { isUserLoggedIn, validateTokenWithBackend, checkUserSession } from './auth.js';
import { getCurrentUserType, setCurrentUserType } from './globalState.js';

(() => {
    const App = {
      htmlElements: {
        mainForm: document.getElementById("mainForm"),
        usuariobienvenido: document.getElementById("usuariobienvenido"),
        btnLogout: document.getElementById("btnLogout"),
        btnPerfil: document.getElementById("btnPerfil"),
        // menu lateral 
        menuCarrito: document.querySelector('.sidebar a[href="#carrito"]'),
        menuPerfil: document.querySelector('.sidebar a[href="#perfil"]'),
        menuServicios: document.querySelector('.sidebar a[href="#servicios"]'),
        menuServiciosupd: document.querySelector('.sidebar a[href="#serviciosupd"]'),
        menucontratarServicios: document.querySelector('.sidebar a[href="#contratarServicios"]'),
        menuOrdenes: document.querySelector('.sidebar a[href="#ordenes"]'),
        menuFacturas: document.querySelector('.sidebar a[href="#facturas"]'),
        menuAdmin: document.querySelector('.sidebar a[href="#admin"]'),
      },
      init() {
        App.bindEvents();
        App.methods.checkSesionExiste();
      },
      bindEvents() {
  
        App.htmlElements.btnLogout.addEventListener(
          "click",
          App.handlers.onClickLogout,
        );
        // App.htmlElements.btnPerfil.addEventListener(
        //   "click",
        //   App.handlers.onClickPerfil,
        // );
        App.htmlElements.menuCarrito.addEventListener("click", App.handlers.onClickCarrito);
        App.htmlElements.menuPerfil.addEventListener("click", App.handlers.onClickPerfil);
        App.htmlElements.menuServicios.addEventListener("click", App.handlers.onClickServicios);
        App.htmlElements.menuServiciosupd.addEventListener("click", App.handlers.onClickServiciosupd);
        App.htmlElements.menucontratarServicios.addEventListener("click", App.handlers.onClickContratarServicios);
        App.htmlElements.menuOrdenes.addEventListener("click", App.handlers.onClickOrdenes);
        App.htmlElements.menuFacturas.addEventListener("click", App.handlers.onClickFacturas);

        App.htmlElements.menuAdmin.addEventListener("click", App.handlers.onClickAdmin);

      },
      handlers: {
        onClickLogout() {
          App.methods.hacerLogout();
        },
        onClickPerfil() {
          App.methods.openPerfil();
        },
        onClickCarrito() {
          App.methods.openPerfil();
          // Lógica para manejar el clic en "Carrito de Compra"
        },
        onClickPerfil() {
          App.methods.openPerfil();
            // Lógica para manejar el clic en "Perfil"
        },
        onClickServicios() {
          App.methods.openServicio();
          // Lógica para manejar el clic en "Servicios por Proveedor"
        },
        onClickServiciosupd() {
          App.methods.openServicioupd();
          // Lógica para manejar el clic en "Servicios por Proveedor"
        },

        onClickContratarServicios() {
          App.methods.openContratarServicio();
          // Lógica para manejar el clic en "Servicios por Proveedor"
        },
        onClickOrdenes() {
          App.methods.openmisOrdenes();
          // Lógica para manejar el clic en "Mis Ordenes"
        },
        onClickFacturas() {
          App.methods.openPerfil();
            // Lógica para manejar el clic en "Mis Facturas"
        },
        onClickAdmin() {
          App.methods.openAdmin();
            // Lógica para manejar el clic en "Mis Facturas"
        },


      },
      methods: {
        async checkSesionExiste() {
          const sesionValida = await checkUserSession();


          if (!sesionValida) {
                // Inicializar el tipo de usuario al cargar la aplicación
            const userType = getCurrentUserType();
            //this.configurarAplicacionParaTipoUsuario(userType);
            window.location.href = './html/login.html';
            // La redirección ya se maneja en checkUserSession, 
            // pero puedes agregar lógica adicional aquí si es necesario
          }else{
            App.methods.cargarNombreUsuario();
          }
          //window.location.href = 'login.html';
          // Obtener token del usuario para checar si hay coneccion
  
        },
        async cargarNombreUsuario() {
          try {
            //const response = await fetch('http://localhost:3000/api/users/profile', {
            const response = await fetch(`${config.API_BASE_URL}/api/users/profile`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
              }
            });
    
            if (!response.ok) {
              throw new Error('Failed to fetch user profile');
            }
    
            const userProfile = await response.json();
            App.methods.mostrarNombreUsuario(userProfile.nombre,userProfile.tipodeusuario);
          } catch (error) {
            console.error('Error al cargar el perfil del usuario:', error);
            App.methods.mostrarNombreUsuario('Usuario','tipodeusuario');
          }
        },
    
        mostrarNombreUsuario(nombre, tipodeusuario) {
          if (tipodeusuario){
            App.htmlElements.usuariobienvenido.textContent = `Bienvenido, ${tipodeusuario} ${nombre} `;   
          }else{
            App.htmlElements.usuariobienvenido.textContent = `Bienvenido, ${tipodeusuario} ${nombre} `;
          }
          
        },
        hacerLogout(){
          // aqui hay que borrar los token del usuario
          localStorage.removeItem('authToken');
          localStorage.removeItem('tokenExpiration');
          localStorage.removeItem('userType');
          localStorage.removeItem('userName');
          localStorage.removeItem('userId');
          window.location.href = "index.html";
        },
        openPerfil(){
          const userType = getCurrentUserType();
          if (userType === 'usuario') {
            window.location.href = './html/perfil.html';
          } else if (userType === 'proveedor') {
            window.location.href = './html/perfilp.html';
          }
        },
        openServicio(){
          const userType = getCurrentUserType();
          if (userType === 'proveedor') {
            window.location.href = './html/nuevo-servicio.html';
          } 
        },
        openServicioupd(){
          const userType = getCurrentUserType();
          if (userType === 'proveedor') {
            window.location.href = './html/inicio-proveedor.html';
          } 
        },

        openContratarServicio(){
          const userType = getCurrentUserType();
          if (userType === 'usuario') {
            window.location.href = './html/servicioShop.html';
          } 
        },
        openmisOrdenes(){
          const userType = getCurrentUserType();
          if (userType === 'usuario') {
            window.location.href = './html/misordenes.html';
          } 
        },
        openAdmin(){
          const userType = getCurrentUserType();
          window.location.href = './html/crudmodel.html';
          // if (userType === 'admin') {
          //   window.location.href = './html/crudmodel.html';
          // } 
        },

          // fin methods
        },
  
        templates: {},
  
        render(elemento,html) {
          //App.htmlElements.indexForm.innerHTML = html;
          document.getElementById(elemento).innerHTML = html;
        },
  
    }; // fin de const App
    App.init();
  })();