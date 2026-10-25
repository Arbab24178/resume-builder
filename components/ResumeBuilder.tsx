"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ACCENTS, emptyResume, type ResumeData, type Settings } from "@/lib/types";
import { loadResume, clearStoredResume, saveResume } from "@/lib/storage";
import { hasContent, reviveResume } from "@/lib/utils";
import { sampleResume } from "@/lib/sample";
import { Editor, type ListKey } from "./Editor";
import { ResumePreview } from "./ResumePreview";
import { CheckIcon, DownloadIcon, EraserIcon, FileIcon, SparkleIcon } from "./icons";

const PAGE_HEIGHT = 1123; // A4 at 96dpi
const PAGE_WIDTH = 794;

type SaveState = "idle" | "saving" | "saved" | "error";

export function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [hydrated, setHydrated] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [scale, setScale] = useState(0.7);
  const [pageHeight, setPageHeight] = useState(PAGE_HEIGHT);
  const [fitMode, setFitMode] = useState<"width" | "page">("width");

  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = loadResume();
    if (stored) setData(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setSaveState("saving");
    const timer = window.setTimeout(() => {
      setSaveState(saveResume(data) ? "saved" : "error");
    }, 500);
    return () => window.clearTimeout(timer);
  }, [data, hydrated]);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const compute = () => {
      const horizontalPadding = window.innerWidth <= 640 ? 20 : 52;
      const verticalPadding = window.innerWidth <= 640 ? 40 : 52;
      const widthScale = (element.clientWidth - horizontalPadding) / PAGE_WIDTH;
      const heightScale = (element.clientHeight - verticalPadding) / pageHeight;
      const target = fitMode === "page" ? Math.min(widthScale, heightScale) : widthScale;
      setScale(Math.min(1, Math.max(0.26, target)));
    };
    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(element);
    window.addEventListener("resize", compute);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [mobileView, fitMode, pageHeight]);

  const onMeasure = useCallback((height: number) => setPageHeight(height), []);

  const pageCount = Math.max(1, Math.ceil((pageHeight - 2) / PAGE_HEIGHT));

  const setPersonal = (field: keyof ResumeData["personal"], value: string) =>
    setData((current) => ({ ...current, personal: { ...current.personal, [field]: value } }));

  const setSummary = (value: string) => setData((current) => ({ ...current, summary: value }));

  const setList = <K extends ListKey>(key: K, items: ResumeData[K]) =>
    setData((current) => ({ ...current, [key]: items }));

  const setCertifications = (items: string[]) =>
    setData((current) => ({ ...current, certifications: items }));

  const setSettings = (patch: Partial<Settings>) =>
    setData((current) => ({ ...current, settings: { ...current.settings, ...patch } }));

  const loadExample = () => {
    if (hasContent(data) && !window.confirm("Replace your current content with the example resume?")) {
      return;
    }
    setData(reviveResume(sampleResume));
  };

  const clearAll = () => {
    if (!window.confirm("Clear all resume content? This cannot be undone.")) return;
    clearStoredResume();
    setData(emptyResume());
  };

  const printResume = () => {
    // Use the candidate's name for the suggested PDF filename.
    const originalTitle = document.title;
    const name = data.personal.fullName.trim();
    if (name) document.title = `${name} — Resume`;

    const restoreTitle = () => {
      document.title = originalTitle;
      window.removeEventListener("afterprint", restoreTitle);
    };
    window.addEventListener("afterprint", restoreTitle);
    window.print();
  };

  const saveLabel = useMemo(() => {
    if (!hydrated) return "Loading…";
    if (saveState === "saving") return "Saving…";
    if (saveState === "saved") return "Saved";
    if (saveState === "error") return "Not saved";
    return "Draft";
  }, [hydrated, saveState]);

  return (
    <div className="appShell">
      <header className="topbar">
        <div className="brand">
          <span className="brandMark" aria-hidden="true">
            <FileIcon width={19} height={19} />
          </span>
          <div className="brandText">
            <h1>Resume Studio</h1>
            <p>Clean, professional resumes — drafted live</p>
          </div>
        </div>

        <div className="topbarActions">
          <span className={`saveChip save-${saveState}`} aria-live="polite">
            {saveState === "saved" ? <CheckIcon width={13} height={13} /> : <span className="saveDot" />}
            {saveLabel}
          </span>
          <button
            type="button"
            className="ghostBtn"
            onClick={loadExample}
            aria-label="Load example resume"
            title="Load example resume"
          >
            <SparkleIcon />
            <span className="btnLabel">Example</span>
          </button>
          <button
            type="button"
            className="ghostBtn ghostBtnSubtle"
            onClick={clearAll}
            aria-label="Clear all resume content"
            title="Clear all resume content"
          >
            <EraserIcon />
            <span className="btnLabel">Clear</span>
          </button>
          <button
            type="button"
            className="primaryBtn"
            onClick={printResume}
            title="Opens the print dialog — choose “Save as PDF”"
          >
            <DownloadIcon />
            Download PDF
          </button>
        </div>
      </header>

      <main className={`mainArea view-${mobileView}`}>
        <section className="editorPane" aria-label="Resume editor">
          <div className="editorIntro">
            <p>
              Fill in your details. Everything is saved in your browser — nothing leaves this
              device.
            </p>
          </div>
          <Editor
            data={data}
            onPersonal={setPersonal}
            onSummary={setSummary}
            onList={setList}
            onCertifications={setCertifications}
          />
          <footer className="editorFooter">
            <span>Tip: press {`Ctrl/Cmd + P`} to print at any time.</span>
          </footer>
        </section>

        <aside className="previewPanel" aria-label="Live preview">
          <div className="previewBar">
            <div className="segmented" role="group" aria-label="Template style">
              <button
                type="button"
                aria-pressed={data.settings.template === "classic"}
                onClick={() => setSettings({ template: "classic" })}
              >
                Classic
              </button>
              <button
                type="button"
                aria-pressed={data.settings.template === "modern"}
                onClick={() => setSettings({ template: "modern" })}
              >
                Modern
              </button>
            </div>

            <div className="swatches" role="group" aria-label="Accent color">
              {ACCENTS.map((accent) => (
                <button
                  key={accent.id}
                  type="button"
                  className="swatch"
                  style={{ background: accent.value }}
                  aria-label={accent.label}
                  aria-pressed={data.settings.accent === accent.value}
                  title={accent.label}
                  onClick={() => setSettings({ accent: accent.value })}
                />
              ))}
            </div>

            <button
              type="button"
              className="fitBtn"
              aria-pressed={fitMode === "page"}
              onClick={() => setFitMode((mode) => (mode === "page" ? "width" : "page"))}
              title="Show the whole page in the preview"
            >
              Fit page
            </button>

            <span className="pageChip">
              A4 · {pageCount} page{pageCount > 1 ? "s" : ""}
            </span>
          </div>

          <div className="previewViewport" ref={viewportRef}>
            <div
              className="paperFrame"
              style={{ width: PAGE_WIDTH * scale, height: pageHeight * scale }}
            >
              <div className="paperScaler" style={{ transform: `scale(${scale})` }}>
                <ResumePreview data={data} onMeasure={onMeasure} />
              </div>
              {Array.from({ length: pageCount - 1 }).map((_, index) => (
                <div
                  key={`guide-${index}`}
                  className="pageGuide"
                  style={{ top: PAGE_HEIGHT * (index + 1) * scale }}
                >
                  <span>Page {index + 2}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      <nav className="mobileTabs" aria-label="View">
        <button
          type="button"
          aria-pressed={mobileView === "edit"}
          onClick={() => setMobileView("edit")}
        >
          Edit
        </button>
        <button
          type="button"
          aria-pressed={mobileView === "preview"}
          onClick={() => setMobileView("preview")}
        >
          Preview
        </button>
      </nav>
    </div>
  );
}
