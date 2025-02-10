import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Flights from "./pages/flights/Flights";
import './App.scss';

function App() {
  return (
    <div className="app">
      <div className="content-container">
        <Router>
          <Routes>
            <Route path="/" element={<Flights />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
