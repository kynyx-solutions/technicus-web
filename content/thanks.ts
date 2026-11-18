export const thanks: Record<string, { title: string; lead: string }> = {
  brief: { title: "Thank you. We have your brief.", lead: "We will read it and reply by email within two working days." },
  consultation: {
    title: "Thank you. We have your request.",
    lead: "We will confirm a time for the call by email, in your time zone.",
  },
  nda: { title: "Thank you. An NDA is on its way.", lead: "We will send the agreement to your email for signature." },
  career: { title: "Thank you for applying.", lead: "We read every application and will reply by email." },
  local: { title: "Thank you. We have your enquiry.", lead: "We will call you back on the number you gave." },
};

export const thanksFallback = { title: "Thank you.", lead: "We have received your message and will reply soon." };
