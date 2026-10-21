"use client";

import { useEffect, useState } from "react";

/**
 * Query string for client components on `force-static` pages.
 * Next's useSearchParams() returns empty values there (the HTML is built once, without a query),
 * so shared links like /people?Role=Partner would never apply. This starts empty — matching the
 * static HTML, so hydration is clean — and switches to the real URL right after mount.
 */
export const useUrlSearchParams = () => {
  const [params, setParams] = useState(() => new URLSearchParams());

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
  }, []);

  return params;
};
