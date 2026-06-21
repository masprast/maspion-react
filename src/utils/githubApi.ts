export const githubFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const response = await fetch(input, init);

  const limit = response.headers.get('x-ratelimit-limit');
  const remaining = response.headers.get('x-ratelimit-remaining');
  const used = response.headers.get('x-ratelimit-used');
  const reset = response.headers.get('x-ratelimit-reset');

  if (limit && remaining && used) {
    window.dispatchEvent(new CustomEvent('github-ratelimit', {
      detail: { limit, remaining, used, reset }
    }));
  }

  return response;
};