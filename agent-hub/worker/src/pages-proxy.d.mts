interface PagesProxyContext {
  request: Request;
  env: {
    AGENT_HUB_WORKER_URL?: string;
    AGENT_HUB_DASHBOARD_PROXY_SECRET?: string;
  };
  params: { path?: string };
}

export function onRequest(context: PagesProxyContext): Promise<Response>;
