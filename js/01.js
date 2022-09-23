const entrada = document.querySelector('#entrada')
const btnResetear = document.querySelector('#btnResetear')
const formulario = document.querySelector('#formulario')
const contenedorEntradas = document.querySelector('#contenedor-entrada')
const btnAbrirPantalla = document.querySelector('#abrir-pantalla')
const btnCerrarPantalla = document.querySelector('#cerrar-pantalla')

let entradaArray = []

generarEventListeners()

function generarEventListeners() {
    
    document.addEventListener('DOMContentLoaded', programarFecha)
    document.addEventListener('DOMContentLoaded', () => {
        entradaArray = JSON.parse(localStorage.getItem('entradas')) || []
        generarHTML()
    })

    document.addEventListener('submit', guardarEntrada)
    btnResetear.addEventListener('click', resetearFormulario)
    btnAbrirPantalla.addEventListener('click', abrirPantalla)
    btnCerrarPantalla.addEventListener('click', cerrarPantalla)

}

function guardarEntrada(e){
    e.preventDefault()
    const entrada = document.querySelector('#entrada').value
    const idEntrada = document.querySelector('#idEntrada').value

    if (entrada === '') {
        mostrarMensaje('Debes escribir algo :)')
        return
    }
    
    const entradaObj = {
        id: Date.now(),
        fecha: new Date().toLocaleDateString(),
        entrada
    }

    const resultado = entradaArray.some(entry => entry.id === Number(idEntrada))

    if (resultado) {
        entradaArray.map( entry => {
            if (entry.id === Number(idEntrada) ) {
                entry.entrada = entrada
                entry.fecha = new Date().toLocaleDateString()
            }
        } )
    }else{
        entradaArray = [entradaObj, ...entradaArray]

    }

    generarHTML()
    resetearFormulario()

}

function sincronizarLocalStorage() {
    localStorage.setItem('entradas', JSON.stringify(entradaArray))
}

function generarHTML() {
    limpiarHTML()

    if (entradaArray.length > 0) {
        entradaArray.forEach(entry => {
            const { id, fecha, entrada } = entry

            const contenedor = document.createElement('div')
            contenedor.setAttribute('id', `abrir-pantalla-${id}`)
            contenedor.classList.add('border-b-2', 'border-gray-400', 'py-4', 'hover:bg-gray-100')

            const contenedorHeader = document.createElement('div')
            contenedorHeader.classList.add('flex', 'items-center', 'justify-between', 'mb-2', 'px-2')
            contenedorHeader.innerHTML = `
            <span class="font-bold text-gray-700">${fecha}</span>
            `

            const contenedorBotones = document.createElement('div')
            contenedorBotones.classList.add('flex', 'items-center', 'gap-x-2')

            const btnEliminar = document.createElement('button')
            btnEliminar.setAttribute('type', 'button')
            btnEliminar.onclick = () => {
                eliminarEntrada(id)
            }
            btnEliminar.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-red-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            `
            
            contenedorBotones.appendChild(btnEliminar)

            contenedorHeader.appendChild(contenedorBotones)

            const contenedorBody = document.createElement('div')
            contenedorBody.classList.add('cursor-pointer','verMas','px-2')
            contenedorBody.setAttribute('id', 'formatear-texto')

            contenedorBody.onclick = function(){
                resetearFormulario()
                const entradaForm = document.querySelector('#entrada')
                const idEntrada = document.querySelector('#idEntrada')
                entradaForm.value = entrada
                idEntrada.value = id
            }


            contenedorBody.innerHTML = `${entrada.substring(0,90)}...`            
            contenedor.appendChild(contenedorHeader)
            contenedor.appendChild(contenedorBody)

            contenedorEntradas.appendChild(contenedor)

        });
    }else{
        const span = document.createElement('span')
        span.classList.add('block','text-center', 'mt-10')
        span.textContent = 'No hay entradas :('
        contenedorEntradas.appendChild(span)
    }

    
    sincronizarLocalStorage()
}

function eliminarEntrada(id) {
    if (confirm('¿Desea eliminar la entrada seleccionada?')) {
        if (Number(document.querySelector('#idEntrada').value) === id) {
            resetearFormulario()
        }
        
        entradaArray = entradaArray.filter(entrada => entrada.id !== id)
        generarHTML()
    }
}

function limpiarHTML() {
    contenedorEntradas.innerHTML = ''
}

function nuevaEntrada() {
    resetearFormulario()
    entrada.focus()
}

function mostrarMensaje(msg) {
    const mensajeError = document.querySelector('#mensaje-error')
    mensajeError.classList.add('py-2','px-4', 'bg-red-200', 'rounded', 'text-red-700', 'mt-2', 'text-sm', 'font-semibold')
    entrada.classList.add('outline-none','border-2','border-red-400','relative')
    mensajeError.textContent = `(*) ${msg}`

    setTimeout(() => {
        entrada.classList.remove('outline-none','border-2', 'border-red-400')
        mensajeError.classList.remove('py-2','px-4', 'bg-red-200', 'rounded', 'text-red-700', 'mt-2', 'text-sm', 'font-semibold')
        mensajeError.textContent = ''
    }, 3000);
}

function abrirPantalla(){
    const columna2 = document.querySelector('#columna-2')
    btnAbrirPantalla.classList.add('hidden')
    btnCerrarPantalla.classList.remove('hidden')
    columna2.requestFullscreen()
}

function cerrarPantalla() {
    btnCerrarPantalla.classList.add('hidden')
    btnAbrirPantalla.classList.remove('hidden')
    document.exitFullscreen()
}

function resetearFormulario() {
    const idEntrada = document.querySelector('#idEntrada')
    idEntrada.value = ''
    formulario.reset()
}

function programarFecha() {
    const fechaHoy = document.querySelector('#fecha-hoy')
    const fecha = new Date().toLocaleDateString()
    fechaHoy.textContent = fecha
}