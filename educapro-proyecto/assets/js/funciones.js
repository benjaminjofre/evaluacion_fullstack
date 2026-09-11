document.addEventListener('DOMContentLoaded', () => {
  cargarTablaAdmin();
  cargarAlumnosProfesor();

  // Proceso de Pago hacia Pantalla Principal (index.html)
  const formPago = document.getElementById('formPago');
  if (formPago) {
    formPago.addEventListener('submit', (e) => {
      e.preventDefault();
      alert("¡Pago realizado con éxito! Tu matrícula ha sido confirmada.");
      window.location.href = 'index.html';
    });
  }
});

// Función de redirección para pagos
function procesarPago(e) {
  if (e) e.preventDefault();
  alert("¡Pago realizado con éxito! Tu matrícula ha sido confirmada.");
  window.location.href = 'index.html';
}

function cargarTablaAdmin() {
  const tabla = document.getElementById('tablaAdmin');
  if (!tabla) return;

  const estudiantes = JSON.parse(localStorage.getItem('estudiantesInscritos')) || [];

  if (estudiantes.length === 0) {
    tabla.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay matriculados registrados aún.</td></tr>';
    return;
  }

  tabla.innerHTML = estudiantes.map(e => `
    <tr>
      <td><strong class="text-dark">${e.nombre}</strong><br><small class="text-muted">${e.email}</small></td>
      <td>${e.curso}</td>
      <td>${e.profesor}</td>
      <td><span class="badge bg-primary">${e.estado || 'EST001 - Matriculado'}</span></td>
      <td><button class="btn btn-sm btn-outline-success fw-bold" onclick="alert('Certificado emitido digitalmente.')">Emitir Certificado</button></td>
    </tr>
  `).join('');
}

function cargarAlumnosProfesor() {
  const select = document.getElementById('selectAlumnoProfesor');
  if (!select) return;

  const estudiantes = JSON.parse(localStorage.getItem('estudiantesInscritos')) || [];
  
  if(estudiantes.length === 0) {
    select.innerHTML = '<option disabled selected>No hay estudiantes para evaluar</option>';
    return;
  }

  select.innerHTML = '<option disabled selected>Seleccione estudiante...</option>' + 
    estudiantes.map((e, index) => `<option value="${index}">${e.nombre} - ${e.curso}</option>`).join('');
}