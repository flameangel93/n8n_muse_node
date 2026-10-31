"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaModelApi = void 0;
class MetaModelApi {
    name = 'metaModelApi';
    displayName = 'Meta Model API';
    documentationUrl = 'https://dev.meta.ai/docs/overview';
    icon = 'file:metaMuse.svg';
    properties = [
        {
            displayName: 'API Key (MODEL_API_KEY)',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            required: true,
            default: '',
            placeholder: 'MODEL_API_KEY',
            description: 'Bearer token (`MODEL_API_KEY`) for authenticating with the Meta Model API. See https://dev.meta.ai/docs/overview.',
        },
        {
            displayName: 'Base URL',
            name: 'baseUrl',
            type: 'string',
            required: true,
            default: 'https://api.meta.ai/v1',
            placeholder: 'https://api.meta.ai/v1',
            description: 'Base URL for the Meta Model API (`https://api.meta.ai/v1`). Can also point to a self-hosted Muse Spark Open or Muse Glimmer OpenAI-compatible runtime (vLLM, SGLang, llama.cpp).',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.apiKey}}',
            },
        },
    };
    test = {
        request: {
            baseURL: '={{$credentials.baseUrl.replace(/\\/+$/, "")}}',
            url: '/models',
            method: 'GET',
        },
    };
}
exports.MetaModelApi = MetaModelApi;
//# sourceMappingURL=MetaModelApi.credentials.js.map