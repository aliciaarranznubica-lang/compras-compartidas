import React, { useEffect, useState } from 'react';

export default function ComprasCompartidas() {
  const personas = [
    {
      id: 1,
      nombre: 'Luna',
      emoji: '🌙',
      color: '#fde68a',
    },
    {
      id: 2,
      nombre: 'Nube',
      emoji: '☁️',
      color: '#bfdbfe',
    },
    {
      id: 3,
      nombre: 'Corazón',
      emoji: '❤️',
      color: '#fecaca',
    },
    {
      id: 4,
      nombre: 'Estrella',
      emoji: '⭐',
      color: '#fde68a',
    },
  ];

  const productosIniciales = [
    'Papel cocina',
    'Lavavajillas',
    'Fairy',
    'Bolsas de basura',
    'Sanitol',
    'Sal lavavajillas',
    'Abrillantador',
  ].map((nombre) => ({
    nombre,
    registros: [],
  }));

  const [productos, setProductos] = useState(
    productosIniciales
  );

  // CARGAR DATOS

  useEffect(() => {
    const guardado = localStorage.getItem(
      'compras-compartidas'
    );

    if (guardado) {
      setProductos(JSON.parse(guardado));
    }
  }, []);

  // GUARDAR DATOS

  useEffect(() => {
    localStorage.setItem(
      'compras-compartidas',
      JSON.stringify(productos)
    );
  }, [productos]);

  // MARCAR / DESMARCAR COMPRA

  const toggleCompra = (
    productoIndex,
    personaId
  ) => {
    setProductos((prev) =>
      prev.map((producto, i) => {
        if (i !== productoIndex) return producto;

        const existe =
          producto.registros.includes(personaId);

        return {
          ...producto,
          registros: existe
            ? producto.registros.filter(
                (id) => id !== personaId
              )
            : [...producto.registros, personaId],
        };
      })
    );
  };

  // NUEVA RONDA

  const nuevaRonda = (productoIndex) => {
    setProductos((prev) =>
      prev.map((producto, i) =>
        i === productoIndex
          ? { ...producto, registros: [] }
          : producto
      )
    );
  };

  // REINICIAR TODO

  const reiniciarTodo = () => {
    localStorage.removeItem(
      'compras-compartidas'
    );

    setProductos(productosIniciales);
  };

  // ENVIAR WHATSAPP

  const enviarAviso = (producto) => {
    const faltan = personas
      .filter(
        (persona) =>
          !producto.registros.includes(persona.id)
      )
      .map((p) => `${p.emoji} ${p.nombre}`)
      .join('\n');

    const mensaje = `🛒 FALTA COMPRAR

${producto.nombre}

Pendientes:
${faltan}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        mensaje
      )}`
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(to bottom, #f8fafc, #eef2ff)',
        padding: '20px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '700px',
          margin: '0 auto',
        }}
      >
        {/* HEADER */}

        <div
          style={{
            background: 'white',
            borderRadius: '28px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow:
              '0 10px 30px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: '38px',
                  lineHeight: '1',
                }}
              >
                Compras 🛒
              </h1>

              <p
                style={{
                  marginTop: '10px',
                  color: '#64748b',
                  lineHeight: '1.5',
                }}
              >
                Marca quién ha comprado cada
                producto.
              </p>
            </div>

            <button
              onClick={reiniciarTodo}
              style={{
                border: 'none',
                background: '#111827',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '16px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Reiniciar
            </button>
          </div>
        </div>

        {/* PRODUCTOS */}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {productos.map(
            (producto, productoIndex) => (
              <div
                key={producto.nombre}
                style={{
                  background: 'white',
                  borderRadius: '24px',
                  padding: '20px',
                  boxShadow:
                    '0 8px 24px rgba(0,0,0,0.05)',
                }}
              >
                {/* CABECERA PRODUCTO */}

                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    alignItems: 'center',
                    marginBottom: '18px',
                    gap: '10px',
                    flexWrap: 'wrap',
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: '22px',
                    }}
                  >
                    {producto.nombre}
                  </h2>

                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      onClick={() =>
                        enviarAviso(producto)
                      }
                      style={{
                        border: 'none',
                        background: '#dcfce7',
                        padding: '10px 14px',
                        borderRadius: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        color: '#166534',
                      }}
                    >
                      📲 Avisar
                    </button>

                    <button
                      onClick={() =>
                        nuevaRonda(productoIndex)
                      }
                      style={{
                        border: 'none',
                        background: '#f1f5f9',
                        padding: '10px 14px',
                        borderRadius: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        color: '#334155',
                      }}
                    >
                      Nueva ronda
                    </button>
                  </div>
                </div>

                {/* PERSONAS */}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(4, 1fr)',
                    gap: '12px',
                  }}
                >
                  {personas.map((persona) => {
                    const activo =
                      producto.registros.includes(
                        persona.id
                      );

                    return (
                      <button
                        key={persona.id}
                        onClick={() =>
                          toggleCompra(
                            productoIndex,
                            persona.id
                          )
                        }
                        style={{
                          border: activo
                            ? `3px solid ${persona.color}`
                            : '2px solid #e5e7eb',
                          background: activo
                            ? persona.color
                            : 'white',
                          borderRadius: '22px',
                          padding: '14px 8px',
                          cursor: 'pointer',
                          transition: '0.2s',
                          transform: activo
                            ? 'scale(1.05)'
                            : 'scale(1)',
                          boxShadow: activo
                            ? '0 6px 18px rgba(0,0,0,0.08)'
                            : 'none',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '34px',
                            marginBottom: '6px',
                          }}
                        >
                          {persona.emoji}
                        </div>

                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#475569',
                          }}
                        >
                          {persona.nombre}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* RESUMEN */}

                <div
                  style={{
                    marginTop: '16px',
                    fontSize: '14px',
                    color: '#64748b',
                  }}
                >
                  Han comprado:{' '}
                  {producto.registros.length}/
                  {personas.length}
                </div>
              </div>
            )
          )}
        </div>

        {/* INFO */}

        <div
          style={{
            marginTop: '24px',
            background: 'white',
            borderRadius: '24px',
            padding: '20px',
            color: '#64748b',
            lineHeight: '1.7',
            boxShadow:
              '0 8px 24px rgba(0,0,0,0.05)',
          }}
        >
          <strong
            style={{
              color: '#111827',
            }}
          >
            Cómo funciona
          </strong>

          <br />
          <br />

          • Pulsa un emoji cuando alguien
          compre ese producto.
          <br />
          • Cuando se vuelva a acabar,
          pulsa “Nueva ronda”.
          <br />
          • “📲 Avisar” abre WhatsApp con
          el mensaje preparado.
          <br />
          • Todo se guarda automáticamente.
        </div>
      </div>
    </div>
  );
}
