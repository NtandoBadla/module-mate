import { useRef, useState } from "react";
import { UploadCloud, FileText, X, Loader2 } from "lucide-react";
import { extractTextFromPDF } from "@/lib/pdf-parser";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
  onDocumentLoaded: (text: string, fileName: string) => void;
  onClear: () => void;
  uploadedFileName: string | null;
}

export function DocumentUpload({ onDocumentLoaded, onClear, uploadedFileName }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("File must be under 20MB.");
      return;
    }

    setError(null);
    setIsProcessing(true);
    try {
      const text = await extractTextFromPDF(file);
      if (!text.trim()) {
        setError("Could not extract text from this PDF. It may be scanned/image-based.");
        return;
      }
      onDocumentLoaded(text, file.name);
    } catch {
      setError("Failed to read the PDF. Please try another file.");
    } finally {
      setIsProcessing(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  }

  if (uploadedFileName) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm">
        <FileText className="h-4 w-4 shrink-0 text-primary" />
        <span className="flex-1 truncate text-foreground">{uploadedFileName}</span>
        <button onClick={onClear} className="text-muted-foreground hover:text-destructive transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pb-2 sm:px-6">
      <div
        onClick={() => !isProcessing && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "mx-auto flex max-w-2xl cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-accent/30",
          isProcessing && "pointer-events-none opacity-60"
        )}
      >
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
        {isProcessing ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Reading your module guide...</p>
          </>
        ) : (
          <>
            <UploadCloud className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Upload your module guide</p>
              <p className="text-xs text-muted-foreground">Drag & drop or click to browse · PDF only · Max 20MB</p>
            </div>
          </>
        )}
      </div>
      {error && <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-destructive">{error}</p>}
    </div>
  );
}
