/**
 * HTTP handlers. These are all very simple, they pretty much just call the
 * DB client and then format the response as JSON. We mosly assume the DB
 * calls will be successful here. A real application would need to handle
 * various kinds of failure modes gracefully.
 */
module.exports = class Handlers {
  constructor(db) {
    this.db = db;
  }

  /**
   * Get all jobs.
   */
  async getJobs(req, res) {
    const jobs = await this.db.jobs.get();
    res.json({ jobs });
  }
  
  /**
   * Get a single job. Client must send an id parameter.
   */
  async getJob(req, res) {
    // Get job ID from request. If it wasn't passed, it will be undefined.
    // If so, or if an invalid value was passed, jobs.get() will throw an
    // exception.
    const id = req.params.id;

    try {
      // Attempt to get the job.
      const jobs = await this.db.jobs.get(parseInt(id));

      // Check if job was found.
      if (jobs.length !== 1) {
        throw new Error();  // Trigger the catch block below.
      } else {
        res.json({ job: jobs[0] })
      }
    } catch (e) {
      // Job wasn't found, either because an invalid ID was passed or because
      // there is no job with that ID. Either way, send a 404.
      res.status(404).json({ error: 'Job not found' });
    }
  }

  /**
   * Raise a new job. The client must supply summary, description and property
   * parameters. We will add to that the active user's ID from the session.
   */
  async raiseJob(req, res) {
    // Get the parameters from the request.
    const { summary, description, property } = req.body;

    // Check they are valid. In a real application I'd be tempted to create
    // a RaiseJobRequest class that performs validation, then pass an instance
    // of that class to the db client rather than have the validation checks
    // performed individually here.
    if (typeof summary !== 'string' || summary.length < 1 || summary.length > 150) {
      return res.status(400).json({ error: 'Invalid summary' });
    }

    if (typeof description !== 'string' || description.length < 1 || description.length > 500) {
      return res.status(400).json({ error: 'Invalid description' });
    }

    if (parseInt(property < 1)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    // Raise the job.
    const job = await this.db.jobs.raise(
      summary,
      description,
      property,
      req.session.user.id
    );

    // For this challenge we will simply assume the insert succeeded. A real
    // application would need to handle failures gracefully.
    res.json({ status: 'OK', job });
  }

  /**
   * Get all properties.
   */
  async getProperties(req, res) {
    const properties = await this.db.properties.all();
    res.json({ properties });
  }
}
