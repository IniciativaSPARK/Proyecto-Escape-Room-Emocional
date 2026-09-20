import { pool } from '../db.js';
import {createUser} from './userService.js';
import {createCredential} from './credentialService.js';

export const registerUser = async (firstName, lastName, email, password) => {

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const newUser = await createUser(firstName, lastName, email, client);

        const newCredential = await createCredential(newUser.id,password,client);

        await client.query('COMMIT');
    }

  catch(error){
    await client.query('ROLLBACK');
    throw error;

  }finally {
    client.release();
  }
}

    








