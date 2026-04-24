Este directorio contiene los middlewares de la aplicación.
¿Qué son?
Funciones intermedias que se ejecutan antes (o después) de la función principal/controlador, actuando como un "filtro" en el flujo de la petición.

Flujo básico:
Request → Middleware(s) → Controlador → Response

¿Para qué se usan?

- Verificar si el usuario está autenticado (JWT, sesión, etc.)
- Validar roles y permisos (admin, user, guest)
- Validar el formato o tipo de datos del input (body, params, query)
- Registrar logs de las peticiones
- Manejar errores de forma centralizada
- Limitar peticiones (rate limiting)
- Sanitizar datos de entrada