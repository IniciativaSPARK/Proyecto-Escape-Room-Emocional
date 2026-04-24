Este directorio contiene funciones utilitarias (helpers) reutilizables en toda la aplicación.

¿Qué es?
Una carpeta con funciones pequeñas, puras y genéricas que resuelven tareas comunes y repetitivas. 
No dependen del contexto del negocio ni de la base de datos: solo reciben datos y devuelven un resultado.

Flujo básico:
utils/ → funciones helpers → usadas por controllers, services, middlewares, etc.

¿Para qué se usa?

- Formatear datos (fechas, números, strings)
- Validar formatos (email, teléfono, DNI)
- Generar valores (IDs, tokens aleatorios, slugs)
- Transformar o limpiar datos
- Centralizar funciones que se repiten en varios archivos


Diferencia entre lib, utils y services:

Carpeta                 Propósito
lib                     Configura y exporta herramientas/clientes externos (BD, SDKs, APIs)
utils                   Funciones helpers pequeñas y puras (formatear fecha, validar email)
services                Lógica de negocio de tu app (crear usuario, procesar pago)