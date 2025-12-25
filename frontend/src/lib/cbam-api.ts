/**
 * CBAM Engine API Service
 * 
 * Frontend API client for the CBAM ML Compliance Engine.
 * Connects to backend endpoints for classification, extraction, and XML generation.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const CBAM_ENGINE_URL = `${API_BASE}/api/v1/cbam-engine`;

// Types
export interface ClassifyRequest {
    product_description: string;
    include_alternatives?: boolean;
}

export interface ClassifyResponse {
    cn_code: string;
    cn_code_formatted: string;
    cn_description: string;
    confidence: number;
    review_status: string;
    chapter: string;
    chapter_description: string;
    is_cbam_relevant: boolean;
    cbam_category: string | null;
    emission_factor: {
        direct_tco2_per_tonne: number;
        indirect_tco2_per_tonne: number;
        electricity_mwh_per_tonne: number;
    } | null;
    alternatives: Array<{
        cn_code: string;
        description: string;
        confidence: number;
    }> | null;
    matched_keywords: string[];
    notes: string[];
}

export interface ExtractResponse {
    document_type: string | null;
    reporting_period_start: string | null;
    reporting_period_end: string | null;
    electricity_consumption_kwh: number | null;
    electricity_consumption_mwh: number | null;
    gross_weight_kg: number | null;
    country_of_origin: string | null;
    producer_name: string | null;
    producer_address: string | null;
    installation_id: string | null;
    product_description: string | null;
    confidence_scores: Record<string, number>;
    warnings: string[];
    extraction_method: string;
}

export interface XMLGenerateRequest {
    report_id?: string;
    year: number;
    quarter: number;
    declarant_eori: string;
    declarant_name: string;
    declarant_street: string;
    declarant_city: string;
    declarant_postal: string;
    declarant_country: string;
    declarant_email?: string;
    cn_code: string;
    cn_description: string;
    cbam_category: string;
    quantity_kg: number;
    country_of_origin: string;
    producer_id: string;
    producer_name: string;
    producer_country: string;
    producer_address?: string;
    producer_verified?: boolean;
    direct_emissions: number;
    indirect_emissions: number;
    electricity_mwh?: number;
    calculation_method?: string;
}

export interface XMLGenerateResponse {
    report_id: string;
    is_valid: boolean;
    validation_errors: string[];
    validation_warnings: string[];
    xml_preview: string;
    total_emissions_tco2: number;
}

export interface FullPipelineRequest {
    product_description: string;
    declarant_eori: string;
    declarant_name: string;
    declarant_country?: string;
    quantity_kg?: number;
    country_of_origin?: string;
    direct_emissions_per_tonne?: number;
    indirect_emissions_per_tonne?: number;
}

export interface FullPipelineResponse {
    status: string;
    message?: string;
    classification?: {
        cn_code: string;
        cn_description: string;
        confidence: number;
        is_cbam: boolean;
        cbam_category: string | null;
        matched_keywords: string[];
    };
    emissions?: {
        quantity_tonnes: number;
        direct_factor_tco2_per_t: number;
        indirect_factor_tco2_per_t: number;
        direct_tco2: number;
        indirect_tco2: number;
        total_tco2: number;
    };
    xml?: {
        report_id: string;
        is_valid: boolean;
        errors: string[];
        preview: string;
    };
}

export interface HealthResponse {
    status: string;
    version: string;
    agents: {
        classifier: { status: string; codes_loaded: number | string; cache_enabled: boolean };
        extractor: { status: string; backend: string };
        serializer: { status: string; schema_loaded: boolean; pretty_print: boolean };
    };
    timestamp: string;
}

// API Functions
export async function classifyProduct(request: ClassifyRequest): Promise<ClassifyResponse> {
    const response = await fetch(`${CBAM_ENGINE_URL}/classify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Classification failed');
    }

    return response.json();
}

export async function classifyBatch(products: string[]): Promise<{ count: number; results: any[] }> {
    const response = await fetch(`${CBAM_ENGINE_URL}/classify/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Batch classification failed');
    }

    return response.json();
}

export async function extractDocument(file: File): Promise<ExtractResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${CBAM_ENGINE_URL}/extract`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Extraction failed');
    }

    return response.json();
}

export async function generateXML(request: XMLGenerateRequest): Promise<XMLGenerateResponse> {
    const response = await fetch(`${CBAM_ENGINE_URL}/generate-xml`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'XML generation failed');
    }

    return response.json();
}

export async function downloadXML(request: XMLGenerateRequest): Promise<Blob> {
    const response = await fetch(`${CBAM_ENGINE_URL}/generate-xml/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'XML download failed');
    }

    return response.blob();
}

export async function processFullPipeline(request: FullPipelineRequest): Promise<FullPipelineResponse> {
    const response = await fetch(`${CBAM_ENGINE_URL}/process-full`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Pipeline processing failed');
    }

    return response.json();
}

export async function checkHealth(): Promise<HealthResponse> {
    const response = await fetch(`${CBAM_ENGINE_URL}/health`);

    if (!response.ok) {
        throw new Error('Health check failed');
    }

    return response.json();
}

// Helper function to download blob as file
export function downloadBlobAsFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
