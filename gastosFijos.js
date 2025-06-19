document.addEventListener('DOMContentLoaded', function() {
    const gastoFijoForm = document.getElementById('gastoFijoForm');
    const listaGastosFijos = document.getElementById('listaGastosFijos');
    const barraProgresoGastosFijos = document.getElementById('barraProgresoGastosFijos');
    const porcentajeGastosFijos = document.getElementById('porcentajeGastosFijos');
    const infoGastosFijos = document.getElementById('infoGastosFijos');
    const fechaReinicio = document.getElementById('fechaReinicio');
    const diasFaltantes = document.getElementById('diasFaltantes');

    // Función para guardar los gastos fijos en el localStorage
    function guardarGastosFijos(gastosFijos) {
        localStorage.setItem('gastosFijos', JSON.stringify(gastosFijos));
    }

    // Función para cargar los gastos fijos desde el localStorage
    function cargarGastosFijos() {
        const gastosFijos = JSON.parse(localStorage.getItem('gastosFijos')) || [];
        return gastosFijos;
    }

    // Función para renderizar los gastos fijos en la interfaz
    function renderGastosFijos() {
        const gastosFijos = cargarGastosFijos();
        listaGastosFijos.innerHTML = '';
        let totalGastosFijos = 0;

        gastosFijos.forEach(gasto => {
            totalGastosFijos += parseFloat(gasto.monto);
            const gastoCard = `
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${gasto.nombre}</h5>
                            <p class="card-text">Monto: $${parseFloat(gasto.monto).toFixed(2)}</p>
                            <p class="card-text">Fecha de Descuento: ${gasto.fechaDescuento}</p>
                            <button class="btn btn-danger btn-sm" onclick="eliminarGastoFijo(${gasto.id})"><i class="fas fa-trash"></i> Eliminar</button>
                        </div>
                    </div>
                </div>
            `;
            listaGastosFijos.innerHTML += gastoCard;
        });

        // Actualizar la barra de progreso y el porcentaje
        const porcentaje = (totalGastosFijos / 1000) * 100; // Suponiendo que el límite es 1000
        barraProgresoGastosFijos.style.width = `${porcentaje}%`;
        porcentajeGastosFijos.textContent = `${porcentaje.toFixed(2)}%`;
    }

    // Función para agregar un nuevo gasto fijo
    gastoFijoForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nombreGastoFijo = document.getElementById('nombreGastoFijo').value;
        const montoGastoFijo = document.getElementById('montoGastoFijo').value;
        const fechaDescuento = document.getElementById('fechaDescuento').value;

        const nuevoGastoFijo = {
            id: Date.now(),
            nombre: nombreGastoFijo,
            monto: parseFloat(montoGastoFijo),
            fechaDescuento: fechaDescuento
        };

        const gastosFijos = cargarGastosFijos();
        gastosFijos.push(nuevoGastoFijo);
        guardarGastosFijos(gastosFijos);
        renderGastosFijos();
        gastoFijoForm.reset();
    });

    // Función para eliminar un gasto fijo
    window.eliminarGastoFijo = function(id) {
        let gastosFijos = cargarGastosFijos();
        gastosFijos = gastosFijos.filter(gasto => gasto.id !== id);
        guardarGastosFijos(gastosFijos);
        renderGastosFijos();
    };

    // Función para calcular los días restantes para el reinicio
    function calcularDiasRestantes() {
        const hoy = new Date();
        const proximoReinicio = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);
        const diferencia = proximoReinicio - hoy;
        const diasRestantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
        return diasRestantes;
    }

    // Inicializar la interfaz
    renderGastosFijos();
    fechaReinicio.textContent = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString();
    diasFaltantes.textContent = calcularDiasRestantes();
});