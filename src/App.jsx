import React, { useEffect, useState } from 'react';

export default function App() {
  const personas = [
    { id: 1, nombre: 'Luna', emoji: '🌙' },
    { id: 2, nombre: 'Nube', emoji: '☁️' },
    { id: 3, nombre: 'Corazón', emoji: '❤️' },
    { id: 4, nombre: 'Estrella', emoji: '⭐' },
  ];

  const productosIniciales = [
    'Papel cocina',
    'Lavavajillas',
    'Fairy',
    'Bolsas basura',
    'Sanitol',
    'Sal lavavajillas',
    'Abrillantador',
  ].map((nombre) => ({
    nombre,
    registros: [],
  }));

  const [productos, setProductos] = useState(productosIniciales);

  useEffect(() => {
    const guardado = localStorage.getItem('compras');

    if (guardado) {
      setProductos(JSON.parse(guardado));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'compras',
      JSON.stringify(productos)
    );
  }, [productos]);

  const toggleCompra = (productoIndex, personaId) => {
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }

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

  const nuevaRonda = (productoIndex) => {
    setProductos((prev) =>
      prev.map((producto, i) =>
        i === productoIndex
          ? { ...producto, registros: [] }
          : producto
      )
    );
  };

  const reiniciar = () => {
    localStorage.removeItem('compras');
    setProductos(productosIniciales);
  };

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
      )}`,
      '_blank'
    );
  };

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Compras 🛒
          </h1>

          <p style={styles.subtitle}>
            Control de productos del piso
          </p>
        </div>

        <button
          onClick={reiniciar}
          style={styles.resetButton}
        >
          Reiniciar
        </button>
      </div>

      {productos.map((producto, productoIndex) => {
        const faltan = personas.filter(
          (persona) =>
            !producto.registros.includes(persona.id)
        );

        return (
          <div
            key={producto.nombre}
            style={styles.card}
          >
            <div style={styles.cardTop}>
              <div>
                <h2 style={styles.producto}>
                  {producto.nombre}
                </h2>

                <p style={styles.faltan}>
                  Faltan:{' '}
                  {faltan.length === 0
                    ? 'nadie 🎉'
                    : faltan
                        .map((p) => p.nombre)
                        .join(', ')}
                </p>
              </div>

              <button
                onClick={() =>
                  enviarAviso(producto)
                }
                style={styles.alertButton}
              >
                📲
              </button>
            </div>

            <div style={styles.personas}>
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
                      ...styles.personaButton,
                      ...(activo
                        ? styles.personaActiva
                        : {}),
                    }}
                  >
                    <div style={styles.emoji}>
                      {persona.emoji}
                    </div>

                    <div style={styles.nombre}>
                      {persona.nombre}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                nuevaRonda(productoIndex)
              }
              style={styles.roundButton}
            >
              Nueva ronda
            </button>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  app: {
    background:
      'linear-gradient(to bottom, #f8fafc, #e2e8f0)',
    minHeight: '100vh',
    padding: '18px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, sans-serif',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '10px',
  },

  title: {
    margin: 0,
    fontSize: '42px',
    fontWeight: '800',
  },

  subtitle: {
    marginTop: '6px',
    color: '#64748b',
    fontSize: '16px',
  },

  resetButton: {
    border: 'none',
    background: '#111827',
    color: 'white',
    padding: '12px 16px',
    borderRadius: '16px',
    fontSize: '15px',
    fontWeight: '600',
  },

  card: {
    background: 'white',
    borderRadius: '28px',
    padding: '18px',
    marginBottom: '18px',
    boxShadow:
      '0 10px 25px rgba(0,0,0,0.06)',
  },

  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px',
  },

  producto: {
    margin: 0,
    fontSize: '24px',
  },

  faltan: {
    marginTop: '6px',
    color: '#64748b',
    fontSize: '14px',
  },

  alertButton: {
    border: 'none',
    background: '#dcfce7',
    width: '54px',
    height: '54px',
    borderRadius: '18px',
    fontSize: '24px',
  },

  personas: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
  },

  personaButton: {
    border: '2px solid #e5e7eb',
    background: 'white',
    borderRadius: '22px',
    padding: '12px 8px',
    minHeight: '92px',
    transition: '0.2s',
  },

  personaActiva: {
    background: '#d1fae5',
    border: '2px solid #10b981',
    transform: 'scale(1.03)',
  },

  emoji: {
    fontSize: '34px',
    marginBottom: '6px',
  },

  nombre: {
    fontSize: '13px',
    fontWeight: '600',
  },

  roundButton: {
    marginTop: '14px',
    width: '100%',
    border: 'none',
    background: '#f1f5f9',
    padding: '14px',
    borderRadius: '18px',
    fontSize: '15px',
    fontWeight: '600',
  },
};
