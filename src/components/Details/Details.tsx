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

interface VersionGroupDetail {
  level_learned_at: number
  move_learn_method: {
    name: string
    url: string
  }
  version_group: {
    name: string
    url: string
  }
}

type Pokemon = {
  name: string
  id: number
  image: string
  height: number
  weight: number
  types: string[]
  stats: {
    hp: number
    attack: number
    defense: number
    speed: number
  }
  abilities: {
    name: string
    url: string
  }[]
  moves: {
    name: string
    level: number
  }[]
}

const baseUrl = 'https://pokeapi.co/api/v2/'

function Details() {
  const { name } = useParams()
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [abilitiesEs, setAbilitiesEs] = useState<string[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await axios.get(`${baseUrl}/pokemon/${name}`)
        const data = res.data

        const levelUpMoves = data.moves
          .flatMap((m: Moves) =>
            m.version_group_details
              .filter((v) => v.move_learn_method.name === 'level-up')
              .map((v) => ({
                name: m.move.name,
                level: v.level_learned_at
              }))
          )
          .filter((m: { name: string; level: number }) => m.level > 0)
          .sort((a: { name: string; level: number }, b: { name: string; level: number }) => a.level - b.level)

        const abilitiesRaw = data.abilities.map((a: Abilities) => ({
          name: a.ability.name,
          url: a.ability.url
        }))

        setPokemon({
          id: data.id,
          name: data.name,
          image: data.sprites.other.dream_world.front_default,
          height: data.height,
          weight: data.weight,
          types: data.types.map((t: Types) => t.type.name),
          abilities: abilitiesRaw,
          stats: {
            hp: data.stats[0].base_stat,
            attack: data.stats[1].base_stat,
            defense: data.stats[2].base_stat,
            speed: data.stats[5].base_stat
          },
          moves: levelUpMoves
        })

        const translated = await Promise.all(
          abilitiesRaw.map(async (ability: { name: string; url: string }) => {
            const res = await axios.get(ability.url)
            const nameEs = res.data.names.find((n: any) => n.language.name === 'es')
            return nameEs ? nameEs.name : ability.name
          })
        )
        setAbilitiesEs(translated)
      } catch (error) {
        console.error('Error al cargar el Pokémon:', error)
      }
    }

    fetchPokemon()
  }, [name])

  const TYPE_TRANSLATIONS: Record<string, string> = {
    normal: 'Normal',
    fire: 'Fuego',
    water: 'Agua',
    electric: 'Eléctrico',
    grass: 'Planta',
    ice: 'Hielo',
    fighting: 'Lucha',
    poison: 'Veneno',
    ground: 'Tierra',
    flying: 'Volador',
    psychic: 'Psíquico',
    bug: 'Bicho',
    rock: 'Roca',
    ghost: 'Fantasma',
    dark: 'Siniestro',
    dragon: 'Dragón',
    steel: 'Acero',
    fairy: 'Hada'
  }

  const speakDescription = () => {
    if (!pokemon) return

    const synth = window.speechSynthesis
    if (synth.speaking) {
      synth.cancel()
      setIsSpeaking(false)
      return
    }

    const typesEs = pokemon.types.map(type => TYPE_TRANSLATIONS[type] || type).join(', ')
    const abilitiesStr = abilitiesEs.join(', ')

    const description = `${pokemon.name} es un Pokémon de tipo ${typesEs}. 
    Mide ${(pokemon.height / 10).toFixed(1)} metros y pesa ${(pokemon.weight / 10).toFixed(1)} kilogramos. 
    Tiene habilidades como ${abilitiesStr}. 
    Sus estadísticas base son: salud ${pokemon.stats.hp}, ataque ${pokemon.stats.attack}, defensa ${pokemon.stats.defense}, y velocidad ${pokemon.stats.speed}.`

    const utterance = new SpeechSynthesisUtterance(description)
    utterance.lang = 'es-ES'

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    synth.speak(utterance)
  }

  if (!pokemon) return <p className={styles.loading}>Cargando información del Pokémon...</p>

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <header className={styles.header}>
          <Link to='/pokedex' className={styles.back}>Volver</Link>
        </header>

        <div className={styles.summary}>
          <h1 className={styles.name}>{pokemon.name}</h1>

          <button
            className={styles.audioBtn}
            onClick={speakDescription}
            aria-label={isSpeaking ? 'Detener voz' : 'Escuchar descripción del Pokémon'}
          >
            <span className={`${styles.audioIcon} ${isSpeaking ? styles.speaking : ''}`}>
              {isSpeaking ? '🔈' : '🔊'}
            </span>
            <span className={styles.audioText}>
              {isSpeaking ? 'Detener audio' : 'Escuchar descripción'}
            </span>
          </button>

          <span className={styles.id}>#{pokemon.id.toString().padStart(3, '0')}</span>
          <img className={styles.image} src={pokemon.image} alt={pokemon.name} />
        </div>

        <div className={styles.info}>
          <p><strong>Altura:</strong> {(pokemon.height / 10).toFixed(1)} m</p>
          <p><strong>Peso:</strong> {(pokemon.weight / 10).toFixed(1)} kg</p>
        </div>

        <div className={styles.section}>
          <h2>Tipos</h2>
          <ul className={styles.list}>
            {pokemon.types.map((t) => (
              <li className={`${styles.type} ${styles[`type--${t}`]}`} key={t}>
                {TYPE_TRANSLATIONS[t] || t}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h3>Habilidades</h3>
          <ul>
            {abilitiesEs.map((ability, index) => (
              <li key={index}>{ability}</li>
            ))}
          </ul>
        </div>

         <div className={styles.section}>
  <h2>Estadísticas</h2>
  <ul className={styles.stats}>
    {[
      { label: 'Salud', value: pokemon.stats.hp, color: '#ff6b6b' },
      { label: 'Ataque', value: pokemon.stats.attack, color: '#feca57' },
      { label: 'Defensa', value: pokemon.stats.defense, color: '#48dbfb' },
      { label: 'Velocidad', value: pokemon.stats.speed, color: '#1dd1a1' }
    ].map((stat, index) => (
      <li key={index} className={styles.statItem}>
        <div className={styles.statHeader}>
          <span className={styles.statLabel}>{stat.label}</span>
          <span className={styles.statValue}>{stat.value}</span>
        </div>
        <div className={styles.statBar}>
          <motion.div
            className={styles.statBarFill}
            style={{ backgroundColor: stat.color }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(stat.value, 100)}%` }}
            transition={{ duration: 8 }}
          />
        </div>
      </li>
    ))}
  </ul>
</div>

        <div className={styles.section}>
  <h2>Movimientos por nivel</h2>
  <div className={styles.scrollable}>
    {Object.entries(
      pokemon.moves.reduce((acc: Record<number, Set<string>>, move) => {
        if (!acc[move.level]) acc[move.level] = new Set()
        acc[move.level].add(move.name)
        return acc
      }, {})
    )
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .reduce((result, [level, moves], _, arr) => {
        const prevMoves = new Set(
          arr
            .filter(([lvl]) => Number(lvl) < Number(level))
            .flatMap(([_, mv]) => Array.from(mv))
        )
        const uniqueMoves = Array.from(moves).filter((m) => !prevMoves.has(m))
        if (uniqueMoves.length > 0) {
          result.push({ level, moves: uniqueMoves })
        }
        return result
      }, [] as { level: string; moves: string[] }[])
      .map(({ level, moves }) => (
        <div key={level} className={styles.moveGroup}>
          <h4 className={styles.levelTitle}>Nivel {level}</h4>
          <ul className={styles.moveList}>
            {moves.map((moveName, i) => (
              <li key={`${moveName}-${i}`} className={styles.moveItem}>
                {moveName}
              </li>
            ))}
          </ul>
        </div>
      ))}
  </div>
</div>
      </motion.div>
    </div>
  )
}

export default Details