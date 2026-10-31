# n8n-nodes-meta-muse

**Meta Muse Community Node for n8n — Powered by the [Meta Model API](https://dev.meta.ai/docs/overview)**

`n8n-nodes-meta-muse` adds first-class support for Meta's **Muse** model family in n8n via the **[Meta Model API](https://dev.meta.ai/docs/overview)** (`https://api.meta.ai/v1`).

It includes **two nodes** in one installable community package:

1. **Meta Muse Chat Model (`lmChatMetaMuse`)** — An **AI Language Model sub-node** (`AiLanguageModel`) that plugs directly into n8n's **AI Agent**, **Basic LLM Chain**, **Summarization Chain**, and **Question & Answer Chain** nodes.
2. **Meta Muse (Meta Model API) (`metaMuse`)** — A full-featured workflow action node (also `usableAsTool: true` for AI Agents) covering every hosted model and surface on the **Meta Model API**:
   - **Muse Wonder** (`muse-wonder-1.0`) & **Muse Spark** (`muse-spark-1.3`, `muse-spark-1.2`, `muse-spark-1.1`, plus discounted `-contributor` variants) via both the **Responses API** (`POST /v1/responses`) and **Chat Completions API** (`POST /v1/chat/completions`)
   - **Muse Image** (`muse-image-1.0`) for single-shot image generation (`POST /v1/images/generations`), image editing & multi-image composition (`POST /v1/images/edits`), and multi-turn conversational image refinement (`POST /v1/responses`)
   - **Muse Voice Transcribe** (`muse-voice-transcribe-1.0`) for WAV audio speech-to-text with turn endpointing and speaker diarization (`POST /v1/asr/transcribe`)
   - **Segment Anything Model (SAM 3.1)** (`sam-3.1`) for object detection, bounding boxes, and pixel-accurate mask segmentation in images and video (`POST /v1/responses`), including built-in parsing of SAM 3.1 `<0f>0<|box;...|><|mask;...|>` tokens into structured JSON
   - **Files API** (`POST /v1/files`, `GET /v1/files`, `DELETE /v1/files/{id}`) for uploading and reusing large multimodal files (up to 1 GiB)
   - **Models Catalog** (`GET /v1/models`, `GET /v1/models/{model}`)

---

## Meta Model API Overview

All requests authenticate with your `MODEL_API_KEY` Bearer token against the **Meta Model API**:

| Setting | Value |
| :--- | :--- |
| **Base URL** | `https://api.meta.ai/v1` |
| **Authentication** | `Authorization: Bearer $MODEL_API_KEY` |
| **Documentation** | [https://dev.meta.ai/docs/overview](https://dev.meta.ai/docs/overview) |
| **Context Window** | `1,048,576` tokens (1M tokens on Muse Wonder & Muse Spark) |

### Supported Meta Muse Models on the Meta Model API

| Model Line | Model ID(s) | Mode / Tier | Endpoints | Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Muse Wonder** | `muse-wonder-1.0` | Standard Mode (Preview) | `/v1/responses`, `/v1/chat/completions` | Meta's most capable model for complex software engineering, sub-agent delegation, parallel tool calls, multimodal understanding (text, image, video, audio, PDF), search grounding, and `reasoning.effort` from `"minimal"` to `"max"`. |
| **Muse Spark 1.3** | `muse-spark-1.3`<br>`muse-spark-1.3-contributor` | Standard Mode<br>Contributor Mode | `/v1/responses`, `/v1/chat/completions` | Latest Muse Spark model tuned for agentic workflows, tight tool loops, and coding. `muse-spark-1.3` supports reasoning effort up to `"max"`. |
| **Muse Spark 1.2** | `muse-spark-1.2`<br>`muse-spark-1.2-contributor` | Standard Mode<br>Contributor Mode | `/v1/responses`, `/v1/chat/completions` | Multimodal model recommended when requests include inline audio understanding alongside text, image, video, and PDF. |
| **Muse Spark 1.1** | `muse-spark-1.1` | Standard Mode | `/v1/responses`, `/v1/chat/completions` | Original Muse Spark model release. |
| **Muse Image** | `muse-image-1.0` | Standard ($0.01 / image) | `/v1/images/generations`, `/v1/images/edits`, `/v1/responses` | Agentic image generation, editing, and multi-turn conversational refinement with automatic built-in web search, visual reference search, and layout code execution. |
| **Muse Voice Transcribe** | `muse-voice-transcribe-1.0` | Standard ($0.18 / hour) | `/v1/asr/transcribe` | Speech-to-text transcription for WAV audio with `PUSH_TO_TALK`, `ENDPOINTING`, and `DIARIZATION` (speaker attribution + turn-level `startMs`/`endMs` timing), keyword biasing, and language biasing. |
| **Segment Anything Model** | `sam-3.1` | Standard | `/v1/responses` | Promptable object detection and segmentation in images and video, returning bounding boxes and pixel masks per frame. |
| **Muse Spark Open / Muse Glimmer** | Custom model ID | Self-hosted | Custom Base URL (`/v1/*`) | Open-weight models served on your own GPUs or edge hardware via vLLM, SGLang, or llama.cpp — supported by changing the **Base URL** in credentials and selecting **Custom Model ID**. |

---

## Installing on Your Remote n8n Instance

You have three ways to install `n8n-nodes-meta-muse` on a remote self-hosted n8n instance:

### Option 1: Install via the n8n GUI (Settings → Community Nodes)

1. Publish this package to npm (or your private npm registry):
   ```bash
   npm run build
   npm publish
   ```
2. On your remote n8n instance, open **Settings → Community Nodes**.
3. Click **Install**.
4. Enter `n8n-nodes-meta-muse` under **Enter npm package name**.
5. Check **I understand the risks of installing unverified code from a public source** and click **Install**.

### Option 2: Install via Environment Variables (n8n 2.21.0+ / Docker / Kubernetes)

On remote Docker or Kubernetes deployments, you can declare community packages declaratively so n8n installs and reconciles them on startup:

```bash
export N8N_COMMUNITY_PACKAGES_ENABLED=true
export N8N_COMMUNITY_PACKAGES_MANAGED_BY_ENV=true
export N8N_COMMUNITY_PACKAGES='[{"name":"n8n-nodes-meta-muse"}]'
```

### Option 3: Install on a VPS Running Coolify (No npm Publish Required)

When n8n is deployed via **Coolify** on a VPS, the n8n container mounts a persistent volume to `/home/node/.n8n`. Any community node installed into `/home/node/.n8n/nodes` persists across Coolify restarts and redeployments!

#### Method A: One-Liner Install from GitHub in Coolify Terminal (Fastest)

1. Open **Coolify → Your Project → Your n8n Service → Terminal** (inside the n8n container) and run:
   ```bash
   mkdir -p /home/node/.n8n/nodes && cd /home/node/.n8n/nodes && wget -O /tmp/n8n-nodes-meta-muse-1.0.0.tgz https://raw.githubusercontent.com/flameangel93/n8n_muse_node/main/n8n-nodes-meta-muse-1.0.0.tgz && npm install --omit=peer --ignore-scripts /tmp/n8n-nodes-meta-muse-1.0.0.tgz
   ```
2. Click **Restart** on your n8n service in Coolify.

#### Method B: SCP Tarball to VPS + Install in Coolify Container

1. From your local machine (`C:\Users\peter\cursor_workspace\meta_muse_node`), copy the pre-built `n8n-nodes-meta-muse-1.0.0.tgz` to your Coolify VPS:
   ```powershell
   scp .\n8n-nodes-meta-muse-1.0.0.tgz root@<YOUR_VPS_IP>:/tmp/
   ```
2. SSH into your VPS (or use **Coolify → Server → Terminal**), find your n8n container name, copy the `.tgz` inside, install it into `/home/node/.n8n/nodes`, and restart:
   ```bash
   # Find the Coolify n8n container name
   CONTAINER=$(docker ps --filter "ancestor=n8nio/n8n" --format "{{.Names}}" | head -n 1)
   # (If your image tag differs, run: CONTAINER=$(docker ps | grep -i n8n | awk '{print $NF}' | head -n 1))

   # Copy the package into the container and install it into the persistent .n8n/nodes volume
   docker cp /tmp/n8n-nodes-meta-muse-1.0.0.tgz "$CONTAINER":/tmp/
   docker exec -u node "$CONTAINER" sh -c "mkdir -p /home/node/.n8n/nodes && cd /home/node/.n8n/nodes && npm install /tmp/n8n-nodes-meta-muse-1.0.0.tgz"

   # Restart the container so n8n loads the new Meta Muse nodes
   docker restart "$CONTAINER"
   ```

#### Method B: Publish to npm + Install via n8n UI or Coolify Environment Variables

If you publish this package to npm (`npm login && npm publish`), you can install it directly in Coolify:
- **In n8n UI**: Go to **Settings → Community Nodes → Install** and enter `n8n-nodes-meta-muse`.
- **Or in Coolify → Your n8n Service → Environment Variables**:
  ```env
  N8N_COMMUNITY_PACKAGES_ENABLED=true
  N8N_COMMUNITY_PACKAGES_MANAGED_BY_ENV=true
  N8N_COMMUNITY_PACKAGES=[{"name":"n8n-nodes-meta-muse"}]
  ```

---

## Configuring Credentials (`Meta Model API`)

1. In n8n, go to **Credentials → Add Credential** and search for **Meta Model API**.
2. Enter your **API Key (`MODEL_API_KEY`)** from [https://dev.meta.ai](https://dev.meta.ai/docs/overview).
3. Keep **Base URL** set to `https://api.meta.ai/v1` (or change it if pointing to a self-hosted Muse Spark Open / Muse Glimmer vLLM or SGLang server).
4. Click **Save** — n8n will automatically verify your key by calling `GET https://api.meta.ai/v1/models`.

---

## Node Reference

### 1. `Meta Muse Chat Model` (AI Agent Sub-Node)

Use **Meta Muse Chat Model** whenever you build workflows with n8n's **AI Agent** node or LangChain chains:

- **Model**: Pick `muse-spark-1.3`, `muse-wonder-1.0`, `muse-spark-1.3-contributor`, `muse-spark-1.2`, `muse-spark-1.2-contributor`, `muse-spark-1.1`, or a custom model ID.
- **Meta Model API Protocol**:
  - **Responses API (`POST /v1/responses`)** *(Recommended)*: Preserves reasoning across turns, supports reasoning summaries (`auto`, `concise`, `detailed`), and enables built-in `web_search` grounding.
  - **Chat Completions API (`POST /v1/chat/completions`)**: Classic OpenAI-compatible messages endpoint.
- **Options**:
  - **Reasoning Effort**: `minimal`, `low`, `medium`, `high`, `xhigh`, or `max` (note: Muse models always reason; `none` is rejected by the Meta Model API with HTTP 400).
  - **Reasoning Summary**: `auto`, `concise`, or `detailed` (Responses API).
  - **Enable Web Search Grounding**: Attaches `{ "type": "web_search" }` so the agent can ground responses in live web results.
  - **Prompt Cache Key** & **Prompt Cache Retention** (`in_memory` or `24h`).
  - **Safety Identifier**: Up to 64-character hashed end-user identifier.
  - **Streaming**: Enabled by default (`true`) as recommended by the Meta Model API to prevent non-streaming gateway timeouts (`HTTP 504`) on long reasoning runs.

### 2. `Meta Muse (Meta Model API)` (Action & Tool Node)

Use **Meta Muse (Meta Model API)** directly in your workflow or connect it as a tool to an AI Agent:

- **Response (`POST /v1/responses`)**:
  - **Create**: Send text, developer `instructions`, multimodal attachments (`input_image`, `input_file`, `input_video` via URL, `data:` URL, or `file-...` ID), `previous_response_id` for multi-turn state, `include: ["reasoning.encrypted_content"]` for stateless reasoning replay, `web_search` grounding, custom function tools, `background: true` execution, and JSON Schema structured output (`text.format`). Automatically extracts top-level `output_text`, `reasoning_summary`, `tool_calls`, and `citations`.
  - **Retrieve / Cancel / Delete / Count Input Tokens**: Full lifecycle management via `GET /v1/responses/{id}`, `POST /v1/responses/{id}/cancel`, `DELETE /v1/responses/{id}`, and `POST /v1/responses/input_tokens`.
- **Chat Completion (`POST /v1/chat/completions`)**:
  - **Complete**: Send `developer` and `user` messages (or a full `messages` JSON array) with `reasoning_effort`, `max_completion_tokens`, `response_format`, and function tools.
- **Image (`muse-image-1.0`)**:
  - **Generate** (`POST /v1/images/generations`): Generate 1–10 images in `webp`, `png`, or `jpeg` with `reasoning_strength` (`high` or `low`) and `tool_enablement` (`enable_image_search`, `enable_web_search`, `enable_shell`). Automatically decodes base64 output into an n8n binary property (`data`) for downstream nodes.
  - **Edit / Compose** (`POST /v1/images/edits`): Edit an n8n binary image or compose multiple images from URLs, data URLs, or `file-...` IDs.
  - **Conversational Generate / Refine** (`POST /v1/responses`): Generate and iteratively refine images across turns using `previous_response_id`.
- **Voice Audio (`muse-voice-transcribe-1.0`)**:
  - **Transcribe Recording** (`POST /v1/asr/transcribe`): Upload an n8n binary WAV file (`16 kHz` or `24 kHz` mono PCM WAV) with `DIARIZATION`, `ENDPOINTING`, or `PUSH_TO_TALK` mode, plus optional `keywords` and `languageBias`.
- **Media Segmentation (`sam-3.1`)**:
  - **Segment Media** (`POST /v1/responses`): Segment objects matching a short noun phrase (e.g., `"yellow school bus"`) in an image or video, returning both raw `output_text` and parsed `frames[].objects[]` with bounding boxes (`x1, y1, x2, y2, width, height`) and mask payloads.
- **File (`/v1/files`) & Model Catalog (`/v1/models`)**:
  - Upload binary files (`user_data` or `batch`), list files, retrieve metadata, delete files, and query `/v1/models`.

---

## Development

```bash
# Install dependencies (use --ignore-scripts on Windows if C++ build tools are not installed)
npm install --ignore-scripts

# Typecheck and build dist/
npm run build

# Create installable npm tarball
npm pack
```
