/**
 * Properties API client.
 */
class Properties {
  all() {
    return fetch('/api/properties')
      .then(res => res.json())
      .then(result => result.properties);
  }
}

/**
 * Jobs API client.
 */
class Jobs {
  /**
   * Get all jobs.
   */
  all() {
    return fetch('/api/jobs')
      .then(res => res.json())
      .then(result => result.jobs);
  }

  /**
   * Get a job by its ID.
   */
  get(id) {
    return fetch('/api/jobs/' + id)
      .then(res => res.json())
  }

  /**
   * Raise a new job.
   */
  raise(summary, description, property) {
    return fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        summary,
        description,
        property
      })
    }).then(res => res.json());
  }
}

/**
 * API client for the backend. Contains two child objects for manipulating
 * properties and jobs, e.g. you can write things like:
 *    const properties = await api.properties.all();
 */
class API {
  constructor() {
    this.properties = new Properties();
    this.jobs = new Jobs();
  }
}

const api = new API();
export default api;