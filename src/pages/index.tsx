import classNames from 'classnames';
import JSConfetti from 'js-confetti';
import Image from 'next/image';
import numeral from 'numeral';
import { useEffect, useMemo, useRef, useState } from 'react';

import FaqItem from '@/components/FaqItem';

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={classNames('animate-spin', className)}
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
    >
      <circle
        className='opacity-25'
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='4'
      ></circle>
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      ></path>
    </svg>
  );
}

export default function HomePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('');

  const [viewCount, setViewCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { width } = useWindowSize();

  const jsConfetti = useMemo(
    () => (typeof window === 'undefined' ? null : new JSConfetti()),
    []
  );

  const reset = () => {
    setViewCount(0);
    setUrl('');
    inputRef.current?.focus();
  };

  const onButtonClick = async () => {
    setError(null);

    if (url.length === 0) {
      inputRef.current?.focus();
      return;
    }

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 750));

    const apiUrl = 'https://www.googleapis.com/youtube/v3/videos';
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const part = 'statistics';
    const videoId = parseVideoId(url);

    const requestUrl = `${apiUrl}?key=${apiKey}&part=${part}&id=${videoId}`;
    const response = await fetch(requestUrl).then((res) => res.json());
    const viewCount = getVideoViewCount(response);

    if (!viewCount) {
      setError('Please enter a valid YouTube URL');
      setLoading(false);
      return;
    }

    const emoji = getEmojiFromPrice((viewCount / 1000) * 60);

    emoji === '/happy.png' ||
      (emoji === '/love.png' &&
        jsConfetti &&
        jsConfetti.addConfetti({ emojis: ['💵', '🤑', '💸'] }));
    setViewCount(viewCount);
    setLoading(false);
  };

  return (
    <div className='relative'>
      <main className='flex flex-col p-3 pt-12'>
        <section className='flex flex-col max-w-lg mx-auto mb-16'>
          <h1 className='mb-12 text-4xl font-bold text-center md:px-20'>
            How Much Do YouTubers Get Paid? 💰
          </h1>

          <div className='relative mb-3'>
            <input
              ref={inputRef}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onButtonClick();
                  inputRef.current?.blur();
                }
              }}
              className='w-full h-16 py-1 pl-5 pr-4 text-lg font-medium transition bg-white border border-gray-200 shadow-xl outline-none focus:border-2 placeholder-odc-text-gray rounded-xl focus:border-purple-500'
              placeholder='Enter link to YouTube video'
            />
            <div className='absolute flex flex-row w-48 h-12 right-2 top-2'>
              <div className='flex-1 h-full bg-gradient-to-l from-white' />
              <button
                onClick={onButtonClick}
                className={classNames(
                  'flex items-center self-center font-medium h-full w-32 text-white transition rounded-xl active:scale-95',
                  {
                    'bg-odc-disabled-gray': url.length === 0,
                    'bg-odc-purple': url.length > 0,
                  }
                )}
              >
                {loading ? (
                  <Spinner className='w-5 h-5 mx-auto' />
                ) : (
                  <p className='mx-auto text-sm font-semibold leading-none'>
                    Calculate
                  </p>
                )}
              </button>
            </div>

            {error && (
              <div className='absolute inset-x-0 w-full pt-4 mb-3'>
                <p className='font-medium text-center text-red-500'>{error}</p>
              </div>
            )}
          </div>
        </section>

        <section className='flex flex-row gap-6 mx-auto mb-16'>
          <div className=' md:w-24 md:h-24'>
            <Image
              src='/sad.png'
              width={'100%'}
              height={'100%'}
              alt='Sad emoji'
            />
          </div>

          <div className=' md:w-24 md:h-24'>
            <Image
              src='/alright.png'
              width={'100%'}
              height={'100%'}
              alt='Shy emoji'
            />
          </div>

          <div className=' md:w-24 md:h-24'>
            <Image
              src='/smirk.png'
              width={'100%'}
              height={'100%'}
              alt='Smirking emoji'
            />
          </div>

          {width && width > 768 && (
            <>
              <div className='w-24 h-24'>
                <Image
                  src='/happy.png'
                  width={'100%'}
                  height={'100%'}
                  alt='Happy emoji'
                />
              </div>

              <div className='w-24 h-24'>
                <Image
                  src='/love.png'
                  width={'100%'}
                  height={'100%'}
                  alt='Heart-eyes emoji'
                />
              </div>
            </>
          )}
        </section>

        <section className='w-full max-w-xl mx-auto mb-16'>
          <h1 className='mb-8 text-4xl font-semibold text-center'>FAQs</h1>

          <FaqItem
            question='How do you calculate how much influencers make?'
            answer='We multiply the views the posts have with the platform typical prices / view. Marketers use the term “CPM” which basically means how much you get for 1,000 views. A CPM of $60 would for example mean you get paid $60 for every 1,000 views you make. So a video with 10,000 views would for example make $600. This formula heavily simplifies pricing, but it’s good for getting a rough feeling of what’s realistic.'
          />
          <FaqItem
            question='How accurate is your calculation?'
            answer='There are huge differences in how much influencers charge based on country, audience, engagement, etc. These factors can typically lead up to 2x higher or lower prices in reality! Our tool just helps you to get a rough feeling for what’s realistic.'
          />
          <FaqItem
            question='How are influencers priced in reality?'
            answer='Short answer: supply & demand. Advertisers (brands & agencies) typically want to price influencers based on performance factors like reach, engagement, and link clicks. Influencers & managers prefer stability and often use fixed prices. Who the price maker is depends on the power dynamics. Big influencers are price makers, small creators are price takers.'
          />
          <FaqItem
            question='Why did you create this tool if there’s no business model?'
            answer='This project was built for fun in less than 2 days as a part of the On Deck Catalyst 2 build weekend. We all have main businesses / projects where we appreciate your support!'
            className='border-b'
          />
        </section>

        <section className='w-full max-w-xl mx-auto mb-16'>
          <p className='px-24 text-lg font-medium text-center'>
            This is a fun project with no business model. If you like it, please
            share it with a friend and follow us on social media for more 😃
          </p>
        </section>

        <section className='flex flex-row w-full max-w-2xl mx-auto mb-8 border-t border-b border-gray-200'>
          <div className='flex flex-col items-center flex-1 p-10'>
            <div className='w-12 h-12 mb-2'>
              <Image
                src='/eric.jpeg'
                width='100%'
                height='100%'
                alt='Face'
                className='rounded-full'
              />
            </div>

            <h1 className='text-lg font-semibold text-center'>Eric Kim</h1>
            <p className='mb-4 text-sm font-normal text-center'>Engineer</p>

            <ul className='flex flex-row gap-2'>
              <a
                href='https://instagram.com/itsmnjn'
                target='_blank'
                rel='noreferrer'
              >
                <li className='w-5 h-5'>
                  <Image
                    src='/Instagram.svg'
                    width='100%'
                    height='100%'
                    alt='Social media icon'
                    className='cursor-pointer'
                  />
                </li>
              </a>
              <a
                href='https://twitter.com/itsmnjn'
                target='_blank'
                rel='noreferrer'
              >
                <li className='w-5 h-5'>
                  <Image
                    src='/Twitter.svg'
                    width='100%'
                    height='100%'
                    alt='Social media icon'
                    className='cursor-pointer'
                  />
                </li>
              </a>
              <a
                href='https://linkedin.com/in/mnjn'
                target='_blank'
                rel='noreferrer'
              >
                <li className='w-5 h-5'>
                  <Image
                    src='/Linkedin.svg'
                    width='100%'
                    height='100%'
                    alt='Social media icon'
                    className='cursor-pointer'
                  />
                </li>
              </a>
            </ul>
          </div>

          <div className='flex flex-col items-center flex-1 p-10'>
            <div className='object-cover w-12 h-12 mb-2 rounded-full'>
              <Image src='/daniel.png' width='100%' height='100%' alt='Face' />
            </div>

            <h1 className='text-lg font-semibold text-center'>Daniel Koss</h1>
            <p className='mb-4 text-sm text-center'>Product</p>

            <ul className='flex flex-row gap-2'>
              <a
                href='https://instagram.com/danielkoss_'
                target='_blank'
                rel='noreferrer'
              >
                <li className='w-5 h-5'>
                  <Image
                    src='/Instagram.svg'
                    width='100%'
                    height='100%'
                    alt='Social media icon'
                    className='cursor-pointer'
                  />
                </li>
              </a>
              <a
                href='https://instagram.com/danielkoss_'
                target='_blank'
                rel='noreferrer'
              >
                <li className='w-5 h-5'>
                  <Image
                    src='/Twitter.svg'
                    width='100%'
                    height='100%'
                    alt='Social media icon'
                    className='cursor-pointer'
                  />
                </li>
              </a>
              <a
                href='https://linkedin.com/in/daniel-koss'
                target='_blank'
                rel='noreferrer'
              >
                <li className='w-5 h-5'>
                  <Image
                    src='/Linkedin.svg'
                    width='100%'
                    height='100%'
                    alt='Social media icon'
                    className='cursor-pointer'
                  />
                </li>
              </a>
            </ul>
          </div>

          <div className='flex flex-col items-center flex-1 p-10'>
            <div className='object-cover w-12 h-12 mb-2 rounded-full'>
              <Image src='/proksh.png' width='100%' height='100%' alt='Face' />
            </div>

            <h1 className='text-lg font-semibold text-center'>Proksh Luthra</h1>
            <p className='mb-4 text-sm text-center'>UI/UX Designer</p>

            <ul className='flex flex-row gap-2'>
              <a
                href='https://www.instagram.com/prokshluthra/'
                target='_blank'
                rel='noreferrer'
              >
                <li className='w-5 h-6'>
                  <Image
                    src='/Instagram.svg'
                    width='100%'
                    height='100%'
                    alt='Social media icon'
                    className='cursor-pointer'
                  />
                </li>
              </a>
              <a
                href='https://twitter.com/proksh_luthra'
                target='_blank'
                rel='noreferrer'
              >
                <li className='w-5 h-6'>
                  <Image
                    src='/Twitter.svg'
                    width='100%'
                    height='100%'
                    alt='Social media icon'
                    className='cursor-pointer'
                  />
                </li>
              </a>
              <a
                href='https://www.linkedin.com/in/prokshluthra/'
                target='_blank'
                rel='noreferrer'
              >
                <li className='w-5 h-6'>
                  <Image
                    src='/Linkedin.svg'
                    width='100%'
                    height='100%'
                    alt='Social media icon'
                    className='cursor-pointer'
                  />
                </li>
              </a>
            </ul>
          </div>
        </section>
      </main>

      {viewCount && (
        <div
          id='modal-wrapper'
          className='absolute top-0 z-10 flex flex-col items-center justify-center w-full h-full p-3'
          onClick={reset}
        >
          <div
            id='modal-bg'
            className='absolute top-0 w-full h-full bg-black opacity-25'
          />
          <div className='absolute top-0 flex flex-col justify-center h-screen'>
            <div
              id='modal-container'
              className='z-10 w-full max-w-sm py-16 bg-white shadow-lg rounded-xl'
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div
                id='modal-content'
                className='relative flex flex-col items-center justify-center w-full h-full'
              >
                <div className='w-24 h-24 mb-4 animate-pop'>
                  <Image
                    src={getEmojiFromPrice((viewCount / 1000) * 60)}
                    width='100%'
                    height='100%'
                    alt='Emoji'
                  />
                </div>
                <p className='px-16 mb-4 text-lg text-center'>
                  For this video, advertisers would typically pay around:
                </p>
                <p className='mb-8 text-5xl font-bold'>
                  {numeral((viewCount / 1000) * 60).format('$0,0.00')}
                </p>

                <button
                  className='px-8 py-3 font-medium text-gray-800 transition bg-gray-200 cursor-pointer hover:bg-gray-300 active:scale-95 rounded-xl'
                  onClick={reset}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

function parseVideoId(url: string) {
  let videoId;
  const splitUrl = url.split('/');

  if (last(splitUrl)[0] === 'w') {
    const doubleSplitUrl = last(splitUrl).split('=');
    videoId = doubleSplitUrl[1];
  } else {
    videoId = last(splitUrl);
  }

  return videoId;
}

function last(list: string[]) {
  const lastIndex = list.length - 1;
  return list[lastIndex];
}

function getVideoViewCount(youtubeApiResponse: {
  items: { statistics: { viewCount: number } }[];
}) {
  let viewCount;

  try {
    viewCount = youtubeApiResponse.items[0].statistics.viewCount;
  } catch (err) {
    return null;
  }

  return viewCount;
}

function getEmojiFromPrice(price: number) {
  if (price < 100) {
    return '/sad.png';
  }

  if (price < 1000) {
    return '/alright.png';
  }

  if (price < 10000) {
    return '/happy.png';
  }

  return '/love.png';
}
