/**
 * A badge component for job status.
 */
export default function JobStatusBadge({ status }) {
  const options = {
    'Open': 'bg-success',
    // More options would be needed for a full application. We only need Open here.
  }

  const color = options[status] || 'bg-dark';

  return <span className={'badge ' + color}>{status}</span>;
}