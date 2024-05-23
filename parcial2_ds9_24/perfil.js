(() => {
  // Obtener datos del usuario del almacenamiento local
  // const usuarioAutenticado = JSON.parse(localStorage.getItem('usuarioAutenticado'));
  const App = {
    htmlElements: {
      form: document.getElementById("formaprofile"),
      btnLogout: document.getElementById("btnLogout"),
      btnEditar: document.getElementById("btnEditar"),
    },
    init() {
      App.bindEvents();
      App.methods.mostrarPerfil();
      // App.initialValiations();
    },
    initialValiations() {
      Session.shouldNotBeLoggedIn();
    },
    bindEvents() {
      App.htmlElements.btnLogout.addEventListener(
        "click",
        App.handlers.onClickLogout,
      );
      App.htmlElements.btnEditar.addEventListener(
        "click",
        App.handlers.onClickEditar,
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
      onClickEditar(event) {
        event.preventDefault();
        App.methods.hacerEdit();
      },
    },
    methods: {
      mostrarPerfil() {
        if (App.methods.usuarioAutenticado()) {
          const arrayUserAutenticado = App.methods.usuarioAutenticado();
          console.log(arrayUserAutenticado);
          const { nombre, nombrecompleto, descripcion, imagen, pais, email, celular} = App.methods.usuarioAutenticado();
          const profileContainer = document.getElementById('profileContainer');
          profileContainer.innerHTML = `
            <img src="${imagen}" alt="${nombre}" width="200" height="200">
            <h2>${nombrecompleto}</h2>
            <p>${email}</p>
            <p>${descripcion}</p>
            <p>Contacto:${celular}</p>
            <p>${pais}</p>           
          `;
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
      hacerEdit(){
        //localStorage.removeItem("usuarioAutenticado");
        window.location.href = "perfiledit.html";
      },

      
    },
    templates: {},
    render() {},
  };
  App.init();
})();

