
import { useState } from "react";
import "./Help.css";

const faqs = [
  {
    question: "How do I scan a leaf?",
    answer:
      "Open AI Leaf Scanner, upload a JPG, PNG, or WebP image, and click Scan Leaf. Make sure the Python backend is running.",
  },
  {
    question: "Why does the scanner predict Tomato for other leaves?",
    answer:
      "The current CNN has limited validation accuracy and may confuse different plants. We are working to improve the model. Treat predictions as experimental.",
  },
  {
    question: "Which plants are included in the dataset?",
    answer:
      "The dataset includes Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Bell Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, and Tomato.",
  },
  {
    question: "What image formats can I upload?",
    answer:
      "The backend accepts JPG, PNG, and WebP images up to 10 MB.",
  },
  {
    question: "What does confidence mean?",
    answer:
      "Confidence is the model's predicted probability for its selected class. High confidence does not guarantee a correct diagnosis.",
  },
  {
    question: "Why does my scanner show a connection error?",
    answer:
      "Check whether FastAPI is running on http://127.0.0.1:8000 and React is running on http://localhost:5173.",
  },
  {
    question: "Where are my scan results saved?",
    answer:
      "Scan history is stored locally in your browser. Clearing browser storage may remove saved history.",
  },
  {
    question: "Can LeafGuard AI replace an agricultural expert?",
    answer:
      "No. It is an educational prototype. Consult a qualified agricultural professional before making important crop-treatment decisions.",
  },
];

export default function Help() {
  const [openIndex, setOpenIndex] = useState(0);
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter((faq) =>
    `${faq.question} ${faq.answer}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="help-page">
      <section className="help-hero">
        <span className="help-tag">SUPPORT CENTER</span>
        <h1>How Can We <span>Help You?</span></h1>
        <p>
          Find answers to common questions about LeafGuard AI,
          leaf scanning, predictions, and troubleshooting.
        </p>

        <input
          className="help-search"
          type="search"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      <section className="help-content">
        <h2>Frequently Asked Questions</h2>

        {filteredFaqs.length === 0 && (
          <p className="help-empty">
            No matching questions found.
          </p>
        )}

        <div className="help-faq-list">
          {filteredFaqs.map((faq) => {
            const index = faqs.indexOf(faq);
            const isOpen = openIndex === index;

            return (
              <article className="help-faq" key={faq.question}>
                <button
                  className="help-question"
                  onClick={() =>
                    setOpenIndex(isOpen ? -1 : index)
                  }
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span>{isOpen ? "−" : "+"}</span>
                </button>

                {isOpen && (
                  <div className="help-answer">
                    {faq.answer}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="help-steps">
        <h2>Quick Start Guide</h2>

        <div className="help-step-grid">
          <div><strong>01</strong><h3>Open Scanner</h3><p>Go to the AI Leaf Scanner page.</p></div>
          <div><strong>02</strong><h3>Upload Image</h3><p>Choose a clear leaf photograph.</p></div>
          <div><strong>03</strong><h3>Scan Leaf</h3><p>Submit the image for analysis.</p></div>
          <div><strong>04</strong><h3>Review Result</h3><p>Read the experimental prediction and guidance.</p></div>
        </div>
      </section>

      <div className="help-warning">
        LeafGuard AI is under development. The current CNN may
        produce inaccurate disease predictions.
      </div>
    </main>
  );
}
