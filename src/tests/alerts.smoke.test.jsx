import { render, screen, act, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Alerts from "../pages/Alerts";

test("renders alerts UI", async () => {
  vi.useFakeTimers();

  render(<Alerts />);
  expect(screen.getByText("Alerts")).toBeInTheDocument();

  await act(async () => {
    vi.advanceTimersByTime(600);
  });

  const resolveButtons = screen.getAllByRole("button", { name: /Resolver/i });
  expect(resolveButtons.length).toBeGreaterThan(0);

  fireEvent.click(resolveButtons[0]);
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(screen.getByText(/Resolver la alerta/i)).toBeInTheDocument();

  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /Confirmar/i }));
  });
  expect(screen.getByText(/Alerta resuelta correctamente/i)).toBeInTheDocument();

  await act(async () => {
    vi.advanceTimersByTime(3500);
  });

  vi.useRealTimers();
});
