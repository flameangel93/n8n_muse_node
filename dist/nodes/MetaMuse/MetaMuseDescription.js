"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metaMuseProperties = exports.metaMuseModelOptions = void 0;
exports.metaMuseModelOptions = [
    {
        name: 'Muse Spark 1.3 (muse-spark-1.3) — Standard Mode (Recommended)',
        value: 'muse-spark-1.3',
        description: 'Latest Muse Spark model tuned for agentic workflows, multi-step tool loops, and coding (1,048,576 token context window; supports up to "max" reasoning effort)',
    },
    {
        name: 'Muse Wonder 1.0 (muse-wonder-1.0) — Preview, Standard Mode',
        value: 'muse-wonder-1.0',
        description: 'Meta’s most capable model for complex software engineering, sub-agent delegation, and long-horizon agentic work (1,048,576 token context window; supports up to "max" reasoning effort)',
    },
    {
        name: 'Muse Spark 1.3 Contributor (muse-spark-1.3-contributor) — Discounted Contributor Mode',
        value: 'muse-spark-1.3-contributor',
        description: 'Muse Spark 1.3 in discounted Contributor mode (supports reasoning effort up to "xhigh")',
    },
    {
        name: 'Muse Spark 1.2 (muse-spark-1.2) — Standard Mode (Multimodal + Audio)',
        value: 'muse-spark-1.2',
        description: 'Previous Muse Spark version in Standard mode; recommended when requests include inline audio understanding',
    },
    {
        name: 'Muse Spark 1.2 Contributor (muse-spark-1.2-contributor) — Discounted Contributor Mode',
        value: 'muse-spark-1.2-contributor',
        description: 'Muse Spark 1.2 in discounted Contributor mode',
    },
    {
        name: 'Muse Spark 1.1 (muse-spark-1.1) — Standard Mode',
        value: 'muse-spark-1.1',
        description: 'Original Muse Spark release (Standard mode only)',
    },
    {
        name: 'Custom / Self-Hosted Model ID (Muse Spark Open / Muse Glimmer)',
        value: 'custom',
        description: 'Specify a custom model ID from the Meta Model API catalog or a self-hosted Muse Spark Open / Muse Glimmer server',
    },
];
exports.metaMuseProperties = [
    {
        displayName: 'Powered by the <b>Meta Model API</b> (<code>https://api.meta.ai/v1</code>) — official inference API for Meta’s Muse model family: <b>Muse Wonder</b>, <b>Muse Spark</b>, <b>Muse Image</b>, <b>Muse Voice Transcribe</b>, and <b>Segment Anything Model (SAM 3.1)</b>.',
        name: 'metaModelApiBanner',
        type: 'notice',
        default: '',
    },
    {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
            {
                name: 'Response (Agentic & Multimodal)',
                value: 'response',
                description: 'Recommended Meta Model API endpoint (POST /v1/responses) for Muse Wonder & Muse Spark with cross-turn reasoning continuity, web search grounding, and multimodal file inputs',
            },
            {
                name: 'Chat Completion',
                value: 'chat',
                description: 'OpenAI-compatible messages endpoint (POST /v1/chat/completions) for Muse Wonder & Muse Spark',
            },
            {
                name: 'Image (Muse Image)',
                value: 'image',
                description: 'Generate, edit, and conversationally refine images using Muse Image (muse-image-1.0) on the Meta Model API',
            },
            {
                name: 'Voice Audio (Muse Voice Transcribe)',
                value: 'audio',
                description: 'Transcribe WAV audio with turn detection and speaker diarization using Muse Voice Transcribe (muse-voice-transcribe-1.0)',
            },
            {
                name: 'Media Segmentation (SAM 3.1)',
                value: 'segmentation',
                description: 'Detect and segment objects in images or video into bounding boxes and pixel masks using Segment Anything Model 3.1 (sam-3.1)',
            },
            {
                name: 'File',
                value: 'file',
                description: 'Upload, list, retrieve, and delete multimodal files (up to 1 GiB) on the Meta Model API Files endpoint (/v1/files)',
            },
            {
                name: 'Model Catalog',
                value: 'model',
                description: 'Query the Meta Model API catalog (/v1/models) to inspect available Muse models',
            },
        ],
        default: 'response',
    },
    // =========================================================================
    // RESOURCE: RESPONSE (POST /v1/responses, GET, DELETE, CANCEL, INPUT_TOKENS)
    // =========================================================================
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['response'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create a response via Meta Model API Responses endpoint',
                description: 'Generate a model response using POST /v1/responses with Muse Wonder or Muse Spark',
            },
            {
                name: 'Retrieve',
                value: 'retrieve',
                action: 'Retrieve a stored response by ID',
                description: 'Fetch a stored response using GET /v1/responses/{response_id}',
            },
            {
                name: 'Cancel',
                value: 'cancel',
                action: 'Cancel an in-progress background response',
                description: 'Cancel an asynchronous background response using POST /v1/responses/{response_id}/cancel',
            },
            {
                name: 'Delete',
                value: 'delete',
                action: 'Delete a stored response',
                description: 'Soft-delete a response by ID using DELETE /v1/responses/{response_id}',
            },
            {
                name: 'Count Input Tokens',
                value: 'countTokens',
                action: 'Count input tokens before sending a response request',
                description: 'Estimate token count and context budget using POST /v1/responses/input_tokens',
            },
        ],
        default: 'create',
    },
    {
        displayName: 'Model',
        name: 'model',
        type: 'options',
        options: exports.metaMuseModelOptions,
        default: 'muse-spark-1.3',
        description: 'The Meta Muse model to call on the Meta Model API',
        displayOptions: {
            show: {
                resource: ['response'],
                operation: ['create', 'countTokens'],
            },
        },
    },
    {
        displayName: 'Custom Model ID',
        name: 'customModel',
        type: 'string',
        default: 'muse-spark-1.3',
        required: true,
        displayOptions: {
            show: {
                resource: ['response'],
                operation: ['create', 'countTokens'],
                model: ['custom'],
            },
        },
    },
    {
        displayName: 'Input Prompt / Text',
        name: 'input',
        type: 'string',
        typeOptions: {
            rows: 4,
        },
        default: '',
        required: true,
        placeholder: 'Analyze this repository architecture and propose a migration plan...',
        description: 'Text input to send to the model. If multimodal attachments or JSON input items are configured in Options, they will be combined with or override this prompt.',
        displayOptions: {
            show: {
                resource: ['response'],
                operation: ['create', 'countTokens'],
            },
        },
    },
    {
        displayName: 'Developer Instructions (System Prompt)',
        name: 'instructions',
        type: 'string',
        typeOptions: {
            rows: 3,
        },
        default: '',
        placeholder: 'You are a senior software architect. Respond concisely with actionable steps.',
        description: 'Top-level `instructions` (developer-role instructions) for tone, persona, and output rules. Takes priority over `input`.',
        displayOptions: {
            show: {
                resource: ['response'],
                operation: ['create', 'countTokens'],
            },
        },
    },
    {
        displayName: 'Response ID',
        name: 'responseId',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'resp_abc123',
        description: 'The ID of the response (`resp_...`) on the Meta Model API',
        displayOptions: {
            show: {
                resource: ['response'],
                operation: ['retrieve', 'cancel', 'delete'],
            },
        },
    },
    {
        displayName: 'Options',
        name: 'responseOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
            show: {
                resource: ['response'],
                operation: ['create', 'countTokens'],
            },
        },
        options: [
            {
                displayName: 'Background Execution',
                name: 'background',
                type: 'boolean',
                default: false,
                description: 'Whether to run the response asynchronously in the background (`background: true`) and return immediately with `status: "queued"` so you can poll or retrieve it by ID',
            },
            {
                displayName: 'Enable Web Search Grounding',
                name: 'enableWebSearch',
                type: 'boolean',
                default: false,
                description: 'Whether to add `{ "type": "web_search" }` to `tools` for real-time answers grounded in live web data with inline citations',
            },
            {
                displayName: 'Function Tools (JSON Array)',
                name: 'toolsJson',
                type: 'json',
                default: '[]',
                description: 'Optional JSON array of tool definitions (e.g. `[{"type":"function","name":"get_weather","description":"...","parameters":{...}}]`)',
            },
            {
                displayName: 'Include Encrypted Reasoning Content',
                name: 'includeEncryptedReasoning',
                type: 'boolean',
                default: false,
                description: 'Whether to set `include: ["reasoning.encrypted_content"]` for stateless multi-turn reasoning replay (cannot be combined with `previous_response_id`)',
            },
            {
                displayName: 'Input Image / File URL or File ID',
                name: 'mediaAttachment',
                type: 'string',
                default: '',
                placeholder: 'https://example.com/chart.png or file-842549258569145',
                description: 'Optional image URL, PDF/file URL, base64 data URL, or uploaded Meta Model API `file-...` ID to attach alongside the input text',
            },
            {
                displayName: 'Input Media Type',
                name: 'mediaAttachmentType',
                type: 'options',
                default: 'input_image',
                options: [
                    {
                        name: 'Image (input_image)',
                        value: 'input_image',
                    },
                    {
                        name: 'Document / PDF / File (input_file)',
                        value: 'input_file',
                    },
                    {
                        name: 'Video (input_video)',
                        value: 'input_video',
                    },
                ],
                description: 'How the attachment should be typed in the Responses API `input` content block',
            },
            {
                displayName: 'Max Output Tokens',
                name: 'maxOutputTokens',
                type: 'number',
                typeOptions: {
                    minValue: 16,
                },
                default: 16384,
                description: 'Bounds total tokens generated (`max_output_tokens`, minimum 16), including internal reasoning tokens and visible output',
            },
            {
                displayName: 'Parallel Tool Calls',
                name: 'parallelToolCalls',
                type: 'boolean',
                default: true,
                description: 'Whether to allow the model to invoke multiple tools in parallel',
            },
            {
                displayName: 'Previous Response ID',
                name: 'previousResponseId',
                type: 'string',
                default: '',
                placeholder: 'resp_abc123',
                description: 'Continue a multi-turn conversation from a stored response ID (`previous_response_id`) with full server-managed reasoning continuity',
            },
            {
                displayName: 'Prompt Cache Key',
                name: 'promptCacheKey',
                type: 'string',
                default: '',
                description: 'Groups related requests to improve prompt-cache hit rates',
            },
            {
                displayName: 'Prompt Cache Retention',
                name: 'promptCacheRetention',
                type: 'options',
                default: 'default',
                options: [
                    { name: 'Server Default', value: 'default' },
                    { name: 'In Memory (in_memory)', value: 'in_memory' },
                    { name: '24 Hours (24h)', value: '24h' },
                ],
                description: 'Hint for server-side prompt cache retention (`prompt_cache_retention`)',
            },
            {
                displayName: 'Raw Input Array (JSON Override)',
                name: 'rawInputJson',
                type: 'json',
                default: '',
                description: 'Optional JSON array of typed Responses API input items (messages, reasoning replay items, function_call_output). If non-empty, overrides the plain text Input field.',
            },
            {
                displayName: 'Reasoning Effort',
                name: 'reasoningEffort',
                type: 'options',
                default: 'default',
                options: [
                    { name: 'Model Default', value: 'default' },
                    { name: 'Minimal (minimal)', value: 'minimal' },
                    { name: 'Low (low)', value: 'low' },
                    { name: 'Medium (medium)', value: 'medium' },
                    { name: 'High (high)', value: 'high' },
                    { name: 'Extra High (xhigh)', value: 'xhigh' },
                    { name: 'Max (max) — Muse Wonder 1.0 & Muse Spark 1.3 Only', value: 'max' },
                ],
                description: 'Controls how much internal reasoning the model performs (`reasoning.effort`). Muse models always reason (`none` is not supported).',
            },
            {
                displayName: 'Reasoning Summary',
                name: 'reasoningSummary',
                type: 'options',
                default: 'none',
                options: [
                    { name: 'None (Do Not Request)', value: 'none' },
                    { name: 'Auto (auto)', value: 'auto' },
                    { name: 'Concise (concise)', value: 'concise' },
                    { name: 'Detailed (detailed)', value: 'detailed' },
                ],
                description: 'Request a human-readable summary of the model’s private reasoning (`reasoning.summary`)',
            },
            {
                displayName: 'Safety Identifier',
                name: 'safetyIdentifier',
                type: 'string',
                default: '',
                description: 'Stable, privacy-preserving identifier for the end user (up to 64 characters)',
            },
            {
                displayName: 'Store Response on Server',
                name: 'store',
                type: 'boolean',
                default: true,
                description: 'Whether to persist the response (`store: true`) so it can be retrieved later or chained with `previous_response_id`',
            },
            {
                displayName: 'Structured Output JSON Schema',
                name: 'jsonSchema',
                type: 'json',
                default: '',
                description: 'Optional JSON Schema object to constrain output via `text.format: { type: "json_schema", name: "response_schema", strict: true, schema: ... }`',
            },
            {
                displayName: 'Temperature',
                name: 'temperature',
                type: 'number',
                typeOptions: { minValue: 0, maxValue: 2, numberPrecision: 2 },
                default: 1,
                description: 'Controls randomness (0–2). Muse Spark and Muse Wonder are tuned for 1.0; leave at 1.0 for most workloads.',
            },
            {
                displayName: 'Top P',
                name: 'topP',
                type: 'number',
                typeOptions: { minValue: 0.01, maxValue: 1, numberPrecision: 2 },
                default: 1,
                description: 'Nucleus sampling threshold (0 < top_p <= 1)',
            },
        ],
    },
    // =========================================================================
    // RESOURCE: CHAT COMPLETION (POST /v1/chat/completions)
    // =========================================================================
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['chat'],
            },
        },
        options: [
            {
                name: 'Complete',
                value: 'complete',
                action: 'Create a chat completion via Meta Model API',
                description: 'Send a messages array to POST /v1/chat/completions with Muse Wonder or Muse Spark',
            },
        ],
        default: 'complete',
    },
    {
        displayName: 'Model',
        name: 'model',
        type: 'options',
        options: exports.metaMuseModelOptions,
        default: 'muse-spark-1.3',
        description: 'The Meta Muse model to use for chat completion',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['complete'],
            },
        },
    },
    {
        displayName: 'Custom Model ID',
        name: 'customModel',
        type: 'string',
        default: 'muse-spark-1.3',
        required: true,
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['complete'],
                model: ['custom'],
            },
        },
    },
    {
        displayName: 'Developer / System Prompt',
        name: 'developerMessage',
        type: 'string',
        typeOptions: {
            rows: 3,
        },
        default: '',
        placeholder: 'You are a helpful assistant...',
        description: 'Standing instructions sent with the `developer` role (highest-precedence role on the Meta Model API)',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['complete'],
            },
        },
    },
    {
        displayName: 'User Message',
        name: 'userMessage',
        type: 'string',
        typeOptions: {
            rows: 4,
        },
        default: '',
        required: true,
        placeholder: 'What are three differences between TCP and UDP?',
        description: 'The user message to send to the model',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['complete'],
            },
        },
    },
    {
        displayName: 'Options',
        name: 'chatOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['complete'],
            },
        },
        options: [
            {
                displayName: 'Additional Messages (JSON Array)',
                name: 'messagesJson',
                type: 'json',
                default: '',
                description: 'Optional full `messages` array in JSON format (e.g. `[{"role":"developer","content":"..."},{"role":"user","content":"..."}]`). If provided, overrides the single User Message field.',
            },
            {
                displayName: 'Max Completion Tokens',
                name: 'maxCompletionTokens',
                type: 'number',
                typeOptions: { minValue: 16 },
                default: 16384,
                description: 'Maximum number of tokens to generate (`max_completion_tokens`), shared between internal reasoning and visible output',
            },
            {
                displayName: 'Prompt Cache Key',
                name: 'promptCacheKey',
                type: 'string',
                default: '',
                description: 'Groups related requests to improve prompt-cache hit rates',
            },
            {
                displayName: 'Prompt Cache Retention',
                name: 'promptCacheRetention',
                type: 'options',
                default: 'default',
                options: [
                    { name: 'Server Default', value: 'default' },
                    { name: 'In Memory (in_memory)', value: 'in_memory' },
                    { name: '24 Hours (24h)', value: '24h' },
                ],
                description: 'Hint for prompt-cache retention (`prompt_cache_retention`)',
            },
            {
                displayName: 'Reasoning Effort',
                name: 'reasoningEffort',
                type: 'options',
                default: 'default',
                options: [
                    { name: 'Model Default', value: 'default' },
                    { name: 'Minimal (minimal)', value: 'minimal' },
                    { name: 'Low (low)', value: 'low' },
                    { name: 'Medium (medium)', value: 'medium' },
                    { name: 'High (high)', value: 'high' },
                    { name: 'Extra High (xhigh)', value: 'xhigh' },
                    { name: 'Max (max) — Muse Wonder 1.0 & Muse Spark 1.3 Only', value: 'max' },
                ],
                description: 'Top-level `reasoning_effort` parameter on Chat Completions (`none` is not supported on Muse models)',
            },
            {
                displayName: 'Response Format',
                name: 'responseFormat',
                type: 'options',
                default: 'text',
                options: [
                    { name: 'Text (Default)', value: 'text' },
                    { name: 'JSON Object (json_object)', value: 'json_object' },
                ],
                description: 'Output format for the assistant response',
            },
            {
                displayName: 'Safety Identifier',
                name: 'safetyIdentifier',
                type: 'string',
                default: '',
                description: 'Stable, privacy-preserving identifier for the end user behind the request (up to 64 characters)',
            },
            {
                displayName: 'Temperature',
                name: 'temperature',
                type: 'number',
                typeOptions: { minValue: 0, maxValue: 2, numberPrecision: 2 },
                default: 1,
                description: 'Controls randomness (0–2). Default is 1.0.',
            },
            {
                displayName: 'Tools (JSON Array)',
                name: 'toolsJson',
                type: 'json',
                default: '',
                description: 'Optional OpenAI-compatible function `tools` JSON array',
            },
            {
                displayName: 'Top P',
                name: 'topP',
                type: 'number',
                typeOptions: { minValue: 0.01, maxValue: 1, numberPrecision: 2 },
                default: 1,
                description: 'Nucleus sampling threshold (0 < top_p <= 1)',
            },
        ],
    },
    // =========================================================================
    // RESOURCE: IMAGE (MUSE IMAGE - muse-image-1.0)
    // =========================================================================
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['image'],
            },
        },
        options: [
            {
                name: 'Generate',
                value: 'generate',
                action: 'Generate an image with Muse Image',
                description: 'Generate one or more images from a text prompt using `muse-image-1.0` (POST /v1/images/generations)',
            },
            {
                name: 'Edit / Compose',
                value: 'edit',
                action: 'Edit or compose images with Muse Image',
                description: 'Edit an image or fuse multiple images from URLs, base64 data URLs, file IDs, or binary data using `muse-image-1.0` (POST /v1/images/edits)',
            },
            {
                name: 'Conversational Generate / Refine (Responses API)',
                value: 'conversational',
                action: 'Generate or refine an image across turns via Responses API',
                description: 'Use `muse-image-1.0` on POST /v1/responses to generate an image and iteratively refine it across turns using `previous_response_id`',
            },
        ],
        default: 'generate',
    },
    {
        displayName: 'Prompt',
        name: 'imagePrompt',
        type: 'string',
        typeOptions: {
            rows: 3,
        },
        default: '',
        required: true,
        placeholder: 'A watercolor painting of a red fox sitting in a snowy pine forest, golden hour',
        description: 'Text prompt describing the image to generate or the edit instruction to apply',
        displayOptions: {
            show: {
                resource: ['image'],
                operation: ['generate', 'edit', 'conversational'],
            },
        },
    },
    {
        displayName: 'Input Image Source',
        name: 'editImageSource',
        type: 'options',
        default: 'urlOrDataUrl',
        options: [
            {
                name: 'Image URL, Base64 Data URL, or File ID',
                value: 'urlOrDataUrl',
                description: 'Provide one or more public URLs, base64 data URLs, or Meta Model API `file-...` IDs (comma-separated)',
            },
            {
                name: 'n8n Binary Property',
                value: 'binary',
                description: 'Read the input image from an incoming n8n binary property',
            },
        ],
        displayOptions: {
            show: {
                resource: ['image'],
                operation: ['edit'],
            },
        },
    },
    {
        displayName: 'Image URL(s) / Data URL(s) / File ID(s)',
        name: 'editImageUrls',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'https://example.com/fox.webp, file-842549258569145',
        description: 'One or more image URLs, `data:image/...;base64,...` strings, or `file-...` IDs (separate multiple with commas to compose multiple images)',
        displayOptions: {
            show: {
                resource: ['image'],
                operation: ['edit'],
                editImageSource: ['urlOrDataUrl'],
            },
        },
    },
    {
        displayName: 'Input Binary Field',
        name: 'editBinaryPropertyName',
        type: 'string',
        default: 'data',
        required: true,
        description: 'Name of the binary property containing the image to edit',
        displayOptions: {
            show: {
                resource: ['image'],
                operation: ['edit'],
                editImageSource: ['binary'],
            },
        },
    },
    {
        displayName: 'Return Binary Image Output',
        name: 'downloadImageAsBinary',
        type: 'boolean',
        default: true,
        description: 'Whether to attach the generated base64 image directly as an n8n binary property (`data`) on the output item',
        displayOptions: {
            show: {
                resource: ['image'],
                operation: ['generate', 'edit', 'conversational'],
            },
        },
    },
    {
        displayName: 'Image Options',
        name: 'imageOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
            show: {
                resource: ['image'],
                operation: ['generate', 'edit', 'conversational'],
            },
        },
        options: [
            {
                displayName: 'Binary Property Name',
                name: 'outputBinaryPropertyName',
                type: 'string',
                default: 'data',
                description: 'Name of the n8n binary property to store the generated image in',
            },
            {
                displayName: 'Enable Built-in Image Search',
                name: 'enableImageSearch',
                type: 'boolean',
                default: true,
                description: 'Whether Muse Image can pull visual reference imagery (landmarks, products, logos, styles) before rendering',
            },
            {
                displayName: 'Enable Built-in Shell / Layout Computation',
                name: 'enableShell',
                type: 'boolean',
                default: true,
                description: 'Whether Muse Image can run layout code for infographics, charts, and structured graphics before rendering',
            },
            {
                displayName: 'Enable Built-in Web Search',
                name: 'enableWebSearch',
                type: 'boolean',
                default: true,
                description: 'Whether Muse Image can look up current facts and real-world data (included in the per-image price)',
            },
            {
                displayName: 'Number of Images (n)',
                name: 'n',
                type: 'number',
                typeOptions: { minValue: 1, maxValue: 10 },
                default: 1,
                description: 'Number of images to generate (1 to 10; applies to Generate and Edit)',
            },
            {
                displayName: 'Output Format',
                name: 'outputFormat',
                type: 'options',
                default: 'webp',
                options: [
                    { name: 'WebP (webp) — Default', value: 'webp' },
                    { name: 'PNG (png)', value: 'png' },
                    { name: 'JPEG (jpeg)', value: 'jpeg' },
                ],
                description: 'Image encoding format returned by Muse Image',
            },
            {
                displayName: 'Previous Response ID (Conversational Refinement)',
                name: 'previousResponseId',
                type: 'string',
                default: '',
                placeholder: 'resp_abc123',
                description: 'For Conversational Generate / Refine: pass the `id` from the prior turn to refine the image while preserving coherence',
            },
            {
                displayName: 'Reasoning Strength',
                name: 'reasoningStrength',
                type: 'options',
                default: 'high',
                options: [
                    {
                        name: 'High (Multi-pass Refinement — Default)',
                        value: 'high',
                    },
                    {
                        name: 'Low (Single-pass — Faster Generation)',
                        value: 'low',
                    },
                ],
                description: 'Controls whether Muse Image refines output over several passes (`high`) or returns after a single pass (`low`)',
            },
            {
                displayName: 'Reference Image URL (Conversational)',
                name: 'referenceImageUrl',
                type: 'string',
                default: '',
                placeholder: 'https://example.com/reference.png',
                description: 'Optional reference image URL or `data:` URL to include in a Conversational Generate / Refine turn',
            },
            {
                displayName: 'Response Format',
                name: 'responseFormat',
                type: 'options',
                default: 'b64_json',
                options: [
                    { name: 'Base64 JSON (b64_json) — Default', value: 'b64_json' },
                    { name: 'Signed Temporary URL (url)', value: 'url' },
                ],
                description: 'Whether `/v1/images/*` returns base64 bytes or a temporary signed URL',
            },
            {
                displayName: 'Size / Aspect Ratio',
                name: 'size',
                type: 'options',
                default: 'auto',
                options: [
                    { name: 'Auto (Default)', value: 'auto' },
                    { name: 'Square (1024x1024)', value: '1024x1024' },
                    { name: 'Landscape (1536x1024)', value: '1536x1024' },
                    { name: 'Wide Landscape (1792x1024)', value: '1792x1024' },
                    { name: 'Portrait (1024x1536)', value: '1024x1536' },
                    { name: 'Tall Portrait (1024x1792)', value: '1024x1792' },
                ],
                description: 'Sets the target aspect ratio for Muse Image',
            },
        ],
    },
    // =========================================================================
    // RESOURCE: VOICE AUDIO (MUSE VOICE TRANSCRIBE - POST /v1/asr/transcribe)
    // =========================================================================
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['audio'],
            },
        },
        options: [
            {
                name: 'Transcribe Recording',
                value: 'transcribe',
                action: 'Transcribe WAV audio with Muse Voice Transcribe',
                description: 'Transcribe a WAV recording using `muse-voice-transcribe-1.0` (POST /v1/asr/transcribe) with optional turn endpointing and speaker diarization',
            },
        ],
        default: 'transcribe',
    },
    {
        displayName: 'Input Binary Field (WAV Audio)',
        name: 'audioBinaryPropertyName',
        type: 'string',
        default: 'data',
        required: true,
        description: 'Name of the n8n binary property containing the WAV audio recording (16 kHz or 24 kHz mono PCM WAV, up to 10 minutes / 32 MB)',
        displayOptions: {
            show: {
                resource: ['audio'],
                operation: ['transcribe'],
            },
        },
    },
    {
        displayName: 'Transcription Mode',
        name: 'transcriptionMode',
        type: 'options',
        default: 'DIARIZATION',
        options: [
            {
                name: 'Diarization (Turn Detection + Speaker Attribution)',
                value: 'DIARIZATION',
                description: 'Detects speech turns with startMs/endMs timing and attributes each turn to a speaker',
            },
            {
                name: 'Endpointing (Turn Detection Only)',
                value: 'ENDPOINTING',
                description: 'Detects speech onset and endpoint, returning one turn per detected segment',
            },
            {
                name: 'Push To Talk (Single Turn)',
                value: 'PUSH_TO_TALK',
                description: 'Treats the entire uploaded audio clip as a single turn',
            },
        ],
        description: 'Transcription behavior mode for `muse-voice-transcribe-1.0`',
        displayOptions: {
            show: {
                resource: ['audio'],
                operation: ['transcribe'],
            },
        },
    },
    {
        displayName: 'Transcription Options',
        name: 'audioOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
            show: {
                resource: ['audio'],
                operation: ['transcribe'],
            },
        },
        options: [
            {
                displayName: 'Keywords (Vocabulary Biasing)',
                name: 'keywords',
                type: 'string',
                default: '',
                placeholder: 'Muse Spark, IgniteCore, SQLAlchemy',
                description: 'Comma-separated list of terms, names, or jargon to bias speech recognition toward',
            },
            {
                displayName: 'Language Bias',
                name: 'languageBias',
                type: 'string',
                default: '',
                placeholder: 'English, German',
                description: 'Comma-separated list of language names (e.g. `English, French`) to bias transcription toward. Omit to auto-detect.',
            },
            {
                displayName: 'Session ID',
                name: 'sessionId',
                type: 'string',
                default: '',
                description: 'Optional correlation ID (`sessionId` query parameter) echoed in the transcription response',
            },
        ],
    },
    // =========================================================================
    // RESOURCE: MEDIA SEGMENTATION (SAM 3.1 - sam-3.1 on POST /v1/responses)
    // =========================================================================
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['segmentation'],
            },
        },
        options: [
            {
                name: 'Segment Media',
                value: 'segment',
                action: 'Segment objects in an image or video with SAM 3.1',
                description: 'Detect and outline objects matching a short noun phrase in an image or video using `sam-3.1` on POST /v1/responses',
            },
        ],
        default: 'segment',
    },
    {
        displayName: 'Object Noun Phrase Prompt',
        name: 'samPrompt',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'yellow school bus',
        description: 'Short concrete noun phrase naming one object concept to segment (e.g. "yellow school bus" or "red bicycle")',
        displayOptions: {
            show: {
                resource: ['segmentation'],
                operation: ['segment'],
            },
        },
    },
    {
        displayName: 'Media Input Type',
        name: 'samMediaType',
        type: 'options',
        default: 'input_image',
        options: [
            {
                name: 'Image (URL, Base64 Data URL, or File ID)',
                value: 'input_image',
            },
            {
                name: 'Video (URL, Base64 Data URL, or File ID)',
                value: 'input_video',
            },
        ],
        description: 'Whether to segment an image or track objects across frames in a video',
        displayOptions: {
            show: {
                resource: ['segmentation'],
                operation: ['segment'],
            },
        },
    },
    {
        displayName: 'Media URL / Base64 Data URL / File ID',
        name: 'samMediaSource',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'https://example.com/street.png or file-842549258569145',
        description: 'Public URL, base64 data URL, or uploaded Meta Model API `file-...` ID of the image or video to segment',
        displayOptions: {
            show: {
                resource: ['segmentation'],
                operation: ['segment'],
            },
        },
    },
    // =========================================================================
    // RESOURCE: FILE (/v1/files)
    // =========================================================================
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['file'],
            },
        },
        options: [
            {
                name: 'Upload',
                value: 'upload',
                action: 'Upload a file to the Meta Model API',
                description: 'Upload an image, video, audio, or PDF file (POST /v1/files) to receive a reusable `file-...` ID',
            },
            {
                name: 'List',
                value: 'list',
                action: 'List uploaded files',
                description: 'List files stored on the Meta Model API (GET /v1/files)',
            },
            {
                name: 'Retrieve Metadata',
                value: 'retrieve',
                action: 'Retrieve file metadata by ID',
                description: 'Fetch metadata for an uploaded file (GET /v1/files/{file_id})',
            },
            {
                name: 'Delete',
                value: 'delete',
                action: 'Delete an uploaded file',
                description: 'Delete a stored file to free team storage (DELETE /v1/files/{file_id})',
            },
        ],
        default: 'upload',
    },
    {
        displayName: 'Input Binary Field',
        name: 'fileBinaryPropertyName',
        type: 'string',
        default: 'data',
        required: true,
        description: 'Name of the binary property containing the file to upload',
        displayOptions: {
            show: {
                resource: ['file'],
                operation: ['upload'],
            },
        },
    },
    {
        displayName: 'Purpose',
        name: 'filePurpose',
        type: 'options',
        default: 'user_data',
        options: [
            {
                name: 'User Data (user_data) — Inference Attachments (Images, Video, Audio, PDF)',
                value: 'user_data',
            },
            {
                name: 'Batch (batch) — JSONL Batch Datasets',
                value: 'batch',
            },
        ],
        description: 'Intended purpose for the uploaded file on the Meta Model API',
        displayOptions: {
            show: {
                resource: ['file'],
                operation: ['upload'],
            },
        },
    },
    {
        displayName: 'File ID',
        name: 'fileId',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'file-842549258569145',
        description: 'The `file-...` identifier returned by the Meta Model API Files endpoint',
        displayOptions: {
            show: {
                resource: ['file'],
                operation: ['retrieve', 'delete'],
            },
        },
    },
    // =========================================================================
    // RESOURCE: MODEL CATALOG (/v1/models)
    // =========================================================================
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['model'],
            },
        },
        options: [
            {
                name: 'List Models',
                value: 'list',
                action: 'List available Meta Muse models',
                description: 'Query GET /v1/models on the Meta Model API to list all enabled models for your key',
            },
            {
                name: 'Get Model',
                value: 'get',
                action: 'Get details for a specific Meta Muse model',
                description: 'Query GET /v1/models/{model} for a single model’s registry entry',
            },
        ],
        default: 'list',
    },
    {
        displayName: 'Model ID',
        name: 'catalogModelId',
        type: 'string',
        default: 'muse-spark-1.3',
        required: true,
        placeholder: 'muse-spark-1.3',
        description: 'The model ID to retrieve from `/v1/models/{model}`',
        displayOptions: {
            show: {
                resource: ['model'],
                operation: ['get'],
            },
        },
    },
];
//# sourceMappingURL=MetaMuseDescription.js.map