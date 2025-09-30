import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Check,
  Plus,
  Search,
  X,
  Filter,
} from "lucide-react";

export default function TeamToDoProject() {
  const [expandedSections, setExpandedSections] = useState({
    autor: true,
    aprendizaje: true,
    funcionales: true,
  });

  const [completedRequirements, setCompletedRequirements] = useState([]);
  const [viewMode, setViewMode] = useState("complete");

  const [tareas, setTareas] = useState([
    { id: 1, texto: "Implementar componente Header", autor: "Juan", completada: false },
    { id: 2, texto: "Crear sistema de filtros", autor: "María", completada: true },
    { id: 3, texto: "Diseñar interfaz responsiva", autor: "Juan", completada: false },
  ]);

  const [nuevaTarea, setNuevaTarea] = useState({ texto: "", autor: "" });
  const [filtro, setFiltro] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [filtroAutor, setFiltroAutor] = useState("todos");

  const agregarTarea = (e) => {
    e.preventDefault();

    if (nuevaTarea.texto.trim() === "" || nuevaTarea.autor.trim() === "") {
      alert("Por favor completa ambos campos");
      return;
    }

    const tarea = {
      id: Date.now(),
      texto: nuevaTarea.texto.trim(),
      autor: nuevaTarea.autor.trim(),
      completada: false,
    };

    setTareas([tarea, ...tareas]);
    setNuevaTarea({ texto: "", autor: "" });
  };

  const toggleTareaCompletada = (id) => {
    setTareas(
      tareas.map((tarea) =>
        tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
      )
    );
  };

  const eliminarTarea = (id) => {
    setTareas(tareas.filter((tarea) => tarea.id !== id));
  };

  const tareasFiltradas = tareas.filter((tarea) => {
    const coincideTexto =
      tarea.texto.toLowerCase().includes(filtro.toLowerCase()) ||
      tarea.autor.toLowerCase().includes(filtro.toLowerCase());

    const coincideEstado =
      filtroEstado === "todas" ||
      (filtroEstado === "completadas" && tarea.completada) ||
      (filtroEstado === "pendientes" && !tarea.completada);

    const coincideAutor =
      filtroAutor === "todos" || tarea.autor === filtroAutor;

    return coincideTexto && coincideEstado && coincideAutor;
  });

  const autoresUnicos = [...new Set(tareas.map((t) => t.autor))];

  const progreso = (completedRequirements.length / 8) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-purple-700 text-center mb-6">
          ✅ Gestor de Tareas en Equipo
        </h1>

        {/* Formulario */}
        <form onSubmit={agregarTarea} className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Nueva tarea..."
            value={nuevaTarea.texto}
            onChange={(e) =>
              setNuevaTarea({ ...nuevaTarea, texto: e.target.value })
            }
            className="flex-1 border rounded-lg p-2"
          />
          <input
            type="text"
            placeholder="Autor..."
            value={nuevaTarea.autor}
            onChange={(e) =>
              setNuevaTarea({ ...nuevaTarea, autor: e.target.value })
            }
            className="w-40 border rounded-lg p-2"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
          >
            <Plus size={18} /> Agregar
          </button>
        </form>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center border rounded-lg px-2">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Buscar..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="p-2 outline-none"
            />
          </div>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="todas">Todas</option>
            <option value="completadas">Completadas</option>
            <option value="pendientes">Pendientes</option>
          </select>

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
            <p className="text-gray-500 text-center">No hay tareas 😅</p>
          ) : (
            tareasFiltradas.map((tarea) => (
              <li
                key={tarea.id}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
              >
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
                <button
                  onClick={() => eliminarTarea(tarea.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
