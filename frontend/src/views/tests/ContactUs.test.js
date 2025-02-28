import { render, screen } from "@testing-library/react";
import ContactUs from "../ContactUs";
import { MemoryRouter } from "react-router-dom";

test("renders Contact Us page with navigation", () => {
  render(
    <MemoryRouter>
      <ContactUs />
    </MemoryRouter>
  );

  // Check if navigation bar is rendered
  expect(screen.getByRole("navigation")).toBeInTheDocument();
});
