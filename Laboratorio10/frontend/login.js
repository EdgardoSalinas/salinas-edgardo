(() => {
    const usuarios = [
      { usuario: 'Juan', contraseña: '48690', nombrecompleto: 'Juan Bosco', descripcion: 'Desarrollador Web', imagen: 'juan.jpg', pais: 'Panamá', email: 'juanz@gmail.com', celular: '507-6626438'  },
      { usuario: 'Marta', contraseña: '48690', nombrecompleto: 'Marta Salcedo',descripcion: 'Diseñadora Gráfica', imagen: 'marta.jpg', pais: 'Panamá', email: 'martax@gmail.com', celular: '507-6638711'  },
      // Agrega más usuarios según sea necesario
    ];
    // contraseña esta en hascode
    const App = {
  
      htmlElements: {
        loginForm: document.getElementById("loginForm"),
        username: document.getElementById("username"),
        password: document.getElementById("password"),
        btnRegistrarse: document.getElementById("btnregistrarse"),
      },
  
      init() {
        App.bindEvents();
        App.methods.checkLogin();
      },
  
      bindEvents() {
        App.htmlElements.loginForm.addEventListener("submit", App.handlers.onSubmit);
        App.htmlElements.btnRegistrarse.addEventListener(
            "click",
            App.handlers.onClickRegistrarse,
          );
      },
  
      handlers: {
        onSubmit(e) {
          e.preventDefault();
          App.methods.redirigirAlPerfil();
        },
        onClickRegistrarse(e) {
            e.preventDefault();
            App.methods.registrarse();
            //window.location.href = 'registro.html';
          },
      },
  
      methods: {

        registrarse() {
            window.location.href = 'registro.html';
        },
  
        checkLogin() {
            // valida si existe usuarioNuevo para agregarlo a usuarios
            if (localStorage.getItem('usuarioNuevo')) {
                const usuarioNuevo = JSON.parse(localStorage.getItem('usuarioNuevo'));
                usuarios.push(usuarioNuevo);
                localStorage.removeItem('usuarioNuevo');
            }
            console.log(usuarios);
            // Obtener datos del usuario del almacenamiento local
            const usuarioAutenticado = JSON.parse(localStorage.getItem('usuarioAutenticado'));
  
            if (usuarioAutenticado) {
                        // Redirigir a login.html si no hay usuario autenticado
                        window.location.href = 'index.html';
  
            }        
          },
         
        autenticarUsuario(usuarios, username, password) {
          return usuarios.find(
            (usuario) =>
              usuario.usuario.toLowerCase() === username.toLowerCase() &&
              usuario.contraseña === this.hashCode(password).toString()
          );
        },
  
            // Función para redirigir al perfil si el usuario está autenticado
        redirigirAlPerfil() {
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;
          
          // Simular autenticación (en una aplicación real, esto se haría en el servidor)
          const usuarioAutenticado = usuarios.find(
              (usuario) =>
                usuario.usuario.toLowerCase() === username.toLowerCase() &&
                usuario.contraseña === this.hashCode(password).toString()
          );
  
          // antes decia solo usuarioAutenticado
          if (this.autenticarUsuario(usuarios,username,password)) {
            //
            // const elusuarioConHashedPassword = usuarioAutenticado.map(usuario => {
            //     // Crear una copia del objeto usuario para no modificar el objeto original
            //     const usuarioCopia = { ...usuario };
              
            //     // Generar el hash de la contraseña y reemplazarlo en el objeto copiado
            //     usuarioCopia.contraseña = hashCode(usuario.contraseña);
              
            //     return usuarioCopia;
            //   });
              
            // Guardar datos del usuario en el almacenamiento local
            //usuarioAutenticado.contraseña = this.hashCode(usuarioAutenticado.contraseña)
            localStorage.setItem('usuarioAutenticado', JSON.stringify(usuarioAutenticado));
            //localStorage.setItem('usuarioAutenticado', JSON.stringify(elusuarioConHashedPassword));
            // Redirigir a perfil.html
            window.location.href = 'index.html';
          } else {
              alert('Credenciales inválidas');
          }
        },// fin redirigirAlPerfil
  



        hashCode(str) {
            let hash = 0;
            for (let i = 0, len = str.length; i < len; i++) {
                let chr = str.charCodeAt(i);
                hash = (hash << 5) - hash + chr;
                hash |= 0; // Convertir a entero de 32 bits
            }
            return hash;
        }
  
        // fin methods
      },
  
      render(html) {
        App.htmlElements.results.innerHTML += html;
      },
  
  
    }; // fin de const App
    App.init();
  })();