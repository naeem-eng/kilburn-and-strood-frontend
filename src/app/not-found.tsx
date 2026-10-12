import { Button } from '@/components/helpers/buttons';
import { Text, TextMd, TitleSm } from '@/components/helpers/typography';
import { FullPageSlider } from '@/components/interactive/fullpage';
import Image from 'next/image';
 
export default function NotFound() {
  return (
      <div className='h-screen w-full relative bg-white z-1 pt-(--padding-top-small) flex justify-between items-end'>
        <FullPageSlider interactive={false} className='not-found-slider w-full'>
          <div className='z-1 pt-(--padding-top-small) h-screen w-full flex justify-between items-end'>
            <div className='bg-white  mt-lg min-h-0 h-[80%] flex flex-row justify-start items-center w-full md:w-[60%] relative z-1'>
              <div className='bg-bright-red min-w-[5vw] min-h-full'></div>
              <div className='mx-xl md:w-[65%]'>
                <TitleSm className='mb-md'>
                  <span className='text-bright-red'>404</span><br />
                  Page not found
                </TitleSm>
              <TextMd>The page you are looking for could not be found. It may have been moved, renamed, or is no longer available.</TextMd>
              <Button buttonClassName='mt-md' type='text' textColor='text-bright-red' href='/'>
                Go to Homepage
              </Button>
              </div>
            </div>

            <div className='w-[50%] absolute right-0 top-0 bottom-0'>
              <Image src='/images/not-found-image.png' alt='404' width={600} height={400} className='w-full h-full object-cover' />
            </div>
          </div>
        </FullPageSlider>
      </div>
    
  );
}
