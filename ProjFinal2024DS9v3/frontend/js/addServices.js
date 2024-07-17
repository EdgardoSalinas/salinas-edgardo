import config from '..//config.js';

(() => {

    const App = {
        htmlElements: {
            // IMAGEN BY URL
            photoInput: document.getElementById("photoInput"),
            photoPreview: document.getElementById("photoPreview"),
            chooseImageBtn: document.getElementById("chooseImage"),
            removeImageBtn: document.getElementById("removeImage"),       
            // IMAGEN BY URL        

            form: document.getElementById('formularioServicio'),            
            tipoServicioSelect: document.getElementById('tipoServicio'),
            nombreInput: document.getElementById('nombre'),
            descripcionTextarea: document.getElementById('descripcion'),
            amenidadesInput: document.getElementById('amenidades'),
            todosLosDiasCheckbox: document.getElementById('todosLosDias'),
            diasCheckboxes: document.querySelectorAll('input[name="dias-semana"]:not(#todosLosDias)'),
            horarioDesdeInput: document.getElementById('horarioDesde'),
            horarioHastaInput: document.getElementById('horarioHasta'),
            precioHoraInput: document.getElementById('precioHora'),

            imagenesInput: document.getElementById('imagenes'),

            notification: document.getElementById('notification'),
            cancelButton: document.getElementById("cancelButton"),
            errorMessages: {
                tipoServicioError: document.getElementById('tipoServicioError'),
                nombreError: document.getElementById('nombreError'),
                descripcionError: document.getElementById('descripcionError'),
                amenidadesError: document.getElementById('amenidadesError'),
                diasError: document.getElementById('diasError'),
                horarioError: document.getElementById('horarioError'),
                precioHoraError: document.getElementById('precioHoraError'),
                imagenesError: document.getElementById('imagenesError')
            }

        },

        init() {
            this.bindEvents();
        },

        bindEvents() {
            //
            App.htmlElements.chooseImageBtn.addEventListener("click", App.handlers.onChooseImage);
            App.htmlElements.removeImageBtn.addEventListener("click", App.handlers.onRemoveImage);
            App.htmlElements.photoInput.addEventListener("change", App.handlers.onPhotoSelected);
        
            //
            const formulario = document.getElementById('formularioServicio');
            formulario.addEventListener('submit', this.handlers.onSubmitFormulario);
            App.htmlElements.todosLosDiasCheckbox.addEventListener('change', this.handlers.onToggleTodosLosDias);
            App.htmlElements.cancelButton.addEventListener("click", App.handlers.onCancel);
        },

        handlers: {
            async onSubmitFormulario(event) {
                event.preventDefault();
                App.methods.clearValidationErrors();
                if (!App.methods.validarFormulario()) {
                    //App.methods.showValidationErrors();
                    App.methods.showNotification('Todos los campos son obligatorios', 'error');
                    return;
                }
                const data = App.methods.obtenerDatosFormulario();
                await App.methods.guardarServicio(data);
            },

            onToggleTodosLosDias() {
                const isChecked = App.htmlElements.todosLosDiasCheckbox.checked;
                App.htmlElements.diasCheckboxes.forEach(checkbox => {
                    checkbox.checked = isChecked;
                });
            },
            onCancel() { App.methods.onCancelbtn()},
            // image url
            onChooseImage() {
                App.htmlElements.photoInput.click();
            },
            onRemoveImage() {
                App.htmlElements.photoPreview.src = "placeholder-image.png";
                App.htmlElements.photoInput.value = "";
              },
            onPhotoSelected(event) {
                const file = event.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    App.htmlElements.photoPreview.src = e.target.result;
                  };
                  reader.readAsDataURL(file);
                }
            },
              

        },

        methods: {
            onCancelbtn() {
                window.history.back();
              },
            validarFormulario() {
                let esValido = true;
                if (!App.htmlElements.tipoServicioSelect.value) {
                    esValido = false;
                    App.htmlElements.tipoServicioSelect.classList.add('error-border');
                    App.htmlElements.errorMessages.tipoServicioError.style.display = 'block';
                }
                if (!App.htmlElements.nombreInput.value.trim()) {
                    esValido = false;
                    App.htmlElements.nombreInput.classList.add('error-border');
                    App.htmlElements.errorMessages.nombreError.style.display = 'block';
                }
                if (!App.htmlElements.descripcionTextarea.value.trim()) {
                    esValido = false;
                    App.htmlElements.descripcionTextarea.classList.add('error-border');
                    App.htmlElements.errorMessages.descripcionError.style.display = 'block';
                }
                if (!App.htmlElements.amenidadesInput.value.trim()) {
                    esValido = false;
                    App.htmlElements.amenidadesInput.classList.add('error-border');
                    App.htmlElements.errorMessages.amenidadesError.style.display = 'block';
                }
                if (!(Array.from(App.htmlElements.diasCheckboxes).some(checkbox => checkbox.checked) || App.htmlElements.todosLosDiasCheckbox.checked)) {
                    esValido = false;
                    App.htmlElements.diasCheckboxes[0].parentElement.classList.add('error-border');
                    App.htmlElements.errorMessages.diasError.style.display = 'block';
                }
                if (!App.htmlElements.horarioDesdeInput.value || !App.htmlElements.horarioHastaInput.value) {
                    esValido = false;
                    App.htmlElements.horarioDesdeInput.classList.add('error-border');
                    App.htmlElements.horarioHastaInput.classList.add('error-border');
                    App.htmlElements.errorMessages.horarioError.style.display = 'block';
                }
                if (!App.htmlElements.precioHoraInput.value.trim()) {
                    esValido = false;
                    App.htmlElements.precioHoraInput.classList.add('error-border');
                    App.htmlElements.errorMessages.precioHoraError.style.display = 'block';
                }
                // if (!App.htmlElements.imagenesInput.files.length) {
                //     esValido = false;
                //     App.htmlElements.imagenesInput.classList.add('error-border');
                //     App.htmlElements.errorMessages.imagenesError.style.display = 'block';
                // }
                return esValido;
            },

            clearValidationErrors() {
                for (const element of Object.values(App.htmlElements.errorMessages)) {
                    // disable por error
                    // if (element.style.display) {
                    //     element.style.display = 'none'
                    // };
                }
                App.htmlElements.tipoServicioSelect.classList.remove('error-border');
                App.htmlElements.nombreInput.classList.remove('error-border');
                App.htmlElements.descripcionTextarea.classList.remove('error-border');
                App.htmlElements.amenidadesInput.classList.remove('error-border');
                App.htmlElements.diasCheckboxes.forEach(checkbox => checkbox.parentElement.classList.remove('error-border'));
                App.htmlElements.horarioDesdeInput.classList.remove('error-border');
                App.htmlElements.horarioHastaInput.classList.remove('error-border');
                App.htmlElements.precioHoraInput.classList.remove('error-border');
                // App.htmlElements.imagenesInput.classList.remove('error-border');
            },

            showNotification(message, type) {
                App.htmlElements.notification.innerText = message;
                App.htmlElements.notification.className = `notification ${type}`;
                App.htmlElements.notification.style.display = 'block';
                setTimeout(() => {
                    App.htmlElements.notification.style.display = 'none';
                }, 3000);
            },

            obtenerDatosFormulario() {
                const usuarioproveedor =  localStorage.getItem('userName');
                const tipoServicio = App.htmlElements.tipoServicioSelect.value;
                const nombre = App.htmlElements.nombreInput.value.trim();
                const descripcion = App.htmlElements.descripcionTextarea.value.trim();
                const amenidades = App.htmlElements.amenidadesInput.value.trim();
                const diasSemana = Array.from(App.htmlElements.diasCheckboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
                const horarioDesde = App.htmlElements.horarioDesdeInput.value;
                const horarioHasta = App.htmlElements.horarioHastaInput.value;
                const precioHora = App.htmlElements.precioHoraInput.value.trim();
                const imagenes = [];
                const photoUrl = {};
                //const imagenes = Array.from(App.htmlElements.imagenesInput.files).map(file => URL.createObjectURL(file));
                if (App.htmlElements.photoInput.files[0]) {
                     const photoUrl = App.htmlElements.photoInput.files[0];
                } 
                const formData = new FormData();
                Array.from(App.htmlElements.form).forEach(element => {
                    if (element.name && !element.disabled) {
                        formData.append(element.name, element.value);
                        console.log(`Elemento agregado: ${element.name} = ${element.value}`);
                    }
                    });
                return (formData);
                //return { usuarioproveedor, tipoServicio, nombre, descripcion, amenidades, diasSemana, horarioDesde, horarioHasta, precioHora, imagenes, photoUrl };
            },

          
            async guardarServicio(formData) {
                //                         body: JSON.stringify(data)
                try {
                    //`${config.API_BASE_URL}
                    //                     const response = await fetch('/api/servicios', {
                    console.log("data guardarservicio", JSON.stringify(formData));

                    const updatedFormData = new FormData();
                    for (let [key, value] of formData.entries()) {
                      updatedFormData.append(key, value);
                    }
                    if (App.htmlElements.photoInput.files[0]) {
                        updatedFormData.append('photo', App.htmlElements.photoInput.files[0]);
                    }

                    const response = await fetch(`${config.API_BASE_URL}/api/servicios/servicios`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: updatedFormData,
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Error al guardar el servicio');
                    }

                    App.methods.showNotification('Servicio guardado con éxito', 'success');
                } catch (error) {
                    App.methods.showNotification(error.message, 'error');
                }
            }
        }
    };

    App.init();
})();
