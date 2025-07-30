import { toast } from "sonner";

export function showTrafficToast() {
	toast.dismiss();
	
	toast(
		<div>
			We're experiencing high traffic. Please try again in a few moments.
		</div>,
		{
			duration: 5000,
			action: {
				label: "Undo",
				onClick: () => {
					// 这里可以添加撤销逻辑
					console.log("Undo clicked");
					toast.dismiss();
				},
			},
		}
	);
}
