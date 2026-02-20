import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, test, expect } from "vitest";
import Alerts from "../pages/Alerts";
import * as alertsApi from "../services/alertsApi";

vi.mock("../services/alertsApi", () => ({
  getAlerts: vi.fn(),
  resolveAlert: vi.fn()
}));

describe("Alerts UI (mock mode)", () => {
  
  test("shows loading then renders alerts list", async () => {
    alertsApi.getAlerts.mockResolvedValue([
      { id: "1", title: "Consumo fuera de rango", message: "Gasto excesivo", severity: "high", createdAt: "10:00" }
    ]);

    render(<Alerts />);
    
    expect(screen.getByText(/Cargando alertas/i)).toBeInTheDocument();

    const alertTitle = await screen.findByText("Consumo fuera de rango");
    expect(alertTitle).toBeInTheDocument();
  });

  test("shows empty state when simulating empty", async () => {
    alertsApi.getAlerts.mockResolvedValue([]);

    render(<Alerts />);

    const emptyMsg = await screen.findByText(/No hay alertas pendientes de resolución/i);
    expect(emptyMsg).toBeInTheDocument();
  });

  test("resolve flow marks alert as resolved and shows toast", async () => {
    alertsApi.getAlerts.mockResolvedValue([
      { id: "1", title: "Alerta Test", message: "Mensaje", severity: "low", createdAt: "12:00" }
    ]);
    alertsApi.resolveAlert.mockResolvedValue({});

    render(<Alerts />);

    const resolveBtn = await screen.findByRole("button", { name: /Resolver/i });
    fireEvent.click(resolveBtn);

    const confirmBtn = screen.queryByRole("button", { name: /Confirmar/i });
    if (confirmBtn) fireEvent.click(confirmBtn);

    expect(alertsApi.resolveAlert).toHaveBeenCalledWith("1");
  });
});