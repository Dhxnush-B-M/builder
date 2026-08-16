import type { RouterOutput } from "@/libs/orpc/client";
import { t } from "@lingui/core/macro";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { orpc } from "@/libs/orpc/client";
import { deleteLocalResume } from "@/libs/resume/local-storage";

type Resume = RouterOutput["resume"]["list"][number];

export function useResumeMenuActions(resume: Resume) {
	const confirm = useConfirm();
	const router = useRouter();
	const queryClient = useQueryClient();
	const { mutate: deleteResume } = useMutation(orpc.resume.delete.mutationOptions());

	const handleDelete = async () => {
		const confirmed = await confirm(t`Are you sure you want to delete this resume?`, {
			description: t`This action cannot be undone.`,
		});
		if (!confirmed) return;

		const toastId = toast.loading(t`Deleting your resume...`);

		try {
			deleteLocalResume(resume.id);
			deleteResume(
				{ id: resume.id },
				{
					onSettled: () => {
						void queryClient.invalidateQueries();
						void router.invalidate();
					},
				},
			);
		} catch {
			// ignore backend RPC errors
		} finally {
			toast.success(t`Your resume has been deleted successfully.`, { id: toastId });
			void queryClient.invalidateQueries();
			void router.invalidate();
		}
	};

	return {
		handleDelete,
	};
}
