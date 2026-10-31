"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaMuse = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const MetaModelApiHelpers_1 = require("./MetaModelApiHelpers");
const MetaMuseDescription_1 = require("./MetaMuseDescription");
class MetaMuse {
    description = {
        displayName: 'Meta Muse (Meta Model API)',
        name: 'metaMuse',
        icon: 'file:metaMuse.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Interact with Meta Muse models (Muse Wonder, Muse Spark, Muse Image, Muse Voice Transcribe, SAM 3.1) using the Meta Model API (https://api.meta.ai/v1)',
        defaults: {
            name: 'Meta Muse',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'metaModelApi',
                required: true,
            },
        ],
        properties: MetaMuseDescription_1.metaMuseProperties,
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const credentials = await this.getCredentials('metaModelApi');
        const baseUrl = (credentials.baseUrl || 'https://api.meta.ai/v1').replace(/\/+$/, '');
        for (let i = 0; i < items.length; i++) {
            try {
                const resource = this.getNodeParameter('resource', i);
                const operation = this.getNodeParameter('operation', i);
                // -------------------------------------------------------------------
                // RESOURCE: RESPONSE (/v1/responses)
                // -------------------------------------------------------------------
                if (resource === 'response') {
                    if (operation === 'create' || operation === 'countTokens') {
                        const selectedModel = this.getNodeParameter('model', i);
                        const model = selectedModel === 'custom'
                            ? this.getNodeParameter('customModel', i).trim()
                            : selectedModel;
                        const inputPrompt = this.getNodeParameter('input', i, '');
                        const instructions = this.getNodeParameter('instructions', i, '');
                        const options = this.getNodeParameter('responseOptions', i, {});
                        const body = {
                            model,
                        };
                        if (instructions.trim()) {
                            body.instructions = instructions.trim();
                        }
                        // Build input (either raw JSON override, multimodal content block array, or string)
                        if (options.rawInputJson && String(options.rawInputJson).trim()) {
                            try {
                                body.input =
                                    typeof options.rawInputJson === 'string'
                                        ? JSON.parse(options.rawInputJson)
                                        : options.rawInputJson;
                            }
                            catch (err) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Invalid JSON in "Raw Input Array (JSON Override)": ${err.message}`, { itemIndex: i });
                            }
                        }
                        else if (options.mediaAttachment && String(options.mediaAttachment).trim()) {
                            const attachment = String(options.mediaAttachment).trim();
                            const mediaType = options.mediaAttachmentType || 'input_image';
                            const contentParts = [
                                {
                                    type: 'input_text',
                                    text: inputPrompt,
                                },
                            ];
                            if (mediaType === 'input_image') {
                                if (attachment.startsWith('file-')) {
                                    contentParts.push({ type: 'input_image', file_id: attachment });
                                }
                                else {
                                    contentParts.push({ type: 'input_image', image_url: attachment });
                                }
                            }
                            else if (mediaType === 'input_video') {
                                if (attachment.startsWith('file-')) {
                                    contentParts.push({ type: 'input_video', file_id: attachment });
                                }
                                else {
                                    contentParts.push({ type: 'input_video', video_url: attachment });
                                }
                            }
                            else {
                                if (attachment.startsWith('file-')) {
                                    contentParts.push({ type: 'input_file', file_id: attachment });
                                }
                                else if (attachment.startsWith('data:')) {
                                    contentParts.push({
                                        type: 'input_file',
                                        filename: 'attachment',
                                        file_data: attachment,
                                    });
                                }
                                else {
                                    contentParts.push({ type: 'input_file', file_url: attachment });
                                }
                            }
                            body.input = [
                                {
                                    type: 'message',
                                    role: 'user',
                                    content: contentParts,
                                },
                            ];
                        }
                        else {
                            body.input = inputPrompt;
                        }
                        // Reasoning settings
                        const reasoning = {};
                        if (options.reasoningEffort && options.reasoningEffort !== 'default') {
                            reasoning.effort = options.reasoningEffort;
                        }
                        if (options.reasoningSummary && options.reasoningSummary !== 'none') {
                            reasoning.summary = options.reasoningSummary;
                        }
                        if (Object.keys(reasoning).length > 0) {
                            body.reasoning = reasoning;
                        }
                        // Tools (web_search + custom function tools)
                        const tools = [];
                        if (options.enableWebSearch) {
                            tools.push({ type: 'web_search' });
                        }
                        if (options.toolsJson && String(options.toolsJson).trim()) {
                            const rawTools = typeof options.toolsJson === 'string'
                                ? JSON.parse(options.toolsJson)
                                : options.toolsJson;
                            if (Array.isArray(rawTools)) {
                                for (const t of rawTools) {
                                    tools.push(t);
                                }
                            }
                        }
                        if (tools.length > 0) {
                            body.tools = tools;
                        }
                        if (options.previousResponseId && String(options.previousResponseId).trim()) {
                            body.previous_response_id = String(options.previousResponseId).trim();
                        }
                        if (options.includeEncryptedReasoning && !body.previous_response_id) {
                            body.include = ['reasoning.encrypted_content'];
                        }
                        if (operation === 'create') {
                            if (options.store !== undefined) {
                                body.store = Boolean(options.store);
                            }
                            if (options.background) {
                                body.background = true;
                            }
                            if (options.maxOutputTokens !== undefined && Number(options.maxOutputTokens) >= 16) {
                                body.max_output_tokens = Number(options.maxOutputTokens);
                            }
                            if (options.temperature !== undefined && Number(options.temperature) !== 1) {
                                body.temperature = Number(options.temperature);
                            }
                            if (options.topP !== undefined && Number(options.topP) > 0 && Number(options.topP) < 1) {
                                body.top_p = Number(options.topP);
                            }
                            if (options.parallelToolCalls !== undefined) {
                                body.parallel_tool_calls = Boolean(options.parallelToolCalls);
                            }
                            if (options.promptCacheKey) {
                                body.prompt_cache_key = String(options.promptCacheKey);
                            }
                            if (options.promptCacheRetention && options.promptCacheRetention !== 'default') {
                                body.prompt_cache_retention = options.promptCacheRetention;
                            }
                            if (options.safetyIdentifier) {
                                body.safety_identifier = String(options.safetyIdentifier).slice(0, 64);
                            }
                            if (options.jsonSchema && String(options.jsonSchema).trim()) {
                                const schemaObj = typeof options.jsonSchema === 'string'
                                    ? JSON.parse(options.jsonSchema)
                                    : options.jsonSchema;
                                body.text = {
                                    format: {
                                        type: 'json_schema',
                                        name: schemaObj.name || 'structured_output',
                                        strict: true,
                                        schema: schemaObj.schema || schemaObj,
                                    },
                                };
                            }
                            const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'metaModelApi', {
                                method: 'POST',
                                url: `${baseUrl}/responses`,
                                body,
                                json: true,
                            }));
                            returnData.push({
                                json: (0, MetaModelApiHelpers_1.enrichResponsesApiOutput)(response),
                                pairedItem: { item: i },
                            });
                        }
                        else {
                            // countTokens: POST /v1/responses/input_tokens
                            const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'metaModelApi', {
                                method: 'POST',
                                url: `${baseUrl}/responses/input_tokens`,
                                body,
                                json: true,
                            }));
                            returnData.push({
                                json: response,
                                pairedItem: { item: i },
                            });
                        }
                    }
                    else if (operation === 'retrieve') {
                        const responseId = this.getNodeParameter('responseId', i).trim();
                        const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'metaModelApi', {
                            method: 'GET',
                            url: `${baseUrl}/responses/${encodeURIComponent(responseId)}`,
                            json: true,
                        }));
                        returnData.push({
                            json: (0, MetaModelApiHelpers_1.enrichResponsesApiOutput)(response),
                            pairedItem: { item: i },
                        });
                    }
                    else if (operation === 'cancel') {
                        const responseId = this.getNodeParameter('responseId', i).trim();
                        const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'metaModelApi', {
                            method: 'POST',
                            url: `${baseUrl}/responses/${encodeURIComponent(responseId)}/cancel`,
                            json: true,
                        }));
                        returnData.push({
                            json: (0, MetaModelApiHelpers_1.enrichResponsesApiOutput)(response),
                            pairedItem: { item: i },
                        });
                    }
                    else if (operation === 'delete') {
                        const responseId = this.getNodeParameter('responseId', i).trim();
                        const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'metaModelApi', {
                            method: 'DELETE',
                            url: `${baseUrl}/responses/${encodeURIComponent(responseId)}`,
                            json: true,
                        }));
                        returnData.push({
                            json: response,
                            pairedItem: { item: i },
                        });
                    }
                }
                // -------------------------------------------------------------------
                // RESOURCE: CHAT COMPLETION (/v1/chat/completions)
                // -------------------------------------------------------------------
                else if (resource === 'chat') {
                    const selectedModel = this.getNodeParameter('model', i);
                    const model = selectedModel === 'custom'
                        ? this.getNodeParameter('customModel', i).trim()
                        : selectedModel;
                    const developerMessage = this.getNodeParameter('developerMessage', i, '');
                    const userMessage = this.getNodeParameter('userMessage', i, '');
                    const options = this.getNodeParameter('chatOptions', i, {});
                    const messages = [];
                    if (options.messagesJson && String(options.messagesJson).trim()) {
                        const parsed = typeof options.messagesJson === 'string'
                            ? JSON.parse(options.messagesJson)
                            : options.messagesJson;
                        if (Array.isArray(parsed)) {
                            for (const msg of parsed) {
                                messages.push(msg);
                            }
                        }
                    }
                    else {
                        if (developerMessage.trim()) {
                            messages.push({
                                role: 'developer',
                                content: developerMessage.trim(),
                            });
                        }
                        messages.push({
                            role: 'user',
                            content: userMessage,
                        });
                    }
                    const body = {
                        model,
                        messages,
                    };
                    if (options.reasoningEffort && options.reasoningEffort !== 'default') {
                        body.reasoning_effort = options.reasoningEffort;
                    }
                    if (options.maxCompletionTokens !== undefined &&
                        Number(options.maxCompletionTokens) >= 16) {
                        body.max_completion_tokens = Number(options.maxCompletionTokens);
                    }
                    if (options.temperature !== undefined && Number(options.temperature) !== 1) {
                        body.temperature = Number(options.temperature);
                    }
                    if (options.topP !== undefined && Number(options.topP) > 0 && Number(options.topP) < 1) {
                        body.top_p = Number(options.topP);
                    }
                    if (options.promptCacheKey) {
                        body.prompt_cache_key = String(options.promptCacheKey);
                    }
                    if (options.promptCacheRetention && options.promptCacheRetention !== 'default') {
                        body.prompt_cache_retention = options.promptCacheRetention;
                    }
                    if (options.safetyIdentifier) {
                        body.safety_identifier = String(options.safetyIdentifier).slice(0, 64);
                    }
                    if (options.responseFormat === 'json_object') {
                        body.response_format = { type: 'json_object' };
                    }
                    if (options.toolsJson && String(options.toolsJson).trim()) {
                        body.tools =
                            typeof options.toolsJson === 'string'
                                ? JSON.parse(options.toolsJson)
                                : options.toolsJson;
                    }
                    const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'metaModelApi', {
                        method: 'POST',
                        url: `${baseUrl}/chat/completions`,
                        body,
                        json: true,
                    }));
                    const choices = Array.isArray(response.choices)
                        ? response.choices
                        : [];
                    const firstMessage = choices[0]?.message || {};
                    returnData.push({
                        json: {
                            content: firstMessage.content ?? '',
                            role: firstMessage.role ?? 'assistant',
                            ...(firstMessage.tool_calls ? { tool_calls: firstMessage.tool_calls } : {}),
                            ...response,
                        },
                        pairedItem: { item: i },
                    });
                }
                // -------------------------------------------------------------------
                // RESOURCE: IMAGE (MUSE IMAGE - muse-image-1.0)
                // -------------------------------------------------------------------
                else if (resource === 'image') {
                    const prompt = this.getNodeParameter('imagePrompt', i);
                    const downloadAsBinary = this.getNodeParameter('downloadImageAsBinary', i, true);
                    const options = this.getNodeParameter('imageOptions', i, {});
                    const outputFormat = options.outputFormat || 'webp';
                    const binaryPropName = options.outputBinaryPropertyName || 'data';
                    if (operation === 'generate' || operation === 'edit') {
                        const body = {
                            model: 'muse-image-1.0',
                            prompt,
                            n: options.n ? Number(options.n) : 1,
                            output_format: outputFormat,
                            response_format: options.responseFormat || 'b64_json',
                        };
                        if (options.size && options.size !== 'auto') {
                            body.size = options.size;
                        }
                        if (options.reasoningStrength) {
                            body.reasoning_strength = options.reasoningStrength;
                        }
                        const toolEnablement = {};
                        if (options.enableImageSearch !== undefined) {
                            toolEnablement.enable_image_search = Boolean(options.enableImageSearch);
                        }
                        if (options.enableWebSearch !== undefined) {
                            toolEnablement.enable_web_search = Boolean(options.enableWebSearch);
                        }
                        if (options.enableShell !== undefined) {
                            toolEnablement.enable_shell = Boolean(options.enableShell);
                        }
                        if (Object.keys(toolEnablement).length > 0) {
                            body.tool_enablement = toolEnablement;
                        }
                        let endpoint = `${baseUrl}/images/generations`;
                        if (operation === 'edit') {
                            endpoint = `${baseUrl}/images/edits`;
                            const sourceType = this.getNodeParameter('editImageSource', i);
                            if (sourceType === 'binary') {
                                const binaryField = this.getNodeParameter('editBinaryPropertyName', i);
                                const binaryData = this.helpers.assertBinaryData(i, binaryField);
                                const buffer = await this.helpers.getBinaryDataBuffer(i, binaryField);
                                const mime = binaryData.mimeType || 'image/webp';
                                const dataUrl = `data:${mime};base64,${buffer.toString('base64')}`;
                                body.images = [{ image_url: dataUrl }];
                            }
                            else {
                                const rawUrls = this.getNodeParameter('editImageUrls', i)
                                    .split(',')
                                    .map((s) => s.trim())
                                    .filter(Boolean);
                                body.images = rawUrls.map((u) => u.startsWith('file-') ? { file_id: u } : { image_url: u });
                            }
                        }
                        const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'metaModelApi', {
                            method: 'POST',
                            url: endpoint,
                            body,
                            json: true,
                        }));
                        const binary = {};
                        const dataList = Array.isArray(response.data) ? response.data : [];
                        if (downloadAsBinary && dataList.length > 0) {
                            for (let idx = 0; idx < dataList.length; idx++) {
                                const b64 = dataList[idx].b64_json;
                                if (b64) {
                                    const key = idx === 0 ? binaryPropName : `${binaryPropName}_${idx}`;
                                    const ext = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
                                    binary[key] = await this.helpers.prepareBinaryData(Buffer.from(b64, 'base64'), `muse-image-${idx + 1}.${ext}`, `image/${outputFormat}`);
                                }
                            }
                        }
                        returnData.push({
                            json: response,
                            ...(Object.keys(binary).length > 0 ? { binary } : {}),
                            pairedItem: { item: i },
                        });
                    }
                    else if (operation === 'conversational') {
                        // Conversational Muse Image via POST /v1/responses
                        const imageTool = {
                            type: 'image_generation',
                            output_format: outputFormat,
                            reasoning_strength: options.reasoningStrength || 'high',
                        };
                        if (options.size && options.size !== 'auto') {
                            imageTool.size = options.size;
                        }
                        if (options.enableImageSearch !== undefined) {
                            imageTool.enable_image_search = Boolean(options.enableImageSearch);
                        }
                        if (options.enableWebSearch !== undefined) {
                            imageTool.enable_web_search = Boolean(options.enableWebSearch);
                        }
                        if (options.enableShell !== undefined) {
                            imageTool.enable_shell = Boolean(options.enableShell);
                        }
                        let inputPayload = prompt;
                        if (options.referenceImageUrl && String(options.referenceImageUrl).trim()) {
                            const ref = String(options.referenceImageUrl).trim();
                            inputPayload = [
                                {
                                    role: 'user',
                                    content: [
                                        { type: 'input_text', text: prompt },
                                        ref.startsWith('file-')
                                            ? { type: 'input_image', file_id: ref }
                                            : { type: 'input_image', image_url: ref },
                                    ],
                                },
                            ];
                        }
                        const body = {
                            model: 'muse-image-1.0',
                            input: inputPayload,
                            tools: [imageTool],
                        };
                        if (options.previousResponseId && String(options.previousResponseId).trim()) {
                            body.previous_response_id = String(options.previousResponseId).trim();
                        }
                        const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'metaModelApi', {
                            method: 'POST',
                            url: `${baseUrl}/responses`,
                            body,
                            json: true,
                        }));
                        const enriched = (0, MetaModelApiHelpers_1.enrichResponsesApiOutput)(response);
                        const binary = {};
                        const imageCalls = Array.isArray(enriched.image_generation_calls)
                            ? enriched.image_generation_calls
                            : [];
                        if (downloadAsBinary && imageCalls.length > 0) {
                            for (let idx = 0; idx < imageCalls.length; idx++) {
                                const b64 = imageCalls[idx].result;
                                if (b64) {
                                    const key = idx === 0 ? binaryPropName : `${binaryPropName}_${idx}`;
                                    const ext = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
                                    binary[key] = await this.helpers.prepareBinaryData(Buffer.from(b64, 'base64'), `muse-image-${idx + 1}.${ext}`, `image/${outputFormat}`);
                                }
                            }
                        }
                        returnData.push({
                            json: enriched,
                            ...(Object.keys(binary).length > 0 ? { binary } : {}),
                            pairedItem: { item: i },
                        });
                    }
                }
                // -------------------------------------------------------------------
                // RESOURCE: VOICE AUDIO (MUSE VOICE TRANSCRIBE - /v1/asr/transcribe)
                // -------------------------------------------------------------------
                else if (resource === 'audio') {
                    const binaryField = this.getNodeParameter('audioBinaryPropertyName', i);
                    const mode = this.getNodeParameter('transcriptionMode', i);
                    const audioOptions = this.getNodeParameter('audioOptions', i, {});
                    const binaryData = this.helpers.assertBinaryData(i, binaryField);
                    const audioBuffer = await this.helpers.getBinaryDataBuffer(i, binaryField);
                    const requestMetadata = {
                        model: 'muse-voice-transcribe-1.0',
                        audioEncoding: 'WAV',
                        mode,
                    };
                    if (audioOptions.keywords && String(audioOptions.keywords).trim()) {
                        requestMetadata.keywords = String(audioOptions.keywords)
                            .split(',')
                            .map((k) => k.trim())
                            .filter(Boolean);
                    }
                    if (audioOptions.languageBias && String(audioOptions.languageBias).trim()) {
                        requestMetadata.languageBias = String(audioOptions.languageBias)
                            .split(',')
                            .map((l) => l.trim())
                            .filter(Boolean);
                    }
                    const { body, contentType } = (0, MetaModelApiHelpers_1.buildMultipartBody)([
                        {
                            name: 'request',
                            value: JSON.stringify(requestMetadata),
                            contentType: 'application/json',
                        },
                        {
                            name: 'audio',
                            filename: binaryData.fileName || 'recording.wav',
                            contentType: binaryData.mimeType || 'audio/wav',
                            data: audioBuffer,
                        },
                    ]);
                    const qs = {};
                    if (audioOptions.sessionId && String(audioOptions.sessionId).trim()) {
                        qs.sessionId = String(audioOptions.sessionId).trim();
                    }
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'metaModelApi', {
                        method: 'POST',
                        url: `${baseUrl}/asr/transcribe`,
                        qs,
                        headers: {
                            'Content-Type': contentType,
                            Accept: 'application/json',
                        },
                        body,
                    });
                    const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
                    returnData.push({
                        json: parsedResponse,
                        pairedItem: { item: i },
                    });
                }
                // -------------------------------------------------------------------
                // RESOURCE: MEDIA SEGMENTATION (SAM 3.1 - sam-3.1 on /v1/responses)
                // -------------------------------------------------------------------
                else if (resource === 'segmentation') {
                    const samPrompt = this.getNodeParameter('samPrompt', i);
                    const samMediaType = this.getNodeParameter('samMediaType', i);
                    const samMediaSource = this.getNodeParameter('samMediaSource', i).trim();
                    const mediaPart = samMediaType === 'input_video'
                        ? samMediaSource.startsWith('file-')
                            ? { type: 'input_video', file_id: samMediaSource }
                            : { type: 'input_video', video_url: samMediaSource }
                        : samMediaSource.startsWith('file-')
                            ? { type: 'input_image', file_id: samMediaSource }
                            : { type: 'input_image', image_url: samMediaSource };
                    const body = {
                        model: 'sam-3.1',
                        input: [
                            {
                                type: 'message',
                                role: 'user',
                                content: [
                                    {
                                        type: 'input_text',
                                        text: samPrompt,
                                    },
                                    mediaPart,
                                ],
                            },
                        ],
                    };
                    const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'metaModelApi', {
                        method: 'POST',
                        url: `${baseUrl}/responses`,
                        body,
                        json: true,
                    }));
                    const enriched = (0, MetaModelApiHelpers_1.enrichResponsesApiOutput)(response);
                    const rawSegmentationText = enriched.output_text || '';
                    const frames = (0, MetaModelApiHelpers_1.parseSamSegmentationText)(rawSegmentationText);
                    returnData.push({
                        json: {
                            prompt: samPrompt,
                            matched: rawSegmentationText.trim().length > 0,
                            frames,
                            ...enriched,
                        },
                        pairedItem: { item: i },
                    });
                }
                // -------------------------------------------------------------------
                // RESOURCE: FILE (/v1/files)
                // -------------------------------------------------------------------
                else if (resource === 'file') {
                    if (operation === 'upload') {
                        const binaryField = this.getNodeParameter('fileBinaryPropertyName', i);
                        const purpose = this.getNodeParameter('filePurpose', i);
                        const binaryData = this.helpers.assertBinaryData(i, binaryField);
                        const fileBuffer = await this.helpers.getBinaryDataBuffer(i, binaryField);
                        // Meta Model API docs note: send `purpose` before `file` for lowest upload latency
                        const { body, contentType } = (0, MetaModelApiHelpers_1.buildMultipartBody)([
                            {
                                name: 'purpose',
                                value: purpose,
                            },
                            {
                                name: 'file',
                                filename: binaryData.fileName || 'upload.bin',
                                contentType: binaryData.mimeType || 'application/octet-stream',
                                data: fileBuffer,
                            },
                        ]);
                        const response = await this.helpers.httpRequestWithAuthentication.call(this, 'metaModelApi', {
                            method: 'POST',
                            url: `${baseUrl}/files`,
                            headers: {
                                'Content-Type': contentType,
                                Accept: 'application/json',
                            },
                            body,
                        });
                        const parsedResponse = typeof response === 'string'
                            ? JSON.parse(response)
                            : response;
                        returnData.push({
                            json: parsedResponse,
                            pairedItem: { item: i },
                        });
                    }
                    else if (operation === 'list') {
                        const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'metaModelApi', {
                            method: 'GET',
                            url: `${baseUrl}/files`,
                            json: true,
                        }));
                        returnData.push({
                            json: response,
                            pairedItem: { item: i },
                        });
                    }
                    else if (operation === 'retrieve') {
                        const fileId = this.getNodeParameter('fileId', i).trim();
                        const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'metaModelApi', {
                            method: 'GET',
                            url: `${baseUrl}/files/${encodeURIComponent(fileId)}`,
                            json: true,
                        }));
                        returnData.push({
                            json: response,
                            pairedItem: { item: i },
                        });
                    }
                    else if (operation === 'delete') {
                        const fileId = this.getNodeParameter('fileId', i).trim();
                        const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'metaModelApi', {
                            method: 'DELETE',
                            url: `${baseUrl}/files/${encodeURIComponent(fileId)}`,
                            json: true,
                        }));
                        returnData.push({
                            json: response,
                            pairedItem: { item: i },
                        });
                    }
                }
                // -------------------------------------------------------------------
                // RESOURCE: MODEL CATALOG (/v1/models)
                // -------------------------------------------------------------------
                else if (resource === 'model') {
                    if (operation === 'list') {
                        const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'metaModelApi', {
                            method: 'GET',
                            url: `${baseUrl}/models`,
                            json: true,
                        }));
                        returnData.push({
                            json: response,
                            pairedItem: { item: i },
                        });
                    }
                    else if (operation === 'get') {
                        const modelId = this.getNodeParameter('catalogModelId', i).trim();
                        const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'metaModelApi', {
                            method: 'GET',
                            url: `${baseUrl}/models/${encodeURIComponent(modelId)}`,
                            json: true,
                        }));
                        returnData.push({
                            json: response,
                            pairedItem: { item: i },
                        });
                    }
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
                        },
                        pairedItem: { item: i },
                    });
                    continue;
                }
                throw new n8n_workflow_1.NodeApiError(this.getNode(), error, { itemIndex: i });
            }
        }
        return [returnData];
    }
}
exports.MetaMuse = MetaMuse;
//# sourceMappingURL=MetaMuse.node.js.map