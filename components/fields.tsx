"use client";

import { useId, type ReactNode } from "react";
import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from "./icons";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "url";
  hint?: string;
  autoComplete?: string;
  wide?: boolean;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
  autoComplete,
  wide,
}: TextFieldProps) {
  const id = useId();
  return (
    <div className={`field${wide ? " fieldWide" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        spellCheck={type === "text"}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint ? <p className="fieldHint">{hint}</p> : null}
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
  counter?: boolean;
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  rows = 4,
  counter,
}: TextAreaFieldProps) {
  const id = useId();
  return (
    <div className="field fieldWide">
      <div className="fieldLabelRow">
        <label htmlFor={id}>{label}</label>
        {counter ? <span className="charCount">{value.trim().length} chars</span> : null}
      </div>
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint ? <p className="fieldHint">{hint}</p> : null}
    </div>
  );
}

interface SectionCardProps {
  step: number;
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function SectionCard({ step, title, description, children, action }: SectionCardProps) {
  return (
    <section className="card" aria-labelledby={`section-${step}`}>
      <div className="cardHead">
        <div className="cardHeadText">
          <span className="stepBadge" aria-hidden="true">
            {String(step).padStart(2, "0")}
          </span>
          <div>
            <h2 id={`section-${step}`}>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
        </div>
        {action}
      </div>
      <div className="cardBody">{children}</div>
    </section>
  );
}

interface ItemCardProps {
  label: string;
  meta?: string;
  index: number;
  total: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  removeLabel: string;
  children: ReactNode;
}

export function ItemCard({
  label,
  meta,
  index,
  total,
  onMove,
  onRemove,
  removeLabel,
  children,
}: ItemCardProps) {
  return (
    <div className="itemCard">
      <div className="itemCardHead">
        <div className="itemCardTitle">
          <span className="itemIndex">{index + 1}</span>
          <div>
            <p className="itemLabel">{label}</p>
            {meta ? <p className="itemMeta">{meta}</p> : null}
          </div>
        </div>
        <div className="itemActions">
          <button
            type="button"
            className="iconBtn"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            aria-label={`Move ${label} up`}
            title="Move up"
          >
            <ArrowUpIcon />
          </button>
          <button
            type="button"
            className="iconBtn"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            aria-label={`Move ${label} down`}
            title="Move down"
          >
            <ArrowDownIcon />
          </button>
          <button
            type="button"
            className="iconBtn iconBtnDanger"
            onClick={onRemove}
            aria-label={removeLabel}
            title={removeLabel}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

interface AddButtonProps {
  label: string;
  onClick: () => void;
}

export function AddButton({ label, onClick }: AddButtonProps) {
  return (
    <button type="button" className="addBtn" onClick={onClick}>
      <span className="addGlyph" aria-hidden="true">
        +
      </span>
      {label}
    </button>
  );
}
