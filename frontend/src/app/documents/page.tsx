'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    Upload,
    FileText,
    Image,
    Trash2,
    Download,
    ArrowLeft,
    Search,
    Sparkles,
    CheckCircle,
    Clock,
    AlertCircle,
    Loader2,
    Eye,
    X,
    FileCheck,
    ChevronRight,
    Factory
} from 'lucide-react';

interface Document {
    id: string;
    filename: string;
    document_type: string;
    file_size: number;
    status: string;
    extracted_data?: any;
    created_at: string;
}

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [extracting, setExtracting] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/v1/documents/');
            const data = await res.json();
            setDocuments(data.documents || []);
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    }, []);

    const handleFiles = async (files: File[]) => {
        for (const file of files) {
            await uploadFile(file);
        }
    };

    const uploadFile = async (file: File) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('document_type', detectDocumentType(file.name));

            const res = await fetch('http://localhost:8000/api/v1/documents/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                await fetchDocuments();
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    const extractData = async (docId: string) => {
        setExtracting(docId);
        try {
            const res = await fetch(`http://localhost:8000/api/v1/documents/${docId}/extract`, {
                method: 'POST',
            });
            if (res.ok) {
                await fetchDocuments();
            }
        } catch (error) {
            console.error('Extraction failed:', error);
        } finally {
            setExtracting(null);
        }
    };

    const deleteDocument = async (docId: string) => {
        if (!confirm('Delete this document?')) return;
        try {
            await fetch(`http://localhost:8000/api/v1/documents/${docId}`, {
                method: 'DELETE',
            });
            setDocuments(documents.filter(d => d.id !== docId));
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const detectDocumentType = (filename: string): string => {
        const lower = filename.toLowerCase();
        if (lower.includes('invoice')) return 'invoice';
        if (lower.includes('packing') || lower.includes('list')) return 'packing_list';
        if (lower.includes('bill') || lower.includes('lading')) return 'bill_of_lading';
        if (lower.includes('certificate')) return 'certificate';
        return 'other';
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'extracted':
                return <CheckCircle className="w-5 h-5 text-emerald-400" />;
            case 'processing':
                return <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-400" />;
            default:
                return <Clock className="w-5 h-5 text-gray-400" />;
        }
    };

    const filteredDocs = documents.filter(doc =>
        doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.document_type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-white">Documents</h1>
                            <p className="text-sm text-gray-400">Upload and manage trade documents</p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-400">
                        {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Upload Zone */}
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-12 text-center mb-8 transition-all ${dragActive
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-white/20 bg-white/5 hover:border-white/40'
                        }`}
                >
                    <input
                        type="file"
                        multiple
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    {uploading ? (
                        <div className="flex flex-col items-center">
                            <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
                            <p className="text-white font-medium">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                                <Upload className="w-8 h-8 text-violet-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Drop files here or click to upload</h3>
                            <p className="text-gray-400 text-sm">PDF, PNG, JPG • Max 10MB per file</p>
                        </div>
                    )}
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-medium">AI Data Extraction</h4>
                            <p className="text-sm text-gray-500">Auto-extract HS codes & values</p>
                        </div>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                            <FileCheck className="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-medium">Instant Validation</h4>
                            <p className="text-sm text-gray-500">Verify against EU regulations</p>
                        </div>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                            <Factory className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-medium">CBAM Ready</h4>
                            <p className="text-sm text-gray-500">Generate reports from docs</p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                </div>

                {/* Documents List */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    </div>
                ) : filteredDocs.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Documents Yet</h3>
                        <p className="text-gray-400">Upload invoices, packing lists, or certificates</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredDocs.map((doc) => (
                            <div
                                key={doc.id}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                            {doc.filename.match(/\.(png|jpg|jpeg)$/i) ? (
                                                <Image className="w-6 h-6 text-violet-400" />
                                            ) : (
                                                <FileText className="w-6 h-6 text-violet-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-white">{doc.filename}</h3>
                                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                                <span className="capitalize">{doc.document_type.replace('_', ' ')}</span>
                                                <span>•</span>
                                                <span>{formatFileSize(doc.file_size)}</span>
                                                <span>•</span>
                                                <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(doc.status)}
                                            <span className="text-sm text-gray-400 capitalize">{doc.status}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {doc.status !== 'extracted' && (
                                                <button
                                                    onClick={() => extractData(doc.id)}
                                                    disabled={extracting === doc.id}
                                                    className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    {extracting === doc.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Sparkles className="w-4 h-4" />
                                                    )}
                                                    Extract
                                                </button>
                                            )}
                                            {doc.extracted_data && (
                                                <button
                                                    onClick={() => setPreviewDoc(doc)}
                                                    className="p-2 bg-violet-500/20 text-violet-400 rounded-lg hover:bg-violet-500/30 transition-colors"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteDocument(doc.id)}
                                                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {doc.extracted_data && (
                                    <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {doc.extracted_data.hs_code && (
                                            <div>
                                                <p className="text-xs text-gray-500">HS Code</p>
                                                <p className="text-emerald-400 font-medium">{doc.extracted_data.hs_code}</p>
                                            </div>
                                        )}
                                        {doc.extracted_data.product_description && (
                                            <div>
                                                <p className="text-xs text-gray-500">Product</p>
                                                <p className="text-white">{doc.extracted_data.product_description}</p>
                                            </div>
                                        )}
                                        {doc.extracted_data.net_weight_kg && (
                                            <div>
                                                <p className="text-xs text-gray-500">Net Weight</p>
                                                <p className="text-white">{doc.extracted_data.net_weight_kg.toLocaleString()} kg</p>
                                            </div>
                                        )}
                                        {doc.extracted_data.total_value && (
                                            <div>
                                                <p className="text-xs text-gray-500">Value</p>
                                                <p className="text-white">{doc.extracted_data.currency} {doc.extracted_data.total_value.toLocaleString()}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Preview Modal */}
            {previewDoc && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">Extracted Data</h2>
                                <p className="text-sm text-gray-400">{previewDoc.filename}</p>
                            </div>
                            <button onClick={() => setPreviewDoc(null)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <pre className="bg-black/30 rounded-xl p-4 text-sm text-gray-300 overflow-x-auto">
                                {JSON.stringify(previewDoc.extracted_data, null, 2)}
                            </pre>
                            <div className="mt-6 flex gap-4">
                                <Link
                                    href="/cbam"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium text-center hover:from-emerald-600 hover:to-teal-700 transition-all"
                                >
                                    Create CBAM Report
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
