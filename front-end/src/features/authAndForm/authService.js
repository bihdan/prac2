const BASE_URL = "http://localhost:8080/api/auth";

export async function login({ username, password }) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.text(); // або .json(), залежно від бекенда
}

export async function signup({ username, password, email }) {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, email }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.text(); // або .json()
}

export async function logout() {
  localStorage.removeItem("rememberMe");
  
  const response = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  {/* localStorage.removeItem("decks");
  localStorage.removeItem("cards");
  localStorage.removeItem("last_selected_deck");
  localStorage.removeItem("rememberMe");*/}
}


export async function autoLogin() {
  const response = await fetch(`${BASE_URL}/auto-login`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.text(); // або .json(), залежно від бекенда
}