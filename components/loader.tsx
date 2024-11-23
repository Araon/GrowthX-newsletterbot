import { useState, useEffect } from "react";

const loadingMessages = [
  "Researching company details...",
  "Analyzing market trends...",
  "Crafting engaging content...",
  "Polishing the newsletter...",
  "Almost there...",
];

export function Loader() {
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prevMessage) => {
        const currentIndex = loadingMessages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => (prevProgress + 1) % 101);
    }, 50);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-2 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-center">
        <p className="text-sm text-primary animate-pulse">{currentMessage}</p>
      </div>
    </div>
  );
}
