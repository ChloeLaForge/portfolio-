import { Route, Routes, useLocation } from 'react-router-dom';
import { Nav } from './components/Nav';
import { useScrollRestoration } from './lib/useScrollRestoration';
import Home from './pages/Home';
import Notebook from './pages/Notebook';
import BarclayWoods from './pages/BarclayWoods';
import Cs1501 from './pages/Cs1501';
import NotFound from './pages/NotFound';

export default function App() {
  const location = useLocation();
  useScrollRestoration();

  return (
    <div className="shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      {/* Keyed on pathname so each route fades in on its own. */}
      <main id="main" className="route" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/notebook" element={<Notebook />} />
          <Route path="/barclay-woods" element={<BarclayWoods />} />
          <Route path="/cs1501" element={<Cs1501 />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
