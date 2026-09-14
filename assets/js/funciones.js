document.addEventListener('DOMContentLoaded', () => {

  const formInscripcion = document.getElementById('formularioRegistro');
  if (formInscripcion) {
    formInscripcion.addEventListener('submit', (e) => {
      e.preventDefault();
      let valido = true;

      const nombre = document.getElementById('nombre');
      const email = document.getElementById('email');
      const telefono = document.getElementById('telefono');
      const curso = document.getElementById('curso');
      const mensaje = document.getElementById('mensajeExito');

      if (nombre.value.trim().length < 3) {
        nombre.classList.add('is-invalid');
        valido = false;
      } else {
        nombre.classList.remove('is-invalid');
        nombre.classList.add('is-valid');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        email.classList.add('is-invalid');
        valido = false;
      } else {
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
      }

      const telRegex = /^\+569\d{8}$/;
      if (!telRegex.test(telefono.value.trim())) {
        telefono.classList.add('is-invalid');
        valido = false;
      } else {
        telefono.classList.remove('is-invalid');
        telefono.classList.add('is-valid');
      }

      if (curso.value === '') {
        curso.classList.add('is-invalid');
        valido = false;
      } else {
        curso.classList.remove('is-invalid');
        curso.classList.add('is-valid');
      }

      if (valido) {
        mensaje.classList.remove('d-none');
        setTimeout(() => {
          window.location.href = 'pago.html';
        }, 1200);
      }
    });
  }

  function cargarReporteMatriculas() {
  const cursos = JSON.parse(localStorage.getItem('cursos')) || [];
  const matriculas = JSON.parse(localStorage.getItem('matriculas')) || [];


  const totalMatriculasElem = document.getElementById('totalMatriculas');
  if (totalMatriculasElem) {
    totalMatriculasElem.textContent = matriculas.length;
  }

  const conteoPorCurso = {};

  cursos.forEach(curso => {
    conteoPorCurso[curso.id] = {
      nombre: curso.nombre,
      codigo: curso.codigo || 'N/A',
      inscritos: 0
    };
  });

  matriculas.forEach(matricula => {
    if (conteoPorCurso[matricula.cursoId]) {
      conteoPorCurso[matricula.cursoId].inscritos += 1;
    }
  });

  const tbody = document.getElementById('tablaReporteCursos');
  if (!tbody) return;

  tbody.innerHTML = '';

  const listaCursos = Object.values(conteoPorCurso);

  if (listaCursos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center text-muted">No hay cursos ni inscripciones registradas.</td>
      </tr>
    `;
    return;
  }

  listaCursos.forEach(item => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td><strong>${item.nombre}</strong></td>
      <td>${item.codigo}</td>
      <td class="text-center">
        <span class="badge bg-success fs-6">${item.inscritos}</span>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

  document.addEventListener('DOMContentLoaded', () => {
  cargarReporteMatriculas();
});


  const formPago = document.getElementById('formPago');
  if (formPago) {
    formPago.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('¡Pago procesado con éxito! Su matrícula ha sido confirmada.');
      window.location.href = 'estudiante.html';
    });
  }


  const botonesGuardar = document.querySelectorAll('main table .btn-primary');
  botonesGuardar.forEach((boton) => {
    boton.addEventListener('click', (e) => {
      const fila = e.target.closest('tr');
      const estudiante = fila.cells[0].innerText;
      alert(`¡Notas y asistencia actualizadas exitosamente para ${estudiante}!`);
    });
  });


  function descargarExcelCalificaciones(datos, nombreArchivo = 'Calificaciones_Asistencia.xlsx') {
    if (!datos || datos.length === 0) {
        alert("No hay datos para exportar a Excel.");
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(datos);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Calificaciones y Asistencia");

    XLSX.writeFile(workbook, nombreArchivo);
}
  document.getElementById('btnExportarExcel')?.addEventListener('click', function() {
    const datosGuardados = obtenerDatosEstudiantes(); 
    descargarExcelCalificaciones(datosGuardados, 'Calificaciones_Estudiantes.xlsx');
});

});
