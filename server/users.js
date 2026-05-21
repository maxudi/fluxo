import bcrypt from 'bcryptjs'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), 'data')
const FILE = path.join(DATA_DIR, 'users.json')

async function read() {
  const raw = await fs.readFile(FILE, 'utf8')
  return JSON.parse(raw)
}

async function write(users) {
  await fs.writeFile(FILE, JSON.stringify(users, null, 2))
}

export async function initUsers() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(FILE)
  } catch {
    const hash = await bcrypt.hash('2@Fluxo#3', 10)
    await write([{
      id: crypto.randomUUID(),
      username: 'admin',
      passwordHash: hash,
      role: 'admin',
      createdAt: new Date().toISOString(),
    }])
    console.log('Arquivo de usuários criado com conta admin padrão.')
  }
}

export async function findUser(username) {
  const users = await read()
  return users.find(u => u.username === username) ?? null
}

export async function listUsers() {
  return read()
}

export async function addUser(username, password, role = 'user') {
  const users = await read()
  if (users.some(u => u.username === username)) throw new Error('Usuário já existe')
  const hash = await bcrypt.hash(password, 10)
  const user = {
    id: crypto.randomUUID(),
    username,
    passwordHash: hash,
    role,
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  await write(users)
  return { id: user.id, username: user.username, role: user.role, createdAt: user.createdAt }
}

export async function removeUser(id) {
  const users = await read()
  const idx = users.findIndex(u => u.id === id)
  if (idx === -1) throw new Error('Usuário não encontrado')
  if (users[idx].role === 'admin' && users.filter(u => u.role === 'admin').length === 1) {
    throw new Error('Não é possível remover o único administrador')
  }
  users.splice(idx, 1)
  await write(users)
}
