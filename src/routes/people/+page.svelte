<script lang="ts">
	import { onMount, tick } from 'svelte';
	import {
		CreateMLCEngine,
		MLCEngine,
		prebuiltAppConfig,
		type ChatCompletion,
		type ChatCompletionMessageParam,
		type ChatCompletionRequestBase,
		type ModelRecord
	} from '@mlc-ai/web-llm';
	import { companyPrompt, enhanceSkillsPrompt, personaPrompt } from './prompts';
	import Highlight from 'svelte-highlight';
	import json from 'svelte-highlight/languages/json';
	import { isValidJson } from '$lib/utils/isValidJson';

	let engine: MLCEngine;
	let isModelLoading = true;
	let loadingPercent = 0;
	let loadingProgressText = '';
	let userQuery =
		'Senior react.js developers with 5+ years of experience in San Francisco working at mid-size tech companies.';
	let generatedFilters = '';
	let generatedSkills = '';
	let generatedCompanyFilters = '';
	let isRecording = false;
	let recognition: SpeechRecognition | null = null;
	let currentStep: 'initial' | 'processing' | 'error' | 'done' = 'initial';
	let chatMessages: ChatCompletionMessageParam[] = [];
	const isMissingSpeechRecognition =
		!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window);

	async function createEngine() {
		try {
			currentStep = 'initial';
			isModelLoading = true;
			loadingPercent = 0;
			loadingProgressText = '';
			const modelRecord = prebuiltAppConfig.model_list.find(
				(model: ModelRecord) => model.model_id === 'Llama-3.1-8B-Instruct-q4f16_1-MLC-1k'
			);
			if (!modelRecord) {
				throw new Error('Model record not found in prebuilt app config');
			}
			engine = await CreateMLCEngine(modelRecord.model_id, {
				initProgressCallback: (progress) => {
					loadingPercent = Math.floor(progress.progress * 100);
					loadingProgressText = progress.text;
					if (progress.progress === 1) {
						loadingProgressText = 'Model loaded successfully! Initializing UI...';
						setTimeout(() => {
							isModelLoading = false;
							currentStep = 'initial';
						}, 3000);
					}
				},
				appConfig: {
					model_list: [modelRecord],
					useIndexedDBCache: true
				}
			});
		} catch (error) {
			console.error('Error creating MLCEngine:', error);
			isModelLoading = false;
			currentStep = 'error';
		}
	}

	async function generateUserAndSkillsQuery(attemptsLeft = 5) {
		if (!engine?.chat) {
			return await createEngine();
		}
		try {
			const messages: ChatCompletionRequestBase = {
				messages: [
					{
						role: 'system',
						content: personaPrompt
					},
					{
						role: 'user',
						content: userQuery
					},
					...chatMessages
				],
				temperature: 0.1,
				stream: false
			};
			const reply = (await engine.chat.completions.create(messages)) as ChatCompletion;
			const responseText = reply.choices.reduce((acc, choice) => acc + choice.message.content, '');
			const asJson = isValidJson(responseText);
			if (!asJson) {
				if (attemptsLeft === 0) {
					throw new Error('Max attempts reached. Unable to get valid JSON response.');
				}
				chatMessages = [
					...chatMessages,
					{ role: 'assistant', content: responseText },
					{
						role: 'user',
						content:
							'The previous response was not valid JSON. Please respond only with valid JSON following the specified template.'
					}
				];
				generateUserAndSkillsQuery(attemptsLeft - 1);
			} else {
				generatedFilters = JSON.stringify(asJson, null, 2);
				const initialSkills = asJson?.skills || [];
				if (initialSkills && initialSkills.length > 0) {
					const skillsMessage: ChatCompletionRequestBase = {
						messages: [
							{
								role: 'system',
								content: enhanceSkillsPrompt
							},
							{
								role: 'user',
								content: generatedFilters
							}
						],
						temperature: 0.1,
						stream: false
					};
					const reply = (await engine.chat.completions.create(skillsMessage)) as ChatCompletion;
					const responseText = reply.choices.reduce(
						(acc, choice) => acc + choice.message.content,
						''
					);
					const skillsJson = isValidJson(responseText);
					if (skillsJson) {
						generatedSkills = JSON.stringify(skillsJson, null, 2);
					} else {
						generatedSkills = 'Failed to generate enhanced skills in valid JSON format.';
					}
				}
			}
		} catch (error) {
			console.error('Error generating user and skills query:', error);
			if (attemptsLeft === 0) {
				isModelLoading = false;
				currentStep = 'error';
			} else {
				generateUserAndSkillsQuery(attemptsLeft - 1);
			}
		}
	}

	async function generateCompanySearch(attemptsLeft = 5) {
		if (!engine?.chat) {
			return await createEngine();
		}
		try {
			const messages: ChatCompletionRequestBase = {
				messages: [
					{
						role: 'system',
						content: companyPrompt
					},
					{
						role: 'user',
						content: userQuery
					},
					...chatMessages
				],
				temperature: 0.1,
				stream: false
			};
			const reply = (await engine.chat.completions.create(messages)) as ChatCompletion;
			const responseText = reply.choices.reduce((acc, choice) => acc + choice.message.content, '');
			const asJson = isValidJson(responseText);
			if (!asJson) {
				if (attemptsLeft === 0) {
					throw new Error('Max attempts reached. Unable to get valid JSON response.');
				}
				chatMessages = [
					...chatMessages,
					{ role: 'assistant', content: responseText },
					{
						role: 'user',
						content:
							'The previous response was not valid JSON. Please respond only with valid JSON following the specified template.'
					}
				];
				generateCompanySearch(attemptsLeft - 1);
			} else {
				generatedCompanyFilters = JSON.stringify(asJson, null, 2);
			}
		} catch (error) {
			console.error('Error generating company search:', error);
			if (attemptsLeft === 0) {
				isModelLoading = false;
				currentStep = 'error';
			} else {
				generateCompanySearch(attemptsLeft - 1);
			}
		}
	}

	async function runWorker(attemptsLeft = 5) {
		try {
			currentStep = 'processing';
			await generateUserAndSkillsQuery(attemptsLeft);
			await generateCompanySearch(attemptsLeft);
			currentStep = 'done';
		} catch (error) {
			console.error('Error during runWorker:', error);
			isModelLoading = false;
			currentStep = 'error';
		}
	}

	async function startVoiceRecognition() {
		if (isMissingSpeechRecognition) {
			return;
		}

		// show the canvas in the UI and wait for DOM to update so `canvas` is bound
		isRecording = true;
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		recognition = new SpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = 'en-US';

		recognition.onresult = (event: SpeechRecognitionEvent) => {
			let transcript = '';
			for (let partTranscript of event.results) {
				if (partTranscript.isFinal) {
					transcript += partTranscript[0].transcript + ' ';
				}
			}
			userQuery = transcript.trim();
		};

		recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
			console.error('Speech recognition error:', event.error);
		};

		recognition.onend = async () => {
			isRecording = false;
		};

		recognition.start();
	}

	function toggleVoiceRecognition() {
		if (isRecording && recognition) {
			recognition.stop();
		} else {
			startVoiceRecognition();
		}
	}

	function resetInternalData() {
		generatedFilters = '';
		generatedSkills = '';
		chatMessages = [];
		currentStep = 'initial';
	}

	onMount(async () => {
		currentStep = 'initial';
		await createEngine();
	});
</script>

<div class="flex h-screen max-h-screen flex-col items-center justify-center bg-base-200">
	{#if currentStep === 'processing'}
		<span class="loading loading-xl loading-infinity"></span>
	{/if}
	{#if currentStep === 'done'}
		<div class="flex h-[80vh] w-full items-start justify-evenly gap-3 overflow-hidden px-4">
			<div class="flex h-full w-1/2 flex-col items-start">
				<h3 class="mb-2 text-2xl text-base-content">Generated User Filters</h3>
				<div
					class="h-full w-full overflow-auto rounded-2xl border-25 border-solid border-neutral shadow"
				>
					<Highlight language={json} code={generatedFilters} />
				</div>
			</div>
			<div class="flex h-full w-1/2 flex-col items-start">
				<h3 class="mb-2 text-2xl text-base-content">Generated company filters</h3>
				<div
					class="h-full w-full overflow-auto rounded-2xl border-25 border-solid border-neutral shadow"
				>
					<Highlight language={json} code={generatedCompanyFilters} />
				</div>
			</div>
			<div class="flex h-full w-1/2 flex-col items-start">
				<h3 class="mb-2 text-2xl text-base-content">Recommended Skills</h3>
				<div
					class="h-full w-full overflow-auto rounded-2xl border-25 border-solid border-neutral shadow"
				>
					<Highlight language={json} code={generatedSkills} />
				</div>
			</div>
		</div>
		<div class="flex grow flex-col">
			<p class="text-base text-base-content/50">
				{userQuery}
			</p>
		</div>
		<button
			class="btn my-2.5 btn-gradient btn-neutral"
			on:click={() => {
				resetInternalData();
			}}
		>
			<span class="icon-[arcticons--improvementroll] size-4.5 shrink-0"></span> New Query ?
		</button>
	{/if}
	{#if currentStep === 'error'}
		<div class="alert max-w-fit alert-error" role="alert">
			Oops! It seems there was an unexpected error. Please reload the page and try again.
		</div>
	{/if}
	{#if currentStep === 'initial'}
		{#if isModelLoading}
			<h3 class="mb-1 text-2xl text-base-content">Loading model</h3>
			<div
				class="radial-progress border-4 border-transparent bg-neutral/10 text-neutral"
				style="--value:{loadingPercent};"
				role="progressbar"
				aria-label="Neutral Radial Progressbar"
			>
				{loadingPercent}%
			</div>
			<h5 class="text-lg font-semibold text-base-content">{loadingProgressText}</h5>
		{:else}
			<h2 class="mb-4 flex items-center align-middle text-3xl text-base-content">
				What are we looking for today?
			</h2>
			<div class="textarea flex min-h-[10%] max-w-lg items-center">
				{#if !isRecording}
					<textarea
						class="h-full grow"
						placeholder="Describe your ideal customer..."
						bind:value={userQuery}
					></textarea>
				{:else}
					<div class="flex grow flex-col">
						<p class="text-base text-base-content/50">
							{userQuery}
						</p>
					</div>
				{/if}
				{#if !isMissingSpeechRecognition}
					{#if isRecording}
						<button
							class="btn mt-2 ml-4 size-16 shrink-0 btn-gradient align-middle btn-accent"
							aria-label="Stop recording"
							on:click={toggleVoiceRecognition}
						>
							<span class="icon-[icomoon-free--stop] size-4.5 shrink-0"></span>
						</button>
					{:else}
						<button
							class="btn mx-4 mt-2 size-16 shrink-0 btn-gradient align-middle btn-accent"
							aria-label="Start recording"
							on:click={toggleVoiceRecognition}
						>
							<span class="icon-[tabler--microphone-filled] size-4.5 shrink-0"></span>
						</button>
					{/if}
				{/if}
			</div>
			<div class="mt-4 flex w-auto items-center justify-center gap-1 align-middle">
				<button
					class="btn btn-gradient btn-primary"
					on:click={() => {
						runWorker();
					}}
				>
					<span class="icon-[oui--generate] size-4.5 shrink-0"></span> Transform query into filters
				</button>
			</div>
		{/if}
	{/if}
</div>
