import { request } from "../services/apiClient";
import { vi, beforeEach, test, expect } from "vitest";

beforeEach(() => {
  vi.restoreAllMocks();
  global.fetch = vi.fn();
});

test("returns parsed JSON on ok response", async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    text: () => Promise.resolve(JSON.stringify({ a: 1 })),
  });

  const data = await request("/api/x");
  expect(data).toEqual({ a: 1 });
});

test("returns null on ok response with empty body", async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    status: 204,
    text: () => Promise.resolve(""),
  });

  const data = await request("/api/x");
  expect(data).toBe(null);
});

test("throws normalized HTTP error with message", async () => {
  global.fetch.mockResolvedValue({
    ok: false,
    status: 400,
    text: () => Promise.resolve(JSON.stringify({ message: "Bad input" })),
  });

  await expect(request("/api/x")).rejects.toMatchObject({
    status: 400,
    code: "HTTP_400",
    message: "Bad input",
  });
});

test("throws NETWORK on TypeError", async () => {
  global.fetch.mockRejectedValue(new TypeError("Failed to fetch"));

  await expect(request("/api/x")).rejects.toMatchObject({
    status: 0,
    code: "NETWORK",
  });
});

test("throws TIMEOUT on AbortError", async () => {
  const error = Object.assign(new Error("Aborted"), { name: "AbortError" });
  global.fetch.mockRejectedValue(error);

  await expect(request("/api/x", { timeout: 1 })).rejects.toMatchObject({
    status: 0,
    code: "TIMEOUT",
  });
});

test("sends JSON body with Content-Type", async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    text: () => Promise.resolve(""),
  });

  await request("/api/x", { method: "POST", body: { hello: "world" } });

  expect(global.fetch).toHaveBeenCalledWith(
    "http://localhost:8080/api/v1/api/x",
    expect.objectContaining({
      method: "POST",
      headers: expect.objectContaining({ 
        "Content-Type": "application/json",
        "Accept": "application/json" 
      }),
      body: JSON.stringify({ hello: "world" }),
      signal: expect.any(AbortSignal) 
    })
  );
});