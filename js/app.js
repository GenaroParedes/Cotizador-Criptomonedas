const selectCriptos = document.querySelector('#criptomonedas');
const selectMoneda = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

window.onload = () => {
    consultarCriptos();
    formulario.addEventListener('submit', submitFormulario);
    selectMoneda.addEventListener('change', leerValor);
    selectCriptos.addEventListener('change', leerValor);
}

async function consultarCriptos(){ //Consultamos las 10 mas importantes
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    try{
        const resultado = await fetch(url);
        const datos = await resultado.json();
        selectCriptomonedas(datos.Data)
    } catch(error){
        console.log(error);
    }

    //Otras formas de hacerlo
    /*fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => selectCriptomonedas(datos.Data))
}
        Otra forma de hacerlo:
        .then(datos => obtenerCriptomendas(datos.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas)) //De esta forma nos traemos las criptomonedas y podemos realizarle mas operaciones
*/
    }


/*Crear un Promise
const obtenerCriptomendas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
})*/

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        const {Name, FullName} = cripto.CoinInfo;
        
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;

        selectCriptos.appendChild(option);
    })
}

function submitFormulario(e){
    e.preventDefault();
    limpiarHTML();
    const {moneda, criptomoneda} = objBusqueda;

    if(criptomoneda === '' || moneda === ''){
        imprimirAlerta('Todos los campos son obligatorios');
        return;
    }

    //Si pasa validación, consultamos la API con los resultados
    consultarAPI();
    formulario.reset();
    limpiarObj();
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value; //Como tengo los name de los select igual a las propiedades del objeto los puedo asignar de esta forma
}

function imprimirAlerta(mensaje){
    const alertaPrevia = document.querySelector('.alerta');
    if(!alertaPrevia){
        const alerta = document.createElement('div');
        alerta.classList.add('error', 'alerta');
        alerta.innerHTML = `
                    <span class="font-bold">Error!</span>
                    <p>${mensaje}</p>
        `

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

async function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    try{
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        mostrarCotizacion(datos.DISPLAY[criptomoneda][moneda]);
    } catch(error){
        console.log(error);
    }
    /*fetch(url)  
        .then(respuesta => respuesta.json())
        //Para ingresar a las propiedades de los datos de esa cripto y esa moneda tenemos que ingresar: datos.DISPLAY[criptomoneda][moneda]
        .then(datos => mostrarCotizacion(datos.DISPLAY[criptomoneda][moneda])) */

}

function mostrarCotizacion(cotizacion){
    limpiarHTML();

    const {CHANGEPCT24HOUR, HIGHDAY, LASTUPDATE, LOWDAY, PRICE} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span class="font-bold">${PRICE}</span>`;

    const mayorPrecioDia = document.createElement('p');
    mayorPrecioDia.innerHTML = `Precio mas alto del dia: <span class="font-bold">${HIGHDAY}</span>`;

    const menorPrecioDia = document.createElement('p');
    menorPrecioDia.innerHTML = `Precio mas bajo del dia: <span class="font-bold">${LOWDAY}</span>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `Variación ultimas 24hs: <span class="font-bold">${CHANGEPCT24HOUR}%</span>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `Ultima actualización: <span class="font-bold">${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(mayorPrecioDia);
    resultado.appendChild(menorPrecioDia);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.firstChild.remove();
    }
}

function mostrarSpinner(){
    limpiarHTML();
    const spinner = document.createElement('DIV');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `

    resultado.appendChild(spinner);
}

function limpiarObj(){
    objBusqueda.criptomoneda = '';
    objBusqueda.moneda = '';
}