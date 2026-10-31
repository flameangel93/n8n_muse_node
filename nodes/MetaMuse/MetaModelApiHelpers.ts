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

function isFilePart(part: MultipartPart): part is MultipartFilePart {
	return 'data' in part && Buffer.isBuffer(part.data);
}

/**
 * Builds an RFC 7578 multipart/form-data Buffer without external dependencies.
 */
export function buildMultipartBody(parts: MultipartPart[]): {
	body: Buffer;
	contentType: string;
} {
	const boundary = `----MetaModelApiBoundary${Date.now().toString(16)}${Math.random()
		.toString(16)
		.slice(2)}`;
	const chunks: Buffer[] = [];

	for (const part of parts) {
		chunks.push(Buffer.from(`--${boundary}\r\n`, 'utf8'));
		if (isFilePart(part)) {
			const safeFilename = part.filename.replace(/["\r\n]/g, '_');
			chunks.push(
				Buffer.from(
					`Content-Disposition: form-data; name="${part.name}"; filename="${safeFilename}"\r\n` +
						`Content-Type: ${part.contentType || 'application/octet-stream'}\r\n\r\n`,
					'utf8',
				),
			);
			chunks.push(part.data);
			chunks.push(Buffer.from('\r\n', 'utf8'));
		} else {
			let header = `Content-Disposition: form-data; name="${part.name}"\r\n`;
			if (part.contentType) {
				header += `Content-Type: ${part.contentType}\r\n`;
			}
			header += '\r\n';
			chunks.push(Buffer.from(header, 'utf8'));
			chunks.push(Buffer.from(part.value, 'utf8'));
			chunks.push(Buffer.from('\r\n', 'utf8'));
		}
	}

	chunks.push(Buffer.from(`--${boundary}--\r\n`, 'utf8'));

	return {
		body: Buffer.concat(chunks),
		contentType: `multipart/form-data; boundary=${boundary}`,
	};
}

/**
 * Extracts top-level convenience fields (`output_text`, `reasoning_summary`,
 * `tool_calls`, `citations`, `image_generation_calls`) from a Meta Model API
 * `/v1/responses` response object.
 */
export function enrichResponsesApiOutput(response: IDataObject): IDataObject {
	const output = Array.isArray(response.output) ? (response.output as IDataObject[]) : [];
	const textParts: string[] = [];
	const reasoningSummaries: string[] = [];
	const toolCalls: IDataObject[] = [];
	const citations: IDataObject[] = [];
	const imageCalls: IDataObject[] = [];

	for (const item of output) {
		if (item.type === 'message' && Array.isArray(item.content)) {
			for (const block of item.content as IDataObject[]) {
				if (block.type === 'output_text' && typeof block.text === 'string') {
					textParts.push(block.text);
					if (Array.isArray(block.annotations)) {
						for (const ann of block.annotations as IDataObject[]) {
							citations.push(ann);
						}
					}
				}
			}
		} else if (item.type === 'reasoning' && Array.isArray(item.summary)) {
			for (const sumBlock of item.summary as IDataObject[]) {
				if (typeof sumBlock.text === 'string') {
					reasoningSummaries.push(sumBlock.text);
				}
			}
		} else if (item.type === 'function_call') {
			toolCalls.push(item);
		} else if (item.type === 'image_generation_call') {
			imageCalls.push(item);
		}
	}

	return {
		output_text: textParts.join('\n'),
		...(reasoningSummaries.length > 0
			? { reasoning_summary: reasoningSummaries.join('\n') }
			: {}),
		...(toolCalls.length > 0 ? { tool_calls: toolCalls } : {}),
		...(citations.length > 0 ? { citations } : {}),
		...(imageCalls.length > 0 ? { image_generation_calls: imageCalls } : {}),
		...response,
	};
}

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
export function parseSamSegmentationText(outputText: string): ParsedSamFrame[] {
	if (!outputText || !outputText.trim()) {
		return [];
	}

	const frames: ParsedSamFrame[] = [];
	const lines = outputText
		.split(/\r?\n/)
		.map((l) => l.trim())
		.filter(Boolean);

	for (const line of lines) {
		const frameMatch = /^<(\d+)f>(.*)$/.exec(line);
		const frameIndex = frameMatch ? Number.parseInt(frameMatch[1], 10) : 0;
		const remainder = frameMatch ? frameMatch[2] : line;

		const objects: ParsedSamObject[] = [];
		const objectRegex =
			/(\d+)<\|box;x1=(-?\d+);y1=(-?\d+);x2=(-?\d+);y2=(-?\d+);w=(\d+);h=(\d+)\|>(?:<\|mask;x=(-?\d+);y=(-?\d+);data=([^|]*)\|>)?/g;

		let match: RegExpExecArray | null;
		while ((match = objectRegex.exec(remainder)) !== null) {
			const obj: ParsedSamObject = {
				objectId: Number.parseInt(match[1], 10),
				box: {
					x1: Number.parseInt(match[2], 10),
					y1: Number.parseInt(match[3], 10),
					x2: Number.parseInt(match[4], 10),
					y2: Number.parseInt(match[5], 10),
					width: Number.parseInt(match[6], 10),
					height: Number.parseInt(match[7], 10),
				},
			};
			if (match[8] !== undefined && match[9] !== undefined && match[10] !== undefined) {
				obj.mask = {
					x: Number.parseInt(match[8], 10),
					y: Number.parseInt(match[9], 10),
					data: match[10],
				};
			}
			objects.push(obj);
		}

		frames.push({
			frameIndex,
			objects,
		});
	}

	return frames;
}
