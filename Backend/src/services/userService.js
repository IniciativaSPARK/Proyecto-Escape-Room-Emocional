import pool from '../lib/db.js';


export const getUserById = async (id) =>{
    const query = 'SELECT * FROM users where id = $1';
    const result = await pool.query(query, [id]);

    return result.rows[0];
};

export const deleteUserById = async (id) =>{

    const query =  'Delete from users where id = $1 RETURNING *';
    const result =await pool.query(query,[id]); 
    return result.rows[0];
};

export const updateUser = async (id,first_name,last_name,email) => {
    const query = 'Update users set first_name = $1, last_name = $2, email = $3 where id = $4 RETURNING *';
    const result = await pool.query(query, [first_name, last_name, email, id]);
    return result.rows[0];
}


export const createUser = async(firstName, lastName, email, client = pool) =>{
const query = 'INSERT INTO users (first_name, last_name, email) VALUES ($1, $2, $3) RETURNING * ';
const result = await client.query(query, [firstName, lastName, email]);
return result.rows[0];
};


