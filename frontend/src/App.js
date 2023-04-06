import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

// Child components we link to.
import Home from './Home';
import Jobs from './Jobs';
import JobDetail from "./JobDetail";
import RaiseJob from "./RaiseJob";

/**
 * Main page component.
 */
function App() {
  return (
    <>
      <nav className="navbar navbar-dark bg-dark mb-2">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Facilities Management</span>
        </div>
      </nav>
      <div className="container-fluid">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/raise-job" element={<RaiseJob />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App;
