import { dia, shapes, ui, format, util } from "@joint/plus";

interface PropsType {
  graph: dia.Graph;
  paper: dia.Paper;
}

export function createAppointmentFlow({ graph, paper }: PropsType) {
  const dataObject = new shapes.bpmn2.DataObject({
    position: { x: 50, y: 50 },
    attrs: {
      dataTypeIcon: {
        iconType: "input",
      },
      collectionIcon: {
        collection: true,
      },
      label: {
        text: "User's booking request",
        textWrap: {
          width: "200%",
        },
      },
    },
  });
  dataObject.addTo(graph);

  // 2. User Inputs Appointment Details (Task - Rounded Rectangle)

  const inputDetailsActivity = new shapes.bpmn2.Activity({
    position: {
      x: 200,
      y: 35,
    },
    attrs: {
      border: {
        borderType: "normal",
        borderStyle: "solid",
      },
      label: {
        text: "Process user inputs",
        textWrap: {
          width: "80%",
        },
      },
      markers: {
        iconTypes: ["sequential"],
      },
    },
  });
  inputDetailsActivity.addTo(graph);

  const checkAvailability = new shapes.bpmn2.Gateway({
    position: {
      x: 430,
      y: 55,
    },
    attrs: {
      body: { fill: "white", stroke: "black" },
      icon: { iconType: "event" },
      label: { text: "Check Availability" },
    },
  });
  checkAvailability.addTo(graph);

  // 4. Appointment Confirmed (Task)
  const confirmAppointment = new shapes.bpmn2.Activity({
    position: {
      x: 546,
      y: 35,
    },
    attrs: {
      border: {
        borderType: "normal",
        borderStyle: "solid",
      },
      label: {
        text: "Confirm Appointment",
        textWrap: {
          width: "80%",
        },
      },
      markers: {
        iconTypes: ["sub-process"],
      },
    },
  });

  confirmAppointment.addTo(graph);

  const dataStore = new shapes.bpmn2.DataStore({
    position: {
      x: 1270,
      y: -310,
    },
    attrs: {
      body: {
        fill: "#ffff",
        stroke: "black",
      },
      top: {
        fill: "#ffffff",
        stroke: "black",
      },
      label: {
        text: "Data Store",
      },
    },
  });

  dataStore.addTo(graph);

  const bookingEventError = new shapes.bpmn2.Event({
    position: {
      x: 625,
      y: 118,
    },
    attrs: {
      label: {
        text: "Error",
      },
      icon: {
        iconType: "error1",
      },
    },
  });

  confirmAppointment.embed(bookingEventError);
  bookingEventError.addTo(graph);

  // 4.1 booking failed
  const notifyBookingFailed = new shapes.bpmn2.Activity({
    position: {
      x: 700,
      y: 355,
    },
    attrs: {
      border: {
        borderType: "normal",
        borderStyle: "solid",
      },
      label: {
        text: "Notify Booking Failed",
        textWrap: {
          width: "80%",
        },
      },
      icon: {
        iconType: "send",
      },
    },
  });

  notifyBookingFailed.addTo(graph);

  const endBookingFailed = new shapes.bpmn2.Event({
    position: {
      x: 1000,
      y: 385,
    },
    attrs: {
      body: {
        stroke: "#fe854f",
      },
      label: {
        text: "End",
      },
      icon: { iconType: "termination2" },
    },
  });
  endBookingFailed.addTo(graph);

  // 5. Send SMS Confirmation (Task with SVG Icon)
  const sendSMS = new shapes.bpmn2.Event({
    position: {
      x: 740,
      y: 65,
    },
    attrs: {
      body: {
        stroke: "#fe854f",
      },
      label: {
        text: "Send SMS Confirmation",
      },
      icon: { iconType: "message1" },
    },
  });
  sendSMS.addTo(graph);

  // 6. Send Email Confirmation (Task with SVG Icon)
  const sendEmail = new shapes.bpmn2.Activity({
    position: {
      x: 865,
      y: 35,
    },
    attrs: {
      border: {
        borderType: "normal",
        borderStyle: "solid",
      },
      label: {
        text: "Send Email confirmation",
        textWrap: {
          width: "80%",
        },
      },
      icon: {
        iconType: "send",
      },
    },
  });

  sendEmail.addTo(graph);

  // 7. End Event (Circle)
  const endEvent = new shapes.bpmn2.Event({
    position: {
      x: 1420,
      y: -300,
    },
    attrs: {
      body: {
        stroke: "#fe854f",
      },
      label: {
        text: "End",
      },
      icon: { iconType: "termination2" },
    },
  });
  endEvent.addTo(graph);

  const confirmPayment = new shapes.bpmn2.Activity({
    position: {
      x: 546,
      y: -145,
    },
    attrs: {
      border: {
        borderType: "normal",
        borderStyle: "solid",
      },
      label: {
        text: "Charge Credit Card",
        textWrap: {
          width: "80%",
        },
      },
      icon: {
        iconType: "service",
      },
    },
  });
  confirmPayment.addTo(graph);

  const notifyConfirmPayment = new shapes.bpmn2.Activity({
    position: {
      x: 760,
      y: -145,
    },
    attrs: {
      border: {
        borderType: "normal",
        borderStyle: "solid",
      },
      label: {
        text: "Notify Booking & payment completion",
        textWrap: {
          width: "80%",
        },
      },
      icon: {
        iconType: "send",
      },
    },
  });
  notifyConfirmPayment.addTo(graph);

  const link15 = new shapes.standard.Link();
  link15.source(confirmPayment).target(notifyConfirmPayment).addTo(graph);

  const link16 = new shapes.standard.Link();
  link16
    .source(notifyConfirmPayment)
    .target(dataStore)
    .router("orthogonal")
    .connector("rounded")
    .appendLabel({
      attrs: {
        text: {
          text: " save payment record ",
        },
      },
    })
    .addTo(graph);

  const paymentError = new shapes.bpmn2.Event({
    position: {
      x: 620,
      y: -160,
    },
    attrs: {
      icon: {
        iconType: "error2",
      },
    },
  });

  confirmPayment.embed(paymentError);
  paymentError.addTo(graph);

  const refund = new shapes.bpmn2.Event({
    position: {
      x: 620,
      y: -250,
    },
    attrs: {
      label: {
        text: "",
      },
      icon: {
        iconType: "compensation2",
      },
    },
  });
  refund.addTo(graph);

  const linkPaymentErrorRefund = new shapes.standard.Link();
  linkPaymentErrorRefund
    .source(paymentError, {
      anchor: {
        name: "top",
      },
    })
    .target(refund, {
      anchor: {
        name: "bottom",
      },
    })
    .connector("normal", {
      cornerType: "normal",
      precision: 0,
      cornerRadius: 20,
    })
    .router("orthogonal")
    .addTo(graph);

  const notifyFailedTransaction = new shapes.bpmn2.Activity({
    position: {
      x: 840,
      y: -280,
    },
    attrs: {
      border: {
        borderType: "normal",
        borderStyle: "solid",
      },
      label: {
        text: "Notify Failed Credit Transaction",
        textWrap: {
          width: "80%",
        },
      },
      icon: {
        iconType: "send",
      },
    },
  });

  notifyFailedTransaction.addTo(graph);

  const linkNotifyFailedRefund = new shapes.standard.Link();
  linkNotifyFailedRefund
    .source(refund)
    .target(notifyFailedTransaction)
    .addTo(graph);

  const endPaymentEvent = new shapes.bpmn2.Event({
    position: {
      x: 1070,
      y: -250,
    },
    attrs: {
      body: {
        stroke: "#fe854f",
      },
      label: {
        text: "End",
      },
      icon: { iconType: "termination2" },
    },
  });
  endPaymentEvent.addTo(graph);
  const linkNotifyFailedPaymentEnd = new shapes.standard.Link();
  linkNotifyFailedPaymentEnd
    .source(notifyFailedTransaction)
    .target(endPaymentEvent)
    .addTo(graph);

  const linkConfirmAppointmentChargePayment = new shapes.standard.Link();
  linkConfirmAppointmentChargePayment.source(confirmAppointment);
  linkConfirmAppointmentChargePayment.target(confirmPayment);
  linkConfirmAppointmentChargePayment.connector("straight", {
    cornerType: "cubic",
    cornerRadius: 20,
  });
  linkConfirmAppointmentChargePayment.addTo(graph);

  const rescheduleGateway = new shapes.bpmn2.Event({
    position: {
      x: 440,
      y: 230,
    },
    attrs: {
      body: {
        stroke: "#fe854f",
      },
      icon: { iconType: "timer1" },
      label: {
        text: "Reschedule?",
      },
    },
  });
  rescheduleGateway.addTo(graph);

  // 9. User Chooses New Date (Task)
  const newDate = new shapes.bpmn2.Activity({
    position: {
      x: 200,
      y: 200,
    },
    attrs: {
      border: {
        borderType: "normal",
        borderStyle: "solid",
      },
      label: {
        text: "Select New Date",
        textWrap: {
          width: "80%",
        },
      },
      icon: {
        iconType: "service",
      },
      markers: {
        iconTypes: ["loop"],
      },
    },
  });
  newDate.addTo(graph);

  // 10. Check New Availability (Gateway)
  const checkNewAvailability = new shapes.bpmn2.Gateway({
    position: {
      x: 580,
      y: 386,
    },
    attrs: {
      body: { fill: "white", stroke: "black" },
      icon: { iconType: "event" },
      label: { text: "Check Availability" },
    },
  });
  checkAvailability.addTo(graph);
  checkNewAvailability.addTo(graph);

  // Links between the elements
  const dataAssociation = new shapes.bpmn2.DataAssociation({
    source: dataObject,
    target: inputDetailsActivity,
  });
  dataAssociation.addTo(graph);

  const link2 = new shapes.standard.Link();
  link2.source(inputDetailsActivity);
  link2.target(checkAvailability);
  link2.addTo(graph);

  const link3 = new shapes.standard.Link();
  link3.source(checkAvailability);
  link3.target(confirmAppointment);
  link3.addTo(graph);

  const link4 = new shapes.standard.Link();
  link4.source(confirmAppointment);
  link4.target(sendSMS);
  link4.addTo(graph);

  // link to notifyBookingFailed from bookingEventError
  const link4_1 = new shapes.standard.Link();
  link4_1.source(bookingEventError);
  link4_1.target(notifyBookingFailed);
  link4_1.addTo(graph);

  link4_1
    .router("orthogonal", {
      padding: 10,
    })
    .connector("straight", {
      cornerType: "cubic",
      cornerRadius: 20,
    });

  const link4_1_1 = new shapes.standard.Link();
  link4_1_1.source(notifyBookingFailed);
  link4_1_1.target(endBookingFailed);
  link4_1_1.addTo(graph);

  const link5 = new shapes.standard.Link();
  link5.source(sendSMS);
  link5.target(sendEmail);
  link5.addTo(graph);

  const linkDataStore = new shapes.standard.Link();
  linkDataStore.source(sendEmail);
  linkDataStore.target(dataStore);
  linkDataStore
    .appendLabel({
      attrs: {
        text: {
          text: " save appointment ",
        },
      },
    })
    .router("orthogonal");
  linkDataStore.addTo(graph);

  const link6 = new shapes.standard.Link();
  link6.source(dataStore);
  link6.target(endEvent);
  link6.addTo(graph);

  const link7 = new shapes.standard.Link();
  link7.source(checkAvailability);
  link7.target(rescheduleGateway);
  link7.addTo(graph);

  const link8 = new shapes.standard.Link();
  link8.source(rescheduleGateway);
  link8.target(newDate);
  link8.addTo(graph);

  const link9 = new shapes.standard.Link();
  link9
    .source(newDate, {
      anchor: {
        name: "bottom",
        args: {
          rotate: true,
        },
      },
    })
    .target(checkNewAvailability)
    .router("rightAngle")
    .connector("straight", {
      cornerType: "cubic",
      cornerRadius: 20,
    })
    .addTo(graph);

  const link10 = new shapes.standard.Link();
  link10
    .source(checkNewAvailability, {
      anchor: {
        name: "left",
        args: {
          rotate: true,
        },
      },
    })
    .target(newDate)
    .router("orthogonal")
    .connector("straight", {
      cornerType: "cubic",
      cornerRadius: 20,
    })
    .addTo(graph);

  const link11 = new shapes.standard.Link();
  link11.source(checkNewAvailability);
  link11.target(confirmAppointment);
  link11.addTo(graph);

  const link12 = new shapes.standard.Link();
  link12
    .source(dataStore, {
      anchor: {
        name: "top",
      },
    })
    .target(checkAvailability, {
      anchor: {
        name: "top",
      },
    })
    .router("rightAngle", {
      startDirections: ["top"],
      endDirections: ["top"],
    })
    .connector("jumpover")
    .appendLabel({
      attrs: {
        text: {
          text: " Fetch existing appointment record ",
        },
      },
    })
    .addTo(graph);
  return { dataObject };
}
