import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

const { getAlertsMock, resolveAlertMock } = vi.hoisted(() => ({
  getAlertsMock: vi.fn(),
  resolveAlertMock: vi.fn(),
}));

vi.mock("../services/alertsApi", () => ({
  getAlerts: getAlertsMock,
  resolveAlert: resolveAlertMock,
}));

const loadAlerts = async () => {
  const module = await import("../pages/Alerts");
  return module.default;
};

describe("Alerts UI (api mode)", () => {
  beforeEach(() => {
    vi.resetModules();
    getAlertsMock.mockReset();
    resolveAlertMock.mockReset();
    if (vi.stubEnv) {
      vi.stubEnv("VITE_USE_MOCK", "false");
    } else {
      import.meta.env.VITE_USE_MOCK = "false";
    }
  });

  afterEach(() => {
    if (vi.unstubAllEnvs) {
      vi.unstubAllEnvs();
    } else {
      import.meta.env.VITE_USE_MOCK = "true";
    }
  });

  test("renders API alerts list when getAlerts returns data", async () => {
    getAlertsMock.mockResolvedValue([
      {
        id: "x1",
        title: "API alert",
        message: "Mensaje desde API",
        severity: "high",
        createdAt: "Hoy",
      },
    ]);

    const Alerts = await loadAlerts();
    render(<Alerts />);

    expect(await screen.findByText("API alert")).toBeInTheDocument();
  });

  test("shows empty state when API returns empty list", async () => {
    getAlertsMock.mockResolvedValue([]);

    const Alerts = await loadAlerts();
    render(<Alerts />);

    expect(
      await screen.findByText(/No hay alertas disponibles en este momento/i)
    ).toBeInTheDocument();
  });
});
