"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Award, Download, Printer } from "lucide-react";

interface CertificateProps {
  traineeName: string;
  drillName: string;
  score: number;
  timeElapsed: number;
  date: Date;
  errors: number;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function getGrade(score: number): string {
  if (score >= 90) return "DISTINCTION";
  if (score >= 80) return "FIRST CLASS";
  if (score >= 70) return "SECOND CLASS";
  if (score >= 60) return "PASS";
  return "NEEDS IMPROVEMENT";
}

export function CertificatePreview({
  traineeName,
  drillName,
  score,
  timeElapsed,
  date,
  errors,
}: CertificateProps) {
  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="certificate-content bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-lg border-4 border-double border-amber-600 text-center relative overflow-hidden"
      style={{ aspectRatio: "1.414" }}
    >
      {/* Decorative corners */}
      <div className="absolute top-2 left-2 w-16 h-16 border-l-4 border-t-4 border-amber-600 rounded-tl-lg" />
      <div className="absolute top-2 right-2 w-16 h-16 border-r-4 border-t-4 border-amber-600 rounded-tr-lg" />
      <div className="absolute bottom-2 left-2 w-16 h-16 border-l-4 border-b-4 border-amber-600 rounded-bl-lg" />
      <div className="absolute bottom-2 right-2 w-16 h-16 border-r-4 border-b-4 border-amber-600 rounded-br-lg" />

      {/* Header */}
      <div className="mb-4">
        <div className="text-amber-800 text-sm tracking-widest mb-1">
          SCHOOL OF ARTILLERY, DEOLALI
        </div>
        <h1 className="text-3xl font-bold text-amber-900 tracking-wide">
          CERTIFICATE OF COMPLETION
        </h1>
        <div className="text-amber-700 text-sm mt-1">
          3D Interactive Training System
        </div>
      </div>

      {/* Award icon */}
      <div className="flex justify-center my-4">
        <div className="p-3 bg-amber-100 rounded-full border-2 border-amber-400">
          <Award className="h-10 w-10 text-amber-600" />
        </div>
      </div>

      {/* Main content */}
      <div className="space-y-3 text-amber-900">
        <p className="text-sm">This is to certify that</p>
        <p className="text-2xl font-bold border-b-2 border-amber-400 inline-block px-8 py-1">
          {traineeName || "Trainee"}
        </p>
        <p className="text-sm">has successfully completed the training drill</p>
        <p className="text-xl font-semibold text-amber-800">{drillName}</p>
      </div>

      {/* Score section */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-white/50 rounded-lg p-3 border border-amber-300">
          <div className="text-2xl font-bold text-amber-800">{score}%</div>
          <div className="text-xs text-amber-600">SCORE</div>
        </div>
        <div className="bg-white/50 rounded-lg p-3 border border-amber-300">
          <div className="text-2xl font-bold text-amber-800">
            {formatTime(timeElapsed)}
          </div>
          <div className="text-xs text-amber-600">TIME</div>
        </div>
        <div className="bg-white/50 rounded-lg p-3 border border-amber-300">
          <div className="text-2xl font-bold text-amber-800">{errors}</div>
          <div className="text-xs text-amber-600">ERRORS</div>
        </div>
      </div>

      {/* Grade */}
      <div className="mt-4">
        <span
          className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${
            score >= 70
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {getGrade(score)}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-between items-end text-xs text-amber-700">
        <div className="text-left">
          <div>Date: {formattedDate}</div>
          <div>Cert. No: SOA-{Date.now().toString().slice(-8)}</div>
        </div>
        <div className="text-right">
          <div className="border-t border-amber-400 pt-1 px-4">
            Instructor Signature
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <Award className="h-64 w-64 text-amber-900" />
      </div>
    </div>
  );
}

export function CertificateGenerator({
  drillName,
  score,
  timeElapsed,
  errors,
}: Omit<CertificateProps, "traineeName" | "date">) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Training_Certificate_${drillName.replace(/\s+/g, "_")}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !certificateRef.current) return;

    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch {
          return "";
        }
      })
      .join("\n");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Training Certificate</title>
          <style>
            ${styles}
            @media print {
              body { margin: 0; }
              .certificate-content { margin: 20mm; }
            }
          </style>
        </head>
        <body>
          ${certificateRef.current.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="default">
          <Award className="h-4 w-4 mr-2" />
          Generate Certificate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Training Certificate
          </DialogTitle>
        </DialogHeader>

        <div ref={certificateRef}>
          <CertificatePreview
            traineeName="Cadet"
            drillName={drillName}
            score={score}
            timeElapsed={timeElapsed}
            date={new Date()}
            errors={errors}
          />
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={handleDownload} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
