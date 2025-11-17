const pool = require('../config/db');

class Store {
  static async create(storeData) {
    const { name, email, address } = storeData;
    const query = 'INSERT INTO stores (name, email, address) VALUES (?, ?, ?)';
    const [result] = await pool.query(query, [name, email, address]);
    return result;
  }

  static async getAll() {
    const query = 'SELECT * FROM stores ORDER BY name';
    const [rows] = await pool.query(query);
    return rows;
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM stores WHERE email = ?';
    const [rows] = await pool.query(query, [email]);
    return rows;
  }

  static async search(filters) {
    const { name, address, userId, sortBy, sortOrder } = filters;
    let query = `
      SELECT s.*, (
        SELECT AVG(r.rating) 
        FROM ratings r 
        WHERE r.store_id = s.id
      ) as overall_rating,
      (
        SELECT rating FROM ratings WHERE store_id = s.id AND user_id = ?
      ) as user_rating
      FROM stores s WHERE 1=1`;
    const params = [];
    params.push(userId || null);
    
    if (name) { query += ' AND s.name LIKE ?'; params.push(`%${name}%`); }
    if (address) { query += ' AND s.address LIKE ?'; params.push(`%${address}%`); }

    const validSortColumns = ['name', 'email', 'overall_rating'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'name';
    const order = sortOrder?.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    query += ` ORDER BY ${sortColumn} ${order}`;
    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async getAverageRating(storeId) {
    const query = 'SELECT AVG(rating) as average_rating FROM ratings WHERE store_id = ?';
    const [rows] = await pool.query(query, [storeId]);
    return rows[0];
  }

  static async getRatingsByStore(storeId) {
    const query = `
      SELECT r.rating, u.name as user_name
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
      ORDER BY r.created_at DESC
    `;
    const [rows] = await pool.query(query, [storeId]);
    return rows;
  }
}

module.exports = Store;
