import type { AIProvider } from "@reactive-resume/ai/types";
import { ORPCError } from "@orpc/client";

export type AiProviderResponse = {
	id: string;
	label: string;
	provider: AIProvider;
	model: string;
	baseURL: string;
	apiKey: string;
	enabled: boolean;
	testStatus: string;
	testError: string | null;
	apiKeyPreview: string;
	apiKeyFingerprint: string;
	lastTestedAt: Date | null;
	lastUsedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
};

export const aiProvidersService = {
	list: async (_input?: { userId: string }): Promise<AiProviderResponse[]> => [],
	getRunnableById: async (_input: { id: string; userId: string }): Promise<AiProviderResponse> => {
		throw new ORPCError("NOT_FOUND", { message: "AI provider not configured." });
	},
	getDefaultRunnable: async (_input: { userId: string }): Promise<AiProviderResponse | null> => {
		return null;
	},
	markUsed: async (_input: { id: string; userId: string }) => {},
};
