Este directorio contiene todas las rutas (endpoints) de la aplicación.¿Qué son?
Son los "caminos" o URLs que expone la API para que el cliente (frontend, app móvil, Postman, etc.) pueda comunicarse con el servidor.

Flujo básico:
Cliente → Ruta (endpoint) → Middleware(s) → Controlador → Response


¿Para qué se usan?

- Definir los endpoints disponibles (URLs) de la app
- Asociar cada URL con su método HTTP (GET, POST, PUT, DELETE, PATCH)
- Conectar cada ruta con su controlador correspondiente
- Aplicar middlewares específicos (auth, validaciones, roles)
- Organizar la API por módulos o recursos (users, products, auth, etc.)

METODOS 
- GET: Obtiene o lee datos del servidor. No modifica nada. Ej: obtener la lista de usuarios.
- POST:  Crea un nuevo recurso en el servidor. Ej: registrar un nuevo usuario.
- PUT: Actualiza un recurso completo (reemplaza todos sus datos). Ej: actualizar toda la info de un usuario.
- DELETE: Elimina un recurso del servidor. Ej: borrar un usuario por su ID.
- PATCH: Actualiza un recurso de forma parcial (solo algunos campos). Ej: cambiar solo el email del usuario.