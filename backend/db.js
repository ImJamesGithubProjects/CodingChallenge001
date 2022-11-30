const db = require('mysql');
const pool = db.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
  insecureAuth: true  // Needed for MySQL 8.
});

/**
 * The NPM "mysql" library doesn't support promises. Let's create our own
 * wrapper so it does.
 */
function query(sql, params) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * Properties DB client.
 */
class Properties {
  /**
   * Get all properties.
   */
  all() {
    const sql = `SELECT id, name FROM properties`;
    return query(sql);
  }
}

/**
 * Jobs DB client
 */
class Jobs {
  /**
   * Get a list of jobs. A job ID can optionally be passed in. For the purposes
   * of this challenge we simply splice the ID into the SQL as an optional
   * WHERE clause. In a real application you might choose to use a query
   * builder or an ORM here.
   */
  async get(id) {
    // If a job ID was passed in, check it's valid.
    if (id) {
      if (!Number.isInteger(id) || id < 1) {
        throw new Error('Invalid job ID');
      }
    }

    // If an ID was passed in, create a WHERE clause for it.
    const extraClause = id ? 'id = ' + id : '1';

    // Set up the SQL we need. We query the v_jobs SQL view so we don't have
    // to write out the joins between various tables here.
    const sql = `
      SELECT
        id,
        summary,
        description,
        status_id,
        status_name,
        property_id,
        property_name,
        raised_by_id,
        raised_by_firstname,
        raised_by_lastname
      FROM
        v_jobs
      WHERE
        ${extraClause}
      ORDER BY
        id ASC
    `;

    // Get the rows from the DB.
    const rows = await query(sql);

    // Apply some structure to the rows.
    const jobs = [];
    for (let row of rows) {
      jobs.push({
        id: row.id,
        summary: row.summary,
        description: row.description,
        status: {
          id: row.status_id,
          name: row.status_name
        },
        property: {
          id: row.property_id,
          name: row.property_name
        },
        raised_by: {
          id: row.raised_by_id,
          firstname: row.raised_by_firstname,
          lastname: row.raised_by_lastname
        }
      });
    }

    return jobs;
  }

  /**
   * Raise a new job. We return the job once it has been created.
   */
  async raise(summary, description, property, raisedBy) {
    // Set up the SQL we need.
    const sql = `
      INSERT INTO jobs (summary, description, status_id, property_id, raised_by)
      VALUES (?, ?, ?, ?, ?)
    `;

    // Perform the insert.
    const result = await query(sql, [
      summary,
      description,
      1,  // Open status. In a real application we would probably use a constant here, e.g. Status.STATUS_OPEN.
      property,
      raisedBy
    ]);

    // Get the job we just raised. For this challenge we simply assume the
    // insert was successful. In a real application we would need to handle
    // failure modes here.
    const jobs = await this.get(result.insertId);

    return jobs[0];
  }
}

/**
 * Database client. Contains two child objects for manipulating jobs and
 * properties. This allows you to write things like:
 *    const jobs = await db.jobs.get();
 */
module.exports = class DB {
  constructor() {
    this.jobs = new Jobs();
    this.properties = new Properties();
  }
}