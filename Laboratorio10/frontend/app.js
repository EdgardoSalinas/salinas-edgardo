(() => {
  const usuarios = [
    { usuario: 'Juan', contraseña: '123', nombrecompleto: 'Juan Bosco', descripcion: 'Desarrollador Web', imagen: 'juan.jpg', pais: 'Panamá', email: 'juanz@gmail.com', celular: '507-6626438'  },
    { usuario: 'Marta', contraseña: '123', nombrecompleto: 'Marta Salcedo',descripcion: 'Diseñadora Gráfica', imagen: 'marta.jpg', pais: 'Panamá', email: 'martax@gmail.com', celular: '507-6638711'  },
    // Agrega más usuarios según sea necesario
  ];
  const App = {
    htmlElements: {
      indexForm: document.getElementById("indexForm"),
      tablaDetalle: document.getElementById("tablaDetalle"),
      divGrafica: document.getElementById("divgrafica"),
      btnLogout: document.getElementById("btnLogout"),
      usuariobienvenido: document.getElementById("usuariobienvenido"),

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

    },
    handlers: {
      onClickLogout() {
        App.methods.hacerLogout();
      },


      onClickBorrar(event) {
        event.preventDefault();
        const fila = event.target.closest('tr')
        App.methods.borrarReg(fila);
        // obtener el valor en la primera celda = idrecord
        //const idrecord = fila.querySelector('td').textContent;

        
        //fila.remove();
        //console.log("¡El botón Votar fue clickeado!");
      },
    },
    methods: {

        borrarReg(fila) {
          console.log(fila);
        },

        checkSesionExiste() {
            // Obtener datos del usuario del almacenamiento local
            const usuarioAutenticado = JSON.parse(localStorage.getItem('usuarioAutenticado'));
            if (!usuarioAutenticado) {
                        // Redirigir a login.html si no hay usuario autenticado
                        window.location.href = 'login.html';
            } else {
              App.htmlElements.usuariobienvenido.innerText=usuarioAutenticado.nombrecompleto;
              const html = App.methods.tablaDetalle();
              App.render('tablaDetalle',html);
              App.methods.obtenerGrafica();

            }       
          },

        async tablaDetalle() {
          // obtener datos del localstorage transacciones
          //const transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];

          //const transacciones = App.methods.getderegistros();
          const transacciones = await App.methods.obtenerTransacciones();

          // obtener el elemento table
          const tablaDet = document.getElementById('tablaDetalle');
          // limpiar el contenido de la tabla
          tablaDet.innerHTML = '';
          // iterar transacciones y crear filas con datos
          // Itera sobre el array de transacciones
          // HEADER
          // agregando el header en html a la tabla
          let filah = document.createElement('tr');
          filah.innerHTML = `<th>id</th><th>Fecha</th><th>Descripción</th><th>Tipo</th><th>Monto</th><th>Balance</th>`;
          tablaDet.appendChild(filah);
          // let fila = document.createElement('tr');
          // ['fecha', 'descripcion', 'tipo', 'monto', 'balance'].forEach(propiedad => {
          //   let celda = document.createElement('th');
          //   celda.textContent = propiedad;
          //   fila.appendChild(celda);
          // });
          let balance=0.00;
          let tipotransaccion = "";   
          transacciones.forEach(transaccion => {
            // Crea una nueva fila
            let fila = document.createElement('tr');
               
            // Crea una celda para cada propiedad y la agrega a la fila
            ['widrecord','fecha', 'descripcion', 'tipo', 'monto'].forEach(propiedad => {
              let celda = document.createElement('td');
              celda.textContent = transaccion[propiedad];
              fila.appendChild(celda);
              if (propiedad === "tipo"){
                tipotransaccion = transaccion[propiedad];                
              }

              if (propiedad === "monto") {
                if (tipotransaccion === "Ingreso") {
                  balance = balance + parseFloat(transaccion[propiedad]);

                  console.log(balance);
                } else {
                  balance = balance - parseFloat(transaccion[propiedad]);

                  console.log(balance);
                }
                let celda = document.createElement('td');
                celda.textContent = balance;
                fila.appendChild(celda);
              } // propiedad === monto
            });  //forEach(propiedad 
            // let celdaBtnBorrar = document.createElement('td');
            // const btnborrar = document.createElement('button');
            // btnborrar.id = "btn-borrar";
            // btnborrar.textContent = "Borrar";
            // btnborrar.classList.add("btn-borrar");
            // btnborrar.addEventListener("click", App.handlers.onClickBorrar);
            // celdaBtnBorrar.appendChild(btnborrar);
            // fila.appendChild(celdaBtnBorrar);

            // Agrega la fila a la tabla
            tablaDet.appendChild(fila);
            
          }); // transacciones.forEach transaccion
          return tablaDet.innerHTML;

        }, // tablaDetalle

        async getderegistros() {
          //const payload = datos ;
          const rawResponse = await fetch('http://localhost:3000/transacciones', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          const data = await rawResponse.json();
          console.log(data);
          return(data);
        },


        async obtenerTransacciones() {
          try {
            const respuesta = await fetch('http://localhost:3000/transacciones');
            const transacciones = await respuesta.json();
            return transacciones;
          } catch (error) {
            console.error('Error:', error);
            throw error; // Opcional: relanzar el error para manejarlo en el llamador
          }
        },

        obtenerGrafica(){
          // const values = [30, 20, 15, 35];
          // const chartElement = app5.methods.generarPieChart(values);
          // app5.htmlElements.divresultados.appendChild(chartElement);
          const data = [];
          const transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
          // obtener el elemento table
          const tablaDet = document.getElementById('tablaDetalle');

          let sumIngresos=0.00;
          let sumEgresos=0.00;
          let tipotransaccion = "";   
          transacciones.forEach(transaccion => {
            // Crea una nueva fila
            let fila = document.createElement('tr');
               
            // Crea una celda para cada propiedad y la agrega a la fila
            ['fecha', 'descripcion', 'tipo', 'monto'].forEach(propiedad => {
              if (propiedad === "tipo"){
                tipotransaccion = transaccion[propiedad];                
              }
              if (propiedad === "monto") {
                if (tipotransaccion === "Ingreso") {
                  sumIngresos = sumIngresos + parseFloat(transaccion[propiedad]);
                } else {
                  sumEgresos = sumEgresos - parseFloat(transaccion[propiedad]);
                }
              } // propiedad === monto
            });  //forEach(propiedad 
          }); // transacciones.forEach transaccion
          sumEgresos = sumEgresos * (-1)
          data.push({ color: '#C40C0C', value: sumEgresos });
          data.push({ color: '#41B06E', value: sumIngresos });

          const chartElement = App.methods.generarPieChart(data);

          const seccionResultados = App.htmlElements.divGrafica;
          let canvasExistente = seccionResultados.querySelector('canvas');

          if (canvasExistente) {
              seccionResultados.removeChild(canvasExistente);
          }
          App.htmlElements.divGrafica.appendChild(chartElement);

      
      },


      generarPieChart(data) {
          // Crear un elemento canvas
          const canvas = document.createElement('canvas');
          canvas.width = 300;
          canvas.height = 300;

          const ctx = canvas.getContext('2d');
          const radius = Math.min(canvas.width, canvas.height) / 2 - 20;
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;

          // Calcular el ángulo inicial y final para cada valor
          let startAngle = 0;
          const totalSum = App.methods.sumg(data.map(item => item.value));
          for (let i = 0; i < data.length; i++) {
              const item = data[i];
              const endAngle = startAngle + (item.value / totalSum) * 2 * Math.PI;

              // Dibujar el arco correspondiente
              ctx.beginPath();
              ctx.moveTo(centerX, centerY);
              ctx.arc(centerX, centerY, radius, startAngle, endAngle);
              ctx.closePath();
              ctx.fillStyle = item.color;
              ctx.fill();

              startAngle = endAngle;
          }

          return canvas;
      },
      sumg(values) {
          return values.reduce((a, b) => a + b, 0);
      },
      hacerLogout(){
        localStorage.removeItem("usuarioAutenticado");
        localStorage.removeItem("transacciones");
        localStorage.removeItem("idrecord");
        
        window.location.href = "index.html";
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