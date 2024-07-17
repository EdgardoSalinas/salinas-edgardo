import config from '../config.js';

(() => {
    const App = {

      state: {
        currentPage: 1,
        servicesPerPage: 2,
        services: [],
        orders: [],
      },

      htmlElements: {

        usuariobienvenido: document.getElementById("usuariobienvenido"),

        serviceList: document.getElementById('serviceList'),

        modal: document.getElementById('appointmentModal'),
        modalContent: document.getElementById('modalContent'),
        closeModal: document.getElementById('closeModal'),

        prevPage: document.getElementById('prevPage'),
        nextPage: document.getElementById('nextPage'),
        currentPage: document.getElementById('currentPage'),
        totalPages: document.getElementById('totalPages'),

        closeButton: document.getElementById('closeButton'),
        orderList: document.getElementById('orderList'),

        modalpp: document.getElementById('appointmentModalpp'),
        modalContentpp: document.getElementById('modalContentpp'),
        closeModalpp: document.getElementById('closeModalpp'),

      },
      init() {
        App.initialValidations();
        App.bindEvents();
        App.methods.fetchServices();
        App.methods.fetchOrders();
      },
      initialValidations() {
        // Realizar validaciones iniciales si es necesario
        const usuariofiltro = localStorage.getItem('userName');
        App.htmlElements.usuariobienvenido.textContent = `Bienvenido,  ${usuariofiltro} `;
      },
      bindEvents() {
        App.htmlElements.closeModal.addEventListener('click', App.methods.hideAppointmentForm);
        window.addEventListener('click', (event) => {
          if (event.target === App.htmlElements.modal) {
            App.methods.hideAppointmentForm();
          }
        });

        App.htmlElements.prevPage.addEventListener('click', () => App.methods.changePage(-1));
        App.htmlElements.nextPage.addEventListener('click', () => App.methods.changePage(1));

        App.htmlElements.closeButton.addEventListener('click', App.methods.closePage);
      },
      handlers: {
        bookAppointment(serviceId,usuarioproveedor,precioHora,truncatedDescription) {
          console.log(`Agendando cita para el servicio con ID: ${serviceId}`);
          App.methods.showAppointmentForm(serviceId,usuarioproveedor,precioHora,truncatedDescription);
        },
        submitAppointment(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const appointmentData = Object.fromEntries(formData.entries());
            console.log('Datos de la cita:', appointmentData);
          
            const cantidad = App.methods.calcularHoras(appointmentData.appointmentTimeIni, appointmentData.appointmentTimeFin);
            const precio = parseFloat(appointmentData.precioHora); // Asegúrate de que esto sea un número
            const monto = App.methods.calcularMonto(cantidad, precio);
            //               cantidad: App.methods.calcularHoras(appointmentData.appointmentTimeIni, appointmentData.appointmentTimeFin),
            // Preparar los datos para enviar al servidor
            const usuariofiltro = localStorage.getItem('userName');
            const ordenServicio = {
              usuario: usuariofiltro, // Asumiendo que el nombre del cliente es el usuario
              idDelServicio: appointmentData.serviceId,
              usuarioDelProveedor: "proveedor_id", // Esto debería venir de algún lugar, quizás del servicio seleccionado
              estado: 'pendiente',
              citasDelServicio: [{
                fechaInicial: appointmentData.appointmentDateInicio,
                fechaFinal: appointmentData.appointmentDateFinal,
                horaInicio: appointmentData.appointmentTimeIni,
                horaFin: appointmentData.appointmentTimeFin,
                nombreCliente: appointmentData.nombreCliente,
                emailCliente: appointmentData.emailCliente
              }],
              cantidad: cantidad,
              precio: precio, // Esto debería venir del servicio seleccionado
              monto: monto, // Esto se calculará en el backend
              descripcion: appointmentData.descripcion
            };
          
            // Enviar los datos al servidor
            fetch(`${config.API_BASE_URL}/api/ordenes/addorden`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(ordenServicio),
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              console.log('Orden de servicio creada:', data);
              alert('Cita agendada con éxito');
              App.methods.hideAppointmentForm();
              App.methods.fetchOrders();
            })
            .catch((error) => {
              console.error('Error:', error);
              alert('Hubo un error al agendar la cita. Por favor, intente de nuevo.');
            });          

          //alert('Cita agendada con éxito');
          //App.methods.hideAppointmentForm();
        },
        payOrder(orderNo,descripcion,monto) {
          // Aquí iría la lógica para iniciar el pago con PayPal
          console.log(`Iniciando pago para la orden: ${orderNo} ${descripcion} ${monto} `);
          // const payLoad =  JSON.stringify({
          //   intent: "CAPTURE",
          //   purchase_units: [
          //     {
          //       amount: {
          //         currency_code: "USD",
          //         value: "105.00",
          //       },
          //       description: "A book5 on the subject of technology.",
          //     },
          //   ],
          // });
        

          
          const payload = {
            "intent": "CAPTURE",
            "purchase_units": [ {
                "reference_id": orderNo,
                "amount": { "currency_code": "USD", "value": monto.toString() },
                "description": descripcion
              } ]
          };
          
          // const wbody = {
          //   "intent": "CAPTURE",
          //   "purchase_units": [ { 
          //     "reference_id": "d9f80740-38f0-11e8-b467-0ed5f89f718b",
          //      "amount": { "currency_code": "USD", "value": "1111.00" } 
          //   } ]
          // };

          //const jsonPayload = JSON.stringify(payload);
          // esta abre la pantalla de login
          
          App.methods.showPayPalModal(payload);
          // antes de modal paypal este era la linea
          //App.methods.paypalBoton(payload);

          // da error
          // App.methods.payOrden2p(orderId);

          //App.methods.payOrdenPaypal(orderId);
          // Implementa la integración con PayPal aquí
        },
      },
      methods: {
        // Método auxiliar para calcular la cantidad de horas
        calcularHoras(horaInicio, horaFin) {
            const inicio = new Date(`1970-01-01T${horaInicio}`);
            const fin = new Date(`1970-01-01T${horaFin}`);
            return (fin - inicio) / 1000 / 60 / 60; // Convertir milisegundos a horas
        },
        calcularMonto(cantidad, precioHora) {
          return cantidad * precioHora;
        },
        async fetchServices() {
          try {
            const response = await fetch(`${config.API_BASE_URL}/api/servicios/serviciosgetall`);
            const services = await response.json();
            App.render(services);
          } catch (error) {
            console.error('Error al obtener los servicios:', error);
          }
        },
        showAppointmentForm(serviceId,usuarioproveedor,precioHora,truncatedDescription) {
          const formHtml = App.templates.appointmentFormTemplate(serviceId,usuarioproveedor,precioHora,truncatedDescription);
          App.htmlElements.modalContent.innerHTML = formHtml;
          App.htmlElements.modal.style.display = 'flex';
        },
        hideAppointmentForm() {
          App.htmlElements.modal.style.display = 'none';
        },
        truncateText(text, maxLength) {
          if (text.length <= maxLength) return text;
          return text.substr(0, maxLength) + '...';
        },
        //
        async fetchServices() {
          try {
            const response = await fetch(`${config.API_BASE_URL}/api/servicios/serviciosgetall`);
            App.state.services = await response.json();
            App.methods.updatePagination();
            App.render();
          } catch (error) {
            console.error('Error al obtener los servicios:', error);
          }
        },
        updatePagination() {
          const totalPages = Math.ceil(App.state.services.length / App.state.servicesPerPage);
          App.htmlElements.totalPages.textContent = totalPages;
          App.htmlElements.currentPage.textContent = App.state.currentPage;
          App.htmlElements.prevPage.disabled = App.state.currentPage === 1;
          App.htmlElements.nextPage.disabled = App.state.currentPage === totalPages;
        },
        changePage(direction) {
          const newPage = App.state.currentPage + direction;
          if (newPage >= 1 && newPage <= Math.ceil(App.state.services.length / App.state.servicesPerPage)) {
            App.state.currentPage = newPage;
            App.methods.updatePagination();
            App.render();
          }
        },       
        async fetchOrders() {
          try {
            //const response = await fetch(`${config.API_BASE_URL}/api/ordenes/getordenes`);
            //const data = await response.json();

            const estadofiltro = "pendiente" ;
            // get username from local storage
            const usuariofiltro = localStorage.getItem('userName');
            //const usuariofiltro = "prov1";
            const url = new URL(`${config.API_BASE_URL}/api/ordenes/getordenes`);
            if (estadofiltro) url.searchParams.append('estado', estadofiltro);
            if (usuariofiltro) url.searchParams.append('usuario', usuariofiltro);
        
            const response = await fetch(url);
            const data = await response.json();
          
            // Verifica si la respuesta tiene una propiedad 'ordenes'
            if (Array.isArray(data.ordenes)) {
              App.state.orders = data.ordenes;
            } else if (Array.isArray(data)) {
              App.state.orders = data;
            } else {
              console.error('La respuesta no contiene un array de órdenes');
              App.state.orders = [];
            }
            
            App.methods.renderOrders();
          } catch (error) {
            console.error('Error al obtener las órdenes:', error);
            App.state.orders = [];
          }
        },

        // async fetchOrders() {
        //   try {
        //     const response = await fetch(`${config.API_BASE_URL}/api/ordenes/getordenes`);
        //     App.state.orders = await response.json();
        //     App.methods.renderOrders();
        //   } catch (error) {
        //     console.error('Error al obtener las órdenes:', error);
        //   }
        // },
        closePage() {
          // Implementa la lógica para volver al formulario anterior
          window.history.back();
        },
        renderOrders() {
          const orderListHTML = App.state.orders.map(order => `
            <div class="order-item">
              <p>Orden No: ${order.numeroOrden}</p>
              <p>Descripcion: ${order.descripcion}</p>
              <p>Estado: ${order.estado}</p>
              <p>Monto: $${order.monto}</p>
              <button onclick="App.handlers.payOrder('${order.numeroOrden}','${order.descripcion}','${order.monto}')">Pagar</button>
            </div>
          `).join('');
          App.htmlElements.orderList.innerHTML = orderListHTML;
        },
        // <button onclick="App.handlers.payOrder('${order._id}')">Pagar</button>
        async payOrdenPaypal(ordernumero) {
          paypal.Buttons({
            async createOrder() {
              return await fetch("http://localhost:3000/api/payment/payOrden", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  cart: [
                    {
                      sku: "YOUR_PRODUCT_STOCK_KEEPING_UNIT",
                      quantity: "YOUR_PRODUCT_QUANTITY",
                    },
                  ]
                })
              })
              .then((response) => response.json())
              .then((order) => order.id);
            },
            async onSuccess(data) {
              await fetch("http://localhost:3000/payment/execute", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  data,
                })
              }).then((response) => {
                response.json();
                window.location.href = "http://localhost:3000/success";
              });
            },
            async onError(err) {
              console.log(err);
              //window.location.href = "http://localhost:3000/error";
            },
            async onCancel(data) {
              console.log(data);
            },
          }).render('#paypal-button-container');
        },
        // En tu archivo JavaScript
        async payOrden2p(orderId) {
          try {
            const buttons = paypal.Buttons({
              createOrder: async (data, actions) => {
                // Llama a tu backend para crear una orden de PayPal
                // antes http://localhost:3000/api/payment/payOrden
                const response = await fetch('http://localhost:3000/api/payment/create', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    cart: [
                      {
                        sku: "YOUR_PRODUCT_STOCK_KEEPING_UNIT",
                        quantity: "YOUR_PRODUCT_QUANTITY",
                      },
                    ]
                  })
                });
                const orderData = await response.json();
                return orderData.id;
              },
              onApprove: async (data, actions) => {
                // Captura los fondos de la transacción
                const details = await actions.order.capture();
                alert('Transacción completada por ' + details.payer.name.given_name);
                // Llama a tu backend para actualizar el estado de la orden
                await this.updateOrderStatus(orderId, 'completed');
              },
              onError: async (err) => {
                console.error('Error en la transacción de PayPal:', err);
                // Puedes manejar el error aquí, por ejemplo, mostrando un mensaje al usuario
                alert('Hubo un error en la transacción. Por favor, intente de nuevo.');
              }
            });
        
            await buttons.render('#paypal-button-container');
          } catch (error) {
            console.error('Error al iniciar el proceso de pago:', error);
            alert('No se pudo iniciar el proceso de pago. Por favor, intente de nuevo más tarde.');
          }
        },
        //
        // body: JSON.stringify({
        //   cart: [
        //         {
        //         sku: "YOUR_PRODUCT_STOCK_KEEPING_UNIT",
        //         quantity: "10",
        //         },
        //         ]
        // })
        //

        //
                  // const wbody = {
          //   "intent": "CAPTURE",
          //   "purchase_units": [ { 
          //     "reference_id": "d9f80740-38f0-11e8-b467-0ed5f89f718b", "amount": { "currency_code": "USD", "value": "1111.00" } 
          //   } ]
          // };


        paypalBoton(datos_body){
          paypal.Buttons({
            createOrder() {
              return fetch("http://localhost:3000/api/payment/create", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(datos_body),
              })
              .then((response) => response.json())
              .then((order) => order.id);
            },
            onApprove(data, actions) {
              return actions.order.capture().then((details) => {
                console.log("Pago completado exitosamente:", details);
        
                // Actualizar el estado de la orden a 'pagado'
                return fetch(`${config.API_BASE_URL}/api/ordenes/updateStatus`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    orderId: datos_body.purchase_units[0].reference_id,
                    newStatus: 'pagado'
                  })
                }).then(response => response.json());
              }).then(() => {
                // Mostrar ventana modal de confirmación
                App.methods.showConfirmationModal();
                App.methods.fetchOrders();
              });
            },
            onSuccess(data) {
              console.log(" succss paypalbutton :",data);

              // fetch("http://localhost:3000/api/payment/execute", {
              //   method: "POST",
              //   headers: {
              //     "Content-Type": "application/json",
              //   },
              //   body: datos_body
              // }).then((response) => {
              //   response.json();
              //   //window.location.href = "http://localhost:3000/success";
              // });
            },
            onError(err) {
              console.log("erro paypalbutton :",err);
              //window.location.href = "http://localhost:3000/error";
            },
            onCancel(data) {
              console.log(data);
            },
          }).render('#paypal-button-container');
   
        },
        showConfirmationModal() {
          const modalHtml = `
            <div class="confirmation-modal">
              <h2>Pago Confirmado</h2>
              <p>Su pago ha sido procesado exitosamente.</p>
              <button onclick="App.methods.hideConfirmationModal()">Cerrar</button>
            </div>
          `;
          App.htmlElements.modalContent.innerHTML = modalHtml;
          App.htmlElements.modal.style.display = 'flex';
        },
        
        hideConfirmationModal() {
          App.htmlElements.modal.style.display = 'none';
          // Actualizar la lista de órdenes después de un pago exitoso
          App.methods.fetchOrders();
        },
        
        showErrorModal(message) {
          const modalHtml = `
            <div class="error-modal">
              <h2>Error</h2>
              <p>${message}</p>
              <button onclick="App.methods.hideConfirmationModal()">Cerrar</button>
            </div>
          `;
          App.htmlElements.modalContent.innerHTML = modalHtml;
          App.htmlElements.modal.style.display = 'flex';
        },

        // paypal modal

        renderPayPalButton(datos_body) {
          const buttonConfig = this.createPayPalButtonConfig(datos_body);
          paypal.Buttons(buttonConfig).render('#paypal-button-container');
        },
        createPayPalButtonConfig(datos_body) {
          return {
            createOrder() {
              return fetch("http://localhost:3000/api/payment/create", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(datos_body),
              })
              .then((response) => response.json())
              .then((order) => order.id);
            },
            onApprove(data, actions) {
              return actions.order.capture().then((details) => {
                console.log("Pago completado exitosamente:", details);
                
                return fetch(`${config.API_BASE_URL}/api/ordenes/updateStatus`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    orderId: datos_body.purchase_units[0].reference_id,
                    newStatus: 'pagado'
                  })
                }).then(response => response.json());
              }).then(() => {
                App.methods.showConfirmationModal();
                App.methods.fetchOrders();
                App.methods.hidePayPalModal();
              });
            },
            onError(err) {
              console.log("Error en paypalbutton:", err);
              App.methods.showErrorModal("Hubo un error en el proceso de pago. Por favor, intente de nuevo.");
            },
            onCancel(data) {
              console.log("Pago cancelado:", data);
              App.methods.hidePayPalModal();
            },
          };
        },

        showPayPalModal(datos_body) {
          const modalHtml = `
            <div class="paypal-modal-content">
              <h2>Realizar Pago</h2>
              <div id="paypal-button-container"></div>
              <button onclick="App.methods.hidePayPalModal()">Cancelar</button>
            </div>
          `;
          App.htmlElements.modalContentpp.innerHTML = modalHtml;
          App.htmlElements.modalpp.style.display = 'flex';

          // Renderizar el botón de PayPal dentro del modal
          this.renderPayPalButton(datos_body);
        },

        hidePayPalModal() {
          App.htmlElements.modalpp.style.display = 'none';
        },

        
        async updateOrderStatus(orderId, newStatus) {}
        //  fin methods
      },
      templates: {
        serviceTemplate(service) {
            //               <p>Tipo de Servicio: ${service.tipoServicio}</p>
            // Obtener la primera imagen del array de imágenes
            //const imagen = service.imagenes && service.imagenes.length > 0 ? service.imagenes[0] : null;

            // Convertir el blob en una URL de datos
            //const imagenUrl = imagen ? `data:image/jpeg;base64,${btoa(String.fromCharCode.apply(null, new Uint8Array(imagen.data)))}` : '';

            //const imagenUrl = service.imagenes && service.imagenes.length > 0 ? service.imagenes[0] : '';

            const imagenUrl = service.imagenes && service.imagenes.length > 0 ? service.imagenes[0] : '';
            const truncatedDescription = App.methods.truncateText(service.descripcion, 100);
            const truncatedAmenities = App.methods.truncateText(service.amenidades, 50);
//                       <p class="service-content p">Descripción: ${service.descripcion}</p>
//                        <p class="service-content p">Amenidades: ${service.amenidades}</p>

            return `
                <div class="service-card">
                   <div class="service-content">
                                
                            <div class="service-content">
                                  <span class="field-value-h">${truncatedDescription}</span>
                            </div>
                            <div class="field">
                                  <span class="field-value">${truncatedAmenities}</span>
                            </div>
                            <div class="field">
                                  <span class="field-label">Días:</span>
                                  <span class="field-value">${service.diasSemana.join(', ')}</span>
                            </div>
                            <div class="field">
                                  <span class="field-label">Horario:</span>
                                  <span class="field-value">${service.horarioDesde} - ${service.horarioHasta}</span>
                            </div>
                            
                            ${service.calificacion ? `<p>Calificación: ${'★'.repeat(service.calificacion.puntaje)}${'☆'.repeat(5-service.calificacion.puntaje)}</p>` : ''}

                            <p class="service-price">Precio/Hora: $${service.precioHora}</p>
                            

                            <button class="appointment-button" onclick="App.handlers.bookAppointment('${service._id}','${service.usuarioproveedor}','${service.precioHora}','${truncatedDescription}')">Agendar</button>
                  </div>
                  <div class="service-image">
                                  ${service.photoUrl ? `<img src="${service.photoUrl}" alt="${service.nombre}">` : ''}
                  </div>
              </div>
            `;
        },

        //                                ${imagenUrl ? `<img src="${imagenUrl}" alt="${service.nombre}">` : ''}
        appointmentFormTemplate(serviceId,usuarioproveedor,precioHora,truncatedDescription) {
          return `
        <form onsubmit="App.handlers.submitAppointment(event)">
              <input type="hidden" name="serviceId" value="${serviceId}">
              <input type="hidden" name="usuarioproveedor" value="${usuarioproveedor}">
              <input type="hidden" name="precioHora" value="${precioHora}">
              <input type="hidden" name="descripcion" value="${truncatedDescription}">

              <div class="form-group">
                <label for="appointmentDateInicio">Fecha Inicio:</label>
                <input type="date" id="appointmentDateInicio" name="appointmentDateInicio" required>
              </div>


              <div class="form-group">
                <label for="appointmentDateFinal">Fecha Final:</label>
                <input type="date" id="appointmentDateFinal" name="appointmentDateFinal" required>
              </div>

              <div class="form-group">
                <label for="appointmentTimeIni">Hora inicio:</label>
                <input type="time" id="appointmentTimeIni" name="appointmentTimeIni" required>
              </div>

              <div class="form-group">
                <label for="appointmentTimeFin">Hora final:</label>
                <input type="time" id="appointmentTimeFin" name="appointmentTimeFin" required>
              </div>

              <div class="form-group">
                <label for="nombreCliente">Nombre:</label>
                <input type="text" id="nombreCliente" name="nombreCliente" required>
              </div>

              <div class="form-group">
                <label for="emailCliente">Email:</label>
                <input type="email" id="emailCliente" name="emailCliente" required>
              </div>

              <button type="submit" class="submit-btn">Confirmar Cita</button>
            </form>
          `;
        },
      },
      render(services) {
        //const serviceListHTML = services.map(App.templates.serviceTemplate).join('');
        //App.htmlElements.serviceList.innerHTML = serviceListHTML;
        //
        console.log(services);
        const startIndex = (App.state.currentPage - 1) * App.state.servicesPerPage;
        const endIndex = startIndex + App.state.servicesPerPage;
        const pageServices = App.state.services.slice(startIndex, endIndex);
        const serviceListHTML = pageServices.map(App.templates.serviceTemplate).join('');
        App.htmlElements.serviceList.innerHTML = serviceListHTML;
      },
    };
    App.init();

    // Make App globally accessible
    window.App = App;
  })();
