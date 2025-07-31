import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import styles from './Details.module.scss'

type Types = {
  slot: number
  type: {
    name: string
    url: string
  }
}

type Abilities = {
  ability: {
    name: string
    url: string 
  }
  is_hidden: boolean
  slot: number
}

type Moves = {
  move: {
    name: string
    url: string
  }
  version_group_details: VersionGroupDetail[]
}

export interface VersionGroupDetail {
  level_learned_at: number
  move_learn_method: {
    name: string
    url: string
  }
  order: any
  version_group: {
    name: string
    url: string
  }
}

type Pokemon = {
  id: number
  name: string
  types: string[]
  image: string
  stats: {
    hp: number
    attack: number
    defense: number
    speed: number
  }
  abilities: string[]
  moves: string[]
}

const baseUrl = 'https://pokeapi.co/api/v2/'

function Details() {
  const { name } = useParams()
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)

  useEffect(() => {
    axios.get(`${baseUrl}/pokemon/${name}`).then((res) => {
      setPokemon({
        id: res.data.id,
        name: res.data.name,
        types: res.data.types.map((t: Types) => t.type.name),
        abilities: res.data.abilities.map((a: Abilities) => a.ability.name),
        moves: res.data.moves.map((m: Moves) => m.move.name).slice(0, 20),
        image: res.data.sprites.other.dream_world.front_default,
        stats: {
          hp: res.data.stats[0].base_stat,
          attack: res.data.stats[1].base_stat,
          defense: res.data.stats[2].base_stat,
          speed: res.data.stats[5].base_stat
        }
      })
    })
  }, [])

  if (!pokemon) return <p className={styles.loading}>Loading pokemon page...</p>

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Branding Header */}
        <div className={styles.branding}>
          <h1 className={styles.brandTitle}>Pokemon information</h1>
          <span className={styles.brandTagline}>Discover your favorite Pokémon</span>
        </div>

        <header className={styles.header}>
          <Link to='/pokedex' className={styles.back}>
            ← Volver
          </Link>
        </header>

        <div className={styles.summary}>
          <span className={styles.id}>#{pokemon.id.toString().padStart(3, '0')}</span>
          <h1 className={styles.name}>{pokemon.name}</h1>
          <img className={styles.image} src={pokemon.image} alt={pokemon.name} />
        </div>

        <div className={styles.section}>
          <h2>Types</h2>
          <ul className={styles.list}>
            {pokemon.types.map((t) => (
              <li className={`${styles.type} ${styles[`type--${t}`]}`} key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h2>Abilities</h2>
          <ul className={styles.list}>
            {pokemon.abilities.map((a) => (
              <li className={styles.ability} key={a}>{a}</li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h2>Stats</h2>
          <ul className={styles.stats}>
            <li>HP: {pokemon.stats.hp}</li>
            <li>Attack: {pokemon.stats.attack}</li>
            <li>Defense: {pokemon.stats.defense}</li>
            <li>Speed: {pokemon.stats.speed}</li>
          </ul>
        </div>
        
        <div className={styles.section}>
          <h2>Moves</h2>
          <ol className={styles.moves}>
            {pokemon.moves.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ol>
        </div>
      </motion.div>
    </div>
  )
}

export default Details