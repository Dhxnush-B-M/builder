import type { InferRouterInputs, InferRouterOutputs, RouterClient } from "@orpc/server";
import type router from "@rbuilder/api/routers";
import { createORPCClient, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
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
		fetch: async (request, init) => {
			try {
				const response = await fetch(request, { ...init, credentials: "include" });
				if (response.status === 405) {
					return new Response(JSON.stringify({ data: null }), {
						status: 200,
						headers: { "Content-Type": "application/json" },
					});
				}
				return response;
			} catch (err) {
				return new Response(JSON.stringify({ data: null }), {
					status: 200,
					headers: { "Content-Type": "application/json" },
				});
			}
		},
		interceptors: [
			onError((error) => {
				if (error instanceof DOMException && error.name === "AbortError") return;
			}),
		],
	}),
);

export const streamClient: RouterClient<typeof router> = createORPCClient(
	new RPCLink({
		url: getRpcUrl(),
		fetch: async (request, init) => {
			try {
				const response = await fetch(request, { ...init, credentials: "include" });
				if (response.status === 405) {
					return new Response(JSON.stringify({ data: null }), {
						status: 200,
						headers: { "Content-Type": "application/json" },
					});
				}
				return response;
			} catch (err) {
				return new Response(JSON.stringify({ data: null }), {
					status: 200,
					headers: { "Content-Type": "application/json" },
				});
			}
		},
		interceptors: [
			onError((error) => {
				if (error instanceof DOMException && error.name === "AbortError") return;
			}),
		],
	}),
);

export const orpc = createTanstackQueryUtils(client);

export type RouterInput = InferRouterInputs<typeof router>;

export type RouterOutput = InferRouterOutputs<typeof router>;
