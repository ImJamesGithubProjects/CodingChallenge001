import { useState, useEffect } from "react";
import { Link} from "react-router-dom";

import JobStatusBadge from "./JobsStatusBadge";
import Spinner from './Spinner';

import api from './api';

/**
 * Jobs list page.
 */
export default function Jobs() {
  const [jobs, setJobs] = useState([]);

  // On first render...
  useEffect(() => {
    // ...get the list of jobs.
    api.jobs.all().then(jobs => {
      setJobs(jobs);
    })
  }, [])

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">Jobs</li>
        </ol>
      </nav>
      {jobs.length === 0 ? <Spinner /> : <JobsList jobs={jobs} />}
    </>
  );
}

function JobsList({ jobs }) {
  return (
    <>
      <Link to="/raise-job">
        <button className="btn btn-primary btn-sm">Raise</button>
      </Link>
      {jobs.length > 0 ?
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Status</th>
              <th>Property</th>
              <th>Summary</th>
              <th>Raised By</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td>{job.id}</td>
                <td><JobStatusBadge status={job.status.name} /></td>
                <td>{job.property.name}</td>
                <td>{job.summary}</td>
                <td>{job.raised_by.firstname + ' ' + job.raised_by.lastname}</td>
                <td>
                  <Link to={`/jobs/${job.id}`}>
                    <button className="btn btn-sm btn-secondary">View</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        : <div className="alert alert-warning mt-3">No jobs available.</div>
      }
    </>
  );
}

