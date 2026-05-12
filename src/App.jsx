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
      registros: [],
    },
    {
      nombre: 'Lavavajillas',
      registros: [],
    },
    {
      nombre: 'Fairy',
      registros: [],
    },
    {
      nombre: 'Bolsas de basura',
      registros: [],
    },
    {
      nombre: 'Sanitol',
      registros: [],
    },
    {
      nombre: 'Sal lavavajillas',
      registros: [],
    },
    {
      nombre: 'Abrillantador',
      registros: [],
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

        const yaRegistrado =
          registrosActuales.includes(personaId);

        let nuevosRegistros;

        if (yaRegistrado) {
          nuevosRegistros = registrosActuales.filter(
            (id) => id !== personaId
          );
        } else {
          nuevosRegistros = [
            ...registrosActuales,
            personaId,
          ];
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
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          background: 'white',
          padding: '20px',
          borderRadius: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
          }}
        >
          <div>
            <h1>Compras compartidas 🛒</h1>

            <p>
              Cada dibujo marca quién ha comprado
              ese producto.
            </p>
          </div>

          <button onClick={resetear}>
            Reiniciar
          </button>
        </div>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: 'left',
                  padding: '10px',
                }}
              >
                Producto
              </th>

              {personas.map((persona) => (
                <th
                  key={persona.id}
                  style={{
                    padding: '10px',
                    fontSize: '30px',
                  }}
                >
                  {persona.emoji}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {productos.map((producto, productoIndex) => (
              <tr key={producto.nombre}>
                <td style={{ padding: '10px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <strong>
                      {producto.nombre}
                    </strong>

                    <button
                      onClick={() => {
                        setProductos((prev) =>
                          prev.map((p, idx) => {
                            if (
                              idx !== productoIndex
                            )
                              return p;

                            return {
                              ...p,
                              registros: [],
                            };
                          })
                        );
                      }}
                    >
                      Nueva ronda
                    </button>
                  </div>
                </td>

                {personas.map((persona) => {
                  const activo = (
                    producto.registros || []
                  ).includes(persona.id);

                  return (
                    <td
                      key={persona.id}
                      style={{
                        textAlign: 'center',
                        padding: '10px',
                      }}
                    >
                      <button
                        onClick={() =>
                          registrarCompra(
                            productoIndex,
                            persona.id
                          )
                        }
                        style={{
                          width: '60px',
                          height: '60px',
                          fontSize: '30px',
                          borderRadius: '16px',
                          border: activo
                            ? '3px solid green'
                            : '2px solid #ccc',
                          background: activo
                            ? '#dcfce7'
                            : 'white',
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

        <div
          style={{
            marginTop: '20px',
            background: '#eff6ff',
            padding: '15px',
            borderRadius: '12px',
          }}
        >
          Cada fila funciona por separado.
          <br />
          <br />
          Cuando alguien compra algo, pulsa su
          dibujo.
          <br />
          <br />
          Cuando ese producto se vuelva a acabar,
          pulsa “Nueva ronda”.
        </div>
      </div>
    </div>
  );
}
