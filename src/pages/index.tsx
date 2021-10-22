import React, { useState } from 'react';

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const onButtonClick = () => {
    // make request to scraping api here and get $ value
    console.log('button clicked!');
    setShowModal(true);
  };

  return (
    <main className='flex flex-col items-center p-3 pt-8'>
      <section className='flex flex-col max-w-lg'>
        <h1 className='mb-2 text-2xl font-semibold'>
          how much is this video worth?
        </h1>
        <p className='mb-3'>
          hey gimme a link to a tiktok or yt video and i'll tell you how much
          it's worth
        </p>
        <input
          className='py-1 pl-2 mb-3 border rounded-md'
          placeholder='https://'
        />
        <button
          type='button'
          onClick={onButtonClick}
          className='self-center px-2 py-1 text-white transition bg-gray-900 border rounded-lg active:bg-gray-800 active:scale-95'
        >
          calculate!
        </button>
      </section>

      {showModal && (
        <div
          id='modal-wrapper'
          className='absolute top-0 z-10 flex items-center justify-center w-full h-full p-3'
          onClick={() => {
            setShowModal(false);
          }}
        >
          <div
            id='modal-bg'
            className='absolute top-0 w-full h-full bg-black opacity-25'
          />
          <div
            id='modal-container'
            className='z-10 w-full h-full max-w-sm bg-white shadow-lg rounded-xl max-h-96'
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div
              id='modal-content'
              className='relative flex flex-col items-center justify-center w-full h-full'
            >
              <p className='mb-2 text-lg'>this video is worth:</p>
              <p className='text-4xl font-semibold'>$100!</p>
              <p className='absolute text-xs right-4 bottom-4'>
                just kidding, this is a wip...
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
