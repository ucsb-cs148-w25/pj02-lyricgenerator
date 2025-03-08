import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Landing from "../Landing";

test("renders Landing page with logo and buttons", () => {
  render(
    <MemoryRouter>
      <Landing />
    </MemoryRouter>
  );

  // Check if the logo is present
  expect(screen.getByAltText("Logo")).toBeInTheDocument();

  // Check if the sign-up and login buttons are present
  expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
});

test("navigation buttons work correctly", () => {
  const mockNavigate = jest.fn();
  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
  }));

  render(
    <MemoryRouter>
      <Landing />
    </MemoryRouter>
  );

  // Click the sign-up button
  fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
  expect(mockNavigate).toHaveBeenCalledWith("/sign-up");

  // Click the login button
  fireEvent.click(screen.getByRole("button", { name: /log in/i }));
  expect(mockNavigate).toHaveBeenCalledWith("/login");

  // Click the home button
  fireEvent.click(screen.getByRole("button", { name: /home/i }));
  expect(mockNavigate).toHaveBeenCalledWith("/home");
});