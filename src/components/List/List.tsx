import { Link } from 'react-router-dom'
import Item from '../Item/Item'

type Pokemon = {
  name: string
  url: string
}

function List({ pokemons }: { pokemons: Pokemon[] }) {
  return (
    <div className='content'>
      {pokemons.length === 0 && <p>No hay nada que mostrar</p>}

      {pokemons.map(p => (
        <Link key={p.url} to={`/pokedex/${p.name}`}>
          <Item url={p.url} />
        </Link>
      ))}
    </div>
  )
}

export default List