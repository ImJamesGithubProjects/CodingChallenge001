import { useState, useEffect } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

import Spinner from './Spinner';

import api from './api';

function RaiseJobForm({ properties }) {

  const [inputs, setInputs] = useState({
    summary: '',
    description: '',
    property: properties[0].id
  });

  const [errorMsg, setErrorMsg] = useState('');

  // Input handler.
  const handler = e => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  const navigate = useNavigate();

  // Submit handler.
  const handleSubmit = () => {
    // We shouldn't be called if the form isn't valid, but check just in case.
    if (!canSubmit) {
      console.log('Naughty...');
      return;
    }

    // Attempt to raise a new job.
    api.jobs.raise(inputs.summary, inputs.description, inputs.property)
      .then(result => {
        // Check if request was successful.
        if (result?.error) {
          setErrorMsg(result.error);
        } else if (result?.status === 'OK' && result?.job?.id) {
          navigate('/jobs/' + result.job.id); // Show new job.
        }
      });
  }

  // Can the user submit the form?
  const canSubmit = inputs.summary
    && inputs.summary.length <= 150
    && inputs.description
    && inputs.description.length <= 500
    && inputs.property;

  return (
    <div style={{ maxWidth: '500px' }}>
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
      <div className="card">
        <div className="card-body">
          <div>
            <div className="mb-3">
              <label htmlFor="summary" className="form-label">Summary</label>
              <input
                value={inputs.summary}
                onChange={handler}
                type="text"
                className="form-control"
                name="summary"
                aria-describedby="emailHelp"
                maxLength="150"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                name="description"
                value={inputs.description}
                onChange={handler}
                className="form-control"
                rows="6"
                maxLength="500"></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="property" className="form-label">Property</label>
              <select
                name="property"
                value={inputs.property}
                onChange={handler}
                className="form-control">
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <button disabled={!canSubmit} onClick={handleSubmit} className="btn btn-primary">Raise Job</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Raise job page.
 */
export default function RaiseJob() {
  const [properties, setProperties] = useState([]);

  // On initial render...
  useEffect(() => {
    // ...get all properties.
    api.properties.all().then(result => {
      setProperties(result);
    })
  }, []);

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <Link className="breadcrumb-item" to="/">Home</Link>
          <Link className="breadcrumb-item" to="/jobs">Jobs</Link>
          <li className="breadcrumb-item active" aria-current="page">Raise a job</li>
        </ol>
      </nav>
      {properties?.length > 0 ? <RaiseJobForm properties={properties} /> : <Spinner />}
    </>
  );
}

