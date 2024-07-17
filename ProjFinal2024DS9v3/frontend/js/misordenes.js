import config from '../config.js';

(() => {
    const App = {
        state: {
            currentPage: 1,
            servicesPerPage: 3,
            services: [],
            orders: [],
          },

        htmlElements: {
            orderList: document.getElementById('orderList'),
            cancelButton: document.getElementById('cancelButton'),
        },
        init() {
            App.bindEvents();
            App.methods.fetchOrders();
        },
        bindEvents() {
            // No hay
            App.htmlElements.orderList.addEventListener('click', App.handlers.orderListClick);
            App.htmlElements.cancelButton.addEventListener('click', App.handlers.cerrarBoton);
        },
        handlers: {
            changeStatus(orderId, newStatus) {
                console.log("handler changestatus");
                App.methods.changeStatusm(orderId, newStatus);
            },
            rateOrder(orderId, rating) {
                App.methods.rateOrder(orderId, rating);
            },
            orderListClick(event) {
                const target = event.target;
                if (target.classList.contains('status-button')) {
                    const orderId = target.dataset.orderId;
                    App.methods.changeStatus(orderId, 'completado');
                } else if (target.classList.contains('star')) {
                    const orderId = target.dataset.orderId;
                    const rating = target.dataset.rating;
                    const servicioId = target.dataset.servicioId;
                    App.methods.rateOrder(orderId, rating);
                  
                    App.methods.updateService(servicioId, rating);
                }
            },
            cerrarBoton(){
                App.methods.cerrarBoton();
            },
        },
        methods: {
            async fetchOrders() {

                try {

                    // get username from local storage
                    const usuariofiltro = localStorage.getItem('userName');
                    //const usuariofiltro = "prov1";
                    const url = new URL(`${config.API_BASE_URL}/api/ordenes/getordenes`);
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
                    App.render('orderList', App.templates.orderList(App.state.orders));
                    //App.methods.renderOrders();

                  } catch (error) {
                    console.error('Error al obtener las órdenes:', error);
                    App.state.orders = [];
                  }

                // const url = new URL(`${config.API_BASE_URL}/api/ordenes/miordenes`);
                // if (usuario) url.searchParams.append('usuario', usuario);

                // const response = await fetch(url);
                // const orders = await response.json();

                // App.render('orderList', App.templates.orderList(orders));

                // fetch(`${config.API_BASE_URL}/api/ordenes/miordenes`, {
                //     method: 'GET',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify({usuario})
                // })
                // .then(response => response.json())
                // .then(orders => {
                //     App.render('orderList', App.templates.orderList(orders));
                // });
            },
            changeStatus(orderId, newStatus) {
                fetch(`${config.API_BASE_URL}/api/ordenes/updateStatus`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ orderId, newStatus })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        App.methods.fetchOrders();
                    } else {
                        alert('Error al actualizar el estado de la orden');
                    }
                });
            },
            rateOrder(orderId, rating) {
                fetch(`${config.API_BASE_URL}/api/ordenes/rate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ orderId, rating })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        App.methods.fetchOrders();
                    } else {
                        alert('Error al calificar la orden');
                    }
                });
            },
            

            async updateService(serviceId, rating) {
                const url = `${config.API_BASE_URL}/api/servicios/serviciorate`; // Asegúrate de que esta ruta coincida con tu configuración de servidor
              
                try {
                  const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      // Incluye aquí cualquier header adicional que necesites, como tokens de autenticación
                    },
                    body: JSON.stringify({ serviceId, rating })
                  });
              
                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
              
                  const updatedService = await response.json();
                  console.log('Servicio actualizado:', updatedService);
                  return updatedService;
                } catch (error) {
                  console.error('Error al actualizar el servicio:', error);
                  throw error;
                }
            },
              


            
            rateServicio(servicioId, rating) {
                fetch(`${config.API_BASE_URL}/api/ordenes/rate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ servicioId, rating })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        App.methods.fetchOrders();
                    } else {
                        alert('Error al actualizar el servicio');
                    }
                });
            },

            cerrarBoton() {
                window.location.href = "../index.html";
                //window.history.back();
              },
            
        },
        templates: {

            orderList(orders) {
                return orders.map(order => `
                    <div class="order-item">
                        <h3>Orden #${order.numeroOrden}</h3>
                        <p>Descripción: ${order.descripcion}</p>
                        <p>Estado: ${order.estado}</p>
                        <p>Monto: $${order.monto}</p>
                        ${order.estado !== 'completado' ?
                            `<button class="status-button" data-order-id="${order.numeroOrden}">Marcar como Completado</button>` : ''}
                        ${order.estado === 'completado' && !order.calificacion ?
                            `<div class="stars">
                                <span class="star" data-order-id="${order.numeroOrden}" data-rating="1" data-servicio-id="${order.idDelServicio}">☆</span>
                                <span class="star" data-order-id="${order.numeroOrden}" data-rating="2" data-servicio-id="${order.idDelServicio}">☆</span>
                                <span class="star" data-order-id="${order.numeroOrden}" data-rating="3" data-servicio-id="${order.idDelServicio}">☆</span>
                                <span class="star" data-order-id="${order.numeroOrden}" data-rating="4" data-servicio-id="${order.idDelServicio}">☆</span>
                                <span class="star" data-order-id="${order.numeroOrden}" data-rating="5" data-servicio-id="${order.idDelServicio}">☆</span>
                            </div>` : ''}
                        ${order.calificacion ? `<p>Calificación: ${'★'.repeat(order.calificacion.puntaje)}${'☆'.repeat(5-order.calificacion.puntaje)}</p>` : ''}
                    </div>
                `).join('');
            },

            orderList2(orders) {
                return orders.map(order => `
                    <div class="order-item">
                        <h3>Orden #${order.numeroOrden}</h3>
                        <p>Descripción: ${order.descripcion}</p>
                        <p>Estado: ${order.estado}</p>
                        <p>Monto: $${order.monto}</p>
                        ${order.estado !== 'completado' ?
                            `<button class="status-button" onclick="App.handlers.changeStatus(${order.numeroOrden}, 'completado')">Marcar como Completado</button>` : ''}
                        ${order.estado === 'completado' && !order.calificacion ?
                            `<div class="stars">
                                <span class="star" onclick="App.handlers.rateOrder(${order.numeroOrden}, 1)">☆</span>
                                <span class="star" onclick="App.handlers.rateOrder(${order.numeroOrden}, 2)">☆</span>
                                <span class="star" onclick="App.handlers.rateOrder(${order.numeroOrden}, 3)">☆</span>
                                <span class="star" onclick="App.handlers.rateOrder(${order.numeroOrden}, 4)">☆</span>
                                <span class="star" onclick="App.handlers.rateOrder(${order.numeroOrden}, 5)">☆</span>
                            </div>` : ''}
                        ${order.calificacion ? `<p>Calificación: ${'★'.repeat(order.calificacion.puntaje)}${'☆'.repeat(5-order.calificacion.puntaje)}</p>` : ''}
                    </div>
                `).join('');
            },
        },
        render(elemento, html) {
            document.getElementById(elemento).innerHTML = html;
        },
    };

    App.init();
})();