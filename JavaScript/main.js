//VARIABLES
let usuario;
let usuarioNuevo;
let btnEliminar;
let btnEditar;
let modoEdicion = false;
//SELECTORES

//Selectores input "Registro"
const inputRegisterName = document.querySelector('#name');
const inputRegisterEmail = document.querySelector('#email-register');
const inputRegisterPassword = document.querySelector('#password-register');
const inputRegisterPassword2 = document.querySelector('#password2-register');

const imprimirListaHTML = document.querySelector('#lista-usuarios tbody');

//Selectores input "Login"
const inputLoginEmail = document.querySelector('#email-inicio');
const inputLoginPassword = document.querySelector('#password-inicio');

//Selectores botones
const btnRegistrarUsuario = document.querySelector('#registrar-usuario');
const btnIniciarLogin = document.querySelector('#button-ingresar');

//OBJETO
const nuevoUsuario = {
    nombre: '',
    email: '',
    password: ''
}

//CLASES
//Clase para almacenar cada usuario que se haya registrado
class UsuariosRegistrados{
    constructor(){
        this.usuarios = [];
    }

    agregarUsuarioNuevo(usuarioNuevo){
        this.usuarios = [...this.usuarios, usuarioNuevo];
        crearListaHTML(this.usuarios);
    }

    eliminarUsuaroExistente(id){
        this.usuarios = this.usuarios.filter((usuario) =>usuario.id !==id);
        crearListaHTML(this.usuarios);
    }

    editarUsuarioExistente(usuario){
        this.usuarios = this.usuarios.map(usuarios => usuarios.id === usuario.id ? usuario : usuarios);
        crearListaHTML(this.usuarios);
    }

    iniciarSesionUsuario(usuario,password){
        if(usuario.password === password){
            ingresoCorrecto(usuario.nombre);
        } else{
            errorPassword();
        }
    }
}


//Clase para instanciar los usarios creados
class UsuarioRegistrado{
    constructor(nombre,email,password,id){
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.id = id;
    }
}

//Clase que se encargará de la interfaz
class Interface{

    mostrarAlerta(mensaje,tipo,inputParent,input){
       
     
        if(tipo==='edicionCorrecta'){
            const divMensaje = document.createElement('div');
            divMensaje.textContent = mensaje;
            divMensaje.classList.add('div-editando');
            formularioRegistro.appendChild(divMensaje);
            setTimeout(()=>{
                divMensaje.remove();
            },3000);
            return;
        }

        if(tipo === 'ingresoCorrecto'){
            console.log('onichan');
            const divMensaje = document.createElement('p');
            divMensaje.textContent = mensaje;
            divMensaje.classList.add('div-ingreso-correcto');
            inputParent.appendChild(divMensaje);

            setTimeout(()=>{
                divMensaje.remove();
            },3000);
            return;
        }

        if(tipo==='loginError'){
            console.log('aquiestamos');
            const divMensaje = document.createElement('p');
            divMensaje.textContent = mensaje;
            divMensaje.classList.add('campo-obligatorio-login');
            inputParent.appendChild(divMensaje);

            setTimeout(()=>{
                divMensaje.remove();
            },3000);
            return;
        }

        this.limpiarAlerta(inputParent);


        const mensajeError = document.createElement('p');
        mensajeError.textContent = mensaje;
        
        if(tipo==='error'){
            mensajeError.classList.add('campo-obligatorio');
            //input.style.border = '1px solid red';
        } 
        
        if(tipo==='valido'){
            mensajeError.classList.add('email-valido');
            input.style.border = '';
        }

        if(tipo==='correcto'){
            mensajeError.classList.remove('campo-obligatorio');
            input.style.border = '';
            mensajeError.classList.add('email-valido');
        }



        inputParent.appendChild(mensajeError);
    }

    limpiarAlerta(input){
        if(input.querySelector('p')){
            input.removeChild(input.lastChild);
        }
    }

    agregarListaHTML(usuarios){

        this.limpiarListaHTML();

        //Iteramos sobre cada usuario
        usuarios.forEach(usuario => {
            const {nombre,email,id} = usuario;

            //Creamos fila
            const row = document.createElement('tr');
            row.dataset.id = id;

            row.innerHTML = `
            <td>${nombre}</td>
            <td>${email}</td>
            `

            //Crear botones para Eliminar y Editar
            const botones = document.createElement('td');
            botones.classList.add('botones-editar-eliminar');
            row.appendChild(botones);

            imprimirListaHTML.appendChild(row);

            btnEliminar = document.createElement('button');
            btnEliminar.classList.add('eliminar-usuario');
            btnEliminar.textContent = 'Eliminar';

            botones.appendChild(btnEliminar);
            btnEliminar.onclick = () =>{
            eliminarUsuario(id);
            limpiarObjeto();
            regresarModoNuevoUsuario();
            }

            btnEditar = document.createElement('button');
            btnEditar.classList.add('editar-usuario');
            btnEditar.textContent = "Editar";
            botones.appendChild(btnEditar);


            btnEditar.onclick = ()=>{
                editarUsuario(id);
            }
        });
        
    }

    limpiarListaHTML(){
        while(imprimirListaHTML.firstChild){
            imprimirListaHTML.removeChild(imprimirListaHTML.firstChild);
        }
    }
}

//INSTANCIAR
const interface = new Interface();
const usuarioNuevoRegistrado = new UsuariosRegistrados();

//EVENT LISTENERS

eventListers();
function eventListers(){
    inputRegisterName.addEventListener('input',validarFormulario);
    inputRegisterEmail.addEventListener('input',validarFormulario);
    inputRegisterPassword.addEventListener('input',validarFormulario);
    inputRegisterPassword2.addEventListener('input',validarFormulario);

    btnRegistrarUsuario.addEventListener('click',agregarNuevoUsuario);
    btnIniciarLogin.addEventListener('click',iniciarSesion);
}

//FUNCIONES

function regresarModoNuevoUsuario(){
    btnRegistrarUsuario.textContent = "Registrar";
    btnRegistrarUsuario.classList.remove('edicion');
    modoEdicion = false;
}

function validarFormulario(e){

    let valorInput = e.target.value;
    const elementoPadre = e.target.parentElement;

    //Validamos si el campo se lleno
    if(valorInput.trim() === ''){
        valorInput = '';
        interface.mostrarAlerta(`El campo ${e.target.name} es obligatorio`,'error',elementoPadre,e.target);
        nuevoUsuario[e.target.name] = '';
        //return;
    }

    //Validamos si el campo email es correcto
    if(e.target.id==='email-register' && !validarEmail(valorInput)){
        interface.mostrarAlerta('El email no es valido','error',elementoPadre,e.target);
        nuevoUsuario[e.target.name] = '';
        return;
    } 

    //Si el email es llenado correctamente mandamos el mensaje de valido
    if(e.target.id==='email-register' && validarEmail(valorInput)){
        interface.mostrarAlerta('Email válido','valido',elementoPadre,e.target);
        nuevoUsuario[e.target.name] = valorInput;
        
    }


    // VALIDAR CONTRASEÑAS
    //Revisamos si las contraseñas coinciden
    if(e.target.id === 'password-register' && valorInput.trim() != ''){
        //Quitamos la alerta si tiene algo el input
        interface.mostrarAlerta('','correcto',elementoPadre,e.target);

        //Si las contraseñas no coinciden mandamos error en password2
        if(valorInput != inputRegisterPassword2.value){
            interface.mostrarAlerta('Las contraseñas no coinciden','error',inputRegisterPassword2.parentElement,inputRegisterPassword2);
            nuevoUsuario[e.target.name] = '';
            comprobarRegistro();
            return;
        } else{
            interface.mostrarAlerta('Las contraseñas coinciden','correcto',inputRegisterPassword2.parentElement,inputRegisterPassword2);
            nuevoUsuario[e.target.name] = valorInput;
            
        }
    }

    //Al salir del input password2 revisamos si las contraseñas son correctas.
    if(e.target.id==='password2-register' && valorInput.trim()){
        if(inputRegisterPassword.value != inputRegisterPassword2.value){
            interface.mostrarAlerta('La contraseña no coincide','error',elementoPadre,e.target);
            nuevoUsuario[e.target.name] = '';
            comprobarRegistro();
            return;
        } else{
            interface.mostrarAlerta('La contraseña coincide','correcto',elementoPadre,e.target);
            nuevoUsuario[e.target.name] =valorInput;
            
        }
    }


    //Si un campo se lleno mandamos el mensaje de llenado correctamente

    if(valorInput.trim() && e.target.id === 'name'){
        interface.mostrarAlerta(`Campo ${e.target.name} llenado correctamente`,'correcto',elementoPadre,e.target);   
        nuevoUsuario[e.target.name] = valorInput;
         
    }

    //Cada que un campo sea correcto revisamos si ya se llenaron todos los campos correctamente
    comprobarRegistro();
}

//Validar si email tiene formato de email
 function validarEmail(email){
    const regex =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/ 
        const resultado = regex.test(email);
        return resultado;
 }

 //Comprobamos si todos los datos ya fueron agregados correctamente
function comprobarRegistro(){
    if(Object.values(nuevoUsuario).includes('')){
        btnRegistrarUsuario.disabled = true;
        btnRegistrarUsuario.opacity = 0.5;
    } else{
        btnRegistrarUsuario.disabled = false;
        btnRegistrarUsuario.opacity = 0;
    }
}

/*comienza el proceso de Registro una vez que todos los campos son llenados
correctamente y se presiona el botón "Registrar" */
 function agregarNuevoUsuario(e){
    e.preventDefault();
    

    if(modoEdicion === false){
        
        nuevoUsuario['id'] = Date.now();
        const {nombre,email,password,id} = nuevoUsuario;
    
        const usuario = new UsuarioRegistrado(nombre,email,password,id);
    
        usuarioNuevoRegistrado.agregarUsuarioNuevo(usuario);

    } else{
        interface.mostrarAlerta('Editado Correctamente',"edicionCorrecta",'','');

        const {nombre,email,password,id} = nuevoUsuario;

        const usuario = new UsuarioRegistrado(nombre,email,password,id);

        usuarioNuevoRegistrado.editarUsuarioExistente({...usuario});

        regresarModoNuevoUsuario();
        organizarFormulario(true);
        
    }
    

    limpiarObjeto();
    comprobarRegistro();
    limpiarAlertas();

 };

 /*Una vez que se registra un usuario se vacia el objeto
 para que asi pueda ser llenado para un nuevo registro */
function limpiarObjeto(){
        //Limpiar objeto
        formularioRegistro.reset();
        nuevoUsuario.nombre = '';
        nuevoUsuario.email = '';
        nuevoUsuario.password = '';
        delete nuevoUsuario.id;
} 

/*si existe alguna alerta en los inputs se limpian */
function limpiarAlertas(){
    interface.limpiarAlerta(inputRegisterName.parentElement);
    interface.limpiarAlerta(inputRegisterEmail.parentElement);
    interface.limpiarAlerta(inputRegisterPassword2.parentElement);
}

/*Se manda a llamar para imprimir la lista de usuarios */
function crearListaHTML(usuarios){
     interface.agregarListaHTML(usuarios);
    }

function eliminarUsuario(id){
    usuarioNuevoRegistrado.eliminarUsuaroExistente(id);
}

function editarUsuario(id){
    const usuarioEditar = usuarioNuevoRegistrado.usuarios.find((usuario)=>usuario.id === id);

    const {nombre,email,password} = usuarioEditar;

    //Agregamos el objeto a editar al formulario
    formularioRegistro.reset();
    registrar();
    limpiarAlertas();

    inputRegisterName.value = nombre;
    inputRegisterEmail.value = email;
    inputRegisterPassword.value = password;
    inputRegisterPassword2.value = password;

    //Llenamos el objeto
    nuevoUsuario.nombre = nombre;
    nuevoUsuario.email = email;
    nuevoUsuario.password = password;
    nuevoUsuario.id = id;
    comprobarRegistro();

    btnRegistrarUsuario.textContent = "Guardar Cambios";

    modoEdicion = true;

    //usuarioNuevoRegistrado.editarUsuarioExistente(id);
}

//INICIAMOS SESION

function iniciarSesion(e){
    e.preventDefault();

    const email = inputLoginEmail.value;
    const password = inputLoginPassword.value;

    if(email.trim() === '' || password.trim() == ''){
        interface.mostrarAlerta('Todos los campos son necesarios','loginError',document.querySelector('#formulario-iniciar .input-group'),'')
        return;
    } else if (!(validarEmail(email))){
        interface.mostrarAlerta('Email no válido','loginError',document.querySelector('#formulario-iniciar .input-group'),'')
        return;
    }

        const buscarUsuario = usuarioNuevoRegistrado.usuarios.find((usuario) => usuario.email === email);

    if(!buscarUsuario){
        interface.mostrarAlerta('Usuario no existe','loginError',document.querySelector('#formulario-iniciar .input-group'),'');
        return;
    } 
        usuarioNuevoRegistrado.iniciarSesionUsuario(buscarUsuario,password);
}

function errorPassword(){
    interface.mostrarAlerta('Contraseña incorrecta','loginError',document.querySelector('#formulario-iniciar .input-group'),'')
    inputLoginPassword.value = '';
    return;
}

function ingresoCorrecto(nombre){
    primerNombre = nombre.split(' ')[0];
    console.log('holas');
    interface.mostrarAlerta(`${primerNombre} has ingresado correctamente`,'ingresoCorrecto',document.querySelector('#formulario-iniciar .input-group'),'');

    formularioInicio.reset();
}