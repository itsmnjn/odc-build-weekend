import classNames from 'classnames';
import Image from 'next/image';
import { useState } from 'react';

export default function FaqItem({
  question,
  answer,
  className,
}: {
  question: string;
  answer: string;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={classNames(
        'py-4 transition duration-300 border-t border-gray-200 cursor-pointer',
        className
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className='flex flex-row items-center'>
        <p className='text-lg font-semibold'>{question}</p>
        <button
          className={classNames('ml-auto text-3xl select-none', {
            '-translate-x-1': expanded,
          })}
        >
          {expanded ? '–' : '+'}
        </button>
      </div>

      {expanded && <p className='text-base leading-relaxed'>{answer}</p>}
    </div>
  );
}
