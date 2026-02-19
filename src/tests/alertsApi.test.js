import { vi, test, expect } from "vitest";
import { getAlerts, resolveAlert } from "../services/alertsApi";
import { request } from "../services/apiClient";

vi.mock("../services/apiClient", () => ({
  request: vi.fn(),
}));

test("getAlerts builds querystring and calls request with GET", async () => {
  request.mockResolvedValue([]);

  await getAlerts({ severity: "high", page: 2 });

  expect(request).toHaveBeenCalledWith("/api/v1/alerts/pending", {
    method: "GET",
  });
});

test("resolveAlert calls request with PATCH and correct path", async () => {
  request.mockResolvedValue({});

  await resolveAlert("abc");

  expect(request).toHaveBeenCalledWith("/api/v1/alerts/abc/resolve", {
    method: "PATCH",
  });
});