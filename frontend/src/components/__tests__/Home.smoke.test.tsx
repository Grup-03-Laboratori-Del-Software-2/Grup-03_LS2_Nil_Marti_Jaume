import React from "react";
import '@testing-library/jest-dom';
import { render, screen, waitFor } from "@testing-library/react";
import Home from "../../pages/Home";

beforeEach(() => {
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ([]), 
  });
});

afterEach(() => {
  (global.fetch as jest.Mock).mockReset();
});

describe("Home page (smoke)", () => {
  it("renders and shows the footer (contentinfo)", async () => {
    render(<Home />);

    const footer = await screen.findByRole("contentinfo");
    expect(footer).toBeInTheDocument();

    expect(screen.getByAltText("ProTube")).toBeInTheDocument();
  });
});
