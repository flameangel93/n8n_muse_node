import { supplyModel, type OpenAiModel } from '@n8n/ai-node-sdk';
import {
	NodeConnectionTypes,
	type IDataObject,
	type ILoadOptionsFunctions,
	type INodePropertyOptions,
	type INodeType,
	type INodeTypeDescription,
	type ISupplyDataFunctions,
	type SupplyData,
} from 'n8n-workflow';

export class LmChatMetaMuse implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Meta Muse Chat Model',
		name: 'lmChatMetaMuse',
		icon: 'file:metaMuse.svg',
		group: ['transform'],
		version: [1],
		description:
			'Use Meta Muse models (Muse Wonder & Muse Spark) via the Meta Model API (https://api.meta.ai/v1) in n8n AI Agents and Chains',
		defaults: {
			name: 'Meta Muse Chat Model',
		},
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Language Models', 'Chat Models (Recommended)'],
				'Language Models': ['Chat Models (Recommended)'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://dev.meta.ai/docs/overview',
					},
				],
			},
		},
		inputs: [],
		outputs: [NodeConnectionTypes.AiLanguageModel],
		outputNames: ['Model'],
		credentials: [
			{
				name: 'metaModelApi',
				required: true,
			},
		],
		properties: [
			{
				displayName:
					'Powered by the <b>Meta Model API</b> (<code>https://api.meta.ai/v1</code>). Connect this node to an <b>AI Agent</b> or <b>LLM Chain</b> to use <b>Muse Wonder</b> (<code>muse-wonder-1.0</code>) or <b>Muse Spark</b> (<code>muse-spark-1.3</code>) with a 1M-token context window, parallel tool calling, and configurable reasoning effort.',
				name: 'metaModelApiNotice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				default: 'muse-spark-1.3',
				description:
					'The Meta Muse model to use from the Meta Model API. See https://dev.meta.ai/docs/models for specifications.',
				options: [
					{
						name: 'Muse Spark 1.3 (muse-spark-1.3) — Standard Mode (Recommended)',
						value: 'muse-spark-1.3',
						description:
							'Latest Muse Spark model tuned for agentic workflows, multi-step tool loops, and coding (1,048,576 token context window; supports up to "max" reasoning effort)',
					},
					{
						name: 'Muse Wonder 1.0 (muse-wonder-1.0) — Preview, Standard Mode',
						value: 'muse-wonder-1.0',
						description:
							'Meta’s most capable model for complex software engineering, sub-agent delegation, and long-horizon agentic work (1,048,576 token context window; supports up to "max" reasoning effort)',
					},
					{
						name: 'Muse Spark 1.3 Contributor (muse-spark-1.3-contributor) — Discounted Contributor Mode',
						value: 'muse-spark-1.3-contributor',
						description:
							'Muse Spark 1.3 in discounted Contributor mode (supports reasoning effort up to "xhigh")',
					},
					{
						name: 'Muse Spark 1.2 (muse-spark-1.2) — Standard Mode (Multimodal + Audio)',
						value: 'muse-spark-1.2',
						description:
							'Previous Muse Spark version in Standard mode; recommended when requests include inline audio understanding',
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
						description:
							'Specify a custom model ID from the Meta Model API catalog or a self-hosted Muse Spark Open / Muse Glimmer server',
					},
				],
			},
			{
				displayName: 'Custom Model ID',
				name: 'customModel',
				type: 'string',
				default: 'muse-spark-1.3',
				required: true,
				placeholder: 'muse-spark-1.3',
				description:
					'Enter the exact model ID supported by the Meta Model API or your self-hosted Muse Spark Open / Muse Glimmer endpoint',
				displayOptions: {
					show: {
						model: ['custom'],
					},
				},
			},
			{
				displayName: 'Meta Model API Protocol',
				name: 'apiProtocol',
				type: 'options',
				default: 'responses',
				description:
					'Choose which Meta Model API surface to call. Both use the same models, auth, and per-token pricing (https://dev.meta.ai/docs/protocols).',
				options: [
					{
						name: 'Responses API (POST /v1/responses) — Recommended for Agents',
						value: 'responses',
						description:
							'Recommended default for agentic and multi-step tool workflows; supports reasoning summaries and built-in web search grounding',
					},
					{
						name: 'Chat Completions API (POST /v1/chat/completions)',
						value: 'chatCompletions',
						description:
							'Classic OpenAI-compatible messages-array endpoint for standard chat and tool calling',
					},
				],
			},
			{
				displayName: 'Options',
				name: 'options',
				placeholder: 'Add Option',
				description: 'Additional Meta Model API parameters for Muse Wonder and Muse Spark',
				type: 'collection',
				default: {},
				options: [
					{
						displayName: 'Enable Web Search Grounding',
						name: 'enableWebSearch',
						type: 'boolean',
						default: false,
						description:
							'Whether to attach the built-in Meta Model API `web_search` tool for real-time answers with inline citations (Responses API only)',
					},
					{
						displayName: 'Max Output / Completion Tokens',
						name: 'maxTokens',
						type: 'number',
						typeOptions: {
							minValue: 16,
						},
						default: 16384,
						description:
							'Maximum number of tokens to generate (`max_output_tokens` on Responses API, `max_completion_tokens` on Chat Completions API). Covers both internal reasoning tokens and visible output tokens.',
					},
					{
						displayName: 'Max Retries',
						name: 'maxRetries',
						type: 'number',
						typeOptions: {
							minValue: 0,
							maxValue: 10,
						},
						default: 2,
						description: 'Maximum number of retries on transient HTTP 429 / 5xx errors',
					},
					{
						displayName: 'Prompt Cache Key',
						name: 'promptCacheKey',
						type: 'string',
						default: '',
						placeholder: 'workflow-agent-v1',
						description:
							'Groups related requests on the Meta Model API to improve prompt-cache hit rates and lower latency/cost',
					},
					{
						displayName: 'Prompt Cache Retention',
						name: 'promptCacheRetention',
						type: 'options',
						default: 'default',
						description: 'Hint for server-side prompt cache retention on the Meta Model API',
						options: [
							{
								name: 'Server Default',
								value: 'default',
							},
							{
								name: 'In Memory (in_memory)',
								value: 'in_memory',
							},
							{
								name: '24 Hours (24h)',
								value: '24h',
							},
						],
					},
					{
						displayName: 'Reasoning Effort',
						name: 'reasoningEffort',
						type: 'options',
						default: 'default',
						description:
							'Controls how much internal reasoning Muse Wonder / Muse Spark performs before answering. Note: Muse models always reason (`"none"` is not supported by the Meta Model API).',
						options: [
							{
								name: 'Model Default',
								value: 'default',
								description: 'Let the Meta Model API select the default reasoning depth',
							},
							{
								name: 'Minimal (minimal)',
								value: 'minimal',
								description: 'Shortest reasoning pass for lowest latency',
							},
							{
								name: 'Low (low)',
								value: 'low',
								description: 'Light reasoning for direct lookups, formatting, and translation',
							},
							{
								name: 'Medium (medium)',
								value: 'medium',
								description: 'Balanced reasoning depth and speed',
							},
							{
								name: 'High (high)',
								value: 'high',
								description: 'Deep reasoning for multi-step problem solving and coding',
							},
							{
								name: 'Extra High (xhigh)',
								value: 'xhigh',
								description: 'Deeper reasoning for complex architecture and debugging',
							},
							{
								name: 'Max (max) — Muse Wonder 1.0 & Muse Spark 1.3 Only',
								value: 'max',
								description:
									'Extended reasoning beyond xhigh. Supported by muse-wonder-1.0 and muse-spark-1.3 (not available on muse-spark-1.3-contributor).',
							},
						],
					},
					{
						displayName: 'Reasoning Summary',
						name: 'reasoningSummary',
						type: 'options',
						default: 'none',
						description:
							'Request a natural-language summary of the model’s private reasoning chain (Responses API only)',
						options: [
							{
								name: 'None (Do Not Request)',
								value: 'none',
							},
							{
								name: 'Auto (auto)',
								value: 'auto',
								description: 'Compact summary, typically about one sentence',
							},
							{
								name: 'Concise (concise)',
								value: 'concise',
								description: 'Brief multi-sentence summary focused on key reasoning steps',
							},
							{
								name: 'Detailed (detailed)',
								value: 'detailed',
								description: 'Longer summary preserving more of the reasoning chain structure',
							},
						],
					},
					{
						displayName: 'Safety Identifier',
						name: 'safetyIdentifier',
						type: 'string',
						default: '',
						placeholder: 'sha256_user_hash',
						description:
							'Stable, privacy-preserving identifier for the end user behind the request (up to 64 characters) for targeted policy enforcement',
					},
					{
						displayName: 'Streaming',
						name: 'streaming',
						type: 'boolean',
						default: true,
						description:
							'Whether to stream responses via SSE. Meta Model API recommends streaming for long generations to avoid non-streaming gateway timeouts (HTTP 504).',
					},
					{
						displayName: 'Temperature',
						name: 'temperature',
						type: 'number',
						typeOptions: {
							minValue: 0,
							maxValue: 2,
							numberPrecision: 2,
						},
						default: 1,
						description:
							'Controls randomness (0 to 2). Muse Spark and Muse Wonder are tuned to run at the default of 1.0 and perform best there. Adjust temperature or top_p, not both.',
					},
					{
						displayName: 'Timeout (ms)',
						name: 'timeout',
						type: 'number',
						typeOptions: {
							minValue: 1000,
						},
						default: 120000,
						description: 'Request timeout in milliseconds',
					},
					{
						displayName: 'Top P',
						name: 'topP',
						type: 'number',
						typeOptions: {
							minValue: 0.01,
							maxValue: 1,
							numberPrecision: 2,
						},
						default: 1,
						description:
							'Nucleus sampling threshold (0 < top_p <= 1; top_p: 0 returns HTTP 400 on Meta Model API). Leave at 1.0 unless needed.',
					},
				],
			},
		],
	};

	methods = {
		loadOptions: {
			async getModels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('metaModelApi');
				const baseUrl = ((credentials.baseUrl as string) || 'https://api.meta.ai/v1').replace(
					/\/+$/,
					'',
				);
				try {
					const response = (await this.helpers.httpRequestWithAuthentication.call(
						this,
						'metaModelApi',
						{
							method: 'GET',
							url: `${baseUrl}/models`,
							json: true,
						},
					)) as { data?: Array<{ id: string }> };

					if (Array.isArray(response?.data) && response.data.length > 0) {
						return response.data.map((m) => ({
							name: m.id,
							value: m.id,
						}));
					}
				} catch {
					// Fallback to static model list if network call fails
				}

				return [
					{ name: 'muse-spark-1.3', value: 'muse-spark-1.3' },
					{ name: 'muse-wonder-1.0', value: 'muse-wonder-1.0' },
					{ name: 'muse-spark-1.3-contributor', value: 'muse-spark-1.3-contributor' },
					{ name: 'muse-spark-1.2', value: 'muse-spark-1.2' },
					{ name: 'muse-spark-1.2-contributor', value: 'muse-spark-1.2-contributor' },
					{ name: 'muse-spark-1.1', value: 'muse-spark-1.1' },
				];
			},
		},
	};

	async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
		const credentials = await this.getCredentials('metaModelApi');
		const baseUrl = ((credentials.baseUrl as string) || 'https://api.meta.ai/v1').replace(
			/\/+$/,
			'',
		);
		const apiKey = credentials.apiKey as string;

		const selectedModel = this.getNodeParameter('model', itemIndex) as string;
		const model =
			selectedModel === 'custom'
				? (this.getNodeParameter('customModel', itemIndex) as string).trim()
				: selectedModel;

		const apiProtocol = this.getNodeParameter('apiProtocol', itemIndex, 'responses') as string;
		const useResponsesApi = apiProtocol === 'responses';

		const options = this.getNodeParameter('options', itemIndex, {}) as IDataObject;

		const additionalParams: Record<string, unknown> = {};

		if (
			options.promptCacheRetention &&
			options.promptCacheRetention !== 'default'
		) {
			additionalParams.prompt_cache_retention = options.promptCacheRetention;
		}

		if (options.safetyIdentifier) {
			additionalParams.safety_identifier = String(options.safetyIdentifier).slice(0, 64);
		}

		const reasoningEffort =
			options.reasoningEffort && options.reasoningEffort !== 'default'
				? String(options.reasoningEffort)
				: undefined;

		const reasoningSummary =
			options.reasoningSummary && options.reasoningSummary !== 'none'
				? (String(options.reasoningSummary) as 'auto' | 'concise' | 'detailed')
				: undefined;

		const modelConfig: OpenAiModel = {
			type: 'openai',
			baseUrl,
			apiKey,
			model,
			useResponsesApi,
			supportsStrictToolCalling: true,
			streaming: options.streaming !== undefined ? Boolean(options.streaming) : true,
		};

		if (options.temperature !== undefined) {
			modelConfig.temperature = Number(options.temperature);
		}

		if (options.topP !== undefined && Number(options.topP) > 0 && Number(options.topP) < 1) {
			modelConfig.topP = Number(options.topP);
		}

		if (options.maxTokens !== undefined && Number(options.maxTokens) >= 16) {
			modelConfig.maxCompletionTokens = Number(options.maxTokens);
			modelConfig.maxTokens = Number(options.maxTokens);
		}

		if (options.promptCacheKey) {
			modelConfig.promptCacheKey = String(options.promptCacheKey);
		}

		if (options.timeout !== undefined) {
			modelConfig.timeout = Number(options.timeout);
		}

		if (options.maxRetries !== undefined) {
			modelConfig.maxRetries = Number(options.maxRetries);
		}

		if (useResponsesApi) {
			if (reasoningEffort || reasoningSummary) {
				modelConfig.reasoning = {
					...(reasoningEffort
						? { effort: reasoningEffort as NonNullable<OpenAiModel['reasoning']>['effort'] }
						: {}),
					...(reasoningSummary ? { summary: reasoningSummary } : {}),
				};
			}

			if (options.enableWebSearch) {
				modelConfig.providerTools = [
					{
						type: 'provider',
						name: 'web_search',
						args: {},
					},
				];
			}
		} else {
			if (reasoningEffort) {
				additionalParams.reasoning_effort = reasoningEffort;
			}
		}

		if (Object.keys(additionalParams).length > 0) {
			modelConfig.additionalParams = additionalParams;
		}

		return supplyModel(this, modelConfig);
	}
}
