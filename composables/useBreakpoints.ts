export function useBreakpoints() {
  function isMobile() {
    if (process.server) {
      return;
    }

    const viewportWidth = window?.innerWidth;

    return (viewportWidth && viewportWidth < 900) || false;
  }

  return {
    isMobile
  };
}
