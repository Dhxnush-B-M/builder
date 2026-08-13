import type { InferRouterInputs, InferRouterOutputs, RouterClient } from "@orpc/server";
import type router from "@rbuilder/api/routers";
import { createORPCClient, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { BatchLinkPlugin } from "@orpc/client/plugins";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

const getRpcUrl = () => {
	let apiUrl = import.meta.env.VITE_API_URL || "https://builder-3.onrender.com";
	if (typeof window !== "undefined" && window.location.hostname !== "localhost" && apiUrl.includes("localhost")) {
		apiUrl = "https://builder-3.onrender.com";
	}
	return `${apiUrl.replace(/\/$/, "")}/api/rpc`;
};

export const client: RouterClient<typeof router> = createORPCClient(
	new RPCLink({
		url: getRpcUrl(),
		fetch: (request, init) => fetch(request, { ...init, credentials: "include" }),
		interceptors: [
			onError((error) => {
				if (error instanceof DOMException && error.name === "AbortError") return;
				console.warn("[oRPC client]", error);
			}),
		],
	}),
);

export const streamClient: RouterClient<typeof router> = createORPCClient(
	new RPCLink({
		url: getRpcUrl(),
		fetch: (request, init) => fetch(request, { ...init, credentials: "include" }),
		interceptors: [
			onError((error) => {
				if (error instanceof DOMException && error.name === "AbortError") return;
				console.warn("[oRPC stream client]", error);
			}),
		],
	}),
);

export const orpc = createTanstackQueryUtils(client);

export type RouterInput = InferRouterInputs<typeof router>;

export type RouterOutput = InferRouterOutputs<typeof router>;
