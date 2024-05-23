(() => {
    const tipotransaccionMap = {
        '1': 'Ingreso',
        '2': 'Egreso',
    }
    const App = {
      htmlElements: {
        formAdd: document.getElementById("formAdd"),
        btnsalvar: document.getElementById("btn-salvar"),
        btncancel: document.getElementById("btn-cancelar")
      },
      init() {
        App.bindEvents();
      },
      initialValiations() {
        Session.shouldNotBeLoggedIn();
      },
      bindEvents() {
        // App.htmlElements.formAdd.addEventListener(
        //   "submit",
        //   App.handlers.onSubmit,
        // );
        App.htmlElements.btnsalvar.addEventListener(
            "click",
            App.handlers.onClickSalvar,
          );
  
        App.htmlElements.btncancel.addEventListener(
          "click",
          App.handlers.onClickCancel,
        );
      },
      handlers: {
        onSubmit(event) {
          event.preventDefault();
          const { fecha, descripcion, monto, tipo} = event.target.elements;
          App.methods.add1Record(fecha.value, descripcion.value, monto.value, tipo.value);
        },
        onClickSalvar(event) {
            // event.preventDefault();
            //const { fecha, descripcion, monto, tipo} = event.target.elements;
            const { fecha, descripcion, monto, tipo} = formAdd.elements;
            const tipoTransacTexto = tipotransaccionMap[tipo.value]
            App.methods.add1Record(fecha.value, descripcion.value, monto.value, tipoTransacTexto);
            //tipo.value
          },
        onClickCancel() {
          App.methods.cancelAdd();
        },
      },
      methods: {
        add1Record(fecha, descripcion, monto, tipo ) {
          let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
          transacciones.push({ fecha, descripcion, monto, tipo });
          localStorage.setItem('transacciones', JSON.stringify(transacciones));
        //   window.location.href = 'index.html';
        },
        cancelAdd() {
          window.location.href = 'index.html';
        },
      },
      templates: {},
      render() {},
    };
    App.init();
  })();
  
  