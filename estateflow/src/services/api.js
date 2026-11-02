// External API service (DummyJSON).
//
// DummyJSON is a free demo API that returns fake users. EstateFlow uses it only
// to demonstrate fetch(), async/await, error handling and data transformation.
// It is NOT a real estate backend, and its "users" are NOT real buyers.
// Property and lead data live in localStorage (see propertyService/leadService).

const BASE_URL = 'https://dummyjson.com'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// Shared request helper: turns every failure into a readable ApiError.
async function request(path, { signal } = {}) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, { signal })
  } catch (error) {
    if (error.name === 'AbortError') throw error // the caller cancelled on purpose
    throw new ApiError('Network error. Check your internet connection and try again.')
  }

  if (!response.ok) {
    throw new ApiError(`The demo API responded with an error (HTTP ${response.status}).`, response.status)
  }

  try {
    return await response.json()
  } catch {
    throw new ApiError('The demo API returned a response that could not be read.')
  }
}

// Converts DummyJSON's user shape into the shape our UI uses. If the API
// changes, only this function needs updating.
function toDemoContact(user) {
  return {
    id: `demo-${user.id}`,
    name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Unknown',
    email: user.email ?? '',
    phone: user.phone ?? '',
    city: user.address?.city ?? '',
    company: user.company?.name ?? '',
    avatar: user.image ?? '',
    isDemo: true,
  }
}

export async function fetchDemoContacts(limit = 8, options = {}) {
  const data = await request(`/users?limit=${limit}`, options)
  if (!data || !Array.isArray(data.users)) {
    throw new ApiError('The demo API returned unexpected data.')
  }
  return data.users.map(toDemoContact)
}
