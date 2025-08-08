import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Circle,
	Settings,
	ChevronUp,
	ChevronDown,
	Eye,
	EyeOff,
	Info,
	RotateCcw,
	Loader2,
} from "lucide-react";
import { INIT_PROVODERS } from "@/lib/llm";
import { Provider } from "@/types";
import {
	proxyFetchPost,
	proxyFetchGet,
	proxyFetchPut,
	fetchPost,
} from "@/api/http";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from "@/components/ui/dialog";

export default function SettingModels() {
	const { modelType, cloud_model_type, setModelType, setCloudModelType } =
		useAuthStore();
	const navigate = useNavigate();
	const [items, setItems] = useState<Provider[]>(
		INIT_PROVODERS.filter((p) => p.id !== "local")
	);
	const [form, setForm] = useState(() =>
		INIT_PROVODERS.filter((p) => p.id !== "local").map((p) => ({
			apiKey: p.apiKey,
			apiHost: p.apiHost,
			is_valid: p.is_valid ?? false,
			model_type: p.model_type ?? "",
			externalConfig: p.externalConfig
				? p.externalConfig.map((ec) => ({ ...ec }))
				: undefined,
			provider_id: p.provider_id ?? undefined,
			prefer: p.prefer ?? false,
		}))
	);
	const [showApiKey, setShowApiKey] = useState(() =>
		INIT_PROVODERS.filter((p) => p.id !== "local").map(() => false)
	);
	const [loading, setLoading] = useState<number | null>(null);
	const [errors, setErrors] = useState<
		{ apiKey?: string; apiHost?: string; model_type?: string }[]
	>(() =>
		INIT_PROVODERS.filter((p) => p.id !== "local").map(() => ({
			apiKey: "",
			apiHost: "",
		}))
	);
	const [collapsed, setCollapsed] = useState(false);

	// Cloud Model
	const [cloudPrefer, setCloudPrefer] = useState(false);

	// Local Model independent state
	const [localEnabled, setLocalEnabled] = useState(true);
	const [localPlatform, setLocalPlatform] = useState("ollama");
	const [localEndpoint, setLocalEndpoint] = useState("");
	const [localType, setLocalType] = useState("");
	const [localVerifying, setLocalVerifying] = useState(false);
	const [localError, setLocalError] = useState<string | null>(null);
	const [localInputError, setLocalInputError] = useState(false);
	const [localPrefer, setLocalPrefer] = useState(false); // Local model prefer state
	const [dialogVisible, setDialogVisible] = useState<boolean>(false);
	const [localProviderId, setLocalProviderId] = useState<number | undefined>(
		undefined
	); // Local model provider_id

	// Load provider list and populate form
	useEffect(() => {
		(async () => {
			try {
				const res = await proxyFetchGet("/api/providers");
				const providerList = Array.isArray(res) ? res : res.items || [];
				// Handle custom models
				setForm((f) =>
					f.map((fi, idx) => {
						const item = items[idx];
						const found = providerList.find(
							(p: any) => p.provider_name === item.id
						);
						if (found) {
							return {
								...fi,
								provider_id: found.id,
								apiKey: found.api_key || "",
								apiHost: found.endpoint_url || "",
								is_valid: !!found?.is_valid,
								prefer: found.prefer ?? false,
								model_type: found.model_type ?? "",
								externalConfig: fi.externalConfig
									? fi.externalConfig.map((ec) => {
											if (
												found.encrypted_config &&
												found.encrypted_config[ec.key] !== undefined
											) {
												return { ...ec, value: found.encrypted_config[ec.key] };
											}
											return ec;
									  })
									: undefined,
							};
						}
						return fi;
					})
				);
				// Handle local model
				const local = providerList.find(
					(p: any) => p.provider_name === "Local Model"
				);
				console.log(123123, local);
				if (local) {
					setLocalEndpoint(local.endpoint_url || "");
					setLocalPlatform(local.encrypted_config?.model_platform || "ollama");
					setLocalType(local.encrypted_config?.model_type || "llama3.2");
					setLocalEnabled(local.is_valid ?? true);
					setLocalPrefer(local.prefer ?? false);
					setLocalProviderId(local.id);
				}
				if (modelType === "cloud") {
					setCloudPrefer(true);
					setForm((f) => f.map((fi) => ({ ...fi, prefer: false })));
					setLocalPrefer(false);
				} else if (modelType === "local") {
					setLocalEnabled(true);
					setForm((f) => f.map((fi) => ({ ...fi, prefer: false })));
					setLocalPrefer(true);
					setCloudPrefer(false);
				} else {
					setLocalPrefer(false);
					setCloudPrefer(false);
				}
			} catch (e) {
				// ignore error
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
		if (import.meta.env.VITE_USE_LOCAL_PROXY !== "true") {
			fetchSubscription();
			updateCredits();
		}
	}, []);

	const handleVerify = async (idx: number) => {
		const { apiKey, apiHost, externalConfig, model_type, provider_id } =
			form[idx];
		let hasError = false;
		const newErrors = [...errors];
		if (items[idx].id !== "local") {
			if (!apiKey || apiKey.trim() === "") {
				newErrors[idx].apiKey = "API Key can not be empty!";
				hasError = true;
			} else {
				newErrors[idx].apiKey = "";
			}
		}
		if (!apiHost || apiHost.trim() === "") {
			newErrors[idx].apiHost = "API Host can not be empty!";
			hasError = true;
		} else {
			newErrors[idx].apiHost = "";
		}
		if (!model_type || model_type.trim() === "") {
			newErrors[idx].model_type = "Model Type can not be empty!";
			hasError = true;
		} else {
			newErrors[idx].model_type = "";
		}
		setErrors(newErrors);
		if (hasError) return;

		setLoading(idx);
		const item = items[idx];
		let external: any = {};
		if (form[idx]?.externalConfig) {
			form[idx]?.externalConfig.map((item) => {
				external[item.key] = item.value;
			});
		}

		console.log(form[idx]);
		try {
			const res = await fetchPost("/model/validate", {
				model_platform: item.id,
				model_type: form[idx].model_type,
				api_key: form[idx].apiKey,
				url: form[idx].apiHost,
				extra_params: external,
			});
			if (res.is_tool_calls && res.is_valid) {
				console.log("success");
				toast("validate success", {
					description: "Verify model supports function calling to use Eigent.",
					closeButton: true,
				});
			} else {
				console.log("failed", res.message);
				toast("validate failed", {
					description: (
						<div
							style={{
								maxHeight: "120px",
								overflowY: "auto",
							}}
						>
							<div>{res.message}</div>
							<div className="flex justify-end">
								<Button
									size="xs"
									variant="primary"
									onClick={() => {
										navigator.clipboard.writeText(res.message);
										toast.success("Copied to clipboard");
									}}
								>
									Copy
								</Button>
							</div>
						</div>
					),
					closeButton: true,
				});

				return;
			}
			console.log(res);
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(null);
		}

		const data: any = {
			provider_name: item.id,
			api_key: form[idx].apiKey,
			endpoint_url: form[idx].apiHost,
			is_valid: form[idx].is_valid,
			model_type: form[idx].model_type,
		};
		if (externalConfig) {
			data.encrypted_config = {};
			externalConfig.forEach((ec) => {
				data.encrypted_config[ec.key] = ec.value;
			});
		}
		try {
			if (provider_id) {
				await proxyFetchPut(`/api/provider/${provider_id}`, data);
			} else {
				await proxyFetchPost("/api/provider", data);
			}
			// add: refresh provider list after saving, update form and switch editable status
			const res = await proxyFetchGet("/api/providers");
			const providerList = Array.isArray(res) ? res : res.items || [];
			setForm((f) =>
				f.map((fi, i) => {
					const item = items[i];
					const found = providerList.find(
						(p: any) => p.provider_name === item.id
					);
					if (found) {
						return {
							...fi,
							provider_id: found.id,
							apiKey: found.api_key || "",
							apiHost: found.endpoint_url || "",
							is_valid: !!found.is_valid,
							prefer: found.prefer ?? false,
							externalConfig: fi.externalConfig
								? fi.externalConfig.map((ec) => {
										if (
											found.encrypted_config &&
											found.encrypted_config[ec.key] !== undefined
										) {
											return { ...ec, value: found.encrypted_config[ec.key] };
										}
										return ec;
								  })
								: undefined,
						};
					}
					return fi;
				})
			);
			handleSwitch(idx, true);
		} finally {
			setLoading(null);
		}
	};

	// Local Model verification
	const handleLocalVerify = async () => {
		setLocalVerifying(true);
		setLocalError(null);
		setLocalInputError(false);
		if (!localEndpoint) {
			setLocalError("Endpoint URL can not be empty!");
			setLocalInputError(true);
			setLocalVerifying(false);
			return;
		}
		try {
			// // 1. Check if endpoint returns response
			// let baseUrl = localEndpoint;
			// let testUrl = baseUrl;
			// let testMethod = "GET";
			// let testBody = undefined;

			// // Extract base URL if it contains specific endpoints
			// if (baseUrl.includes('/chat/completions')) {
			// 	baseUrl = baseUrl.replace('/chat/completions', '');
			// } else if (baseUrl.includes('/completions')) {
			// 	baseUrl = baseUrl.replace('/completions', '');
			// }

			// // Always test with chat completions endpoint for OpenAI-compatible APIs
			// testUrl = `${baseUrl}/chat/completions`;
			// testMethod = "POST";
			// testBody = JSON.stringify({
			// 	model: localType || "test",
			// 	messages: [{ role: "user", content: "test" }],
			// 	max_tokens: 1,
			// 	stream: false
			// });

			// const resp = await fetch(testUrl, {
			// 	method: testMethod,
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 		"Authorization": "Bearer dummy"
			// 	},
			// 	body: testBody
			// });

			// if (!resp.ok) {
			// 	throw new Error("Endpoint is not responding");
			// }

			try {
				const res = await fetchPost("/model/validate", {
					model_platform: localPlatform,
					model_type: localType,
					api_key: "not-required",
					url: localEndpoint,
				});
				if (res.is_tool_calls && res.is_valid) {
					console.log("success");
					toast("validate success", {
						description:
							"Verify model supports function calling to use Eigent.",
						closeButton: true,
					});
				} else {
					console.log("failed", res.message);
					toast("validate failed", {
						description: (
							<div
								style={{
									maxHeight: "120px",
									overflowY: "auto",
								}}
							>
								<div>{res.message}</div>
								<div className="flex justify-end">
									<Button
										size="xs"
										variant="primary"
										onClick={() => {
											navigator.clipboard.writeText(res.message);
											toast.success("Copied to clipboard");
										}}
									>
										Copy
									</Button>
								</div>
							</div>
						),
						closeButton: true,
					});

					return;
				}
				console.log(res);
			} catch (e) {
				console.log(e);
			} finally {
				setLoading(null);
			}

			// 2. Save to /api/provider/ (save only base URL)
			const data: any = {
				provider_name: localPlatform,
				api_key: "not-required",
				endpoint_url: localEndpoint, // Save base URL without specific endpoints
				is_valid: true,
				model_type: localType,
				encrypted_config: {
					model_platform: localPlatform,
					model_type: localType,
				},
			};
			await proxyFetchPost("/api/provider", data);
			setLocalError(null);
			setLocalInputError(false);
			// add: refresh provider list after saving, update localProviderId and localPrefer
			const res = await proxyFetchGet("/api/providers");
			const providerList = Array.isArray(res) ? res : res.items || [];
			const local = providerList.find(
				(p: any) => p.provider_name === localPlatform
			);
			if (local) {
				handleLocalSwitch(true);

				setLocalProviderId(local.id);
				setLocalPrefer(local.prefer ?? false);
			}
		} catch (e: any) {
			setLocalError(
				e.message || "Verification failed, please check Endpoint URL"
			);
			setLocalInputError(true);
		} finally {
			setLocalVerifying(false);
		}
	};

	const [activeModelIdx, setActiveModelIdx] = useState<number | null>(null); // Current active model idx

	// Switch linkage logic: only one switch can be enabled
	useEffect(() => {
		if (activeModelIdx !== null) {
			setLocalEnabled(false);
		} else {
			setLocalEnabled(true);
		}
	}, [activeModelIdx]);
	useEffect(() => {
		if (localEnabled) {
			setActiveModelIdx(null);
		}
	}, [localEnabled]);

	const handleSwitch = async (idx: number, checked: boolean) => {
		if (!checked) {
			setActiveModelIdx(null);
			setLocalEnabled(true);
			return;
		}
		if (!(await checkHasSearchKey())) {
			setDialogVisible(true);
			return;
		}
		try {
			await proxyFetchPost("/api/provider/prefer", {
				provider_id: form[idx].provider_id,
			});
			setModelType("custom");
			setActiveModelIdx(idx);
			setLocalEnabled(false);
			setCloudPrefer(false);
			setForm((f) => f.map((fi, i) => ({ ...fi, prefer: i === idx }))); // Only one prefer allowed
			setLocalPrefer(false);
		} catch (e) {
			// Optional: add error message
		}
	};
	const handleLocalSwitch = async (checked: boolean) => {
		if (!checked) {
			setLocalEnabled(false);
			return;
		}
		if (!(await checkHasSearchKey())) {
			setDialogVisible(true);
			return;
		}
		try {
			if (localProviderId === undefined) return;
			await proxyFetchPost("/api/provider/prefer", {
				provider_id: localProviderId,
			});
			setModelType("local");
			setLocalEnabled(true);
			setActiveModelIdx(null);
			setForm((f) => f.map((fi) => ({ ...fi, prefer: false }))); // Set all others' prefer to false
			setLocalPrefer(true);
		} catch (e) {
			// Optional: add error message
		}
	};

	const checkHasSearchKey = async () => {
		const configsRes = await proxyFetchGet("/api/configs");
		const configs = Array.isArray(configsRes) ? configsRes : [];
		console.log(configsRes, configs);
		const _hasApiKey = configs.find(
			(item) => item.config_name === "GOOGLE_API_KEY"
		);
		const _hasApiId = configs.find(
			(item) => item.config_name === "SEARCH_ENGINE_ID"
		);
		return _hasApiKey && _hasApiId;
	};

	const [subscription, setSubscription] = useState<any>(null);
	const fetchSubscription = async () => {
		const res = await proxyFetchGet("/api/subscription");
		console.log(res);
		if (res) {
			setSubscription(res);
		}
	};
	const [credits, setCredits] = useState<any>(0);
	const [loadingCredits, setLoadingCredits] = useState(false);
	const updateCredits = async () => {
		try {
			setLoadingCredits(true);
			const res = await proxyFetchGet(`/api/user/current_credits`);
			console.log(res?.credits);
			setCredits(res?.credits);
		} catch (error) {
			console.error(error);
		} finally {
			setLoadingCredits(false);
		}
	};

	return (
		<div className="space-y-2">
			{import.meta.env.VITE_USE_LOCAL_PROXY !== "true" && (
				<div className="w-[630px] pt-4 self-stretch px-6 py-4 bg-surface-secondary rounded-2xl inline-flex flex-col justify-start items-start gap-4">
					<div className="self-stretch flex flex-col justify-start items-start gap-1">
						<div className="self-stretch h-6 inline-flex justify-start items-center gap-2.5">
							<div className="flex-1 justify-center text-text-body text-base font-bold leading-snug">
								Eigent Cloud Version
							</div>
							<Switch
								checked={cloudPrefer}
								onCheckedChange={(checked) => {
									if (checked) {
										setLocalPrefer(false);
										setActiveModelIdx(null);
										setForm((f) => f.map((fi) => ({ ...fi, prefer: false })));
										setCloudPrefer(true);
										setModelType("cloud");
									} else {
										setCloudPrefer(false);
										setModelType("custom");
									}
								}}
							/>
						</div>
						<div className="self-stretch justify-center">
							<span className="text-text-body text-xs font-normal font-['Inter'] leading-tight">
								You are currently subscribed to the{" "}
								{subscription?.plan_key?.charAt(0).toUpperCase() +
									subscription?.plan_key?.slice(1)}
								. Discover more about our{" "}
							</span>
							<span
								onClick={() => {
									window.location.href = `https://www.eigent.ai/pricing`;
								}}
								className="cursor-pointer text-text-body text-xs font-normal font-['Inter'] underline leading-tight"
							>
								pricing options
							</span>
							<span className="text-text-body text-xs font-normal font-['Inter'] leading-tight">
								.
							</span>
						</div>
					</div>
					<div className="flex flex-row items-center justify-start gap-2 mt-2 w-full">
						<Button
							onClick={() => {
								window.location.href = `https://www.eigent.ai/dashboard`;
							}}
							variant="primary"
							size="sm"
						>
							{loadingCredits ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								subscription?.plan_key?.charAt(0).toUpperCase() +
								subscription?.plan_key?.slice(1)
							)}
							<Settings />
						</Button>
						<div className="text-text-body text-sm font-normal font-['Inter'] leading-tight">
							Credits:{" "}
							{loadingCredits ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								credits
							)}
						</div>
					</div>
					<div className="w-full flex items-center flex-1 justify-between pt-4 border-t border-border-secondary">
						<div className="flex items-center flex-1 min-w-0">
							<span className="whitespace-nowrap overflow-hidden text-ellipsis text-xs font-medium leading-tight">
								Select Model Type
							</span>
							<Tooltip>
								<TooltipTrigger asChild>
									<span className="ml-1 cursor-pointer inline-flex items-center">
										<Info className="w-4 h-4 text-gray-400" />
									</span>
								</TooltipTrigger>
								<TooltipContent
									side="top"
									className="flex items-center justify-center text-center min-w-[220px] min-h-[40px]"
								>
									<span className="w-full flex items-center justify-center">
										{cloud_model_type === "gpt-4.1-mini"
											? "GPT-4.1 Mini: Lower cost, faster responses, but reduced output quality."
											: cloud_model_type === "gpt-4.1"
											? "GPT-4.1: Higher cost, slower responses, but superior quality and reasoning."
											: cloud_model_type === "claude-opus-4-1-20250805"
											? "Claude Opus 4.1: Higher cost, slower responses, but superior quality and reasoning."
											: cloud_model_type === "claude-sonnet-4-20250514"
											? "Claude Sonnet 4: Higher cost, slower responses, but superior quality and reasoning."
											: cloud_model_type === "claude-3-5-haiku-20241022"
											? "Claude 3.5 Haiku: Higher cost, slower responses, but superior quality and reasoning."
											: cloud_model_type === "gpt-5"
											? "GPT-5: Higher cost, slower responses, but superior quality and reasoning."
											: cloud_model_type === "gpt-5-mini"
											? "GPT-5 mini: Higher cost, slower responses, but superior quality and reasoning."
											: cloud_model_type === "gpt-5-nano"
											? "GPT-5 nano: Higher cost, slower responses, but superior quality and reasoning."
											: "Gemini 2.5 Pro: Higher cost, slower responses, but superior quality and reasoning."}
									</span>
								</TooltipContent>
							</Tooltip>
						</div>
						<div className="flex-shrink-0">
							<Select
								value={cloud_model_type}
								onValueChange={setCloudModelType}
							>
								<SelectTrigger className="h-7 min-w-[160px]  px-3 py-1 text-xs">
									<SelectValue placeholder="Select Model Type" />
								</SelectTrigger>
								<SelectContent className="bg-input-bg-default">
									<SelectItem value="gemini/gemini-2.5-pro">
										Gemini 2.5 Pro
									</SelectItem>
									<SelectItem value="gemini-2.5-flash">
										Gemini 2.5 Flash
									</SelectItem>
									<SelectItem value="gpt-4.1-mini">GPT-4.1 mini</SelectItem>
									<SelectItem value="gpt-4.1">GPT-4.1</SelectItem>
									<SelectItem value="gpt-5">GPT-5</SelectItem>
									<SelectItem value="gpt-5-mini">GPT-5 mini</SelectItem>
									<SelectItem value="gpt-5-nano">GPT-5 nano</SelectItem>
									<SelectItem value="claude-opus-4-1-20250805">
										Claude Opus 4.1
									</SelectItem>
									<SelectItem value="claude-sonnet-4-20250514">
										Claude Sonnet 4
									</SelectItem>
									<SelectItem value="claude-3-5-haiku-20241022">
										Claude 3.5 Haiku
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
			)}
			{/* customer models */}
			<div className="self-stretch pt-4 border-t border-border-disabled inline-flex flex-col justify-start items-start gap-4">
				<div className="self-stretch inline-flex justify-start items-center gap-2 relative px-6">
					<div className="justify-center text-text-body text-base font-bold leading-snug">
						Custom Model
					</div>
					<div className="justify-center text-text-body text-xs font-medium leading-none">
						Use your own API keys or set up a local model.
					</div>
					<div className="flex-1" />
					<Button
						variant="ghost"
						size="icon"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							setCollapsed((c) => !c);
						}}
					>
						{collapsed ? (
							<ChevronDown className="w-4 h-4" />
						) : (
							<ChevronUp className="w-4 h-4" />
						)}
					</Button>
				</div>
				{/*  model list */}
				<div
					className={`self-stretch inline-flex flex-col justify-start items-start gap-4 transition-all duration-300 ease-in-out overflow-hidden ${
						collapsed
							? "max-h-0 opacity-0 pointer-events-none"
							: "max-h-[3000px] opacity-100"
					}`}
					style={{
						transform: collapsed ? "translateY(-10px)" : "translateY(0)",
					}}
				>
					{items.map((item, idx) => {
						const canSwitch = !!form[idx].provider_id;
						return (
							<div
								key={item.id}
								className="w-[630px] px-6 py-4 bg-surface-secondary rounded-2xl gap-4"
							>
								<div className="h6 flex items-center justify-between">
									<div>
										<div className="text-base font-bold leading-12 text-text-primary">
											{item.name}
										</div>
										<div className="text-sm leading-13 py-1">
											{item.description}
										</div>
									</div>
									<Switch
										checked={form[idx].prefer}
										disabled={!canSwitch || loading === idx}
										onCheckedChange={(checked) => handleVerify(idx)}
									/>
								</div>
								<div className="flex w-full items-center gap-2">
									<div className="relative w-full">
										<div className="flex-1">
											<Input
												id={`apiKey-${item.id}`}
												type={showApiKey[idx] ? "text" : "password"}
												placeholder={`Enter your API ${item.name} Key`}
												className="w-full pr-10"
												value={form[idx].apiKey}
												onChange={(e) => {
													const v = e.target.value;
													setForm((f) =>
														f.map((fi, i) =>
															i === idx ? { ...fi, apiKey: v } : fi
														)
													);
													setErrors((errs) =>
														errs.map((er, i) =>
															i === idx ? { ...er, apiKey: "" } : er
														)
													);
												}}
											/>
											<span
												className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-black-100"
												onClick={() =>
													setShowApiKey((arr) =>
														arr.map((v, i) => (i === idx ? !v : v))
													)
												}
												tabIndex={-1}
											>
												{showApiKey[idx] ? (
													<Eye className="w-5 h-5" />
												) : (
													<EyeOff className="w-5 h-5" />
												)}
											</span>
										</div>
									</div>
								</div>
								{errors[idx]?.apiKey && (
									<div className="text-xs text-red-500 mt-1">
										{errors[idx].apiKey}
									</div>
								)}

								<div className="mt-md space-y-4">
									<div>
										<Input
											id={`apiHost-${item.id}`}
											placeholder={`Enter your ${item.name} URL`}
											className="w-full"
											value={form[idx].apiHost}
											onChange={(e) => {
												const v = e.target.value;
												setForm((f) =>
													f.map((fi, i) =>
														i === idx ? { ...fi, apiHost: v } : fi
													)
												);
												setErrors((errs) =>
													errs.map((er, i) =>
														i === idx ? { ...er, apiHost: "" } : er
													)
												);
											}}
										/>
										{errors[idx]?.apiHost && (
											<div className="text-xs text-red-500 mt-1">
												{errors[idx].apiHost}
											</div>
										)}
									</div>

									{/* model type */}
									<div>
										<Input
											id={`modelType-${item.id}`}
											placeholder={`Enter your ${item.name} Model Type`}
											className="w-full"
											value={form[idx].model_type}
											onChange={(e) => {
												const v = e.target.value;
												setForm((f) =>
													f.map((fi, i) =>
														i === idx ? { ...fi, model_type: v } : fi
													)
												);
												setErrors((errs) =>
													errs.map((er, i) =>
														i === idx ? { ...er, model_type: "" } : er
													)
												);
											}}
										/>
										{errors[idx]?.model_type && (
											<div className="text-xs text-red-500 mt-1">
												{errors[idx].model_type}
											</div>
										)}
									</div>
									{/* externalConfig render */}
									{item.externalConfig &&
										form[idx].externalConfig &&
										form[idx].externalConfig.map((ec, ecIdx) => (
											<div key={ec.key} className="mt-2">
												<label className="block text-xs font-medium mb-1">
													{ec.name}
												</label>
												{ec.options && ec.options.length > 0 ? (
													<Select
														value={ec.value}
														onValueChange={(v) => {
															setForm((f) =>
																f.map((fi, i) =>
																	i === idx
																		? {
																				...fi,
																				externalConfig: fi.externalConfig?.map(
																					(eec, i2) =>
																						i2 === ecIdx
																							? { ...eec, value: v }
																							: eec
																				),
																		  }
																		: fi
																)
															);
														}}
													>
														<SelectTrigger className="bg-white-100% w-full border border-gray-200 rounded px-3 py-2 text-sm">
															<SelectValue placeholder="please select" />
														</SelectTrigger>
														<SelectContent className="bg-white-100%">
															{ec.options.map((opt) => (
																<SelectItem key={opt.value} value={opt.value}>
																	{opt.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												) : (
													<Input
														className="w-full"
														value={ec.value}
														onChange={(e) => {
															const v = e.target.value;
															setForm((f) =>
																f.map((fi, i) =>
																	i === idx
																		? {
																				...fi,
																				externalConfig: fi.externalConfig?.map(
																					(eec, i2) =>
																						i2 === ecIdx
																							? { ...eec, value: v }
																							: eec
																				),
																		  }
																		: fi
																)
															);
														}}
													/>
												)}
											</div>
										))}
								</div>
								<div className="flex justify-end mt-2">
									<Button
										variant="secondary"
										size="sm"
										type="button"
										onClick={() => handleVerify(idx)}
										disabled={loading === idx}
									>
										<span className="text-text-inverse-primary">
											{loading === idx ? "..." : "Verify"}
										</span>
										<Circle className="text-text-inverse-primary"></Circle>
									</Button>
								</div>
							</div>
						);
					})}
				</div>
			</div>
			{/* Local Model */}
			<div className="w-[630px] mt-4 px-6 py-4 bg-surface-secondary rounded-2xl flex flex-col gap-4">
				<div className="flex items-center justify-between mb-2">
					<div className="font-bold text-base">Local Model</div>
					<Switch
						checked={localPrefer}
						disabled={!localEndpoint}
						onCheckedChange={(checked) => handleLocalSwitch(checked)}
					/>
				</div>
				<div className="flex flex-col gap-3">
					<div>
						<label className="block text-sm font-bold mb-1">
							Model Platform
						</label>
						<Select
							value={localPlatform}
							onValueChange={(v) => {
								console.log(v);
								setLocalPlatform(v);
							}}
							disabled={!localEnabled}
						>
							<SelectTrigger className="w-full border border-solid border-border-primary bg-input-bg-default rounded px-3 py-2 text-sm">
								<SelectValue placeholder="Select platform" />
							</SelectTrigger>
							<SelectContent className="bg-white-100%">
								<SelectItem value="ollama">Ollama</SelectItem>
								<SelectItem value="vllm">vLLM</SelectItem>
								<SelectItem value="sglang">Sglang</SelectItem>
								<SelectItem value="lmstudio">LMStudio</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div>
						<label
							className="block text-sm font-bold mb-1"
							style={{ color: localInputError ? "#ef4444" : undefined }}
						>
							Model Endpoint URL
						</label>
						<Input
							className={`bg-white-100% w-full${
								localInputError ? " border-red-500" : ""
							}`}
							value={localEndpoint}
							onChange={(e) => {
								setLocalEndpoint(e.target.value);
								setLocalInputError(false);
								setLocalError(null);
							}}
							disabled={!localEnabled}
							placeholder="http://localhost:11434/v1"
						/>
						{localError && (
							<div className="text-xs text-red-500 mt-1">{localError}</div>
						)}
					</div>
					<div className="gap-1.5">
						<label className="block text-sm font-bold mb-1 leading-tight">
							Model Type
						</label>
						<Input
							placeholder="Enter your local model type"
							className="w-full"
							value={localType}
							onChange={(e) => setLocalType(e.target.value)}
							disabled={!localEnabled}
						/>
						{/* <Select
							value={localType}
							onValueChange={(v) => setLocalType(v)}
							disabled={!localEnabled}
						>
							<SelectTrigger className="w-full border border-solid border-border-primary bg-input-bg-default rounded px-3 py-2 text-sm">
								<SelectValue placeholder="Select type" />
							</SelectTrigger>
							<SelectContent className="bg-white-100%">
								<SelectItem value="llama3.2">llama3.2</SelectItem>
								<SelectItem value="qwen3">qwen3</SelectItem>
								<SelectItem value="deepseek-r1">deepseek r1</SelectItem>
							</SelectContent>
						</Select> */}
					</div>
				</div>
				<div className="flex justify-end mt-2 ">
					<Button
						onClick={handleLocalVerify}
						disabled={!localEnabled || localVerifying}
						variant="secondary"
						size="sm"
					>
						<span className="text-text-inverse-primary">
							{localVerifying ? "Verifying..." : "Verify"}
						</span>
						<Circle />
					</Button>
				</div>
			</div>
			{/* error dialog */}
			<Dialog
				open={dialogVisible}
				onOpenChange={() => navigate("/setting/mcp")}
			>
				<DialogContent className="bg-white-100%">
					<DialogHeader>
						<DialogTitle>You are on Selft Host Mode</DialogTitle>
					</DialogHeader>
					<DialogDescription className="space-y-2">
						<p className="indent-6">
							You're using Self-hosted mode. To get the best performance from
							this product, please enter the Google Search Key in "MCP and
							Tools" to ensure Eigent works properly.
						</p>
						<p className="indent-6">
							The Google Search Key is essential for delivering accurate search
							results. Exa Search Key is optional but highly recommended for
							better performance.
						</p>
					</DialogDescription>
					<DialogFooter>
						<Button onClick={() => navigate("/setting/mcp")}>close</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
