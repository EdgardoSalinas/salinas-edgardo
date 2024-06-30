(() => {
  // Obtener datos del usuario del almacenamiento local
  // const usuarioAutenticado = JSON.parse(localStorage.getItem('usuarioAutenticado'));
  const App = {
    htmlElements: {
      form: document.getElementById("formaprofile"),
      btnSalvar: document.getElementById("btnSalvar"),
      btnCerrar: document.getElementById("btnCerrar"),
      usuario: document.getElementById("usuario"),
      nombreCompleto: document.getElementById("nombreCompleto"),
      contrasena: document.getElementById("contrasena"),
      email: document.getElementById("email"),
      descripcion: document.getElementById("descripcion"),
      celular: document.getElementById("celular"),
      pais: document.getElementById("pais"),
    },
    init() {
      App.bindEvents();
      App.methods.cargarPerfil();
      // App.initialValiations();
    },
    // initialValiations() {
    //   Session.shouldNotBeLoggedIn();
    // },
    bindEvents() {
      App.htmlElements.btnCerrar.addEventListener(
        "click",
        App.handlers.onClickLogout,
      );
      App.htmlElements.btnSalvar.addEventListener(
        "click",
        App.handlers.onClickSalvar,
      );

    },
    handlers: {
      // onSubmit(event) {
      //   event.preventDefault();
      //   const { username, password } = event.target.elements;
      //   Session.login(username.value, password.value);
      // },
      onClickLogout(event) {
        event.preventDefault();
        App.methods.hacerLogout();
      },
      onClickSalvar(event) {
        event.preventDefault();
        App.methods.hacerSalvar();
        const divResultado = document.getElementById("divresultado");
        divResultado.innerHTML = "Registro exitoso";
        const btnVolver = document.createElement("button");
        btnVolver.innerText = "Retornar";
        btnVolver.addEventListener("click", () => {
            window.location.href = "index.html";
        });
        divResultado.appendChild(btnVolver);
       // App.methods.cargarPerfil();
      },

    },
    methods: {
      cargarPerfil() {
        if (App.methods.usuarioAutenticado()) {
            window.location.href = 'index.html';
        //   const arrayUserAutenticado = App.methods.usuarioAutenticado();
        //   console.log(arrayUserAutenticado);
        //   const { nombrecompleto, contraseña, email, descripcion, pais, celular} = App.methods.usuarioAutenticado();
        //   App.htmlElements.nombreCompleto.value = nombrecompleto;
        //   App.htmlElements.contrasena.value = contraseña;
        //   App.htmlElements.email.value = email;
        //   App.htmlElements.descripcion.value = descripcion;
        //   App.htmlElements.celular.value = celular;
        //   App.htmlElements.pais.value = pais;
                  // Redirigir a login.html si hay usuario autenticado
                //window.location.href = 'index.html';

        } 
        else {
          // Redirigir a login.html si hay usuario autenticado
          //window.location.href = 'index.html';
        }
      },
      usuarioAutenticado() {
        return JSON.parse(localStorage.getItem("usuarioAutenticado"));        
      },
      hacerLogout(){
        //localStorage.removeItem("usuarioAutenticado");
        window.location.href = "index.html";
      },

      hacerSalvar(){
        
        // const userData = JSON.parse(localStorage.getItem('usuarioNuevo'));
        // userData.nombrecompleto = App.htmlElements.nombreCompleto.value ;
        // if (!(userData.contraseña == parseInt(App.htmlElements.contrasena.value))){
        //     userData.contraseña = App.methods.hashCode(App.htmlElements.contrasena.value);
        // }
        // userData.email = App.htmlElements.email.value;
        // userData.descripcion = App.htmlElements.descripcion.value;
        // userData.celular = App.htmlElements.celular.value;
        // userData.pais = App.htmlElements.pais.value;
        // { usuario: 'Juan', contraseña: '48690', nombrecompleto: 'Juan Bosco'
        //         , descripcion: 'Desarrollador Web', imagen: 'juan.jpg', pais: 'Panamá', email: 'juanz@gmail.com', celular: '507-6626438'  },
        const userData = {
            usuario: App.htmlElements.usuario.value,
            contraseña: App.methods.hashCode(App.htmlElements.contrasena.value).toString(),
            nombrecompleto: App.htmlElements.nombreCompleto.value,
            descripcion: App.htmlElements.descripcion.value,
            imagen: App.htmlElements.usuario.value.toString() + '.jpg',
            pais: App.htmlElements.pais.value,
            email: App.htmlElements.email.value,
            celular: App.htmlElements.celular.value
        };

        localStorage.setItem('usuarioNuevo', JSON.stringify(userData));

      },
      
      hashCode(str) {
        let hash = 0;
        for (let i = 0, len = str.length; i < len; i++) {
            let chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convertir a entero de 32 bits
        }
        return hash;
    }

    },
    templates: {},
    render() {},
  };
  App.init();
})();

