// HTTP contract types derived from bethehero-api/tests/contract/fixtures/*.json
// Any drift from these types will break integration with the running API.

// FROM ongs.json + auth.json — Ong is the response shape for /auth/login, /auth/user, GET /ongs
export interface Ong {
  id: string           // __HEX8__ — 8-char hex string, used as auth token
  name: string
  cellphone: string
  email: string
  city: string
  uf: string           // __STRING_LENGTH_2__
  created_at: string   // __ISO8601__
  // forbidden_keys: ["updated_at"] — do NOT add updated_at
}

// FROM ongs.json POST /ongs 200 — note forbidden_keys: ["name", "email", "cellphone"]
// Status 200 (not 201) — Express default, no explicit status set in OngController.store
export interface CreateOngResponse {
  id: string
}

export interface CreateOngRequest {
  name: string
  email: string
  cellphone: string
  city: string
  uf: string
}

// FROM incidents.json GET /incidents 200 — note value_type: "string", forbidden_keys: ["updated_at", "ong_id"]
// The nested ong also omits updated_at (forbidden_keys_on_nested_ong: ["updated_at"])
export interface Incident {
  id: number           // __INTEGER__
  title: string
  description: string
  value: string        // __DECIMAL_STRING__ — DO NOT parseFloat
  created_at: string
  ong: Ong             // nested — includes id, name, cellphone, email, city, uf, created_at; no updated_at
}

// Alias for clarity — same as Incident (GET /incidents returns nested ong)
export type IncidentWithOng = Incident

// FROM incidents.json POST /incidents 200 — forbidden_keys: ["title", "description", "value", "ong_id"]
// status_note: "Keep 200, NOT 201"
export interface CreateIncidentResponse {
  id: number
}

export interface CreateIncidentRequest {
  title: string
  description: string
  value: string | number  // Body accepts number; response value is string
}

// FROM auth.json POST /auth/login 200 — same shape as Ong
export type LoginResponse = Ong

// FROM auth.json POST /auth/login requestBody — email-based login (NOT id)
export interface LoginRequest {
  email: string
}
