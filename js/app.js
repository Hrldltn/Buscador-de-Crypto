const criptomonedaSelect=document.querySelector('#criptomonedas')
const formulario=document.querySelector('#formulario')
const monedaSelect=document.querySelector('#moneda')
const resultado=document.querySelector('#resultado')

const objBusqueda={
    moneda:'',
    criptomoneda:''
}


const obtenerCriptomonedas= criptomonedas =>new Promise(resolve =>{
    resolve(criptomonedas)
})

document.addEventListener('DOMContentLoaded',()=>{
    consultarCriptomonedas()
    
    formulario.addEventListener('submit',submitForm)

    criptomonedaSelect.addEventListener('change',leerValor)
    monedaSelect.addEventListener('change',leerValor)
})

async function consultarCriptomonedas(){
        const url='https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'

        try {
            const respuesta=await fetch(url)
            const resultado=await respuesta.json()
            const criptomonedas=await obtenerCriptomonedas(resultado.Data)
            selectCriptomonedas(criptomonedas)
        }catch(error){
            console.log(error)
        }

}

function selectCriptomonedas(criptomonedas){
    //conocer tiempo de ejecucion con performance para tester

    for(let i = 0 ; i < criptomonedas.length; i++){
        const{FullName,Name}=criptomonedas[i].CoinInfo

        const option=document.createElement('option')
        option.value=Name
        option.textContent=FullName
        criptomonedaSelect.appendChild(option)

    }

}

function leerValor(e){
    objBusqueda[e.target.name]=e.target.value
    objBusqueda[e.target.FullName]=e.target.value
}

function submitForm(e){
    e.preventDefault()

    const{moneda,criptomoneda}=objBusqueda

    if(moneda==='' || criptomoneda===''){
        mostrarMensaje('Todos los campos son obligatorios');
        return
    }

    //consultarAPP

    consultarAPI()
}

function mostrarMensaje(msg){
    const existeError=document.querySelector('.error')
    
    if(!existeError){
        const divMensaje=document.createElement('div')
        divMensaje.classList.add('error')

        divMensaje.textContent=msg  
        formulario.appendChild(divMensaje)

        setTimeout(()=>{
            divMensaje.remove()
        },2000)
    }
    
}   

function consultarAPI(){
    const {moneda,criptomoneda}=objBusqueda
    const url=`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
    
    mostrarSpinner()

    setTimeout(()=>{
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(cotizacion => { mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda])})
    },2400)    
}

function mostrarCotizacion(cotizacion){
    limpiarHTML()
    
    const {PRICE,HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE}=cotizacion
    
    const precio=document.createElement('p')
    precio.classList.add('precio')
    precio.innerHTML=`El precio es:<span>${PRICE}</span>`

    const precioAlto=document.createElement('p');
    precio.classList.add('precio')
    precioAlto.innerHTML=`Precio más alto del día es: <span>${HIGHDAY}</span>`

    const precioBajo=document.createElement('p');
    precio.classList.add('precio')
    precioBajo.innerHTML=`Precio más bajo del día es: <span>${LOWDAY}</span>`

    const Horas=document.createElement('p');
    precio.classList.add('precio')
    Horas.innerHTML=`Precio de las últimas 24 horas es: <span>${CHANGEPCT24HOUR}% </span>`

    const actualizacion=document.createElement('p');
    precio.classList.add('precio')
    actualizacion.innerHTML=`Última actualización: <span>${LASTUPDATE}</span>`


    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(Horas);
    resultado.appendChild(actualizacion);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarSpinner(){
    limpiarHTML();

    const spinner=document.createElement('div');
    spinner.classList.add('sk-cube-grid')

    spinner.innerHTML=`
        <div class="sk-cube sk-cube1"></div>
        <div class="sk-cube sk-cube2"></div>
        <div class="sk-cube sk-cube3"></div>
        <div class="sk-cube sk-cube4"></div>
        <div class="sk-cube sk-cube5"></div>
        <div class="sk-cube sk-cube6"></div>
        <div class="sk-cube sk-cube7"></div>
        <div class="sk-cube sk-cube8"></div>
        <div class="sk-cube sk-cube9"></div>
    `
    resultado.appendChild(spinner)
}