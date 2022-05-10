//campos del formulario
const mascotaInput = document.querySelector('#mascota')
const propietarioInput = document.querySelector('#propietario')
const telefonoInput = document.querySelector('#telefono')
const fechaInput = document.querySelector('#fecha')
const horaInput = document.querySelector('#hora')
const sintomasInput = document.querySelector('#sintomas')
//UI
const formulario = document.querySelector('#nueva-cita')
const contenedorCitas =document.querySelector('#citas')

let editando;

class Citas {
    constructor(){
        this.citas=[];
    }
    agregarCita(cita){
        this.citas = [...this.citas, cita ]

        console.log(this.citas);

    }
    eliminarCita(id){
        this.citas = this.citas.filter(cita=>cita.id !== id)
    }
    editarCita(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }
}
class UI{
    impimirAlerta(mensaje,tipo){
        //crear el div.
        const divMensaje= document.createElement('div');
        divMensaje.classList.add('text-center','alert', 'd-block','col-12');
        //agregar clase en base al tipo de error.
        if (tipo==='error') {
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }

        //Mensaje de error
        divMensaje.textContent=mensaje;
        //agregar al DOM.
        document.querySelector('#contenido').insertBefore(divMensaje,document.querySelector('.agregar-cita'));
        //quitar la alerta despues de 5 segundos.
        setTimeout(() => {
            divMensaje.remove();
        }, 5000);
    }
    impimirCitas({citas}){

        this.limpiarHTML();
     citas.forEach(cita => {
        const {mascota, propietario, telefono, fecha,hora, sintomas, id} =cita;
        const divCita = document.createElement('div');
        divCita.classList.add('cita','p-3');
        divCita.dataset.id=id;

        //Scripting de los elementos de la cita.
        const mascotaParrafo=document.createElement('h2');
        mascotaParrafo.classList.add('card-title','font-weight-bolder');
        mascotaParrafo.textContent = mascota;

        const propietarioParrafo=document.createElement('p');
        propietarioParrafo.innerHTML=`
            <span class="font-weight-bolder">Propietario: </span> ${propietario}
        `;

        const telefonoParrafo=document.createElement('p');
        telefonoParrafo.innerHTML=`
            <span class="font-weight-bolder"> Telefono: </span> ${telefono}
        `;
        const fechaParrafo=document.createElement('p');
        fechaParrafo.innerHTML=`
            <span class="font-weight-bolder"> Fecha: </span> ${fecha}
        `;
        const horaParrafo=document.createElement('p');
        horaParrafo.innerHTML=`
            <span class="font-weight-bolder"> Hora: </span> ${hora}
        `;
        const sintomasParrafo=document.createElement('p');
        sintomasParrafo.innerHTML=`
            <span class="font-weight-bolder"> sintomas: </span> ${sintomas}
        `;

        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
        btnEliminar.innerHTML ='eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'

        btnEliminar.onclick = ()=>eliminarCita(id);

        //añade un boton para editar.
        const btnEditar =document.createElement('button');
        btnEditar.classList.add('btn','btn-info');
        btnEditar.innerHTML= `Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" 
        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
        </path></svg>
        `;
        btnEditar.onclick=() => cargarEdicion(cita);

        //agregar los parrafos al divCita
        divCita.appendChild(mascotaParrafo);
        divCita.appendChild(propietarioParrafo);
        divCita.appendChild(telefonoParrafo);
        divCita.appendChild(fechaParrafo);
        divCita.appendChild(horaParrafo);
        divCita.appendChild(sintomasParrafo);
        //agregar el boton de eliminar al HTML.
        divCita.appendChild(btnEliminar);
        //agregar las citas al HTML.
        contenedorCitas.appendChild(divCita);
        divCita.appendChild(btnEditar);

     });
    }
    limpiarHTML(){
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild( contenedorCitas.firstChild)
        }
    }
}

const ui = new UI();
const administrarCitas = new Citas();

//registrar eventos
eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita)
}
//objeto con informacion de la cita
const citaObj ={
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''



}
//agrega datos al objeto de cita.
function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
    
}

//VALIDAR Y AGREGAR CITAS ALA CLASE DE CITAS.
function nuevaCita(e) {
    e.preventDefault();

    //Extraer la informacion del objeto de citas.
    const {mascota, propietario, telefono, fecha,hora, sintomas} =citaObj;

    //validar.
    if (mascota==='' ||propietario===''||telefono===''||fecha===''||hora===''||sintomas==='') {
        ui.impimirAlerta('Todos los campos son obligatorios','error')
        return;
    }

    if (editando) {
    ui.impimirAlerta('Editado correctamente')

    //pasar el objeto de la cita a edicion-
        administrarCitas.editarCita({...citaObj})
        //regresar el texto de boton a su texto original.
    formulario.querySelector('button[type="submit"]').textContent = 'Crear cita'
  //quitar modo edicion.
    editando = false;
    }else{
    //generar un id unico
    citaObj.id =Date.now();
    //creando una nueva cita.
    administrarCitas.agregarCita({...citaObj})


    //Mensaje de arreglado correctamente.
    ui.impimirAlerta('Se agrego correctamente.')
    }



    //reiniciar el Objeto para la validacion.
    reiniciarObjeto();

    //reiniciar elformulario.
    formulario.reset();

    //Mostrar el HTML de las citas.
    ui.impimirCitas(administrarCitas);
}


function reiniciarObjeto() {
    citaObj.mascota= '';
    citaObj.propietario= '';
    citaObj.telefono= '';
    citaObj.fecha= '';
    citaObj.hora= '';
    citaObj.sintomas= '';
}


function eliminarCita(id) {
    //eliminar la cita.
    administrarCitas.eliminarCita(id);

    //muestre un mensaje.
    ui.impimirAlerta('La cita se elimino correctamente');

    //refresca las citas
    ui.impimirCitas(administrarCitas);
}

//carga los datos y el modo edicion.
function cargarEdicion(cita) {
    const {mascota, propietario, telefono, fecha,hora, sintomas, id} =cita;

    //llenar los inputs.
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Llamar el objeto.
    citaObj.mascota= mascota;
    citaObj.propropietario = propietario ;
    citaObj.telefono= telefono;
    citaObj.fecha= fecha;
    citaObj.hora= hora;
    citaObj.id= id;

    //cambiar el texto del boton.
    formulario.querySelector('button[type="submit"]').textContent='Guardar Cambios';0
    editando=true;
}
