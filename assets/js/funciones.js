document.addEventListener('DOMContentLoaded', () => {

  // 1. Validar Formulario de Inscripción (contacto.html)
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

      // Validar Nombre
      if (nombre.value.trim().length < 3) {
        nombre.classList.add('is-invalid');
        valido = false;
      } else {
        nombre.classList.remove('is-invalid');
        nombre.classList.add('is-valid');
      }

      // Validar Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        email.classList.add('is-invalid');
        valido = false;
      } else {
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
      }

      // Validar Teléfono (+56912345678)
      const telRegex = /^\+569\d{8}$/;
      if (!telRegex.test(telefono.value.trim())) {
        telefono.classList.add('is-invalid');
        valido = false;
      } else {
        telefono.classList.remove('is-invalid');
        telefono.classList.add('is-valid');
      }

      // Validar Curso
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
  // 1. Obtener la lista de cursos y matrículas guardadas (o array por defecto)
  const cursos = JSON.parse(localStorage.getItem('cursos')) || [];
  const matriculas = JSON.parse(localStorage.getItem('matriculas')) || [];

  // 2. Mostrar la cantidad total de matrículas
  const totalMatriculasElem = document.getElementById('totalMatriculas');
  if (totalMatriculasElem) {
    totalMatriculasElem.textContent = matriculas.length;
  }

  // 3. Contar la cantidad de inscritos por cada curso
  const conteoPorCurso = {};

  // Inicializar conteo para todos los cursos registrados
  cursos.forEach(curso => {
    conteoPorCurso[curso.id] = {
      nombre: curso.nombre,
      codigo: curso.codigo || 'N/A',
      inscritos: 0
    };
  });

  // Contabilizar cada matrícula asociada al ID de un curso
  matriculas.forEach(matricula => {
    if (conteoPorCurso[matricula.cursoId]) {
      conteoPorCurso[matricula.cursoId].inscritos += 1;
    }
  });

  // 4. Renderizar la tabla con los resultados
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

  // Ejecutar la función cuando cargue el documento
  document.addEventListener('DOMContentLoaded', () => {
  cargarReporteMatriculas();
});

  // 2. Simulación de Pasarela de Pago (pago.html)
  const formPago = document.getElementById('formPago');
  if (formPago) {
    formPago.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('¡Pago procesado con éxito! Su matrícula ha sido confirmada.');
      window.location.href = 'estudiante.html';
    });
  }

  // 3. Guardar Calificaciones y Asistencia (profesor.html)
  const botonesGuardar = document.querySelectorAll('main table .btn-primary');
  botonesGuardar.forEach((boton) => {
    boton.addEventListener('click', (e) => {
      const fila = e.target.closest('tr');
      const estudiante = fila.cells[0].innerText;
      alert(`¡Notas y asistencia actualizadas exitosamente para ${estudiante}!`);
    });
  });

  /**
 * Exporta una lista de datos a un archivo Excel (.xlsx)
 * @param {Array<Object>} datos - Lista de objetos con los datos a exportar.
 * @param {string} nombreArchivo - Nombre del archivo Excel a generar.
 */
  function descargarExcelCalificaciones(datos, nombreArchivo = 'Calificaciones_Asistencia.xlsx') {
    if (!datos || datos.length === 0) {
        alert("No hay datos para exportar a Excel.");
        return;
    }

    // 1. Crear una nueva hoja de trabajo a partir del arreglo de datos
    const worksheet = XLSX.utils.json_to_sheet(datos);

    // 2. Crear un libro de trabajo (Workbook) y agregar la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Calificaciones y Asistencia");

    // 3. Generar y descargar el archivo de Excel
    XLSX.writeFile(workbook, nombreArchivo);
}
  document.getElementById('btnExportarExcel')?.addEventListener('click', function() {
    // Obtener los datos actuales desde una variable, tabla o localStorage
    const datosGuardados = obtenerDatosEstudiantes(); 
    descargarExcelCalificaciones(datosGuardados, 'Calificaciones_Estudiantes.xlsx');
});

});
