import { useState, useEffect, useCallback } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Admin() {
  const { user, getToken } = useAuth()
  const [tab, setTab] = useState('users')

  // ── Usuários ──
  const [users, setUsers] = useState([])
  const [loadError, setLoadError] = useState('')
  const [form, setForm] = useState({ username: '', password: '', role: 'user' })
  const [formError, setFormError] = useState('')
  const [formOk, setFormOk] = useState('')
  const [saving, setSaving] = useState(false)

  // ── Logs ──
  const [logs, setLogs] = useState([])
  const [logsError, setLogsError] = useState('')
  const [logsLoading, setLogsLoading] = useState(false)

  // Somente admin acessa esta página
  if (user?.role !== 'admin') return <Navigate to="/" replace />

  const fetchUsers = useCallback(async () => {
    setLoadError('')
    try {
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const data = await res.json()
      if (!res.ok) setLoadError(data.error ?? 'Erro ao carregar usuários')
      else setUsers(data)
    } catch {
      setLoadError('Erro de conexão')
    }
  }, [getToken])

  const fetchLogs = useCallback(async () => {
    setLogsError('')
    setLogsLoading(true)
    try {
      const res = await fetch('/api/logs', {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const data = await res.json()
      if (!res.ok) setLogsError(data.error ?? 'Erro ao carregar log')
      else setLogs(data)
    } catch {
      setLogsError('Erro de conexão')
    } finally {
      setLogsLoading(false)
    }
  }, [getToken])

  useEffect(() => { fetchUsers() }, [fetchUsers])
  useEffect(() => { if (tab === 'logs') fetchLogs() }, [tab, fetchLogs])

  async function handleCreate(e) {
    e.preventDefault()
    setFormError('')
    setFormOk('')
    setSaving(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error ?? 'Erro ao criar usuário')
      } else {
        setFormOk(`Usuário "${data.username}" criado com sucesso.`)
        setForm({ username: '', password: '', role: 'user' })
        fetchUsers()
      }
    } catch {
      setFormError('Erro de conexão')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id, username) {
    if (!window.confirm(`Remover o usuário "${username}"?`)) return
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const data = await res.json()
      if (!res.ok) window.alert(data.error ?? 'Erro ao remover usuário')
      else fetchUsers()
    } catch {
      window.alert('Erro de conexão')
    }
  }

  const roleLabel = r => (r === 'admin' ? 'Administrador' : 'Usuário')

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Administração</h1>
        <p className="text-sm text-slate-500 mt-0.5">Gerencie usuários e monitore acessos ao sistema.</p>
      </div>

      {/* Abas */}
      <div className="flex gap-1 border-b border-slate-200">
        {[
          { id: 'users', label: 'Usuários' },
          { id: 'logs',  label: 'Log de Acessos' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === t.id
                ? 'border-[#0f3973] text-[#0f3973]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Aba: Usuários ── */}
      {tab === 'users' && (<>

      {/* Formulário de criação */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-sm font-semibold text-slate-700">Novo usuário</h2>
        </div>
        <form onSubmit={handleCreate} className="px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Usuário
            </label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3973] focus:border-transparent"
              required
              minLength={3}
              maxLength={50}
              disabled={saving}
              spellCheck={false}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Senha
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3973] focus:border-transparent"
              required
              minLength={8}
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Perfil
            </label>
            <select
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3973] focus:border-transparent bg-white"
              disabled={saving}
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {formError && (
            <p className="sm:col-span-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {formError}
            </p>
          )}
          {formOk && (
            <p className="sm:col-span-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              {formOk}
            </p>
          )}

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#0f3973] hover:bg-[#0c2d5e] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Criar usuário'}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de usuários */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-sm font-semibold text-slate-700">Usuários cadastrados</h2>
        </div>

        {loadError && (
          <p className="px-5 py-4 text-sm text-red-600">{loadError}</p>
        )}

        {!loadError && users.length === 0 && (
          <p className="px-5 py-4 text-sm text-slate-400">Nenhum usuário encontrado.</p>
        )}

        {users.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <th className="px-5 py-3">Usuário</th>
                <th className="px-5 py-3">Perfil</th>
                <th className="px-5 py-3">Criado em</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800">{u.username}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.role === 'admin'
                        ? 'bg-[#0f3973]/10 text-[#0f3973]'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {roleLabel(u.role)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500 text-xs">
                    {new Date(u.createdAt).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {u.id !== user.id && (
                      <button
                        onClick={() => handleDelete(u.id, u.username)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        Remover
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </>)}

      {/* ── Aba: Log de Acessos ── */}
      {tab === 'logs' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Últimos 1000 acessos</h2>
            <button
              onClick={fetchLogs}
              disabled={logsLoading}
              className="text-xs text-[#0f3973] hover:underline disabled:opacity-50"
            >
              {logsLoading ? 'Carregando...' : 'Atualizar'}
            </button>
          </div>

          {logsError && (
            <p className="px-5 py-4 text-sm text-red-600">{logsError}</p>
          )}

          {!logsError && !logsLoading && logs.length === 0 && (
            <p className="px-5 py-4 text-sm text-slate-400">Nenhum acesso registrado ainda.</p>
          )}

          {logs.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <th className="px-5 py-3">Data / Hora</th>
                    <th className="px-5 py-3">Usuário</th>
                    <th className="px-5 py-3">IP</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((entry, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-5 py-2.5 text-slate-500 text-xs whitespace-nowrap">
                        {entry.ts ? new Date(entry.ts).toLocaleString('pt-BR') : '—'}
                      </td>
                      <td className="px-5 py-2.5 font-medium text-slate-800">{entry.username}</td>
                      <td className="px-5 py-2.5 text-slate-500 font-mono text-xs">{entry.ip}</td>
                      <td className="px-5 py-2.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          entry.status === 'OK'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-600'
                        }`}>
                          {entry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
