import { Route, Routes } from 'react-router'
import Home from '../components/Home/Home'
import Pokedex from '../components/Pokedex/Pokedex'
import Details from '../components/Details/Details'
import ProtectedRoute from './ProtectedRoute'

function App () {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pokedex" element={<ProtectedRoute />}>
        <Route index element={<Pokedex />} />
        <Route path=":name" element={<Details />} />
      </Route>
      <Route path="*" element={<h2>404 Not Found</h2>} />
    </Routes>
  )
}

export default App
