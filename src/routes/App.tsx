import { Route, Routes } from 'react-router'
import Home from '../components/Home/Home'
import Pokedex from '../components/Pokedex/Pokedex'
import Details from '../components/Details/Details'
import ProtectedRoute from './ProtectedRoute'
import { useEffect, useState } from 'react'
import Loader from '../components/LoaderM/LoaderM'

function App () {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 3500)
    return () => clearTimeout(timeout)
  }, [])

  if (loading) return <Loader />

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
