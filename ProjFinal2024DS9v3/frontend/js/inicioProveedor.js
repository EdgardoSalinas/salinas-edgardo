const App = {
  htmlElements: {
    username: document.getElementById('nav-username'),
    logoutButton: document.getElementById('nav-logout'),
    serviciosTable: document.getElementById('servicios-table'),
    serviciosBody: document.getElementById('servicios-body'),
  },
  init() {
    this.bindEvents();
    this.getUserData();
    this.getServicios();
  },
  bindEvents() {
    this.htmlElements.logoutButton.addEventListener('click', this.handlers.logout);
  },
  handlers: {
    logout(event) {
      event.preventDefault();
      fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error de red al cerrar sesión');
        }
        return response.json();
      })
      .then(data => {
        if (data.message === 'Cierre de sesión exitoso') {
          window.location.href = '/login';
        } else {
          throw new Error('Error del servidor al cerrar sesión: ' + data.error);
        }
      })
      .catch(error => {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión. Por favor, inténtalo de nuevo.');
      });
    },
    editar(event) {
      const id = event.target.getAttribute('data-id');
      window.location.href = `/agregar-servicio?id=${id}`;
    },
    eliminar(event) {
      const id = event.target.getAttribute('data-id');
      if (confirm('¿Está seguro de eliminar este servicio?')) {
        fetch(`/api/servicios/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('No se pudo eliminar el servicio');
          }
          return response.json();
        })
        .then(data => {
          App.getServicios(); // Actualizar la lista después de eliminar
        })
        .catch(error => console.error('Error al eliminar servicio:', error));
      }
    }
  },
  getUserData() {
    fetch('/api/auth/user', {
      method: 'GET',
      credentials: 'include'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo obtener datos del usuario');
      }
      return response.json();
    })
    .then(data => {
      if (data.username) {
        this.htmlElements.username.textContent = data.username; // Asegúrate de obtener correctamente el nombre de usuario
      } else {
        throw new Error('Usuario no encontrado');
      }
    })
    .catch(error => console.error('Error al obtener datos del usuario:', error));
  },
  getServicios() {
    fetch('/api/servicios', {
      method: 'GET',
      credentials: 'include'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo obtener servicios');
      }
      return response.json();
    })
    .then(data => {
      this.renderServicios(data);
    })
    .catch(error => console.error('Error al obtener servicios:', error));
  },
  renderServicios(servicios) {
    this.htmlElements.serviciosBody.innerHTML = '';
    servicios.forEach(servicio => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${servicio.nombre}</td>
        <td>${servicio.descripcion}</td>
        <td>
          <button class="editar" data-id="${servicio._id}">Editar</button>
          <button class="eliminar" data-id="${servicio._id}">Eliminar</button>
        </td>
      `;
      this.htmlElements.serviciosBody.appendChild(row);
    });

    this.htmlElements.serviciosTable.querySelectorAll('.editar').forEach(button => {
      button.addEventListener('click', this.handlers.editar);
    });
    this.htmlElements.serviciosTable.querySelectorAll('.eliminar').forEach(button => {
      button.addEventListener('click', this.handlers.eliminar);
    });
  }
};

App.init();
