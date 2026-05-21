import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), 'data')
const FILE = path.join(DATA_DIR, 'access.log')

export async function logAccess({ username, ip, success, reason }) {
  const ts = new Date().toISOString()
  const status = success ? 'OK' : `FALHA (${reason ?? ''})`
  const line = `${ts} | ${String(ip).padEnd(20)} | ${String(username).padEnd(20)} | ${status}\n`
  try {
    await fs.appendFile(FILE, line)
  } catch (err) {
    console.error('Erro ao gravar log de acesso:', err.message)
  }
}
