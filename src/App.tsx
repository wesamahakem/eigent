import AppRoutes from "@/routers/index";
import React, { useEffect, useState } from "react";
import { stackClientApp } from "@/stack/client";
import { StackProvider, StackTheme } from "@stackframe/react";
import { useNavigate } from "react-router-dom";
import { AnimationJson } from "@/components/AnimationJson";
import animationData from "@/assets/animation/openning_animaiton.json";
import { useAuthStore } from "./store/authStore";
import { Toaster } from "sonner";

function App() {

	const navigate = useNavigate();
	const { setInitState } = useAuthStore();
	
	useEffect(() => {
		const handleShareCode = (event: any, share_token: string) => {
			navigate({
				pathname: "/",
				search: `?share_token=${encodeURIComponent(share_token)}`,
			});
		};

		// 监听版本更新通知
		const handleUpdateNotification = (data: { 
			type: string; 
			currentVersion: string; 
			previousVersion: string; 
			reason: string; 
		}) => {
			console.log("收到版本更新通知:", data);
			
			if (data.type === 'version-update') {
				// 处理版本更新逻辑
				console.log(`版本从 ${data.previousVersion} 更新到 ${data.currentVersion}`);
				console.log(`更新原因: ${data.reason}`);
				setInitState("carousel");
			}
		};

		window.ipcRenderer.on("auth-share-token-received", handleShareCode);
		window.electronAPI.onUpdateNotification(handleUpdateNotification);

		return () => {
			window.ipcRenderer.off("auth-auth-share-token-received", handleShareCode);
			window.electronAPI.removeAllListeners("update-notification");
		};
	}, [navigate, setInitState]);

	const [animationFinished, setAnimationFinished] = useState(false);
	const { isFirstLaunch } = useAuthStore();

	return (
		<StackProvider app={stackClientApp}>
			<StackTheme>
				{isFirstLaunch && !animationFinished ? (
					<AnimationJson
						onComplete={() => setAnimationFinished(true)}
						animationData={animationData}
					/>
				) : (
					<AppRoutes />
				)}
			</StackTheme>
			<Toaster />
		</StackProvider>
	);
}

export default App;
