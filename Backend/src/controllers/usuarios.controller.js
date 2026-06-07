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
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await getUsuarioByIdService(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUsuario = async (req, res) => {
  try {
    const { first_name, last_name, email, role_id, organization_id, phone, password } = req.body;
    
    // Validación básica
    if (!first_name || !last_name || !email || !role_id || !organization_id || !password) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: first_name, last_name, email, role_id, organization_id, password' 
      });
    }
    
    const nuevoUsuario = await createUsuarioService({ first_name, last_name, email, role_id, organization_id, phone, password });
    res.status(201).json(nuevoUsuario);
  } 
  
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUsuario = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, is_active } = req.body;
    const usuarioActualizado = await updateUsuarioService(req.params.id, { first_name, last_name, email, phone, is_active });
    if (!usuarioActualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await deleteUsuarioService(req.params.id);
    if (!usuarioEliminado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuarioEliminado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
