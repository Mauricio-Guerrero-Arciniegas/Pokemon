import { useRef, useState } from 'react'
import { useName } from '../../context/nameContext'
import { Link, useNavigate } from 'react-router'
import { loadConfettiPreset } from 'tsparticles-preset-confetti'
import { tsParticles } from 'tsparticles-engine'
import styles from './Home.module.scss'

function Home() {
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const { name, getName } = useName()

  const handleSetName = async () => {
    const value = inputRef.current?.value.trim()
    setError(null)

    if (!value) {
      setError('El nombre no puede estar vacío')
      return
    }

    getName(value)
    inputRef.current!.value = ''

    await loadConfettiPreset(tsParticles)
    tsParticles.load({
      id: 'confetti',
      options: {
        preset: 'confetti',
        particles: {
          color: {
            value: ['#FFD700', '#FF4500', '#00CED1', '#32CD32', '#FF69B4']
          }
        }
      }
    })

    setTimeout(() => {
      navigate('/pokedex')
    }, 4000)
  }

  return (
    <div className={styles.container}>
      <div id="confetti" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} />

      {!name && (
        <>
          <h1 className={styles.title}>Bienvenido Entrenador(a)</h1>
          <p className={styles.subtitle}>Para comenzar ingresa tu nombre</p>
          <input
            type="text"
            ref={inputRef}
            placeholder="Escribe tu nombre"
            className={styles.input}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSetName()
              }
            }}
          />
          <button type="button" onClick={handleSetName} className={styles.button}>
            Comenzar
          </button>
        </>
      )}

      {name && (
        <h2 className={styles.greeting}>
          Hola de nuevo <span className={styles.username}>{name}</span>, Redireccionando a tu{' '}
          <Link to="/pokedex" className={styles.link}>Pokedex</Link>
        </h2>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}

export default Home