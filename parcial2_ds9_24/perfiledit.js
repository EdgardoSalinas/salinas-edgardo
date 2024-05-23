(() => {
  // Obtener datos del usuario del almacenamiento local
  // const usuarioAutenticado = JSON.parse(localStorage.getItem('usuarioAutenticado'));
  const App = {
    htmlElements: {
      form: document.getElementById("formaprofile"),
      btnSalvar: document.getElementById("btnSalvar"),
      btnCerrar: document.getElementById("btnCerrar"),
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
    initialValiations() {
      Session.shouldNotBeLoggedIn();
    },
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
        App.methods.cargarPerfil();
      },

    },
    methods: {
      cargarPerfil() {
        if (App.methods.usuarioAutenticado()) {
          const arrayUserAutenticado = App.methods.usuarioAutenticado();
          console.log(arrayUserAutenticado);
          const { nombrecompleto, contraseña, email, descripcion, pais, celular} = App.methods.usuarioAutenticado();
          App.htmlElements.nombreCompleto.value = nombrecompleto;
          App.htmlElements.contrasena.value = contraseña;
          App.htmlElements.email.value = email;
          App.htmlElements.descripcion.value = descripcion;
          App.htmlElements.celular.value = celular;
          App.htmlElements.pais.value = pais;

        } 
        else {
          // Redirigir a login.html si no hay usuario autenticado
          window.location.href = 'index.html';
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
        const userData = JSON.parse(localStorage.getItem('usuarioAutenticado'));
        userData.nombrecompleto = App.htmlElements.nombreCompleto.value ;
        if (!(userData.contraseña == parseInt(App.htmlElements.contrasena.value))){
            userData.contraseña = App.methods.hashCode(App.htmlElements.contrasena.value);
        }
        userData.email = App.htmlElements.email.value;
        userData.descripcion = App.htmlElements.descripcion.value;
        userData.celular = App.htmlElements.celular.value;
        userData.pais = App.htmlElements.pais.value;
        localStorage.setItem('usuarioAutenticado', JSON.stringify(userData));
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

