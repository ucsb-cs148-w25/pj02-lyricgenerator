import { render, screen } from "@testing-library/react";
import About from "../About";
import { MemoryRouter } from "react-router-dom";

test("renders About page with navigation", () => {
  render(
    <MemoryRouter>
      <About />
    </MemoryRouter>
  );

  // Check if navigation bar is rendered
  expect(screen.getByRole("navigation")).toBeInTheDocument();
});