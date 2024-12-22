import { BulkUploadForm } from "@/components/admin/bulk-upload-form";

export default function BulkUploadPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Bulk Upload Events</h1>
      <div className="max-w-xl mx-auto">
        <BulkUploadForm />
      </div>
    </div>
  );
}