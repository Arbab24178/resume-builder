# Resume Studio

A browser-based resume builder: fill in your details on the left, watch a print-ready A4 resume
take shape on the right, then export it as PDF.

Built with Next.js (App Router), React, TypeScript and plain CSS.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # production build
npm start       # serve the production build
```

## Features

- **Live A4 preview** — a real 794 × 1123 px page, scaled to the panel, with a **Fit page**
  toggle for seeing the whole sheet at once and page-break guides when content runs long.
- **Two templates** — Classic (centred serif header, ruled sections) and Modern (accent rail,
  coloured section labels), each with five accent colours.
- **Structured editor** — personal details, summary, work experience, projects, education,
  skill groups and certifications. Repeatable entries can be reordered or removed.
- **Print to PDF** — "Download PDF" opens the print dialog with dedicated `@page A4` styles, so
  the export contains only the resume, with no app chrome and real page margins.
- **Autosave** — every change is saved to `localStorage` after a short debounce. Nothing is sent
  to a server.
- **Responsive** — split view on desktop, Edit/Preview tabs on mobile.
- **Accessible** — labelled inputs, `aria-pressed` controls, keyboard-reachable list actions,
  reduced-motion support.

## Structure

```
app/
  layout.tsx            metadata + document shell
  page.tsx              renders the builder
  globals.css           design system, resume typography, responsive + print rules
components/
  ResumeBuilder.tsx     state, autosave, PDF export, preview scaling
  Editor.tsx            all resume sections
  ResumePreview.tsx     A4 document (Classic / Modern templates)
  fields.tsx            field, section and repeatable-item primitives
  icons.tsx             inline SVG icon set
lib/
  types.ts              data model, accent palette, empty resume
  sample.ts             example resume content
  storage.ts            localStorage load/save/clear
  utils.ts              bullets, date ranges, links, hydration/sanitising
```

## Notes

- PDF export uses the browser's print pipeline (choose **Save as PDF**). This keeps the app
  dependency-free and produces selectable, ATS-readable text — no canvas or rasterisation.
- Data lives only in the current browser profile. Clearing site data removes the draft.
