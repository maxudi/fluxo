import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import rateLimit from 'express-rate-limit'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { findUser, listUsers, addUser, removeUser, initUsers } from './users.js'
import { logAccess } from './logger.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT ?? 3000
const JWT_SECRET = process.env.JWT_SECRET ?? 'gaeco-default-secret-troque-em-producao'
const JWT_EXPIRES = '8h'

const app = express()
// Confia no proxy reverso (Traefik/EasyPanel) para obter o IP real
app.set('trust proxy', 1)
app.use(express.json())

// ── Middleware de autenticação ─────────────────────────────────────
function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Não autenticado' })
  }
  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' })
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' })
  }
  next()
}

// ── Rate limiting no login ─────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Muitas tentativas de login. Aguarde 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// ── Rota de login ──────────────────────────────────────────────────
app.post('/api/auth', loginLimiter, async (req, res) => {
  const { username, password } = req.body ?? {}
  const ip = req.ip ?? 'desconhecido'

  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Dados inválidos' })
  }

  const user = await findUser(username.trim().toLowerCase())
  if (!user) {
    await logAccess({ username, ip, success: false, reason: 'usuário não encontrado' })
    return res.status(401).json({ error: 'Credenciais inválidas' })
  }

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) {
    await logAccess({ username: user.username, ip, success: false, reason: 'senha incorreta' })
    return res.status(401).json({ error: 'Credenciais inválidas' })
  }

  await logAccess({ username: user.username, ip, success: true })
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  )
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } })
})

// ── Rotas de usuários (somente admin) ─────────────────────────────
app.get('/api/users', requireAuth, requireAdmin, async (_req, res) => {
  const users = await listUsers()
  res.json(users.map(({ id, username, role, createdAt }) => ({ id, username, role, createdAt })))
})

app.post('/api/users', requireAuth, requireAdmin, async (req, res) => {
  const { username, password, role } = req.body ?? {}
  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Username e senha são obrigatórios' })
  }
  if (username.length < 3 || username.length > 50) {
    return res.status(400).json({ error: 'Username deve ter entre 3 e 50 caracteres' })
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Senha deve ter ao menos 8 caracteres' })
  }
  try {
    const user = await addUser(
      username.trim().toLowerCase(),
      password,
      role === 'admin' ? 'admin' : 'user'
    )
    res.status(201).json(user)
  } catch (err) {
    res.status(409).json({ error: err.message })
  }
})

app.delete('/api/users/:id', requireAuth, requireAdmin, async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ error: 'Não é possível remover seu próprio usuário' })
  }
  try {
    await removeUser(req.params.id)
    res.json({ ok: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// 404 para rotas de API desconhecidas
app.use('/api', (_req, res) => res.status(404).json({ error: 'Rota não encontrada' }))

// ── Frontend estático ──────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../dist')))
app.get('/{*splat}', (_req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// ── Inicialização ──────────────────────────────────────────────────
await initUsers()
app.listen(PORT, () => console.log(`GAECO Fluxo rodando na porta ${PORT}`))
