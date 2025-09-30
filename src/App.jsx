import { useState } from "react"; 
// Importamos el hook useState de React para manejar estados

export default function TeamToDoProject() {
  // Estado que controla secciones desplegadas (a futuro)
  const [expandedSections, setExpandedSections] = useState({
    autor: true,
    aprendizaje: true,
    funcionales: true,
  });

  // Estado para requisitos completados (se usa en el progreso)
  const [completedRequirements, setCompletedRequirements] = useState([]);
  // Estado para el modo de vista (no se usa en el JSX actual)
  const [viewMode, setViewMode] = useState("complete");

  // Lista de tareas iniciales
  const [tareas, setTareas] = useState([
    { id: 1, texto: "Implementar componente Header", autor: "Juan", completada: false },
    { id: 2, texto: "Crear sistema de filtros", autor: "María", completada: true },
    { id: 3, texto: "Diseñar interfaz responsiva", autor: "Juan", completada: false },
  ]);

  // Estado para manejar inputs de una nueva tarea
  const [nuevaTarea, setNuevaTarea] = useState({ texto: "", autor: "" });

  // Estados para filtros
  const [filtro, setFiltro] = useState("");           // búsqueda por texto
  const [filtroEstado, setFiltroEstado] = useState("todas"); // todas, completadas o pendientes
  const [filtroAutor, setFiltroAutor] = useState("todos");   // filtrar por autor

  // Estados para edición de tareas
  const [editando, setEditando] = useState(null);     // id de tarea en edición
  const [textoEditado, setTextoEditado] = useState(""); 
  const [autorEditado, setAutorEditado] = useState("");

  //  Función: agregar tarea nueva
  const agregarTarea = () => {
    if (nuevaTarea.texto.trim() === "" || nuevaTarea.autor.trim() === "") {
      alert("Por favor completa ambos campos");
      return;
    }

    const tarea = {
      id: Date.now(),                  // id único
      texto: nuevaTarea.texto.trim(),  // texto de la tarea
      autor: nuevaTarea.autor.trim(),  // autor
      completada: false,               // siempre comienza pendiente
    };

    setTareas([tarea, ...tareas]);     // agregamos al inicio
    setNuevaTarea({ texto: "", autor: "" }); // limpiamos inputs
  };

  // Función: marcar o desmarcar tarea completada
  const toggleTareaCompletada = (id) => {
    setTareas(
      tareas.map((tarea) =>
        tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
      )
    );
  };

  // Función: eliminar tarea por id
  const eliminarTarea = (id) => {
    setTareas(tareas.filter((tarea) => tarea.id !== id));
  };

  //  Función: iniciar edición de una tarea
  const iniciarEdicion = (tarea) => {
    setEditando(tarea.id);       // guardamos id de tarea
    setTextoEditado(tarea.texto);
    setAutorEditado(tarea.autor);
  };

  //  Función: guardar cambios en edición
  const guardarEdicion = (id) => {
    if (textoEditado.trim() === "" || autorEditado.trim() === "") {
      alert("Por favor completa ambos campos");
      return;
    }

    setTareas(
      tareas.map((tarea) =>
        tarea.id === id
          ? { ...tarea, texto: textoEditado.trim(), autor: autorEditado.trim() }
          : tarea
      )
    );
    setEditando(null);       // salir del modo edición
    setTextoEditado("");
    setAutorEditado("");
  };

  //  Función: cancelar la edición actual
  const cancelarEdicion = () => {
    setEditando(null);
    setTextoEditado("");
    setAutorEditado("");
  };

  // Filtros de tareas
  const tareasFiltradas = tareas.filter((tarea) => {
    // filtro por texto (en tarea o autor)
    const coincideTexto =
      tarea.texto.toLowerCase().includes(filtro.toLowerCase()) ||
      tarea.autor.toLowerCase().includes(filtro.toLowerCase());

    // filtro por estado
    const coincideEstado =
      filtroEstado === "todas" ||
      (filtroEstado === "completadas" && tarea.completada) ||
      (filtroEstado === "pendientes" && !tarea.completada);

    // filtro por autor
    const coincideAutor =
      filtroAutor === "todos" || tarea.autor === filtroAutor;

    return coincideTexto && coincideEstado && coincideAutor;
  });

  // Autores únicos para desplegar en <select>
  const autoresUnicos = [...new Set(tareas.map((t) => t.autor))];

  // Progreso de requisitos (se calcula pero no se usa en el JSX)
  const progreso = (completedRequirements.length / 8) * 100;

  // ================================
  // JSX (lo que se renderiza en pantalla)
  // ================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-purple-700 text-center mb-6">
          ✅ Gestor de Tareas en Equipo
        </h1>

        {/* Formulario para agregar nueva tarea */}
        <div className="flex gap-3 mb-6">
          {/* input texto */}
          <input
            type="text"
            placeholder="Nueva tarea..."
            value={nuevaTarea.texto}
            onChange={(e) =>
              setNuevaTarea({ ...nuevaTarea, texto: e.target.value })
            }
            onKeyPress={(e) => e.key === 'Enter' && agregarTarea()}
            className="flex-1 border rounded-lg p-2"
          />
          {/* input autor */}
          <input
            type="text"
            placeholder="Autor..."
            value={nuevaTarea.autor}
            onChange={(e) =>
              setNuevaTarea({ ...nuevaTarea, autor: e.target.value })
            }
            onKeyPress={(e) => e.key === 'Enter' && agregarTarea()}
            className="w-40 border rounded-lg p-2"
          />
          {/* botón agregar */}
          <button
            onClick={agregarTarea}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
          >
            <span className="text-lg">+</span> Agregar
          </button>
        </div>

        {/* Controles de filtros */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Filtro de búsqueda */}
          <div className="flex items-center border rounded-lg px-2">
            <span className="text-gray-500">🔍</span>
            <input
              type="text"
              placeholder="Buscar..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="p-2 outline-none"
            />
          </div>

          {/* Filtro por estado */}
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="todas">Todas</option>
            <option value="completadas">Completadas</option>
            <option value="pendientes">Pendientes</option>
          </select>

          {/* Filtro por autor */}
          <select
            value={filtroAutor}
            onChange={(e) => setFiltroAutor(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="todos">Todos</option>
            {autoresUnicos.map((autor) => (
              <option key={autor} value={autor}>
                {autor}
              </option>
            ))}
          </select>
        </div>

        {/* Lista de tareas */}
        <ul className="space-y-3">
          {tareasFiltradas.length === 0 ? (
            <p className="text-gray-500 text-center">No hay tareas</p>
          ) : (
            tareasFiltradas.map((tarea) => (
              <li
                key={tarea.id}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
              >
                {editando === tarea.id ? (
                  // Vista de edición
                  <>
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={tarea.completada}
                        onChange={() => toggleTareaCompletada(tarea.id)}
                      />
                      <input
                        type="text"
                        value={textoEditado}
                        onChange={(e) => setTextoEditado(e.target.value)}
                        className="flex-1 border rounded p-1 px-2"
                        autoFocus
                      />
                      <input
                        type="text"
                        value={autorEditado}
                        onChange={(e) => setAutorEditado(e.target.value)}
                        className="w-32 border rounded p-1 px-2"
                      />
                    </div>
                    <div className="flex gap-2">
                      {/* Guardar cambios */}
                      <button
                        onClick={() => guardarEdicion(tarea.id)}
                        className="text-green-600 hover:text-green-800 text-xl"
                      >
                        ✓
                      </button>
                      {/* Cancelar edición */}
                      <button
                        onClick={cancelarEdicion}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                      >
                        ✕
                      </button>
                    </div>
                  </>
                ) : (
                  // Vista normal de la tarea
                  <>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={tarea.completada}
                        onChange={() => toggleTareaCompletada(tarea.id)}
                      />
                      <span
                        className={`${
                          tarea.completada ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {tarea.texto} <span className="text-sm">({tarea.autor})</span>
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {/* Editar */}
                      <button
                        onClick={() => iniciarEdicion(tarea)}
                        className="text-blue-500 hover:text-blue-700 text-lg"
                      >
                        ✏️
                      </button>
                      {/* Eliminar */}
                      <button
                        onClick={() => eliminarTarea(tarea.id)}
                        className="text-red-500 hover:text-red-700 text-xl"
                      >
                        ✕
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
