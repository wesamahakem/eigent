import AppRoutes from "@/routers/index";
import React, { useEffect, useState } from "react";
import { stackClientApp } from "@/stack/client";
import { StackProvider, StackTheme } from "@stackframe/react";
import { useNavigate } from "react-router-dom";
import { AnimationJson } from "@/components/AnimationJson";
import animationData from "@/assets/animation/openning_animaiton.json";
import { useAuthStore } from "./store/authStore";
import { Toaster } from "sonner";
import { hasStackKeys } from "./lib";

const HAS_STACK_KEYS = hasStackKeys();

function App() {
	const navigate = useNavigate();
	const { setInitState } = useAuthStore();
	const [animationFinished, setAnimationFinished] = useState(false);
	const { isFirstLaunch } = useAuthStore();

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

			if (data.type === "version-update") {
				// 处理版本更新逻辑
				console.log(
					`版本从 ${data.previousVersion} 更新到 ${data.currentVersion}`
				);
				console.log(`更新原因: ${data.reason}`);
				setInitState("carousel");
			}
		};

		window.ipcRenderer.on("auth-share-token-received", handleShareCode);
		window.electronAPI.onUpdateNotification(handleUpdateNotification);

		return () => {
			window.ipcRenderer.off("auth-share-token-received", handleShareCode);
			window.electronAPI.removeAllListeners("update-notification");
		};
	}, [navigate, setInitState]);

	// 渲染主要内容
	const renderMainContent = () => {
		if (isFirstLaunch && !animationFinished) {
			return (
				<AnimationJson
					onComplete={() => setAnimationFinished(true)}
					animationData={animationData}
				/>
			);
		}
		return <AppRoutes />;
	};

	// 渲染包装器
	const renderWrapper = (children: React.ReactNode) => {
		if (HAS_STACK_KEYS) {
			return (
				<StackProvider app={stackClientApp}>
					<StackTheme>{children}</StackTheme>
					<Toaster />
				</StackProvider>
			);
		}
		return (
			<>
				{children}
				<Toaster />
			</>
		);
	};

	return renderWrapper(renderMainContent());
}

export default App;
