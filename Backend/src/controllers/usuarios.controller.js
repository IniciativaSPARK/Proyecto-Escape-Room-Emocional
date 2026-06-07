
// En cualquier service o controller:
import {
  getUsuarios as getUsuariosService,
  getUsuarioById as getUsuarioByIdService,
  createUsuario as createUsuarioService,
  updateUsuario as updateUsuarioService,
  deleteUsuario as deleteUsuarioService,
} from '../services/usuarios.service.js';

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await getUsuariosService();
    return res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({ mensaje: 'Error interno al obtener usuarios' });
  }
};

export const getUsuarioById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  try {
    const usuario = await getUsuarioByIdService(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    return res.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario por id:', error);
    return res.status(500).json({ mensaje: 'Error interno al obtener usuario' });
  }
};

export const createUsuario = async (req, res) => {
  const { nombre, email } = req.body;
  if (!nombre || !email) {
    return res.status(400).json({ mensaje: 'Faltan campos requeridos' });
  }

  try {
    const nuevoUsuario = await createUsuarioService({ nombre, email });
    return res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return res.status(500).json({ mensaje: 'Error interno al crear usuario' });
  }
};

export const updateUsuario = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { nombre, email } = req.body;

  if (Number.isNaN(id)) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  if (!nombre || !email) {
    return res.status(400).json({ mensaje: 'Faltan campos requeridos' });
  }

  try {
    const usuarioActualizado = await updateUsuarioService(id, { nombre, email });
    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    return res.json(usuarioActualizado);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return res.status(500).json({ mensaje: 'Error interno al actualizar usuario' });
  }
};

export const deleteUsuario = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  try {
    const usuarioEliminado = await deleteUsuarioService(id);
    if (!usuarioEliminado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    return res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return res.status(500).json({ mensaje: 'Error interno al eliminar usuario' });
  }
};

