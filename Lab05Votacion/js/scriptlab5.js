        (() => {

            // Array de colores hexadecimales
            const colores = [
                { hex: "#FF0000", nombre: "Rojo" },
                { hex: "#00FF00", nombre: "Verde" },
                { hex: "#0000FF", nombre: "Azul" },
                { hex: "#FFFF00", nombre: "Amarillo" },
                { hex: "#FFA500", nombre: "Naranja" },
                { hex: "#800080", nombre: "Violeta" },
                { hex: "#000000", nombre: "Negro" },
                { hex: "#FFFFFF", nombre: "Blanco" },
                { hex: "#FF69B4", nombre: "Rosa" },
                { hex: "#FFC0CB", nombre: "Rosa claro" },
                { hex: "#800000", nombre: "Borgoña" },
                { hex: "#008000", nombre: "Verde oscuro" },
                { hex: "#000080", nombre: "Azul marino" }
            ];
            
            const selectColor = document.getElementById('color');
            
            // Crear las opciones de la lista de selección
            colores.forEach(color => {
                const option = document.createElement('option');
                option.value = color.hex;
                option.textContent = `${color.nombre} (${color.hex})`;
                option.style.color = color.hex; // Establecer el color del texto de la opción
                selectColor.appendChild(option);
            });
                                //  

            const app5 = {
                htmlElements : {
                
                    forma5 : document.getElementById('formaLab5'),
                    nombre : document.getElementById('nombre'),
                    color : document.getElementById('color'),
                    btninsertar : document.getElementById("btninsertar"),
                    tablacandidatos : document.getElementById('tablacandidatos'),
                    divresultados : document.getElementById('divresultados'),

                },
                init(){
                    app5.bindEvents();
                },
                bindEvents() {
                    //app5.htmlElements.btninsertar.addEventListener("click", app5.handlers.onButtonClick);
                    //app5.bindEvents();
                    app5.htmlElements.btninsertar.addEventListener('click',app5.handlers.onButtonClick);
                    // app5.htmlElements.btninsertar.addEventListener(
                    //     'click', 
                    //     app5.handlers.hndlrbtn
                    // );


                },
                handlers: {
                    onButtonClick(event) {
                        event.preventDefault();
                        app5.methods.insertarcandidatos(nombre.value,color.value);
                        console.log("¡El botón fue clickeado!");
                    },
                    onClickVotar(event) {
                        event.preventDefault();
                        const fila = event.target.closest('tr')
                        const celdaVotos = fila.querySelector('#idtab_CeldaVotos');
                        const votosActuales = parseInt(celdaVotos.textContent);
                        const votosNuevos = votosActuales + 1;
                        celdaVotos.textContent = votosNuevos;
                        
                        app5.methods.obtenergrafica();

                    },
                    onClickBorrar(event) {
                        event.preventDefault();
                        const fila = event.target.closest('tr')
                        fila.remove();
                        app5.methods.obtenergrafica();
                        //console.log("¡El botón Votar fue clickeado!");
                    },
                },
                methods: {

              
                    insertarcandidatos(nombre,color) {
                        // Crear una nueva fila en la tabla
                        const nuevaFila = document.createElement("tr");

                        // Crear las celdas de la fila
                        const celdaimagen = document.createElement("td");
                        const imagentmp = document.createElement("img")
                        const celdaNombre = document.createElement("td");
                        const celdaColor = document.createElement("td");
                        const celdaVotos = document.createElement("td");
                        const celdaBtnVotar = document.createElement("td");
                        const celdaBtnBorrar = document.createElement("td");
                        const btnvotar = document.createElement('button');
                        const btnborrar = document.createElement('button');

                        // Asignar los valores a las celdas
                        celdaNombre.textContent = nombre;
                        celdaVotos.textContent = "0";
                        celdaVotos.id = "idtab_CeldaVotos"
                        celdaColor.className = "colortd"
                        celdaColor.textContent = color;
                        celdaColor.style.backgroundColor = color;

                        // Asignar los valores a los botones
                        btnvotar.id = "btn-votar";
                        btnvotar.textContent = "Votar";
                        btnvotar.classList.add("btn-votar");
                        btnvotar.addEventListener("click", app5.handlers.onClickVotar);
                        celdaBtnVotar.appendChild(btnvotar);

                        btnborrar.id = "btn-borrar";
                        btnborrar.textContent = "Borrar";
                        btnborrar.classList.add("btn-borrar");
                        btnborrar.addEventListener("click", app5.handlers.onClickBorrar);
                        celdaBtnBorrar.appendChild(btnborrar);
                        

                        // genera la grafica
                        // const values = [30, 20, 15, 35];
                        // const chartElement = app5.methods.generarPieChart(values);
                        // app5.htmlElements.divresultados.appendChild(chartElement);

                        //const values = Array.from(app5.htmlElements.tablacandidatos.querySelectorAll('tr'))                         
                        //*const values = [30, 20, 15, 35];
                        //*const chartElement = generarPieChart(values);
                        // Insertar el gráfico en la sección
                        //*app5.htmlElements.resultados.appendChild(chartElement);
                        // fin genera grafica

                        // Agregar las celdas a la fila
                        nuevaFila.appendChild(celdaBtnVotar);
                        nuevaFila.appendChild(celdaBtnBorrar);
    
                        nuevaFila.appendChild(celdaNombre);
                        nuevaFila.appendChild(celdaColor);
                        nuevaFila.appendChild(celdaVotos);

                        obtenerImagenAleatoria()
                            .then(img => {
                                imagentmp.src = img.src;
                                //imagentmp.urlImagen = img.src;
                                //imagentmp.urlImagen = "star.png"
                                celdaimagen.appendChild(imagentmp)
                                console.log(imagentmp.src);
                                nuevaFila.appendChild(celdaimagen);
                            })
                            .catch(error => console.error(error));


                        app5.htmlElements.tablacandidatos.appendChild(nuevaFila);


                        async function obtenerImagenAleatoria() {
                            try {
                                const response = await fetch('https://dog.ceo/api/breeds/image/random');
                                const data = await response.json();
                                const urlImagen = data.message;
                                const img = document.createElement('img');
                                img.src = urlImagen;
                                return img;
                            } catch (error) {
                                return console.error(error);
                            }
                        }

   
                        // Función auxiliar para generar un color aleatorio
                        function getRandomColor() {
                            const letters = '0123456789ABCDEF';
                            let color = '#';
                            for (let i = 0; i < 6; i++) {
                            color += letters[Math.floor(Math.random() * 16)];
                            }
                            return color;
                        }
                        //
                        
                    },//insertarcandidatos 
                    
                    obtenergrafica(){
                        // const values = [30, 20, 15, 35];
                        // const chartElement = app5.methods.generarPieChart(values);
                        // app5.htmlElements.divresultados.appendChild(chartElement);
                        const data = [];
                        const tabla = app5.htmlElements.tablacandidatos;
                        const filas = tabla.rows;
                        for (let i = 1; i < filas.length; i++) {
                            const fila = filas[i];
                            const color = fila.cells[3].textContent;
                            const valor = parseInt(fila.cells[4].textContent);
                          
                            // Crear un objeto y agregarlo al array
                            data.push({ color: color, value: valor });
                          }
                          
                        const chartElement = app5.methods.generarPieChart(data);

                        const seccionResultados = app5.htmlElements.divresultados;
                        let canvasExistente = seccionResultados.querySelector('canvas');

                        if (canvasExistente) {
                            seccionResultados.removeChild(canvasExistente);
                        }
                        app5.htmlElements.divresultados.appendChild(chartElement);

                    
                    },


                    generarPieChart(data) {
                        // Crear un elemento canvas
                        const canvas = document.createElement('canvas');
                        canvas.width = 500;
                        canvas.height = 500;

                        const ctx = canvas.getContext('2d');
                        const radius = Math.min(canvas.width, canvas.height) / 2 - 20;
                        const centerX = canvas.width / 2;
                        const centerY = canvas.height / 2;

                        // Calcular el ángulo inicial y final para cada valor
                        let startAngle = 0;
                        const totalSum = app5.methods.sumg(data.map(item => item.value));
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


// fin metodos

                }
            };
            app5.init();
        }) ();
