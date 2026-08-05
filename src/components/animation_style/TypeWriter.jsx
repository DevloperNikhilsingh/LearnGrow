import React, { useEffect, useRef, useState } from 'react';

const TypewriterHeading = ({
  lines,
  className,
  speed = 10,
  lineGap = 400,
  cursorColor = '#f59e0b',
}) => {
  const [displayLines, setDisplayLines] = useState(lines.map(() => ''));
  const [activeLine, setActiveLine] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const ref = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            runTypewriter();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runTypewriter = async () => {
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      setActiveLine(lineIndex);
      const text = lines[lineIndex];
      for (let charIndex = 0; charIndex <= text.length; charIndex++) {
        await new Promise((resolve) => setTimeout(resolve, speed));
        setDisplayLines((prev) => {
          const next = [...prev];
          next[lineIndex] = text.slice(0, charIndex);
          return next;
        });
      }
      if (lineIndex < lines.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, lineGap));
      }
    }
    setIsDone(true);
  };

  return (
    <h2 ref={ref} className={className}>
      {displayLines.map((line, i) => (
        <div key={i} style={{ minHeight: '1.2em' }}>
          {line}
          {!isDone && activeLine === i && (
            <span
              style={{
                display: 'inline-block',
                width: '3px',
                height: '0.9em',
                background: cursorColor,
                marginLeft: '4px',
                verticalAlign: 'middle',
                animation: 'twBlink 0.8s step-end infinite',
              }}
            />
          )}
        </div>
      ))}
      <style>{`
        @keyframes twBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </h2>
  );
};

export default TypewriterHeading;