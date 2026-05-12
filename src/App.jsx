import React, { useEffect, useState } from 'react';

export default function ComprasCompartidas() {
  const personas = [
    { id: 1, nombre: 'Luna', emoji: '🌙' },
    { id: 2, nombre: 'Nube', emoji: '☁️' },
    { id: 3, nombre: 'Corazón', emoji: '❤️' },
    { id: 4, nombre: 'Estrella', emoji: '⭐' },
  ];

  const productosIniciales = [
    { nombre: 'Papel cocina', registros: [] },
    { nombre: 'Lavavajillas', registros: [] },
    { nombre: 'Fairy', registros: [] },
    { nombre: 'Bolsas de basura', registros: [] },
    { nombre: 'Sanitol', registros: [] },
    { nombre: 'Sal lavavajillas', registros: [] },
    { nombre: 'Abrillantador', registros: [] },
  ];

  const [productos, setProductos] = useState(productosIniciales);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(
        'compras-compartidas'
      );

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

  const registrarCompra = (
    productoIndex,
    personaId
  ) => {
    setProductos((prev) =>
      prev.map((producto, i) => {
        if (i !== productoIndex) return producto;

        const registrosActuales =
          producto.registros || [];

        const yaRegistrado =
          registrosActuales.includes(personaId);

        let nuevosRegistros;

        if (yaRegistrado) {
          nuevosRegistros =
            registrosActuales.filter(
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
    localStorage.removeItem(
      'compras-compartidas'
    );

    setProductos(productosIniciales);
  };

  return (
    <div
      style={{
        padding: '12px',
        fontFamily: 'Arial',
        background: '#f3f4f6',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          background: 'white',
          padding: '18px',
          borderRadius: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '36px',
              }}
            >
              Compras compartidas 🛒
            </h1>

            <p
              style={{
                color: '#666',
                marginTop: '10px',
              }}
            >
              Cada dibujo marca quién ha
              comprado ese producto.
            </p>
          </div>

          <button
            onClick={resetear}
            style={{
              padding: '10px 14px',
              borderRadius: '14px',
              border: 'none',
            }}
          >
            Reiniciar
          </button>
        </div>

        <div
          style={{
            overflowX: 'auto',
          }}
        >
          <table
            style={{
              width: '100%',
              minWidth: '650px',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '12px',
                  }}
                >
                  Producto
                </th>

                {personas.map((persona) => (
                  <th
                    key={persona.id}
                    style={{
                      fontSize: '28px',
                      padding: '10px',
                    }}
                  >
                    {persona.emoji}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {productos.map(
                (producto, productoIndex) => (
                  <tr key={producto.nombre}>
                    <td
                      style={{
                        padding: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection:
                            'column',
                          gap: '8px',
                        }}
                      >
                        {producto.nombre}

                        <button
                          onClick={() => {
                            setProductos(
                              (prev) =>
                                prev.map(
                                  (p, idx) => {
                                    if (
                                      idx !==
                                      productoIndex
                                    )
                                      return p;

                                    return {
                                      ...p,
                                      registros: [],
                                    };
                                  }
                                )
                            );
                          }}
                          style={{
                            width: 'fit-content',
                            padding:
                              '6px 10px',
                            borderRadius:
                              '12px',
                            border: 'none',
                            background:
                              '#eee',
                            fontSize: '12px',
                          }}
                        >
                          Nueva ronda
                        </button>
                      </div>
                    </td>

                    {personas.map(
                      (persona) => {
                        const activo = (
                          producto.registros ||
                          []
                        ).includes(
                          persona.id
                        );

                        return (
                          <td
                            key={persona.id}
                            style={{
                              textAlign:
                                'center',
                              padding:
                                '10px',
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
                                width: '56px',
                                height:
                                  '56px',
                                fontSize:
                                  '28px',
                                borderRadius:
                                  '16px',
                                border:
                                  activo
                                    ? '3px solid green'
                                    : '2px solid #ccc',
                                background:
                                  activo
                                    ? '#dcfce7'
                                    : 'white',
                              }}
                            >
                              {
                                persona.emoji
                              }
                            </button>
                          </td>
                        );
                      }
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            marginTop: '20px',
            background: '#eff6ff',
            padding: '16px',
            borderRadius: '16px',
            lineHeight: '1.5',
          }}
        >
          Cada fila funciona por separado.
          <br />
          <br />
          Cuando alguien compra algo,
          pulsa su dibujo.
          <br />
          <br />
          Cuando ese producto se vuelva a
          acabar, pulsa “Nueva ronda”.
        </div>
      </div>
    </div>
  );
}
