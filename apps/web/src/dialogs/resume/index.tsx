import type { DialogProps } from "../store";
import { Trans } from "@lingui/react/macro";
import { PencilSimpleLineIcon, PlusIcon } from "@phosphor-icons/react";
import { useStore } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@rbuilder/ui/components/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@rbuilder/ui/components/dialog";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@rbuilder/ui/components/form";
import { Input } from "@rbuilder/ui/components/input";
import { generateId, generateRandomName, slugify } from "@rbuilder/utils/string";
import { usePatchResume } from "@/features/resume/builder/draft";
import { useFormBlocker } from "@/hooks/use-form-blocker";
import { saveLocalResume } from "@/libs/resume/local-storage";
import { useAppForm, withForm } from "@/libs/tanstack-form";
import { useDialogStore } from "../store";

const formSchema = z.object({
	id: z.string(),
	name: z.string().min(1).max(64),
	slug: z.string().min(1).max(64).transform(slugify),
	tags: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
	id: "",
	name: "",
	slug: "",
	tags: [],
};

export function CreateResumeDialog(_: DialogProps<"resume.create">) {
	const navigate = useNavigate();
	const closeDialog = useDialogStore((state) => state.closeDialog);
	// Skip the unsaved-changes guard when we close as a result of a successful create.
	const didCreateRef = useRef(false);

	const form = useAppForm({
		defaultValues: {
			id: generateId(),
			name: "",
			slug: "",
			tags: [] as string[],
		},
		validators: { onSubmit: formSchema },
		onSubmit: ({ value }) => {
			didCreateRef.current = true;
			const newId = value.id || generateId();
			const resumeName = value.name || "Untitled Resume";
			saveLocalResume({
				id: newId,
				name: resumeName,
				slug: value.slug || slugify(resumeName),
				tags: value.tags || [],
			});
			toast.success("Your resume has been created successfully.");
			closeDialog();
			void navigate({ to: "/builder/$resumeId", params: { resumeId: newId } });
		},
	});

	const name = useStore(form.store, (s) => s.values.name);

	useEffect(() => {
		form.setFieldValue("slug", slugify(name));
	}, [form, name]);

	useFormBlocker(form, {
		shouldBlock: () => !didCreateRef.current && form.state.isDirty && !form.state.isSubmitting,
	});

	const _onCreateSampleResume = () => {
		didCreateRef.current = true;
		const newId = generateId();
		saveLocalResume({
			id: newId,
			name: "Sample Resume",
			slug: "sample-resume",
			tags: [],
		});
		toast.success("Your resume has been created successfully.");
		closeDialog();
		void navigate({ to: "/builder/$resumeId", params: { resumeId: newId } });
	};

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle className="flex items-center gap-x-2">
					<PlusIcon />
					<Trans>Create a new resume</Trans>
				</DialogTitle>
				<DialogDescription>
					<Trans>Start building your resume by giving it a name.</Trans>
				</DialogDescription>
			</DialogHeader>

			<form
				className="space-y-4"
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					void form.handleSubmit();
				}}
			>
				<ResumeForm form={form} />

				<DialogFooter>
					<Button type="submit">
						<Trans>Create</Trans>
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}

export function UpdateResumeDialog({ data }: DialogProps<"resume.update">) {
	const closeDialog = useDialogStore((state) => state.closeDialog);
	const patchResume = usePatchResume();

	const form = useAppForm({
		defaultValues: {
			id: data.id,
			name: data.name,
			slug: data.slug,
			tags: data.tags,
		},
		validators: { onSubmit: formSchema },
		onSubmit: ({ value }) => {
			patchResume((draft) => {
				draft.name = value.name;
				draft.slug = value.slug;
				draft.tags = value.tags;
			});

			toast.success("Your resume has been updated successfully.");
			closeDialog();
		},
	});

	const name = useStore(form.store, (s) => s.values.name);

	useEffect(() => {
		if (!name) return;
		form.setFieldValue("slug", slugify(name));
	}, [form, name]);

	useFormBlocker(form);

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle className="flex items-center gap-x-2">
					<PencilSimpleLineIcon />
					<Trans>Update Resume</Trans>
				</DialogTitle>
				<DialogDescription>
					<Trans>Changed your mind? Rename your resume to something more descriptive.</Trans>
				</DialogDescription>
			</DialogHeader>

			<form
				className="space-y-4"
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					void form.handleSubmit();
				}}
			>
				<ResumeForm form={form} />

				<DialogFooter>
					<Button type="submit">
						<Trans>Save Changes</Trans>
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}

export function DuplicateResumeDialog({ data }: DialogProps<"resume.duplicate">) {
	const navigate = useNavigate();
	const closeDialog = useDialogStore((state) => state.closeDialog);

	const form = useAppForm({
		defaultValues: {
			id: data.id,
			name: `${data.name} (Copy)`,
			slug: `${data.slug}-copy`,
			tags: data.tags,
		},
		validators: { onSubmit: formSchema },
		onSubmit: ({ value }) => {
			toast.success("Your resume has been duplicated successfully.");
			closeDialog();

			if (!data.shouldRedirect) return;
			void navigate({ to: "/builder/$resumeId", params: { resumeId: generateId() } });
		},
	});

	const name = useStore(form.store, (s) => s.values.name);

	useEffect(() => {
		if (!name) return;
		form.setFieldValue("slug", slugify(name));
	}, [form, name]);

	useFormBlocker(form);

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle className="flex items-center gap-x-2">
					<PencilSimpleLineIcon />
					<Trans>Duplicate Resume</Trans>
				</DialogTitle>
				<DialogDescription>
					<Trans>Duplicate your resume to create a new one, just like the original.</Trans>
				</DialogDescription>
			</DialogHeader>

			<form
				className="space-y-4"
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					void form.handleSubmit();
				}}
			>
				<ResumeForm form={form} />

				<DialogFooter>
					<Button type="submit">
						<Trans>Duplicate</Trans>
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}

const ResumeForm = withForm({
	defaultValues,
	render: function ResumeFormRenderer({ form }) {
		const _slugPrefix = typeof window !== "undefined" ? `${window.location.origin}/` : "/";

		const _onGenerateName = () => {
			form.setFieldValue("name", generateRandomName());
		};

		return (
			<form.Field name="name">
				{(field) => (
					<FormItem hasError={field.state.meta.isTouched && field.state.meta.errors.length > 0}>
						<FormLabel>
							<Trans>Name</Trans>
						</FormLabel>
						<div className="flex items-center gap-x-2">
							<FormControl
								render={
									<Input
										min={1}
										max={64}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(event) => field.handleChange(event.target.value)}
									/>
								}
							/>
						</div>
						<FormMessage errors={field.state.meta.errors} />
						<FormDescription>
							<Trans>Tip: You can name the resume referring to the position you are applying for.</Trans>
						</FormDescription>
					</FormItem>
				)}
			</form.Field>
		);
	},
});
