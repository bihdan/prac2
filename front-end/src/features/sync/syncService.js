const BASE_URL = "http://localhost:8080/api/sync";

export async function push({ decks, cards }) {
  const response = await fetch(`${BASE_URL}/push`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ decks, cards }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.text();
}

export async function pull({ decks}) {
  const response = await fetch(`${BASE_URL}/pull`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ decks}),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}