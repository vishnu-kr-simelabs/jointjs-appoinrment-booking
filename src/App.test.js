import { render, screen, fireEvent } from "@testing-library/react";
import { useEffect, useRef } from "react";
import { dia, ui, shapes } from "@joint/plus";
import App from "./App";

// Mock JointJS libraries
jest.mock("@joint/plus", () => ({
  dia: {
    Graph: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
    })),
    Paper: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      findViewByModel: jest.fn(),
      freeze: jest.fn(),
      unfreeze: jest.fn(),
    })),
  },
  ui: {
    PaperScroller: jest.fn().mockImplementation(() => ({
      render: jest.fn(),
      center: jest.fn(),
      zoom: jest.fn(),
      remove: jest.fn(),
    })),
    Halo: jest.fn().mockImplementation(() => ({
      render: jest.fn(),
    })),
  },
  shapes: {},
}));

describe("App Component", () => {
  it("renders the canvas and other elements", () => {
    render(<App />);

    // Check if canvas, stencil, and toolbar are rendered
    expect(screen.getByText(/Appointment booking/)).toBeInTheDocument();
    expect(screen.getByClassName("canvas")).toBeInTheDocument();
    expect(screen.getById("stencil")).toBeInTheDocument();
    expect(screen.getById("toolbar")).toBeInTheDocument();
  });

  it("initializes JointJS paper and scroller", () => {
    render(<App />);

    // Check if dia.Graph and ui.PaperScroller are initialized
    expect(dia.Graph).toHaveBeenCalled();
    expect(ui.PaperScroller).toHaveBeenCalled();
  });

  it("handles pinch zoom event", () => {
    render(<App />);

    const paperInstance = new dia.Paper();
    const scrollerInstance = new ui.PaperScroller();

    // Simulate pinch event
    fireEvent(paperInstance, new MouseEvent("paper:pinch", { bubbles: true }));

    // Check if zoom method is called with the correct scale
    expect(scrollerInstance.zoom).toHaveBeenCalled();
  });

  it("opens halo on cell pointer up", () => {
    render(<App />);

    const paperInstance = new dia.Paper();

    // Simulate cell pointer up event
    fireEvent(
      paperInstance,
      new MouseEvent("cell:pointerup", { bubbles: true })
    );

    // Check if Halo.render() is called
    expect(ui.Halo).toHaveBeenCalled();
  });
});
