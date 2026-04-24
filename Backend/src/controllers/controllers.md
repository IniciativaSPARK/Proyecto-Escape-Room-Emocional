Este directorio contiene los controladores de la aplicación.
¿Qué son?
Funciones que reciben la petición del cliente, la procesan (apoyándose en los services) y devuelven una respuesta. Son el puente entre las rutas y la lógica de negocio.

Flujo básico:
Ruta → Controlador → Service → Respuesta al cliente

¿Para qué se usan?

- Recibir la request (req) y enviar la response (res)
- Extraer datos del body, params o query
- Llamar al service correspondiente
- Manejar errores y devolver códigos HTTP adecuados
- Formatear la respuesta que recibe el cliente


Diferencia con el service:
Controlador                             Service
Maneja req y res                        No sabe nada de req/res
Debe ser "delgado" (poca lógica)        Contiene la lógica de negocio
Se enfoca en el flujo HTTP              Se enfoca en los datos y reglas