"use client";
import { memo, useEffect, useRef } from "react";

const EmbedCode = ({ embedCode }: any) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!embedCode || !iframeRef.current) return;

    const html = `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>body { margin: 0; padding: 0; overflow: hidden; }</style>
        </head>
        <body>
          ${embedCode}
          <script>
            const observer = new ResizeObserver(() => {
              window.parent.postMessage({ height: document.body.scrollHeight }, '*');
            });
            observer.observe(document.body);
          <\/script>
        </body>
      </html>`;


    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;

    // Auto resize
    const handler = (e: MessageEvent) => {
      if (e.data?.height && iframeRef.current) {
        iframeRef.current.style.height = e.data.height + "px";
      }
    };
    window.addEventListener("message", handler);

    return () => {
      URL.revokeObjectURL(url); // cleanup memory
      window.removeEventListener("message", handler);
    };
  }, [embedCode]);

  return (
    <iframe
      ref={iframeRef}
      style={{ border: "none", width: "100%", height: "0px" }}
    />
  );
};

export default memo(EmbedCode);