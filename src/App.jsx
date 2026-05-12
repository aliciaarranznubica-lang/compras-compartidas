import React, { useEffect, useState } from 'react';

export default function ComprasCompartidas() {
  const personas = [
    { id: 1, nombre: 'Luna', emoji: '🌙' },
    { id: 2, nombre: 'Nube', emoji: '☁️' },
    { id: 3, nombre: 'Corazón', emoji: '❤️' },
    { id: 4, nombre: 'Estrella', emoji: '⭐' },
  ];

  const productosIniciales = [
    {
      nombre: 'Papel cocina',
      registros: []
    },
    {
      nombre: 'Lavavajillas',
      registros: []
    },
    {
      nombre: 'Fairy',
      registros: []
    },
    {
      nombre: 'Bolsas de basura',
      registros: []
    },
    {
      nombre: 'Sanitol',
      registros: []
    },
    {
      nombre: 'Sal lavavajillas',
      registros: []
    },
    {
      nombre: 'Abrillantador',
      registros: []
    },
  ];

  const [productos, setProductos] = useState(productosIniciales);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem('compras-compartidas');

      if (guardado) {
        setProductos(JSON.parse(guardado));
      }
    } catch (error) {
      console.error(error);
    }

    setCargado(true);
  }, []);

  useEffect(() => {
    if (cargado) {
      localStorage.setItem(
        'compras-compartidas',
        JSON.stringify(productos)
      );
    }
  }, [productos, cargado]);

  const registrarCompra = (productoIndex, personaId) => {
    setProductos((prev) =>
      prev.map((producto, i) => {
        if (i !== productoIndex) return producto;

        const registrosActuales = producto.registros || [];

        const yaRegistrado = registrosActuales.includes(personaId);

        let nuevosRegistros;

        if (yaRegistrado) {
          nuevosRegistros = registrosActuales.filter(
            (id) => id !== personaId
          );
        } else {
          nuevosRegistros = [...registrosActuales, personaId];
        }

        return {
          ...producto,
          registros: nuevosRegistros,
        };
      })
    );
  };

  const resetear = () => {
    localStorage.removeItem('compras-compartidas');
    setProductos(productosIniciales);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Compras compartidas 🛒
            </h1>
            <p className="text-gray-500 mt-2">
              Cada dibujo marca quién ha comprado ese producto en la ronda actual.
            </p>
          </div>

          <button
            onClick={resetear}
            className="bg-black text-white px-5 py-3 rounded-2xl"
          >
            Reiniciar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse overflow-hidden rounded-3xl border">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-4 text-lg">Producto</th>
                {personas.map((persona) => (
                  <th
                    key={persona.id}
                    className="p-4 text-center text-4xl"
                  >
                    {persona.emoji}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {productos.map((producto, productoIndex) => (
                <tr
                  key={producto.nombre}
                  className="border-t"
                >
                  <td className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-lg">
                        {producto.nombre}
                      </span>

                      <button
                        onClick={() => {
                          setProductos((prev) =>
                            prev.map((p, idx) => {
                              if (idx !== productoIndex) return p;

                              return {
                                ...p,
                                registros: [],
                              };
                            })
                          );
                        }}
                        className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-xl whitespace-nowrap"
                      >
                        Nueva ronda
                      </button>
                    </div>
                  </td>

                  {personas.map((persona) => {
                    const activo = (producto.registros || []).includes(persona.id);

                    return (
                      <td
                        key={persona.id}
                        className="p-3 text-center"
                      >
                        <button
                          onClick={() =>
                            registrarCompra(productoIndex, persona.id)
                          }
                          className={w-14 h-14 rounded-2xl text-3xl transition-all border-2 ${
                            activo
                              ? 'bg-green-100 border-green-500 scale-110'
                              : 'bg-white border-gray-200 opacity-60'
                          }}
                        >
                          {persona.emoji}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-gray-700">
          Cada fila funciona por separado.
          
          Cuando alguien compra algo, pulsa su dibujo.
          
          Cuando ese producto se vuelva a acabar, pulsa “Nueva ronda” solo en esa fila.
        </div>
      </div>
    </div>
  );
}
