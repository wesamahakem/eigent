import { useEffect, useState } from "react";
import {
	ChevronsLeft,
	Search,
	FileText,
	CodeXml,
	ChevronLeft,
	Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { useChatStore } from "@/store/chatStore";
import { MarkDown } from "@/components/ChatBox/MarkDown";
import { useAuthStore } from "@/store/authStore";

export default function Folder({ data }: { data?: Agent }) {
	const chatStore = useChatStore();
	const authStore = useAuthStore();
	const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (chatStore?.tasks[chatStore.activeTaskId as string].selectedFile) {
			selecetdFileChange(
				chatStore.tasks[chatStore.activeTaskId as string]
					.selectedFile as FileInfo
			);
		}
	}, [chatStore.tasks[chatStore.activeTaskId as string].selectedFile]);
	const selecetdFileChange = (file: FileInfo, isShowSourceCode?: boolean) => {
		if (file.type === "zip") {
			window.ipcRenderer.invoke("reveal-in-folder", file.path);
			return;
		}
		setSelectedFile(file);
		setLoading(true);
		console.log("file", JSON.parse(JSON.stringify(file)));
		window.ipcRenderer
			.invoke("open-file", file.type, file.path, isShowSourceCode)
			.then((res) => {
				setSelectedFile({ ...file, content: res });
				setLoading(false);
			});
	};

	const [isShowSourceCode, setIsShowSourceCode] = useState(false);
	const isShowSourceCodeChange = () => {
		selecetdFileChange(selectedFile!, !isShowSourceCode);
		setIsShowSourceCode(!isShowSourceCode);
	};

	const [isCollapsed, setIsCollapsed] = useState(false);

	const [fileGroups, setFileGroups] = useState<
		{
			folder: string;
			files: FileInfo[];
		}[]
	>([
		{
			folder: "Reports",
			files: [],
		},
	]);
	useEffect(() => {
		window.ipcRenderer
			.invoke(
				"get-file-list",
				authStore.email,
				chatStore.activeTaskId as string
			)
			.then((res) => {
				console.log("res", res);
				setFileGroups((prev) => {
					return [
						{
							...prev[0],
							files: res || [],
						},
					];
				});
			});
	}, [data, chatStore.tasks[chatStore.activeTaskId as string]?.taskAssigning]);
	const handleBack = () => {
		chatStore.setActiveWorkSpace(chatStore.activeTaskId as string, "workflow");
	};

	return (
		<div className="h-full w-full flex overflow-hidden">
			{/* fileList */}
			<div
				className={`${
					isCollapsed ? "w-16" : "w-64"
				} border-[0px] border-r border-r-zinc-200 border-zinc-300 !border-solid flex flex-col transition-all duration-300 ease-in-out flex-shrink-0`}
			>
				{/* head */}
				<div
					className={` py-2 border-b border-zinc-200 flex-shrink-0 ${
						isCollapsed ? "px-2" : "pl-4 pr-2"
					}`}
				>
					<div className="flex items-center justify-between">
						{!isCollapsed && (
							<div className="flex items-center gap-2">
								<Button
									onClick={handleBack}
									size="sm"
									variant="ghost"
									className={`flex items-center gap-2`}
								>
									<ChevronLeft />
								</Button>
								<span className="text-xl font-bold text-primary whitespace-nowrap">
									Agent Folder
								</span>
							</div>
						)}
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsCollapsed(!isCollapsed)}
							className={`${
								isCollapsed ? "w-full" : ""
							} flex items-center justify-center`}
							title={isCollapsed ? "open" : "close"}
						>
							<ChevronsLeft
								className={`w-6 h-6 text-zinc-500 ${
									isCollapsed ? "rotate-180" : ""
								} transition-transform ease-in-out`}
							/>
						</Button>
					</div>
				</div>

				{/* Search Input*/}
				{!isCollapsed && (
					<div className="px-2 border-b border-zinc-200 flex-shrink-0">
						<div className="relative">
							<Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
							<input
								type="text"
								placeholder="Search"
								className="w-full pl-9 pr-2 py-2 text-sm border border-zinc-200 rounded-md border-solid focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>
				)}

				{/* fileList */}
				<div className="flex-1 overflow-y-auto min-h-0">
					{!isCollapsed ? (
						<div className="p-2">
							<Accordion
								type="single"
								collapsible
								defaultValue="folder-0"
								className="w-full"
							>
								{fileGroups.map((group, index) => (
									<AccordionItem
										key={group.folder}
										value={`folder-${index}`}
										className="border-none bg-transparent"
									>
										<AccordionTrigger className="mb-1 bg-transparent px-1 py-2 hover:no-underline hover:bg-white-50 rounded-md text-xs font-medium text-zinc-700">
											<div className="flex items-center gap-2 text-primary text-[10px] leading-4 font-bold">
												{group.folder}
											</div>
										</AccordionTrigger>
										<AccordionContent className="pb-0">
											<div className="space-y-2">
												{group.files?.map((file) => (
													<button
														key={file.name}
														onClick={() =>
															selecetdFileChange(file, isShowSourceCode)
														}
														className={`w-full flex items-center gap-2 p-2 text-sm rounded-md bg-transparent text-primary hover:bg-white-50 transition-colors text-left ${
															selectedFile?.name === file.name && "bg-white-50%"
														}`}
													>
														{file.icon && (
															<file.icon className="w-5 h-5 flex-shrink-0 text-ellipsis overflow-hidden" />
														)}
														<span className="truncate text-[13px] font-medium leading-5 text-ellipsis overflow-hidden">
															{file.name}
														</span>
													</button>
												))}
											</div>
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</div>
					) : (
						// Display simplified file icons when collapsed
						<div className="p-2 space-y-2">
							{fileGroups.map((group) =>
								group.files.map((file) => (
									<button
										key={file.name}
										onClick={() => selecetdFileChange(file, isShowSourceCode)}
										className={`w-full flex items-center justify-center p-2 rounded-md hover:bg-zinc-100 transition-colors ${
											selectedFile?.name === file.name
												? "bg-blue-50 text-blue-700"
												: "text-zinc-600"
										}`}
										title={file.name}
									>
										{file.icon && <file.icon className="w-4 h-4" />}
									</button>
								))
							)}
						</div>
					)}
				</div>
			</div>

			{/* content */}
			<div className="flex-1 flex flex-col min-w-0 overflow-hidden">
				{/* head */}
				{selectedFile && (
					<div className="p-4 border-b border-zinc-200 flex-shrink-0">
						<div className="flex items-center justify-between gap-2">
							<div
								onClick={() => {
									window.ipcRenderer.invoke(
										"reveal-in-folder",
										selectedFile.path
									);
								}}
								className="flex-1 min-w-0 overflow-hidden cursor-pointer flex items-center gap-2"
							>
								<span className="block text-[15px] leading-[22px] font-medium text-primary overflow-hidden text-ellipsis whitespace-nowrap">
									{selectedFile.name}
								</span>
								<Button size="icon" variant="ghost">
									<Download className="w-4 h-4 text-zinc-500" />
								</Button>
							</div>
							<Button
								variant="ghost"
								size="icon"
								className=" flex-shrink-0"
								onClick={() => isShowSourceCodeChange()}
							>
								<CodeXml className="w-4 h-4 text-zinc-500" />
							</Button>
						</div>
					</div>
				)}

				{/* content */}
				<div className="flex-1 overflow-y-auto min-h-0">
					<div className="p-6 h-full">
						{selectedFile ? (
							!loading ? (
								selectedFile.type === "md" && !isShowSourceCode ? (
									<div className="prose prose-sm max-w-none">
										<MarkDown
											content={selectedFile.content || ""}
											enableTypewriter={false}
										/>
									</div>
								) : selectedFile.type === "pdf" ? (
									<iframe
										src={
											"localfile://" +
											encodeURIComponent(selectedFile.content as string)
										}
										className="w-full h-full border-0"
										title={selectedFile.name}
									/>
								) : ["csv", "doc", "docx", "pptx"].includes(
										selectedFile.type
								  ) ? (
									<div
										className="w-full overflow-auto"
										dangerouslySetInnerHTML={{
											__html: selectedFile.content || "",
										}}
									/>
								) : selectedFile.type === "html" ? (
									isShowSourceCode ? (
										<>{selectedFile.content}</>
									) : (
										<iframe
											src={
												"localfile://" +
												encodeURIComponent(selectedFile.content as string)
											}
											className="w-full h-full border-0"
											title={selectedFile.name}
										/>
									)
								) : selectedFile.type === "zip" ? (
									<div className="flex items-center justify-center h-full text-zinc-500">
										<div className="text-center">
											<FileText className="w-12 h-12 mx-auto mb-4 text-zinc-300" />
											<p className="text-sm">Zip file is not supported yet.</p>
										</div>
									</div>
								) : [
										"png",
										"jpg",
										"jpeg",
										"gif",
										"bmp",
										"webp",
										"svg",
								  ].includes(selectedFile.type.toLowerCase()) ? (
									<div className="flex items-center justify-center h-full">
										<img
											src={`localfile://${encodeURIComponent(
												selectedFile.path
											)}`}
											alt={selectedFile.name}
											className="max-w-full max-h-full object-contain"
										/>
									</div>
								) : (
									<pre className="text-sm text-zinc-700 font-mono whitespace-pre-wrap break-words overflow-x-auto">
										{selectedFile.content}
									</pre>
								)
							) : (
								<div className="flex items-center justify-center h-full">
									<div className="text-center">
										<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
										<p className="text-sm text-zinc-500">Loading...</p>
									</div>
								</div>
							)
						) : (
							<div className="flex items-center justify-center h-full text-zinc-500">
								<div className="text-center">
									<FileText className="w-12 h-12 mx-auto mb-4 text-zinc-300" />
									<p className="text-sm">Select a file to view its contents</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
