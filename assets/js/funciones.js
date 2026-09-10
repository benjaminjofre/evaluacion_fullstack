document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('formularioRegistro');

  if (formulario) {
    formulario.addEventListener('submit', (e) => {
      e.preventDefault();
      let esValido = true;

      const nombre = document.getElementById('nombre');
      const email = document.getElementById('email');
      const telefono = document.getElementById('telefono');
      const curso = document.getElementById('curso');
      const mensajeExito = document.getElementById('mensajeExito');

      // Validar Nombre
      if (nombre.value.trim().length < 3) {
        nombre.classList.add('is-invalid');
        esValido = false;
      } else {
        nombre.classList.remove('is-invalid');
        nombre.classList.add('is-valid');
      }

      // Validar Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        email.classList.add('is-invalid');
        esValido = false;
      } else {
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
      }

      // Validar Teléfono (+569 y 8 dígitos)
      const telRegex = /^\+569\d{8}$/;
      if (!telRegex.test(telefono.value.trim())) {
        telefono.classList.add('is-invalid');
        esValido = false;
      } else {
        telefono.classList.remove('is-invalid');
        telefono.classList.add('is-valid');
      }

      // Validar Curso
      if (curso.value === '') {
        curso.classList.add('is-invalid');
        esValido = false;
      } else {
        curso.classList.remove('is-invalid');
        curso.classList.add('is-valid');
      }

      if (esValido) {
        // Guardar la inscripción detallada y actualizar contadores
        registrarFormulario(nombre.value, email.value, telefono.value, curso.value);

        mensajeExito.classList.remove('d-none');
        formulario.reset();
        setTimeout(() => {
          mensajeExito.classList.add('d-none');
          document.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
        }, 4000);
      }
    });
  }

  actualizarformulariosEnPantalla();
  verificarEstadoAdmin();
});

function registrarFormulario(nombre, email, telefono, cursoKey) {
  if (!cursoKey) return;

  const datosIniciales = {
    "html": 0,
    "js": 0,
    "git": 0
  };

  let formulario = JSON.parse(localStorage.getItem('formulariosInscritos')) || datosIniciales;
  if (formulario[cursoKey] !== undefined) {
    formulario[cursoKey]++;
  } else {
    formulario[cursoKey] = 1;
  }
  localStorage.setItem('formulariosInscritos', JSON.stringify(formulario));

  let listaInscritos = JSON.parse(localStorage.getItem('listaAlumnosInscritos')) || [];
  
  const nombresCursos = {
    "html": "HTML5 y CSS3",
    "js": "JavaScript Avanzado",
    "git": "Git y GitHub"
  };

  listaInscritos.push({
    nombre: nombre,
    email: email,
    telefono: telefono,
    curso: nombresCursos[cursoKey] || cursoKey,
    fecha: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  });

  localStorage.setItem('listaAlumnosInscritos', JSON.stringify(listaInscritos));

  actualizarformulariosEnPantalla();
  renderizarTablaAdmin();
}

function actualizarformulariosEnPantalla() {
  const datosIniciales = {
    "html": 0,
    "js": 0,
    "git": 0
  };

  let formulario = JSON.parse(localStorage.getItem('formulariosInscritos'));

  if (!formulario) {
    formulario = datosIniciales;
    localStorage.setItem('formulariosInscritos', JSON.stringify(formulario));
  }

  const idsCursos = {
    "html": "count-html",
    "js": "count-js",
    "git": "count-git"
  };

  Object.keys(idsCursos).forEach(curso => {
    const elemento = document.getElementById(idsCursos[curso]);
    if (elemento) {
      elemento.textContent = formulario[curso] !== undefined ? formulario[curso] : 0;
    }
  });

  renderizarTablaAdmin();
}


const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

function iniciarSesionAdmin(e) {
  if (e) e.preventDefault();
  const user = document.getElementById('adminUser').value;
  const pass = document.getElementById('adminPass').value;
  const errorMsg = document.getElementById('errorLogin');

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    localStorage.setItem('isAdminLoggedIn', 'true');
    if (errorMsg) errorMsg.classList.add('d-none');
    
    const modalEl = document.getElementById('loginModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
    
    verificarEstadoAdmin();
  } else {
    if (errorMsg) errorMsg.classList.remove('d-none');
  }
}

function cerrarSesionAdmin() {
  localStorage.removeItem('isAdminLoggedIn');
  verificarEstadoAdmin();
}

function verificarEstadoAdmin() {
  const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true';
  const btnLogin = document.getElementById('btnMostrarLogin');
  const btnLogout = document.getElementById('btnCerrarSesion');
  const panelAdmin = document.getElementById('panelAdminDetalles');

  if (isAdmin) {
    if (btnLogin) btnLogin.classList.add('d-none');
    if (btnLogout) btnLogout.classList.remove('d-none');
    if (panelAdmin) panelAdmin.classList.remove('d-none');
    renderizarTablaAdmin();
  } else {
    if (btnLogin) btnLogin.classList.remove('d-none');
    if (btnLogout) btnLogout.classList.add('d-none');
    if (panelAdmin) panelAdmin.classList.add('d-none');
  }
}

function renderizarTablaAdmin() {
  const tablaBody = document.getElementById('tablaInscritosBody');
  if (!tablaBody) return;

  const listaInscritos = JSON.parse(localStorage.getItem('listaAlumnosInscritos')) || [];
  tablaBody.innerHTML = '';

  if (listaInscritos.length === 0) {
    tablaBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay inscripciones registradas aún.</td></tr>`;
    return;
  }

  listaInscritos.forEach((alumno, index) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${index + 1}</td>
      <td><strong>${alumno.nombre}</strong></td>
      <td>${alumno.email}</td>
      <td>${alumno.telefono}</td>
      <td><span class="badge bg-primary">${alumno.curso}</span></td>
      <td class="text-muted small">${alumno.fecha}</td>
    `;
    tablaBody.appendChild(fila);
  });
}