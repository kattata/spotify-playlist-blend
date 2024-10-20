export function useBreakpoints() {
  function isMobile() {
    if (import.meta.server) {
      return;
    }

    const viewportWidth = window?.innerWidth;

    return (viewportWidth && viewportWidth < 900) || false;
  }

  return {
    isMobile
  };
}
