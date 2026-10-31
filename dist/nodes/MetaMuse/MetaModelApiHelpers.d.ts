import type { IDataObject } from 'n8n-workflow';
export interface MultipartFieldPart {
    name: string;
    value: string;
    contentType?: string;
}
export interface MultipartFilePart {
    name: string;
    filename: string;
    contentType: string;
    data: Buffer;
}
export type MultipartPart = MultipartFieldPart | MultipartFilePart;
/**
 * Builds an RFC 7578 multipart/form-data Buffer without external dependencies.
 */
export declare function buildMultipartBody(parts: MultipartPart[]): {
    body: Buffer;
    contentType: string;
};
/**
 * Extracts top-level convenience fields (`output_text`, `reasoning_summary`,
 * `tool_calls`, `citations`, `image_generation_calls`) from a Meta Model API
 * `/v1/responses` response object.
 */
export declare function enrichResponsesApiOutput(response: IDataObject): IDataObject;
export interface ParsedSamObject extends IDataObject {
    objectId: number;
    box?: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        width: number;
        height: number;
    };
    mask?: {
        x: number;
        y: number;
        data: string;
    };
}
export interface ParsedSamFrame extends IDataObject {
    frameIndex: number;
    objects: ParsedSamObject[];
}
/**
 * Parses SAM 3.1 (`sam-3.1`) special-token output text from `/v1/responses`:
 * `<0f>0<|box;x1=353;y1=382;x2=453;y2=427;w=537;h=561|><|mask;x=0;y=0;data=46,101,~...|>,1<|box;...|>`
 */
export declare function parseSamSegmentationText(outputText: string): ParsedSamFrame[];
