import { dia, ui, shapes, format, util } from "@joint/plus";

export const createToolbar = (graph, paper, paperScroller, toolbarRef) => {
  const commandManager = new dia.CommandManager({
    graph: graph,
  });

  const toolbar = new ui.Toolbar({
    autoToggle: true,
    theme: "modern",
    // initialize tools with default settings
    tools: [
      "zoomIn",
      "zoomOut",
      "zoomToFit",
      "zoomSlider",
      "undo",
      "redo",
      {
        type: "button",
        name: "json",
        text: "Export JSON",
      },
      {
        type: "button",
        name: "svg",
        text: "Export SVG",
      },
    ],
    references: {
      paperScroller: paperScroller,
      commandManager: commandManager,
    },
  });

  toolbarRef.appendChild(toolbar.render().el);

  toolbar.on("json:pointerclick", () => {
    const str = JSON.stringify(graph.toJSON());
    const bytes = new TextEncoder().encode(str);
    const blob = new Blob([bytes], { type: "application/json;charset=utf-8" });
    util.downloadBlob(blob, "appointment-booking.json");
  });

  toolbar.on("svg:pointerclick", () => {
    format.toSVG(
      paper,
      (svg) => {
        util.downloadDataUri(
          `data:image/svg+xml,${encodeURIComponent(svg)}`,
          "appointment-booking.svg"
        );
      },
      { useComputedStyles: false }
    );
  });
};
