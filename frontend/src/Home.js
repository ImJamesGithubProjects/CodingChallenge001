import { Link } from "react-router-dom";

/**
 * Home page component. Doesn't do anything other than link to the jobs list
 * for this challenge.
 */
export default function Home() {
  return (
    <Link to="/jobs">Jobs list</Link>
  )
}