import { toast } from "sonner";

export function showTrafficToast() {
	toast(
		<div>
			We're experiencing high traffic. Please try again in a few moments.
		</div>,
		{
			duration: 5000,
		}
	);
}
