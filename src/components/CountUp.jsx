/**
 * components/home/CountUp.jsx
 * Number ko 0 se target value tak animate karta hai, jab target value change ho to bhi naye number tak animate karega
 */
import React, { useEffect, useRef, useState } from 'react';

export default function CountUp({ end, duration = 1800, suffix = '', prefix = '', decimals = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasStarted = useRef(false);
  const prevEnd = useRef(0);

  useEffect(() => {
    const runAnimation = () => {
      const startValue = prevEnd.current;
      const startTime = performance.now();

      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = startValue + (end - startValue) * eased;
        setCount(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(end);
          prevEnd.current = end;
        }
      };

      requestAnimationFrame(animate);
    };

    if (!hasStarted.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            hasStarted.current = true;
            runAnimation();
            observer.disconnect();
          }
        },
        { threshold: 1 }
      );
      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    } else {
      // already visible once — any future change in `end` animates smoothly from old value
      runAnimation();
    }
  }, [end, duration]);

  const displayValue = decimals > 0 ? count.toFixed(decimals) : Math.round(count);

  return (
    <span ref={ref}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}