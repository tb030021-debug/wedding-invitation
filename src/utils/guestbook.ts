export type GuestbookPayload = {
  name: string;
  side: GuestbookSide;
  message: string;
  password: string;
};

export type GuestbookSide = "GROOM_SIDE" | "BRIDE_SIDE";

export type GuestbookMessage = {
  id: string;
  name: string;
  side: GuestbookSide;
  message: string;
  createdAt: string;
};

async function readJsonResponse<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => ({}))) as { message?: string };

  if (!response.ok) {
    throw new Error(data.message || "요청을 처리하지 못했습니다.");
  }

  return data as T;
}

export async function fetchGuestbookMessages() {
  const response = await fetch("/api/guestbook", {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store"
  });

  return readJsonResponse<{ messages: GuestbookMessage[] }>(response);
}

export async function submitGuestbookMessage(payload: GuestbookPayload) {
  const response = await fetch("/api/guestbook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(payload)
  });

  return readJsonResponse<{ message: GuestbookMessage }>(response);
}

export async function deleteGuestbookMessage(id: string, password: string) {
  const response = await fetch(`/api/guestbook/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ password })
  });

  return readJsonResponse<{ ok: true }>(response);
}
