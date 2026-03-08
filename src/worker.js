import html502 from "../dist/src/pages/502/index.html";
import html1033 from "../dist/src/pages/1033/index.html";

export default {
  async fetch(request, env, ctx) {
    try {
      const response = await fetch(request);

      if (response.status === 502) {
        return new Response(html502, {
          status: 502,
          headers: { "Content-Type": "text/html;charset=UTF-8" }
        });
      }

      if (response.status === 530) {
        const body = await response.text();
        const isTunnelError =
          body.includes("1033") ||
          body.includes("tunnel") ||
          body.includes("Tunnel");

        if (isTunnelError) {
          return new Response(html1033, {
            status: 503,
            headers: { "Content-Type": "text/html;charset=UTF-8" }
          });
        }

        return new Response(body, {
          status: 530,
          headers: response.headers
        });
      }

      return response;

    } catch (error) {
      console.error("Błąd połączenia z serwerem origin:", error);
      return response;
    }
  }
};
