import { useEffect, useRef } from 'react';

export default function InfiniteScroll({ getMore }) {
  const containerRef = useRef();

  useEffect(() => {
    const options = {
      root: document.querySelector('#CardContainer'),
      rootMargin: '0px',
      threshold: 1.0
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        getMore();
      }
    }, options);

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    }
  }, [])

  return <div ref={containerRef}/>;
}