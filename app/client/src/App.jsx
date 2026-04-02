import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import HomePage from './Pages/HomePage';
import CaseView from './Pages/CaseView';
import SearchView from './Pages/SearchView';
import NotFound from './Pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cases" element={<SearchView />} />
        {/*<Route path="CaseView" element={<CaseView />} /> */}
        <Route path="CaseView/:id" element={<CaseView />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
