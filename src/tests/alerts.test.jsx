import { render, screen, act, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Alerts from "../pages/Alerts";

const advanceMockFetch = async () => {
  await act(async () => {
    vi.advanceTimersByTime(600);
  });
};

describe("Alerts UI (mock mode)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  test("shows loading then renders alerts list", async () => {
    render(<Alerts />);
    expect(screen.getByText(/Cargando alertas/i)).toBeInTheDocument();

    await advanceMockFetch();

    expect(screen.getByText("Consumo fuera de rango")).toBeInTheDocument();
    expect(screen.getByText("Recordatorio de mantenimiento")).toBeInTheDocument();
    expect(screen.getByText("Meta semanal cumplida")).toBeInTheDocument();
  });

  test("shows empty state when simulating empty", async () => {
    render(<Alerts />);
    await advanceMockFetch();

    fireEvent.click(screen.getByRole("button", { name: /Simular vacio/i }));
    expect(screen.getByText(/Cargando alertas/i)).toBeInTheDocument();

    await advanceMockFetch();

    expect(
      screen.getByText(/No hay alertas disponibles en este momento/i)
    ).toBeInTheDocument();
  });

  test("shows error state and allows retry without crashing", async () => {
    render(<Alerts />);
    await advanceMockFetch();

    fireEvent.click(screen.getByRole("button", { name: /Simular error/i }));
    await advanceMockFetch();

    expect(
      screen.getByText(/No fue posible cargar las alertas/i)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Reintentar/i }));
    expect(screen.getByText(/Cargando alertas/i)).toBeInTheDocument();

    await advanceMockFetch();

    expect(
      screen.getByText(/No fue posible cargar las alertas/i)
    ).toBeInTheDocument();
  });

  test("resolve flow marks alert as resolved and shows toast", async () => {
    render(<Alerts />);
    await advanceMockFetch();

    const before = screen.getAllByRole("button", { name: /Resolver/i }).length;
    fireEvent.click(screen.getAllByRole("button", { name: /Resolver/i })[0]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Resolver la alerta/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Confirmar/i }));

    expect(
      screen.getByText(/Alerta resuelta correctamente/i)
    ).toBeInTheDocument();

    const after = screen.getAllByRole("button", { name: /Resolver/i }).length;
    expect(after).toBe(before - 1);
  });

  test("traps focus between cancel and confirm buttons in modal", async () => {
    render(<Alerts />);
    await advanceMockFetch();

    fireEvent.click(screen.getAllByRole("button", { name: /Resolver/i })[0]);

    const dialog = screen.getByRole("dialog");
    const cancelBtn = screen.getByRole("button", { name: /Cancelar/i });
    const confirmBtn = screen.getByRole("button", { name: /Confirmar/i });

    confirmBtn.focus();
    expect(confirmBtn).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(cancelBtn).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(confirmBtn).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
    expect(cancelBtn).toHaveFocus();
  });
});
