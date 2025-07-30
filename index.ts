// TypeScript
// Anotanciones de tipos
let nombre: string = 'Juan'
let numero: number = 30
let booleano: boolean = false
let nulo: null = null
let indefinido: undefined = undefined

// Tipos complejos: Arreglos y Objetos
let nombres: string[] = ['Luis', 'Paco', 'Ana']
let numeros: number[] = [1, 2, 3, 4, 5]

let usuario: { id: number, nombre: string } = {
  id: 1,
  nombre: 'Juan'
}

// type User = {
//   id: number,
//   nombre: string
// }

// let usuario: User = {
//   id: 1,
//   nombre: 'Juan'
// }

// Union de tipos (|) y la intersección de tipos (&)
let resultado: string | number = 'pending'
resultado = 200

const matriz: (string | number)[] = ['Ana', 20, 'Luis']

type Usuario = {
  nombre: string
}

type Administrador = {
  permisos: string[]
}

type UsuarioAdministrador = Usuario & Administrador

const admin: UsuarioAdministrador = {
  nombre: 'Juan',
  permisos: ['crear', 'editar', 'borrar']
}

// Funciones tipadas
function saludar (name: string): void | number {
  fetch(`https://api.example.com/${name}`)
  return 20
}

console.log(saludar(''))
console.log(saludar('service'))


// interfaces
interface Person {
  nombre: string
  edad: number
}

const persona: Person = {
  nombre: 'Juan',
  edad: 30
}

interface Person {
  profesion?: string
}

const persona2: Person = {
  nombre: 'Ana',
  edad: 25,
  profesion: 'Ingeniera'
}

interface Student extends Person {
  curso: string
}

const estudiante: Student = {
  nombre: 'Luis',
  edad: 22,
  profesion: 'Estudiante',
  curso: 'Matemáticas'
}

// Alias de tipos y los tipos literales
type ID = string | number
const userId: ID = 'asd--as-das-d-as-dasdas'

type State = 'loading' | 'success' | 'error'

let estado: State = 'loading'

// Enumeraciones (enums)
enum Rol {
  Usuario = 'Usuario',
  Administrador = 'Administrador',
  SuperAdministrador = 'SuperAdministrador'
}

const currentUser = {
  nombre: 'Juan',
  rol: Rol.Administrador
}

const currentUser2 = {
  nombre: 'Ana',
  rol: Rol.Usuario
}

// Genéricos
function addNewUser<T> (user: T): T[] {
  return [user]
}

console.log(addNewUser({ id: 1 }))
console.log(addNewUser(20))
console.log(addNewUser('abc'))