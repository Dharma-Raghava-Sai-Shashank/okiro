async function jsonFetch(url, options = {}) {
  const username = localStorage.getItem('okiro_username') || 'okiro'
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Username': username,
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const err = await res.json()
      if (err?.error) message = err.error
    } catch {}
    throw new Error(message)
  }
  return res.json()
}

export async function listTasks() {
  const { tasks } = await jsonFetch('/api/tasks')
  return tasks
}

export async function createTask(payload) {
  const { task } = await jsonFetch('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return task
}

export async function updateTask(id, patch) {
  const { task } = await jsonFetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
  return task
}

export async function deleteTask(id) {
  return jsonFetch(`/api/tasks/${id}`, { method: 'DELETE' })
}
