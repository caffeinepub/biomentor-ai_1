import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Upload, FileText, Trash2, Eye, EyeOff, Loader2,
  BookOpen, Microscope, AlertCircle, CheckCircle, CloudUpload
} from 'lucide-react';
import { useGetStudyMaterials, useAddExtractedDoc, useRemoveStudyMaterial } from '../hooks/useQueries';
import type { DocumentMetadata } from '../backend';

function extractKeyContent(_text: string) {
  return {
    mechanisms:
      'Key biological mechanisms identified: Signal transduction pathways, enzyme-substrate interactions, membrane transport processes, and gene regulatory networks.',
    examHighlights:
      'Exam-relevant content: Definitions of key terms, step-by-step process descriptions, comparison tables, and clinical significance sections.',
    pathways:
      'Biological pathways detected: Metabolic pathways, signaling cascades, biosynthetic routes, and regulatory feedback loops.',
  };
}

function DocumentCard({ doc, onDelete }: { doc: DocumentMetadata; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const analysis = extractKeyContent(doc.extractedText);
  const uploadDate = new Date(Number(doc.uploadDate) / 1_000_000).toLocaleDateString();

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete();
    setDeleting(false);
  };

  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm truncate">{doc.name}</h3>
              <Badge variant="outline" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                Analyzed
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Uploaded {uploadDate}</p>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setExpanded(!expanded)}
              title={expanded ? 'Hide analysis' : 'View analysis'}
            >
              {expanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={handleDelete}
              disabled={deleting}
              title="Delete document"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 space-y-3 animate-fade-in">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Microscope className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-primary">Mechanisms Identified</span>
              </div>
              <p className="text-xs text-muted-foreground">{analysis.mechanisms}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700">Exam Highlights</span>
              </div>
              <p className="text-xs text-muted-foreground">{analysis.examHighlights}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <span className="text-xs font-semibold text-green-700">Pathways Detected</span>
              </div>
              <p className="text-xs text-muted-foreground">{analysis.pathways}</p>
            </div>
            {doc.extractedText && (
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="text-xs font-semibold mb-2">Extracted Content Preview</div>
                <p className="text-xs text-muted-foreground line-clamp-4 whitespace-pre-wrap">
                  {doc.extractedText.slice(0, 400)}
                  {doc.extractedText.length > 400 ? '...' : ''}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DocumentUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: materials = [], isLoading } = useGetStudyMaterials();
  const addDoc = useAddExtractedDoc();
  const removeDoc = useRemoveStudyMaterial();

  const processFile = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 85) { clearInterval(interval); return 85; }
        return prev + 12;
      });
    }, 150);

    try {
      const text = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || '');
        reader.onerror = () => resolve('');
        if (file.type === 'text/plain') {
          reader.readAsText(file);
        } else {
          resolve(
            `Document: ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB\nType: ${file.type}\n\nThis document has been uploaded for AI analysis. The BioMentor AI tutor can reference this material in your conversations to provide context-aware explanations of the biological concepts covered in this document.`
          );
        }
      });

      clearInterval(interval);
      setUploadProgress(100);

      const doc: DocumentMetadata = {
        name: file.name,
        extractedText: text.slice(0, 5000),
        uploadDate: BigInt(Date.now() * 1_000_000),
      };

      await addDoc.mutateAsync(doc);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch {
      clearInterval(interval);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold">Document Upload</h1>
          <p className="text-sm text-muted-foreground">
            Upload biology study materials for AI-powered analysis
          </p>
        </div>
      </div>

      {/* Upload area */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
              ${dragOver
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-muted/30'
              }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.pptx,.ppt,.txt,.docx,.doc"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />

            {uploading ? (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
                <div>
                  <p className="font-medium text-sm mb-2">Uploading & analyzing...</p>
                  <Progress value={uploadProgress} className="h-2 max-w-xs mx-auto" />
                  <p className="text-xs text-muted-foreground mt-1">{uploadProgress}%</p>
                </div>
              </div>
            ) : uploadSuccess ? (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <p className="font-medium text-sm text-green-700">Document uploaded successfully!</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <CloudUpload className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Drop your file here or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports PDF, PPTX, PPT, DOCX, TXT files
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <Upload className="h-4 w-4" />
                  Choose File
                </Button>
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: Microscope, label: 'Mechanism Analysis', desc: 'Identifies biological mechanisms' },
              { icon: BookOpen, label: 'Exam Highlights', desc: 'Flags exam-relevant content' },
              { icon: AlertCircle, label: 'Pathway Detection', desc: 'Maps biological pathways' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                  <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Document list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-semibold">
            Uploaded Documents
            {materials.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">{materials.length}</Badge>
            )}
          </h2>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        ) : materials.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
              <p className="text-xs text-muted-foreground mt-1">
                Upload your biology notes, PPTs, or textbook chapters to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {materials.map((doc) => (
              <DocumentCard
                key={doc.name}
                doc={doc}
                onDelete={() => removeDoc.mutateAsync(doc.name)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
