let usuarios = [
  { id: 1, nombre: 'Ana García', email: 'ana@spark.com' },
  { id: 2, nombre: 'Luis Martínez', email: 'luis@spark.com' }
]; 

let nextId = 3;

export const getUsuarios = (req, res) => {
  res.json(usuarios);
};

export const getUsuarioById = (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find(u => u.id === id);
  
  if (!usuario) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }
  
  res.json(usuario);
};

export const createUsuario = (req, res) => {
  const { nombre, email } = req.body;
  
  if (!nombre || !email) {
    return res.status(400).json({ mensaje: 'Faltan campos requeridos' });
  }
  
  const nuevoUsuario = { id: nextId++, nombre, email };
  usuarios.push(nuevoUsuario);
  
  res.status(201).json(nuevoUsuario);
};

export const updateUsuario = (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, email } = req.body;
  const index = usuarios.findIndex(u => u.id === id);
  
  if (index === -1) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }
  
  usuarios[index] = { ...usuarios[index], nombre, email };
  res.json(usuarios[index]);
};

export const deleteUsuario = (req, res) => {
  const id = parseInt(req.params.id);
  const index = usuarios.findIndex(u => u.id === id);
  
  if (index === -1) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }
  
  usuarios.splice(index, 1);
  res.status(204).send();
};