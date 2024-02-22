//VARIABLES

//SELECTORES
const contenedorLoginRegister = document.querySelector('.contenedor-login-register');

const formularioInicio = document.querySelector('#formulario-iniciar');
const formularioRegistro = document.querySelector('#formulario-register');

const containerInicio = document.querySelector('.ingesar-login');
const containerRegister = document.querySelector('.ingesar-register');

const btnIniciarSesion = document.querySelector('#button-iniciar-sesion');
const btnRegistrar = document.querySelector('#button-register')

//EVENT LISTENERS

btnRegistrar.addEventListener('click',registrar);
btnIniciarSesion.addEventListener('click',iniciar);

window.addEventListener('resize',()=>{
    let width = window.innerWidth;
    let responsive;

    if(width<800){
        responsive = true;
        organizarFormulario(responsive);
    } else {
        responsive = false;
        organizarFormulario(responsive);
    }
});

addEventListener('DOMContentLoaded',()=>{
    let width = window.innerWidth;

    if(width<800){
        containerRegister.style.display = 'block';
        containerInicio.style.display = 'none';
    }
})


//FUNCIONES
function registrar(){
    if(window.innerWidth >800){
        formularioRegistro.style.display = "block";
        contenedorLoginRegister.style.left = "410px";
        contenedorLoginRegister.style.top = "-3px";
        formularioInicio.style.display = 'none';
        containerRegister.style.opacity = "0";
        containerInicio.style.opacity ='1';
    } else{
        formularioInicio.style.display = 'none';
        formularioRegistro.style.display = 'block';

        containerRegister.style.display = 'none';
        containerInicio.style.display = 'block';
        containerInicio.style.opacity = "1";
    }
}

function iniciar(){
    if(window.innerWidth > 800){
        formularioRegistro.style.display = "none";
        contenedorLoginRegister.style.left = "10px";
        contenedorLoginRegister.style.top = "63px";
        formularioInicio.style.display = 'block';
        containerRegister.style.opacity = "1";
        containerInicio.style.opacity ='0';
    }  else {
        formularioInicio.style.display = 'block';
        formularioRegistro.style.display = 'none';

        containerRegister.style.display = 'block';
        containerInicio.style.display = 'none';
        containerRegister.style.opacity = "1";
    }

}

function organizarFormulario(responsive){

    const formularioInicioDisplay = window.getComputedStyle(formularioInicio).display;
    const formularioRegistroDisplay = window.getComputedStyle(formularioRegistro).display;

    //Si el tamaño de la ventana es menor a 800px
    if(responsive === true){

        const botonesEliminar = document.querySelectorAll(".eliminar-usuario");
        const botonesEditar = document.querySelectorAll(".editar-usuario");

        botonesEditar.forEach(elemento =>{
            elemento.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
        })

        botonesEliminar.forEach(elemento => {
            elemento.innerHTML = `<i class="fa-solid fa-x"></i>`;
        });
        
        if(window.innerWidth<800){
            if(formularioInicioDisplay === 'block'){
                containerInicio.style.display = 'none';
            } else if(formularioRegistroDisplay === 'block'){
                containerRegister.style.display = 'none';
            }
        }

    }


    //Si el tamaño de la ventana es mayor a 800px
    if(responsive === false){
        const botonesEliminar = document.querySelectorAll(".eliminar-usuario");
        const botonesEditar = document.querySelectorAll(".editar-usuario");

        botonesEditar.forEach(elemento =>{
            elemento.textContent = "Editar";
        })

        botonesEliminar.forEach(elemento => {
            elemento.textContent = `Eliminar`;
        });

        containerInicio.style.display = 'block';
        containerRegister.style.display = 'block';

        if(formularioInicioDisplay === 'block'){
            iniciar();
        } else if(formularioRegistroDisplay === 'block'){
            registrar();
        }
    }


}


