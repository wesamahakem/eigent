import type { ProgressInfo } from "electron-updater";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import {Progress} from "@/components/ui/progress";

const Update = () => {

  const checkUpdate = async () => {
    const result = await window.ipcRenderer.invoke("check-update");
    if (result?.error) {
      toast.error("update check failed", {
        description: result.error.message,
      });
    }
  };

  const onUpdateCanAvailable = useCallback(
    (_event: Electron.IpcRendererEvent, info: VersionInfo) => {

      if (info.update) {
        toast("new version available", {
          description: `v${info.version} → v${info.newVersion}`,
          action: {
            label: "download",
            onClick: () => {
              window.ipcRenderer.invoke("start-download");
            },
          },
          duration: Infinity,
        });
      }
    },
    []
  );

  const onUpdateError = useCallback(
    (_event: Electron.IpcRendererEvent, err: ErrorType) => {
      toast.error("update error", {
        description: err.message,
      });
    },
    []
  );

  const onDownloadProgress = useCallback(
    (_event: Electron.IpcRendererEvent, progress: ProgressInfo) => {
      toast.custom((t) => (
        <div className="bg-white-100% shadow p-4 rounded w-[300px]">
          <div className="text-sm font-medium mb-2">downloading...</div>
          <Progress value={progress.percent ?? 0} />
        </div>
      ), {
        id: "download-progress",
        duration: Infinity,
      });
    },
    []
  )

  const onUpdateDownloaded = useCallback(
    (_event: Electron.IpcRendererEvent) => {
      toast.dismiss("download-progress");
      toast.success("download completed", {
        description: "click to install update",
        action: {
          label: "install",
          onClick: () => window.ipcRenderer.invoke("quit-and-install"),
        },
        duration: Infinity,
      });
    },
    []
  );

  useEffect(() => {
    if (sessionStorage.getItem("updateElectronShown")) {
      return;
    }
    sessionStorage.setItem("updateElectronShown", "1");

    window.ipcRenderer.on("update-can-available", onUpdateCanAvailable);
    window.ipcRenderer.on("update-error", onUpdateError);
    window.ipcRenderer.on("download-progress", onDownloadProgress);
    window.ipcRenderer.on("update-downloaded", onUpdateDownloaded);
    checkUpdate();

    return () => {
      window.ipcRenderer.off("update-can-available", onUpdateCanAvailable);
      window.ipcRenderer.off("update-error", onUpdateError);
      window.ipcRenderer.off("download-progress", onDownloadProgress);
      window.ipcRenderer.off("update-downloaded", onUpdateDownloaded);
    };
  }, []);

  return null; 
};

export default Update;
