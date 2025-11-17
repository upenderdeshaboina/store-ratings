const pool = require('../config/db');

class Rating {
  static async create(ratingData) {
    const { user_id, store_id, rating } = ratingData;
    const query = 'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?';
    const [result] = await pool.query(query, [user_id, store_id, rating, rating]);
    return result;
  }

  static async getByUserAndStore(userId, storeId) {
    const query = 'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?';
    const [rows] = await pool.query(query, [userId, storeId]);
    return rows;
  }

  static async getTotalCount() {
    const query = 'SELECT COUNT(*) as total_ratings FROM ratings';
    const [rows] = await pool.query(query);
    return rows[0];
  }

  static async getUserRatingForStores(userId) {
    const query = `
      SELECT
        s.id,
        s.name,
        s.address,
        (SELECT AVG(rating) FROM ratings WHERE store_id = s.id) as overall_rating,
        (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = ?) as user_rating
      FROM stores s
      ORDER BY s.name
    `;
    const [rows] = await pool.query(query, [userId]);
    return rows;
  }

  static async getAllRatings(options = {}) {
    const { sortBy, sortOrder } = options;
    const query = `
      SELECT
        r.id,
        r.rating,
        r.created_at,
        u.name as user_name,
        s.name as store_name
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      JOIN stores s ON r.store_id = s.id
    `;

    const validSortColumns = ['user_name', 'store_name', 'rating', 'created_at'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const [rows] = await pool.query(`${query} ORDER BY ${sortColumn} ${order}`);
    return rows;
  }
}

module.exports = Rating;
