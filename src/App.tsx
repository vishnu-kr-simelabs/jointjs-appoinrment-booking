import { useEffect, useRef, useState } from "react";
import { dia, ui, shapes } from "@joint/plus";
import "./App.css";
import { createAppointmentFlow } from "./appoinrment";
import { createStencil } from "./stencil";
import { createToolbar } from "./toolbar";

import EyeIcon from "./EyeIcon";
import EyeOffIcon from "./EyeOffIcon";

function App() {
  const canvas = useRef<Element | null>(null);
  const stencilRef = useRef<Element | null>(null);
  const toolbarRef = useRef<Element | null>(null);

  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    const CustomLinkView = dia.LinkView.extend({
      // custom interactions:
      pointerdblclick: function (evt, x, y) {
        this.addVertex(x, y);
      },

      contextmenu: function (evt, x, y) {
        this.addLabel(x, y);
      },
    });

    const graph = new dia.Graph();

    const paper = new dia.Paper({
      model: graph,
      background: {
        color: "#F8F9FA",
      },
      frozen: true,
      async: true,
      cellViewNamespace: shapes,
      defaultRouter: { name: "normal" },
      defaultConnector: { name: "straight", args: { cornerType: "line" } },
      drawGrid: {
        name: "fixedDot",
        args: {
          color: "black",
        },
      },
      gridSize: 10,
      linkView: CustomLinkView,
    });

    const scroller = new ui.PaperScroller({
      paper,
      autoResizePaper: true,
      cursor: "grab",
    });

    canvas.current?.appendChild(scroller.el);
    scroller.render().center();

    paper.on(
      "paper:pinch",
      (_evt: object, ox: number, oy: number, scale: number) => {
        const zoom = scroller.zoom();
        scroller.zoom(zoom * scale, {
          min: 0.2,
          max: 5,
          ox,
          oy,
          absolute: true,
        });
      }
    );

    const { dataObject } = createAppointmentFlow({
      graph,
      paper,
    });

    createStencil(graph, scroller, stencilRef.current);
    createToolbar(graph, paper, scroller, toolbarRef.current);

    // create halo
    function openHalo(cellView: unknown) {
      new ui.Halo({ cellView: cellView }).render();
    }
    if (dataObject) {
      paper.on("cell:pointerup", (cellView: unknown) => {
        openHalo(cellView);
      });

      // open halo for first element by default
      // openHalo(paper.findViewByModel(dataObject));
    }

    // BPMN FreeTransform Controls
    // function openBPMNTransform(cellView: unknown) {
    //   new ui.BPMNFreeTransform({ cellView: cellView }).render();
    // }

    // paper.on("element:pointerup", (cellView: unknown) => {
    //   // new ui.BPMNFreeTransform({ cellView });
    //   openBPMNTransform(cellView);
    // });

    // openBPMNTransform(paper.findViewByModel(startEvent));

    paper.unfreeze();

    return () => {
      scroller.remove();
      paper.remove();
    };
  }, []);

  const handleStencilBtnClick = () => {
    setIsHidden(!isHidden);
  };

  return (
    <>
      <h1>Appointment Booking</h1>
      <div className="topbar-section">
        <button className="stencil-btn" onClick={handleStencilBtnClick}>
          {isHidden ? <EyeIcon /> : <EyeOffIcon />} Stencil
        </button>
        <div ref={toolbarRef} />
      </div>

      <div className="canvas" ref={canvas}>
        <div
          id="stencil"
          className={isHidden ? "hide" : ""}
          ref={stencilRef}
        ></div>
      </div>
      <div id="toolbar"></div>
    </>
  );
}

export default App;
