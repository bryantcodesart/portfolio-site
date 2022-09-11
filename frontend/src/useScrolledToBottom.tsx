import { useEffect, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';

const isScrolledToBottom = (container: HTMLElement) => Math.abs(
  (container.scrollHeight - container.scrollTop) - container.clientHeight,
) < 1;
export const useScrolledToBottom = () => {
  const scrollRef = useRef<HTMLDivElement>(null!);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  useEffect(() => {
    if (!scrollRef.current) { return; }
    setScrolledToBottom(isScrolledToBottom(scrollRef.current));
  }, []);
  useEventListener('scroll', () => {
    if (!scrollRef.current) { return; }
    setScrolledToBottom(isScrolledToBottom(scrollRef.current));
  }, scrollRef);

  return { scrollRef, scrolledToBottom };
};
