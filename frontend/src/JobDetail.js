import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import JobStatusBadge from "./JobsStatusBadge";
import Spinner from "./Spinner";
import api from "./api";

function JobDetailTable({ job }) {
  return (
    <table className="table" style={{ maxWidth: '700px' }}>
      <tbody>
        <tr>
          <th>ID</th>
          <td>{job.id}</td>
        </tr>
        <tr>
          <th>Status</th>
          <td><JobStatusBadge status={job.status.name} /></td>
        </tr>
        <tr>
          <th>Property</th>
          <td>{job.property.name}</td>
        </tr>
        <tr>
          <th>Summary</th>
          <td>{job.summary}</td>
        </tr>
        <tr>
          <th style={{ verticalAlign: 'top' }}>Description</th>
          <td>
            <textarea
              className="form-control shadow-none"
              readOnly
              rows="6"
              value={job.description}>
            </textarea>
          </td>
        </tr>
        <tr>
          <th>Raised by</th>
          <td>{job.raised_by.firstname + ' ' + job.raised_by.lastname}</td>
        </tr>
      </tbody>
    </table>
  )
}

/**
 * Job detail page.
 */
export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSpinner, setShowSpinner] = useState(true);

  // On initial render, or when the job ID changes...
  useEffect(() => {
    // ...attempt to get the job.
    api.jobs.get(id).then(result => {
      // Check if a job was returned.
      if (result?.error) {
        setErrorMsg(result.error);  // Set the error message.
      } else {
        setJob(result.job);         // Set the job.
      }
      setShowSpinner(false);        // Either way, turn off spinner.
    });
  }, [id]);

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <Link className="breadcrumb-item" to="/">Home</Link>
          <Link className="breadcrumb-item" to="/jobs">Jobs</Link>
          <li className="breadcrumb-item active" aria-current="page">{id}</li>
        </ol>
      </nav>
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
      {showSpinner && <Spinner />}
      {job && <JobDetailTable job={job} />}
    </>
  )
}