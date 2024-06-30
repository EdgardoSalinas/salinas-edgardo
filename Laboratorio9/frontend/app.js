(() => {
    const App = {
      htmlElements: {
        formFibo: document.getElementById("formFibonnaci"),
        btnCalcular: document.getElementById("btnCalcular"),
        numero: document.getElementById("numero"),
        resultado: document.getElementById("resultado"),
      },
      init() {
        App.bindEvents();
      },
      bindEvents() {
        //App.htmlElements.formFibo.addEventListener("submit", App.handlers.calcularFibonacci);
        App.htmlElements.btnLogout.addEventListener(
            "click",
            App.handlers.calcularFibonacci,
          );

      },
      handlers: {
        calcularFibonacci() {
            event.preventDefault();
            const numero = parseInt(htmlElements.numero.value);
            if (numero < 0) {
                alert("El número debe ser mayor a 0");
            } else {
                const fibonacci = App.methods.calcularFibonacci(numero);
                App.render(resultado,fibonacci);
            }
        },
      },
      methods: {
        async calcularFibonacci(numero) {
            const payload = { numero };
            const rawResponse = await fetch('http://localhost:3000/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            const data = await rawResponse.json();
            console.log(data);
            return(data);
        },
      },
      templates: {
      },
      render(elemento,html) {
        document.getElementById(elemento).innerHTML = html;
      },
    }; // fin de const App
    App.init();
  })();
