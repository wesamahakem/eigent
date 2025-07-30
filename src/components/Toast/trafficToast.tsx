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
					console.log("Undo clicked");
					toast.dismiss();
				},
			},
		}
	);
}
