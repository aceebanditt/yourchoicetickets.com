"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { BulkUploadPreview } from "./bulk-upload-preview";
import { BulkUploadService } from "@/lib/services/bulk-upload-service";
import type { Event } from "@/lib/types/event";

export function BulkUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Partial<Event>[]>([]);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv") && !file.name.endsWith(".xlsx")) {
      toast({
        title: "Invalid file format",
        description: "Please upload a CSV or Excel file",
        variant: "destructive",
      });
      return;
    }

    setFile(file);
    setProgress(0);
    setLoading(true);

    try {
      const data = await BulkUploadService.parseCSV(file);
      const validation = await BulkUploadService.validateEvents(data);
      
      setPreviewData(data);
      setValidationErrors(validation.success ? [] : validation.errors);
      
      if (!validation.success) {
        toast({
          title: "Validation errors found",
          description: "Please review the errors and fix the data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error parsing file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || validationErrors.length > 0) return;

    setLoading(true);
    setProgress(0);

    try {
      const events = await BulkUploadService.uploadEvents(previewData as Event[], "system");
      setProgress(100);
      
      toast({
        title: "Upload successful",
        description: `${events.length} events have been uploaded`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-2 border-dashed rounded-lg p-8 text-center">
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          disabled={loading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer text-primary hover:text-primary/80"
        >
          Choose a file
        </label>
        {file && <p className="mt-2 text-sm">{file.name}</p>}
      </div>

      {previewData.length > 0 && (
        <BulkUploadPreview
          data={previewData}
          validationErrors={validationErrors}
        />
      )}

      {loading && (
        <Progress value={progress} className="w-full" />
      )}

      <Button
        type="submit"
        disabled={!file || loading || validationErrors.length > 0}
        className="w-full"
      >
        {loading ? "Uploading..." : "Upload Events"}
      </Button>
    </form>
  );
}