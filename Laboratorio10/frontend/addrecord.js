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
        App.methods.validaInicial();
      },
    //   initialValiations() {
    //     Session.shouldNotBeLoggedIn();
    //   },
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
            event.preventDefault();
            //const { fecha, descripcion, monto, tipo} = event.target.elements;
            const { fecha, descripcion, monto, tipo} = formAdd.elements;
            const tipoTransacTexto = tipotransaccionMap[tipo.value]
            App.methods.add1Record(fecha.value, descripcion.value, monto.value, tipoTransacTexto);
            // Clear input fields
            fecha.value = '';
            descripcion.value = '';
            monto.value = '';
            tipo.value = '';
            document.getElementById("divresultado").innerHTML = "Transacción exitosa";
            //tipo.value
          },
        onClickCancel(event) {
          event.preventDefault();
          App.methods.cancelAdd();
        },
      },
      methods: {

        validaInicial() {
            if (!App.methods.usuarioAutenticado()) {
                              // Redirigir a login.html si no hay usuario autenticado
              window.location.href = 'index.html';

            } 
          },
          usuarioAutenticado() {
            return JSON.parse(localStorage.getItem("usuarioAutenticado"));        
          },

        add1Record(fecha, descripcion, monto, tipo ) {
            let idrecord = 0;
            let transacID = JSON.parse(localStorage.getItem('idrecord')) || [];
            
            if (transacID.length>0){
                idrecord = parseInt(idrecord = transacID[0].idr);
            } 

            let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
            // obtener el numero de elementos en transacciones
            //let numeroElementos = transacciones.length;
            let widrecord = 0
            widrecord = idrecord + 1;

            //transacciones.push({ fecha, descripcion, monto, tipo , widrecord});
            transacciones.push({ fecha, descripcion, tipo, monto, widrecord});

            App.methods.insertregistros({ fecha, descripcion, tipo, monto, widrecord});

            // localStorage.setItem('transacciones', JSON.stringify(transacciones));

            transacID = [{
                idr: widrecord
                }]
                
            localStorage.setItem('idrecord', JSON.stringify(transacID));
            
        //   window.location.href = 'index.html';
        },
        async insertregistros(datos) {
          const payload = datos ;
          const rawResponse = await fetch('http://localhost:3000/ingresos/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const data = await rawResponse.json();
          console.log(data);
          //return(data);
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
  
  