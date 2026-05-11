Este directorio contiene librerías, clientes y configuraciones personalizadas que se usan en toda la aplicación.

¿Qué es?
Una carpeta para código reutilizable que inicializa o envuelve herramientas externas (clientes de base de datos, SDKs de terceros, utilidades personalizadas). 
Es el lugar donde se configuran y exportan instancias que luego otras partes de la app importarán.

Flujo básico:
lib/ → inicializa/configura → es importado por services, controllers, etc.

¿Para qué se usa?

- Inicializar clientes de base de datos (Prisma, Mongoose, Supabase)
- Configurar SDKs de terceros (Stripe, Firebase, AWS, OpenAI)
- Crear clientes para APIs externas (instancias de Axios con URL base/headers)
- Centralizar la lógica de conexión reutilizable
- Evitar repetir configuraciones en varios archivos


Diferencia entre lib, utils y services:

Carpeta                 Propósito
lib                     Configura y exporta herramientas/clientes externos (BD, SDKs, APIs)
utils                   Funciones helpers pequeñas y puras (formatear fecha, validar email)
services                Lógica de negocio de tu app (crear usuario, procesar pago)


---

Ejemplo de uso — db.js (conexión a la base de datos)

db.js inicializa el pool de conexiones a Neon PostgreSQL usando la variable DATABASE_URL del .env.
Solo se configura una vez aquí y se importa donde sea necesario.

// En cualquier service o controller:
import pool from '../lib/db.js';

// Consulta simple
const resultado = await pool.query('SELECT * FROM usuarios');
console.log(resultado.rows);

// Consulta con parámetros (evita SQL injection)
const { rows } = await pool.query(
  'SELECT * FROM usuarios WHERE id = $1',
  [usuarioId]
);
console.log(rows[0]);

// Insertar un registro
await pool.query(
  'INSERT INTO usuarios (nombre, email) VALUES ($1, $2)',
  [nombre, email]
);