const BASE = '/api';

async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

function createApi(path) {
  return {
    list:       (params) => request(`/${path}?${new URLSearchParams(params || {})}`),
    getById:    (id) => request(`/${path}/${id}`),
    create:     (data) => request(`/${path}`, { method: 'POST', body: JSON.stringify(data) }),
    update:     (id, data) => request(`/${path}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete:     (id) => request(`/${path}/${id}`, { method: 'DELETE' }),
  };
}

export const aeroApi = {
  Flight:   createApi('flights'),
  Airline:  createApi('airlines'),
  Aircraft: createApi('aircraft'),
  Pilot:    createApi('pilots'),
  Crew:     createApi('crew'),
};
