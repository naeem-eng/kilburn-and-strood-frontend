import React from 'react';

export type ValidateOptions = {
  allowDOM?: boolean; // allow native DOM elements (div, span) as children
  allowAnonymous?: boolean; // allow components with no name/displayName
  throwOnInvalid?: boolean; // throw an Error when invalid child found
  devOnly?: boolean; // only run in non-production
  componentName?: string; // optional name used in error messages
};

/**
 * Validate that React children are only from a set of allowed component displayNames.
 * Throws (or returns false) when an invalid child is found.
 */
export function validateChildren(
  children: React.ReactNode,
  allowedDisplayNames: string[],
  options: ValidateOptions = {}
): boolean {
  const {
    allowDOM = true,
    allowAnonymous = true,
    throwOnInvalid = true,
    devOnly = true,
    componentName = 'Component',
  } = options;

  if (devOnly && process.env.NODE_ENV === 'production') return true;

  const allowed = new Set(allowedDisplayNames.filter(Boolean));
  const arr = React.Children.toArray(children);

  for (const c of arr) {
    if (!React.isValidElement(c)) continue;
    const t: any = (c.type as any);

    // native DOM elements have string types like 'div'
    if (typeof t === 'string') {
      if (allowDOM) continue;
      const msg = `${componentName}: native DOM element <${t}> is not allowed as a child. Use allowed subcomponents instead.`;
      if (throwOnInvalid) throw new Error(msg);
      return false;
    }

    const name = t.displayName || t.name || null;
    if (!name) {
      if (allowAnonymous) continue;
      const msg = `${componentName}: anonymous component provided as child. Only specific subcomponents are allowed.`;
      if (throwOnInvalid) throw new Error(msg);
      return false;
    }

    if (!allowed.has(name)) {
      const msg = `${componentName}: invalid child component "${name}". Allowed: ${Array.from(allowed).join(', ')}`;
      if (throwOnInvalid) throw new Error(msg);
      return false;
    }
  }

  return true;
}

export function useValidateChildren(
  children: React.ReactNode,
  allowedDisplayNames: string[],
  options: ValidateOptions = {}
) {
  React.useEffect(() => {
    try {
      validateChildren(children, allowedDisplayNames, options);
    } catch (err) {
      // rethrow so developers see it in console (or let options.handle it later)
      throw err;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);
}
