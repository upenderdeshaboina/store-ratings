const pool = require('../config/db');

class User {
  static async create(userData) {
    const { name, email, address, password, role } = userData;
    const query = 'INSERT INTO users (name, email, address, password, role) VALUES (?, ?, ?, ?, ?)';
    const [result] = await pool.query(query, [name, email, address, password, role]);
    return result;
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.query(query, [email]);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows;
  }

  static async updatePassword(id, password) {
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    const [result] = await pool.query(query, [password, id]);
    return result;
  }

  static async getAll() {
    const query = 'SELECT id, name, email, address, role FROM users ORDER BY name';
    const [rows] = await pool.query(query);
    return rows;
  }

  static async getByRole(role) {
    const query = 'SELECT id, name, email, address, role FROM users WHERE role = ? ORDER BY name';
    const [rows] = await pool.query(query, [role]);
    return rows;
  }

  static async search(filters) {
    const { name, email, address, role, sortBy, sortOrder } = filters;

    let query = `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.address, 
        u.role,
        (
          CASE 
            WHEN u.role = 'store_owner' THEN (
              SELECT AVG(r.rating) 
              FROM ratings r
              JOIN stores s ON r.store_id = s.id
              WHERE s.email = u.email
            )
            ELSE NULL
          END
        ) as rating
      FROM users u 
      WHERE 1=1
    `;
    const params = [];

    if (name) { query += ' AND u.name LIKE ?'; params.push(`%${name}%`); }
    if (email) { query += ' AND u.email LIKE ?'; params.push(`%${email}%`); }
    if (address) { query += ' AND u.address LIKE ?'; params.push(`%${address}%`); }
    if (role) { query += ' AND u.role = ?'; params.push(role); }

    const validSortColumns = ['name', 'email', 'role', 'rating'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'name';
    const order = sortOrder?.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const finalSortColumn = sortColumn === 'rating' ? 'rating' : `u.${sortColumn}`;

    query += ` ORDER BY ${finalSortColumn} ${order}`;

    const [rows] = await pool.query(query, params);
    return rows;
  }
}

module.exports = User;
