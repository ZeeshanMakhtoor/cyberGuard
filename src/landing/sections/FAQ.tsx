import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { useReveal } from "../lib/useReveal";

const FAQS = [
  {
    q: "What exactly does CyberGuard AI measure?",
    a: "A single, explainable 0–100 risk score derived from live threat intelligence, vulnerability data, and business-consequence factors — plus a modeled Expected Annual Loss (EAL) range in your local currency, so the number means something to both engineers and the board.",
  },
  {
    q: "Do I need to rip out my existing security tools?",
    a: "No. CyberGuard AI is designed to sit on top of your existing vulnerability scanners, asset inventory, and threat feeds — it aggregates and quantifies, it doesn't replace your stack.",
  },
  {
    q: "How is this different from a generic security score?",
    a: "Every number is traceable. Click into any score and you'll see the exact vulnerabilities, assets, and threats behind it — no black-box ML model, and every formula is shown, not hidden.",
  },
  {
    q: "Is my data safe?",
    a: "Your risk data stays in your own workspace. We follow standard security practices for data in transit and at rest, and you control exactly what's connected.",
  },
  {
    q: "When can I get access?",
    a: "We're onboarding organizations from the waitlist in small batches. Join below and we'll reach out with next steps.",
  },
];

export default function FAQ() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="faq" className="lp-section">
      <div className="lp-container max-w-3xl">
        <div ref={ref} className={`lp-fade-up ${visible ? "lp-visible" : ""} text-center`}>
          <span className="lp-eyebrow">FAQ</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">Frequently asked questions</h2>
        </div>

        <Accordion.Root type="single" collapsible defaultValue="item-0" className="mt-10 flex flex-col gap-3">
          {FAQS.map((item, i) => (
            <Accordion.Item key={item.q} value={`item-${i}`} className="lp-card overflow-hidden">
              <Accordion.Header>
                <Accordion.Trigger className="lp-accordion-trigger w-full flex items-center justify-between gap-4 text-left px-5 py-4">
                  <span className="text-sm font-semibold">{item.q}</span>
                  <ChevronDown className="lp-accordion-chevron w-4 h-4 flex-shrink-0" style={{ color: "var(--lp-accent)" }} />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="lp-accordion-content">
                <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "var(--lp-muted)" }}>{item.a}</p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
