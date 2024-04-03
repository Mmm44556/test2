import { useState, useEffect } from 'react';

// 定义断点
const breakpoints = {
  xsm: 480,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1440,
  xxl: 1600
};

// 自定义钩子
function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState(getBreakpoint());

  function getBreakpoint() {
    const width = window.innerWidth;
    const breakpointKeys = Object.keys(breakpoints);
    for (let i = 0; i < breakpointKeys.length; i++) {
      const key = breakpointKeys[i];
      if (width < breakpoints[key]) {
        return key;
      }
    }
    return breakpointKeys[breakpointKeys.length - 1]; // 默认为最后一个断点
  }

  useEffect(() => {
    function handleResize() {
      setBreakpoint(getBreakpoint());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

export default useBreakpoint;
