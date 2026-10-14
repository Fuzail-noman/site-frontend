import { Route, Routes, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Report from './pages/Report.jsx';
import History from './pages/History.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report/:id" element={<Report />} />
        <Route path="/history" element={<History />} />
        <Route
          path="*"
          element={
            <div className="py-24 text-center">
              <p className="text-6xl">🕳️</p>
              <p className="mt-3 text-slate-400">Ye page exist hi nahi karta.</p>
              <Link to="/" className="btn btn-primary mt-6">Home</Link>
            </div>
          }
        />
      </Routes>
    </>
  );
}
