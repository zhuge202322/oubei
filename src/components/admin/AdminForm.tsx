import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldClass = "mt-2 w-full border border-[#c7d2e1] bg-white px-3 text-sm text-[#1c2b3f] outline-none focus:border-[#0b2545] focus:ring-2 focus:ring-[#0b2545]/15";

export function AdminField({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-sm font-medium text-[#20324a]">{label}{children}</label>;
}

export function AdminInput(props: InputHTMLAttributes<HTMLInputElement>) { return <input {...props} className={`${fieldClass} h-11 ${props.className || ""}`} />; }
export function AdminTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea {...props} className={`${fieldClass} min-h-28 py-3 ${props.className || ""}`} />; }
export function AdminSelect(props: SelectHTMLAttributes<HTMLSelectElement>) { return <select {...props} className={`${fieldClass} h-11 ${props.className || ""}`} />; }
