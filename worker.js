const BACKEND = 'https://n-project-9d67.onrender.com';

function shouldProxy(pathname) {
  return pathname === '/api' || pathname.startsWith('/api/') || pathname.startsWith('/uploads/');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (shouldProxy(url.pathname)) {
      const target = new URL(url.pathname + url.search, BACKEND);
      const headers = new Headers(request.headers);
      headers.set('host', new URL(BACKEND).host);
      // Ensure upstream CORS is not required; browser sees same-origin worker response.
      headers.delete('origin');

      const upstream = await fetch(
        new Request(target.toString(), {
          method: request.method,
          headers,
          body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
          redirect: 'manual',
        })
      );

      const responseHeaders = new Headers(upstream.headers);
      // Same-origin to the Workers host — drop upstream CORS noise.
      responseHeaders.delete('access-control-allow-origin');
      responseHeaders.delete('access-control-allow-credentials');
      responseHeaders.delete('access-control-allow-headers');
      responseHeaders.delete('access-control-allow-methods');

      return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: responseHeaders,
      });
    }

    return env.ASSETS.fetch(request);
  },
};
