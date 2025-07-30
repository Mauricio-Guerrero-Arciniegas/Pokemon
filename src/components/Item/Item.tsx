import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './Item.module.scss'

type Pokemon = {
  id: number
  name: string
  types: string[]
  image: string
}

type Type = {
  slot: number
  type: {
    name: string
    url: string
  }
}

function Item({ url }: { url: string }) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)

  useEffect(() => {
    axios.get(url).then((res) => {
      setPokemon({
        id: res.data.id,
        name: res.data.name,
        types: res.data.types.map((t: Type) => t.type.name),
        image: res.data.sprites.other.dream_world.front_default
      })
    })
  }, [url])

  if (!pokemon) return <p className={styles['pokemon-card__loading']}>Loading...</p>

  return (
    <div className={styles['pokemon-card']}>
      <img
        className={styles['pokemon-card__image']}
        src={pokemon.image}
        alt={pokemon.name}
        width={160}
        height={160}
      />
      <span className={styles['pokemon-card__id']}>
        #{pokemon.id.toString().padStart(3, '0')}
      </span>
      <h2 className={styles['pokemon-card__name']}>{pokemon.name}</h2>
      <div className={styles['pokemon-card__types']}>
        {pokemon.types.map((t) => (
          <span
            key={t}
            className={`${styles['pokemon-card__type']} ${styles[`pokemon-card__type--${t}`]}`}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Item