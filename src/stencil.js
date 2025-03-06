import { dia, ui, shapes, layout } from "@joint/plus";

export const createStencil = (graph, paper, ref) => {
  const stencil = new ui.Stencil({
    graph: graph,
    paper: paper,
    width: 200,
    height: 580,
    cellCursor: "grab",
  });

  ref.appendChild(stencil.render().el);

  const activity = new shapes.bpmn2.Activity({
    position: { x: 10, y: 10 },
    size: { width: 120, height: 90 },
    attrs: {
      background: { fill: "#fff" },
      icon: { iconType: "receive" },
      label: { text: "Activity" },
      markers: {
        iconTypes: ["ad-hoc", "loop"],
        iconsFlow: "column",
        iconColor: "#212121",
      },
    },
  });

  const choreography = new shapes.bpmn2.Choreography({
    position: { x: 10, y: 120 },
    size: { width: 110, height: 90 },
    attrs: {
      body: {
        fill: "#fff",
        stroke: "#212121",
      },
      content: {
        html: "Choreography",
      },
      participantsBodies: {
        fill: "#fff",
      },
    },
    participants: ["Participant 1", "Participant 2"],
    initiatingParticipant: 1,
  });

  const conversation = new shapes.bpmn2.Conversation({
    position: { x: 20, y: 230 },
    size: { width: 55, height: 45 },
    attrs: {
      body: {
        fill: "#fff",
        stroke: "#212121",
      },
      label: {
        text: "Conversation",
      },
    },
  });

  const dataObject = new shapes.bpmn2.DataObject({
    position: { x: 20, y: 320 },
    size: { width: 35, height: 45 },
    attrs: {
      body: {
        fill: "#fff",
        stroke: "#212121",
      },
      label: {
        text: "Data Object",
      },
    },
  });

  const dataStore = new shapes.bpmn2.DataStore({
    position: {
      x: 100,
      y: 320,
    },
    size: { width: 55, height: 45 },
    attrs: {
      body: {
        fill: "#fff",
        stroke: "#212121",
      },
      top: {
        fill: "#fff",
        stroke: "#212121",
      },
      label: {
        text: "Data Store",
        fill: "black",
      },
    },
  });

  const eventItem = new shapes.bpmn2.Event({
    position: {
      x: 20,
      y: 420,
    },
    size: { width: 45, height: 45 },
    attrs: {
      body: {
        stroke: "#212121",
      },
      label: {
        text: "Event",
      },
    },
  }).attr("icon/iconType", "timer1");

  const gateway = new shapes.bpmn2.Gateway({
    position: {
      x: 100,
      y: 420,
    },
    size: { width: 45, height: 45 },
    attrs: {
      body: { fill: "white", stroke: "black" },
      icon: { iconType: "exclusive_event" },
      label: { text: "Gateway" },
    },
  });

  const group = new shapes.bpmn2.Group({
    position: { x: 95, y: 230 },
    size: { width: 75, height: 65 },
    attrs: {
      body: {
        stroke: "#212121",
      },
      label: {
        text: "Group",
      },
    },
  });

  //   const headeredHorizontalPool = new shapes.bpmn2.HeaderedHorizontalPool({
  //     position: { x: 100, y: 530 },
  //     size: { width: 70, height: 70 },
  //     attrs: {
  //       header: {
  //         fill: "#00fa9a",
  //       },
  //       headerText: {
  //         text: "Headered Horizontal Pool",
  //         fill: "#ffffff",
  //       },
  //     },
  //   });
  //   headeredHorizontalPool.addTo(graph);
  //   headeredHorizontalPool.addSwimlane(new shapes.bpmn2.HorizontalSwimlane());
  //   headeredHorizontalPool.addPhase(new shapes.bpmn2.VerticalPhase());

  const elements = [
    activity,
    choreography,
    conversation,
    dataObject,
    dataStore,
    eventItem,
    gateway,
    group,
    // headeredHorizontalPool,
  ];
  stencil.load(elements);
};
