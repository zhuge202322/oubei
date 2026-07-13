"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  FileUp,
  Mail,
  Paperclip,
  Phone,
  RotateCcw,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import {
  Breadcrumbs,
  Button,
  Container,
  Footer,
  Header,
  cx,
} from "@/components/site";

type FormValues = {
  projectType: string;
  material: string;
  quantity: string;
  application: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
};

type Errors = Partial<Record<keyof FormValues | "consent" | "file", string>>;

const initialValues: FormValues = {
  projectType: "",
  material: "",
  quantity: "",
  application: "",
  name: "",
  company: "",
  email: "",
  phone: "",
  message: "",
};

const steps = [
  { number: 1, title: "Project brief", detail: "Tell us what you need" },
  { number: 2, title: "Your details", detail: "Where should we reply?" },
  { number: 3, title: "Review & send", detail: "Confirm your request" },
];

const inputClass = "mt-2 min-h-12 w-full border border-border bg-white px-3 text-sm text-primary outline-none transition-colors placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/15";

async function responseError(response: Response, fallback: string) {
  try {
    const payload = await response.json() as { error?: unknown; message?: unknown };
    if (typeof payload.error === "string" && payload.error.trim()) return payload.error;
    if (typeof payload.message === "string" && payload.message.trim()) return payload.message;
  } catch {
    // The fallback covers empty and non-JSON error responses.
  }
  return fallback;
}

function FieldLabel({ htmlFor, children, required = false }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return <label htmlFor={htmlFor} className="text-sm font-semibold text-primary">{children}{required ? <span className="ml-1 text-[#c62828]" aria-hidden="true">*</span> : null}</label>;
}

function QuoteForm() {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (uploadTimerRef.current !== null) window.clearInterval(uploadTimerRef.current);
  }, []);

  function updateValue(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status === "error") setStatus("idle");
    setSubmitError("");
  }

  function validate(currentStep: number) {
    const nextErrors: Errors = {};
    if (currentStep === 1) {
      if (!values.projectType) nextErrors.projectType = "Choose the project type that is closest to your request.";
      if (!values.material) nextErrors.material = "Select a material family or choose custom recommendation.";
      if (!values.application.trim()) nextErrors.application = "Add the application or equipment this part will support.";
    }
    if (currentStep === 2) {
      if (!values.name.trim()) nextErrors.name = "Enter your name so our team knows who to contact.";
      if (!values.company.trim()) nextErrors.company = "Enter your company name.";
      if (!values.email.trim()) nextErrors.email = "Enter a work email address.";
      else if (!/^\S+@\S+\.\S+$/.test(values.email)) nextErrors.email = "Use a valid email address, for example name@company.com.";
      if (!values.phone.trim()) nextErrors.phone = "Add a phone number, including country code if possible.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function nextStep() {
    if (validate(step)) setStep((current) => Math.min(3, current + 1));
  }

  function previousStep() {
    setErrors({});
    setStep((current) => Math.max(1, current - 1));
  }

  function stopUploadProgress() {
    if (uploadTimerRef.current !== null) {
      window.clearInterval(uploadTimerRef.current);
      uploadTimerRef.current = null;
    }
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    stopUploadProgress();
    setFile(null);
    setUploadProgress(0);
    if (!selected) {
      setErrors((current) => ({ ...current, file: undefined }));
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      event.currentTarget.value = "";
      setErrors((current) => ({ ...current, file: "That file is larger than 10 MB. Please choose a smaller drawing or compress it first." }));
      return;
    }
    setErrors((current) => ({ ...current, file: undefined }));
    setFile(selected);
    let progress = 0;
    uploadTimerRef.current = window.setInterval(() => {
      progress = Math.min(100, progress + 20);
      setUploadProgress(progress);
      if (progress >= 100) stopUploadProgress();
    }, 80);
  }

  function removeFile() {
    stopUploadProgress();
    setFile(null);
    setUploadProgress(0);
    setErrors((current) => ({ ...current, file: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate(2)) {
      setStep(2);
      return;
    }
    if (!consent) {
      setErrors((current) => ({ ...current, consent: "Confirm that we may use these details to respond to your request." }));
      return;
    }

    setErrors((current) => ({ ...current, consent: undefined }));
    setSubmitError("");
    setStatus("submitting");

    const formData = new FormData();
    formData.append("type", "quote");
    Object.entries(values).forEach(([field, value]) => formData.append(field, value));
    formData.append("consent", String(consent));
    if (file) formData.append("file", file);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(await responseError(response, "We could not send the request. Please try again."));
      }
      setStatus("success");
    } catch (error) {
      setSubmitError(error instanceof Error && error.message ? error.message : "We could not send the request. Please check your connection and try again.");
      setStatus("error");
    }
  }

  function reset() {
    stopUploadProgress();
    setValues(initialValues);
    setErrors({});
    setFile(null);
    setUploadProgress(0);
    setConsent(false);
    setSubmitError("");
    setStatus("idle");
    setStep(1);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  if (status === "success") {
    return (
      <div className="border border-[#bdd7c6] bg-[#f2faf4] p-7 sm:p-10" role="status" aria-live="polite">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-[#d8f0df] text-[#19733a]"><CheckCircle2 aria-hidden="true" className="h-6 w-6" /></div>
        <p className="mt-7 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#19733a]">Request received</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-primary">Thanks, {values.name || "we have your details"}.</h2>
        <p className="mt-4 max-w-xl text-sm leading-6 text-muted">Our engineering sales team will review your brief and reply within one business day. We have included {file ? file.name : "the information you provided"} in the request record.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/resources" variant="outline" icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}>Browse resources</Button>
          <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 border border-transparent px-4 text-sm font-semibold text-primary underline decoration-border underline-offset-4 hover:decoration-primary"><RotateCcw aria-hidden="true" className="h-4 w-4" /> Start another request</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="mb-8 grid gap-3 sm:grid-cols-3" aria-label="Quote request progress">
        {steps.map((item) => {
          const active = item.number === step;
          const complete = item.number < step;
          return (
            <div key={item.number} className={cx("border-t-2 pt-3", active ? "border-[#c62828]" : complete ? "border-primary" : "border-border")}>
              <div className="flex items-center gap-2">
                <span className={cx("grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold", active ? "bg-[#c62828] text-white" : complete ? "bg-primary text-white" : "bg-surface-high text-muted")} aria-hidden="true">{complete ? <Check className="h-4 w-4" /> : item.number}</span>
                <span className={cx("text-xs font-semibold", active || complete ? "text-primary" : "text-muted")}>{item.title}</span>
              </div>
              <p className="mt-2 pl-9 text-[11px] text-muted">{item.detail}</p>
            </div>
          );
        })}
      </div>

      {status === "error" ? <p className="mb-5 border border-[#edb4b4] bg-[#fff5f5] px-4 py-3 text-sm text-[#8f1d1d]" role="alert">{submitError}</p> : null}

      {step === 1 ? (
        <section aria-labelledby="step-project">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#c62828]">Step 1 of 3</p>
          <h2 id="step-project" className="mt-2 text-2xl font-semibold text-primary">Tell us about the part</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">A few constraints help us route your request to the right material and process engineer.</p>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="projectType" required>Project type</FieldLabel>
              <select id="projectType" value={values.projectType} onChange={(event) => updateValue("projectType", event.target.value)} className={inputClass} aria-invalid={Boolean(errors.projectType)}>
                <option value="">Select one</option>
                <option value="new-design">New design / prototype</option>
                <option value="replacement">Replacement part</option>
                <option value="production">Production program</option>
                <option value="technical">Technical question</option>
              </select>
              {errors.projectType ? <p className="mt-2 text-xs text-[#8f1d1d]" role="alert">{errors.projectType}</p> : null}
            </div>
            <div>
              <FieldLabel htmlFor="material" required>Material preference</FieldLabel>
              <select id="material" value={values.material} onChange={(event) => updateValue("material", event.target.value)} className={inputClass} aria-invalid={Boolean(errors.material)}>
                <option value="">Choose a family</option>
                <option value="nbr">NBR / nitrile</option>
                <option value="fkm">FKM / fluorocarbon</option>
                <option value="epdm">EPDM</option>
                <option value="silicone">Silicone / VMQ</option>
                <option value="custom">Recommend the best material</option>
              </select>
              {errors.material ? <p className="mt-2 text-xs text-[#8f1d1d]" role="alert">{errors.material}</p> : null}
            </div>
            <div>
              <FieldLabel htmlFor="quantity">Estimated annual quantity</FieldLabel>
              <select id="quantity" value={values.quantity} onChange={(event) => updateValue("quantity", event.target.value)} className={inputClass}>
                <option value="">Select a range</option>
                <option value="under-1000">Under 1,000 pieces</option>
                <option value="1k-10k">1,000 - 10,000 pieces</option>
                <option value="10k-100k">10,000 - 100,000 pieces</option>
                <option value="over-100k">Over 100,000 pieces</option>
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="application" required>Application or equipment</FieldLabel>
              <input id="application" type="text" value={values.application} onChange={(event) => updateValue("application", event.target.value)} placeholder="e.g. hydraulic cylinder, pump, gearbox" className={inputClass} aria-invalid={Boolean(errors.application)} />
              {errors.application ? <p className="mt-2 text-xs text-[#8f1d1d]" role="alert">{errors.application}</p> : null}
            </div>
          </div>
          <div className="mt-5">
            <FieldLabel htmlFor="message">What should we know?</FieldLabel>
            <textarea id="message" value={values.message} onChange={(event) => updateValue("message", event.target.value)} rows={4} placeholder="Pressure, temperature, media, dimensions, target date, or any other useful context" className={`${inputClass} resize-y py-3`} />
          </div>
          <div className="mt-8 flex justify-end"><Button type="button" onClick={nextStep} icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}>Continue</Button></div>
        </section>
      ) : null}

      {step === 2 ? (
        <section aria-labelledby="step-details">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#c62828]">Step 2 of 3</p>
          <h2 id="step-details" className="mt-2 text-2xl font-semibold text-primary">Where should we reply?</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">Your details stay with our engineering sales team and are used only to answer this request.</p>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="name" required>Full name</FieldLabel>
              <input id="name" type="text" autoComplete="name" value={values.name} onChange={(event) => updateValue("name", event.target.value)} placeholder="Your name" className={inputClass} aria-invalid={Boolean(errors.name)} />
              {errors.name ? <p className="mt-2 text-xs text-[#8f1d1d]" role="alert">{errors.name}</p> : null}
            </div>
            <div>
              <FieldLabel htmlFor="company" required>Company</FieldLabel>
              <input id="company" type="text" autoComplete="organization" value={values.company} onChange={(event) => updateValue("company", event.target.value)} placeholder="Company name" className={inputClass} aria-invalid={Boolean(errors.company)} />
              {errors.company ? <p className="mt-2 text-xs text-[#8f1d1d]" role="alert">{errors.company}</p> : null}
            </div>
            <div>
              <FieldLabel htmlFor="email" required>Work email</FieldLabel>
              <input id="email" type="email" autoComplete="email" value={values.email} onChange={(event) => updateValue("email", event.target.value)} placeholder="name@company.com" className={inputClass} aria-invalid={Boolean(errors.email)} />
              {errors.email ? <p className="mt-2 text-xs text-[#8f1d1d]" role="alert">{errors.email}</p> : null}
            </div>
            <div>
              <FieldLabel htmlFor="phone" required>Phone</FieldLabel>
              <input id="phone" type="tel" autoComplete="tel" value={values.phone} onChange={(event) => updateValue("phone", event.target.value)} placeholder="+86 319 000 0000" className={inputClass} aria-invalid={Boolean(errors.phone)} />
              {errors.phone ? <p className="mt-2 text-xs text-[#8f1d1d]" role="alert">{errors.phone}</p> : null}
            </div>
          </div>

          <div className="mt-7">
            <p className="text-sm font-semibold text-primary">Drawing or reference file <span className="font-normal text-muted">(optional)</span></p>
            <input ref={fileInputRef} id="quote-file" type="file" accept=".pdf,.step,.stp,.dwg,.dxf,.png,.jpg,.jpeg" onChange={onFileChange} className="sr-only" />
            {!file ? (
              <label htmlFor="quote-file" className="mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-border bg-surface-low px-5 text-center transition-colors hover:border-primary hover:bg-white focus-within:border-primary">
                <span className="grid h-9 w-9 place-items-center border border-border bg-white text-primary"><Upload aria-hidden="true" className="h-4 w-4" /></span>
                <span className="text-sm font-semibold text-primary">Choose a file to attach</span>
                <span className="text-xs text-muted">PDF, STEP, STP, DWG, DXF, PNG or JPG up to 10 MB</span>
              </label>
            ) : (
              <div className="mt-2 border border-border bg-surface-low p-4" aria-live="polite">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center border border-border bg-white text-primary"><Paperclip aria-hidden="true" className="h-4 w-4" /></span>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-primary">{file.name}</p><p className="mt-1 text-xs text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p></div>
                  <button type="button" onClick={removeFile} aria-label={`Remove ${file.name}`} className="grid h-9 w-9 shrink-0 place-items-center text-muted transition-colors hover:bg-white hover:text-primary"><X aria-hidden="true" className="h-4 w-4" /></button>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden bg-white"><div className="h-full bg-[#c62828] transition-[width] duration-150" style={{ width: `${uploadProgress}%` }} /></div>
                <p className="mt-2 text-[11px] text-muted">{uploadProgress < 100 ? "Preparing secure upload..." : "File ready to send with your request."}</p>
              </div>
            )}
            {errors.file ? <p className="mt-2 text-xs text-[#8f1d1d]" role="alert">{errors.file}</p> : null}
          </div>

          <div className="mt-8 flex flex-col-reverse justify-between gap-3 sm:flex-row"><Button type="button" variant="ghost" iconPosition="left" icon={<ArrowLeft aria-hidden="true" className="h-4 w-4" />} onClick={previousStep}>Back</Button><Button type="button" onClick={nextStep} icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}>Review request</Button></div>
        </section>
      ) : null}

      {step === 3 ? (
        <section aria-labelledby="step-review">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#c62828]">Step 3 of 3</p>
          <h2 id="step-review" className="mt-2 text-2xl font-semibold text-primary">Review your request</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">Check the details below. You can go back to edit anything before sending.</p>
          <div className="mt-7 divide-y divide-border border border-border">
            <div className="grid gap-2 px-4 py-4 sm:grid-cols-[150px_1fr]"><p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">Project</p><p className="text-sm text-primary">{values.projectType || "Not specified"} / {values.material || "Material recommendation"}</p></div>
            <div className="grid gap-2 px-4 py-4 sm:grid-cols-[150px_1fr]"><p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">Application</p><p className="text-sm text-primary">{values.application || "Not specified"}{values.quantity ? ` - ${values.quantity}` : ""}</p></div>
            <div className="grid gap-2 px-4 py-4 sm:grid-cols-[150px_1fr]"><p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">Contact</p><p className="text-sm text-primary">{values.name} / {values.company}<br /><span className="text-muted">{values.email} / {values.phone}</span></p></div>
            <div className="grid gap-2 px-4 py-4 sm:grid-cols-[150px_1fr]"><p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">Attachment</p><p className="text-sm text-primary">{file ? file.name : "No file attached"}</p></div>
          </div>
          <div className="mt-6">
            <label className="flex items-start gap-3 text-xs leading-5 text-muted"><input type="checkbox" checked={consent} onChange={(event) => { setConsent(event.target.checked); setErrors((current) => ({ ...current, consent: undefined })); }} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "consent-error" : undefined} className="mt-1 h-4 w-4 accent-[#c62828]" /> I agree that Xingtai Oubei may use these details to respond to this technical request.</label>
            {errors.consent ? <p id="consent-error" className="mt-2 text-xs text-[#8f1d1d]" role="alert">{errors.consent}</p> : null}
          </div>
          <div className="mt-8 flex flex-col-reverse justify-between gap-3 sm:flex-row"><Button type="button" variant="ghost" disabled={status === "submitting"} iconPosition="left" icon={<ArrowLeft aria-hidden="true" className="h-4 w-4" />} onClick={previousStep}>Back and edit</Button><Button type="submit" disabled={status === "submitting"} icon={status === "submitting" ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> : <ArrowRight aria-hidden="true" className="h-4 w-4" />}>{status === "submitting" ? "Sending request..." : "Send request"}</Button></div>
        </section>
      ) : null}
    </form>
  );
}

export default function QuotePage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-primary text-white">
          <Container className="py-8 sm:py-10"><Breadcrumbs dark items={[{ label: "Request a quote" }]} /></Container>
          <div className="border-t border-white/15">
            <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-20 lg:py-20">
              <div className="max-w-xl">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#ff8c8c]">Engineering intake / 01</p>
                <h1 className="mt-5 text-4xl font-semibold leading-[1.03] tracking-tight sm:text-6xl">Tell us what needs to seal.</h1>
                <p className="mt-6 max-w-lg text-base leading-7 text-white/70 sm:text-lg">Share your drawing, operating conditions, and target volumes. Our team will respond with a material and manufacturing path built around the application.</p>
                <div className="mt-10 grid gap-4 border-t border-white/15 pt-7 text-sm text-white/70 sm:grid-cols-2">
                  <div className="flex items-start gap-3"><ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#ff8c8c]" /><span><strong className="block font-semibold text-white">Engineering review</strong>One business day for a first response</span></div>
                  <div className="flex items-start gap-3"><FileUp aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#ff8c8c]" /><span><strong className="block font-semibold text-white">Secure attachments</strong>Drawings up to 10 MB per request</span></div>
                </div>
                <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/64"><a href="mailto:sales@xingtaioubei.com" className="inline-flex items-center gap-2 transition-colors hover:text-white"><Mail aria-hidden="true" className="h-4 w-4" /> sales@xingtaioubei.com</a><a href="tel:+863190000000" className="inline-flex items-center gap-2 transition-colors hover:text-white"><Phone aria-hidden="true" className="h-4 w-4" /> +86 319 000 0000</a></div>
              </div>
              <div className="border border-border bg-white p-5 text-primary sm:p-8 lg:p-10"><QuoteForm /></div>
            </Container>
          </div>
        </section>
        <section className="border-b border-border bg-surface-low py-8"><Container className="flex flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between"><p className="inline-flex items-center gap-2"><CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[#19733a]" /> No commitment - a technical conversation comes first.</p><Link href="/resources" className="inline-flex items-center gap-1 font-semibold text-primary hover:text-[#c62828]">Read our engineering guides <ChevronRight aria-hidden="true" className="h-4 w-4" /></Link></Container></section>
      </main>
      <Footer />
    </>
  );
}
