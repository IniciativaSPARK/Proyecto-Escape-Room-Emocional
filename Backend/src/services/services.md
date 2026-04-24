Este directorio contiene los servicios de la aplicación.

¿Qué son?
Funciones encargadas de la lógica de negocio y la comunicación con fuentes de datos (base de datos, APIs externas, etc.). Son el "cerebro" que procesa la información antes de devolverla al controlador.

Flujo básico:
Ruta → Controlador → Service → Base de datos / API externa

¿Para qué se usan?

- Separar la lógica de negocio de los controladores
- Consultar, crear, actualizar o eliminar datos en la BD
- Consumir APIs externas (pagos, emails, terceros)
- Aplicar reglas de negocio (cálculos, validaciones complejas)
- Reutilizar código en varios controladores
- Facilitar el testeo unitario


Diferencia con el controlador:
Controlador                                     Service
Recibe la petición y devuelve la respuesta      Procesa la lógica y los datos
Se comunica con el cliente (req/res)            Se comunica con la BD o APIs
Debe ser "delgado"                              Contiene la lógica pesada