import { useEffect, useState } from 'react'
import { useName } from '../../context/nameContext'
import axios from 'axios'
import List from '../List/List'
import styles from './Pokedex.module.scss'

const defaultType = {
  'ghost': 'Fantasma',
  'dark': 'Siniestro',
  'electric': 'Eléctrico',
  'normal': 'Normal',
  'fire': 'Fuego',
  'psychic': 'Psíquico',
  'flying': 'Volador',
  'steel': 'Acero',
  'poison': 'Veneno',
  'dragon': 'Dragón',
  'water': 'Agua',
  'ice': 'Hielo',
  'rock': 'Roca',
  'fighting': 'Lucha',
  'grass': 'Planta',
  'bug': 'Bicho',
  'ground': 'Tierra',
  'fairy': 'Hada',
}

type Pokemon = {
  name: string
  url: string
}

type TypeFiltered = {
  pokemon: {
    name: string
    url: string
  }
  slot: number
}

const baseUrl = 'https://pokeapi.co/api/v2/'

function Pokedex() {
  const { name } = useName()
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [typeFiltered, setTypeFiltered] = useState<Pokemon[]>([])
  const [value, setValue] = useState<string>('')
  const [type, setType] = useState<string>('')
  const [page, setPage] = useState(1)

  const itemsPerPage = 12

  useEffect(() => {
    axios.get(`${baseUrl}/pokemon?limit=649`)
      .then(res => {
        setPokemons(res.data.results)
      })
  }, [])

  useEffect(() => {
    if (!type) return
    axios.get(`${baseUrl}/type/${type}`)
      .then(res => {
        const filteredNames = res.data.pokemon.map((e: TypeFiltered) => e.pokemon.name)
        setTypeFiltered(pokemons.filter(p => filteredNames.includes(p.name)))
      })
  }, [type, pokemons])

  useEffect(() => {
    setPage(1)
  }, [value, type])

  const filtered = (type ? typeFiltered : pokemons).filter(p =>
    p.name.toLowerCase().includes(value.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginatedItems = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const goToPage = (current: number) => {
    setPage(Math.max(1, Math.min(current, totalPages)))
  }

  const range = []
  const maxVisibleButtons = 7
  const half = Math.floor(maxVisibleButtons / 2)
  let start = Math.max(1, page - half)
  let end = start + maxVisibleButtons - 1

  if (end > totalPages) {
    end = totalPages
    start = Math.max(1, end - maxVisibleButtons + 1)
  }

  for (let i = start; i <= end; i++) {
    range.push(i)
  }

  return (
    <div className={`${styles.container} ${styles['fade-in']}`}>
      <div className={styles.card}>
        <header>
          <h2>{name}, ya estás en tu Pokedex.</h2>
          <h3>Desde aquí puedes obtener datos acerca de tus Pokemon favoritos, filtra tu busqueda por tipo:</h3>
        </header>

        <form>
          <input
            type="text"
            placeholder="Search..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All</option>
            {Object.keys(defaultType).map((type: string) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </form>

        <List pokemons={paginatedItems} />

        <div className={styles.pagination}>
          <span>{page} de {totalPages}</span>
          <div>
            <button onClick={() => goToPage(page - 1)} disabled={page === 1}>prev</button>
            {range.map(n => (
              <button
                key={n}
                className={n === page ? 'active' : ''}
                onClick={() => goToPage(n)}
              >
                {n}
              </button>
            ))}
            <button onClick={() => goToPage(page + 1)} disabled={page === totalPages}>next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pokedex