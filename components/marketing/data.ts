export const tiers = [
  {
    name: "Free",
    description: "Try it on your next contract.",
    monthly: 0,
    features: [
      "3 documents per month",
      "Risk score & summary",
      "Clause-by-clause analysis",
      "AI chat about your document",
    ],
    cta: "Start for free",
    highlighted: false,
  },
  {
    name: "Pro",
    description: "For people who sign things often.",
    monthly: 19,
    features: [
      "Unlimited documents",
      "Everything in Free",
      "PDF export & share links",
      "Key dates timeline",
      "Priority processing",
    ],
    cta: "Go Pro",
    highlighted: true,
  },
  {
    name: "Team",
    description: "For agencies, landlords and small firms.",
    monthly: 49,
    features: [
      "Everything in Pro",
      "Team members & roles",
      "Shared workspace",
      "Centralised billing",
    ],
    cta: "Start with Team",
    highlighted: false,
  },
];

export const faqs = [
  {
    question: "Is this legal advice?",
    answer:
      "No. ContractLens AI explains what your contract says in plain English, but it is not a law firm and does not provide legal advice. For decisions with serious consequences, speak to a qualified solicitor.",
  },
  {
    question: "Which file types can I upload?",
    answer:
      "PDF and DOCX. Scanned documents work best when the text is selectable — photos of paper contracts may lose accuracy.",
  },
  {
    question: "Is my contract private?",
    answer:
      "Yes. Your documents are stored encrypted, are only visible to your account, and are never used to train AI models. You can delete a document at any time and it is removed from our storage.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Any time, in one click from your billing settings. You keep Pro features until the end of the period you've paid for, and your documents stay accessible on the Free plan.",
  },
  {
    question: "What contracts work best?",
    answer:
      "Everyday UK agreements: tenancy agreements, employment contracts, freelance and consulting agreements, NDAs and service contracts. Very long or heavily bespoke commercial contracts may need a solicitor's eye on top.",
  },
  {
    question: "How accurate is it?",
    answer:
      "The AI cites the exact paragraphs it relies on, so you can verify every claim against the original text yourself. Treat it as a very fast first read — not the final word.",
  },
  {
    question: "Do you support contracts from outside the UK?",
    answer:
      "The analysis is tuned for documents governed by the law of England, Wales, Scotland or Northern Ireland. Other jurisdictions will still get a useful summary, but risk checks reference UK law.",
  },
];
