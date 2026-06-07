import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getUsuarioByEmail } from '../services/auth.service.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || '8h';

if (!JWT_SECRET) {
  throw new Error('Falta la variable de entorno JWT_SECRET en el archivo .env');
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son requeridos' });
    }

    const usuario = await getUsuarioByEmail(email);

    if (!usuario || !usuario.password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        role_id: usuario.role_id,
        organization_id: usuario.organization_id,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({
      token,
      user: {
        id: usuario.id,
        email: usuario.email,
        first_name: usuario.first_name,
        last_name: usuario.last_name,
        role_id: usuario.role_id,
        organization_id: usuario.organization_id,
        is_active: usuario.is_active,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};
