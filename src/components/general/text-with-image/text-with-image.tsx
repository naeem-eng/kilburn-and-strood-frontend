import { Button } from "@/components/helpers/buttons"
import { Text, TextXl, TitleSm } from "@/components/helpers/typography"
import Image from "next/image"
import { memo } from "react"
import { TextWithImageProps } from "./text-with-image.types"
import { createIncrementalAnimationAttributes } from "@/components/helpers/animation"
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreak from 'remark-breaks';
import BodyMarkdown from "@/components/helpers/body-markdown/BodyMarkdown"

const TextWithImage: React.FC<TextWithImageProps> = (props) => {
  const isAnimation = props?.isAnimation || false;
  const isLightAnimation = props?.isLightAnimation || false;
  type AnimatedFieldKey = 'title' | 'text' | 'button'

  const distances = ['-40svh', '-36svh', '-32svh']

  const animatedFieldsOrder: AnimatedFieldKey[] = []
  if (props.title) animatedFieldsOrder.push('title')
  if (props.text) animatedFieldsOrder.push('text')
  if (props.cta) animatedFieldsOrder.push('button')

  const getAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
    distances,
    fieldsOrder: animatedFieldsOrder
  })
  const getMobileAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
    distances: ['10svh', '8svh', '6svh'],
    fieldsOrder: animatedFieldsOrder,
    negativeOnReverse: false,
    screenSize: 'mobile-',
    trigger: '.text-container',
    start: 'top 90%',
    delay: 0.1,
  })

  const textLength = props.text?.length ?? 0
  const desktopVerticalPaddingClass =
    textLength > 800 ? 'md:py-[5%]' : textLength > 400 ? 'md:py-[10%]' : 'md:py-[15%]'

  return (
    <div
      data-animation={isAnimation}
      data-light-animation={isLightAnimation}
      data-section-type="text-with-image"
      data-animation-component
      data-primary-header
      className={`${isAnimation || isLightAnimation ? 'invisible' : ''} ${props?.className || ''} textWithImage overflow-clip w-full pt-(--padding-top) relative h-full background-white grid grid-rows-[1fr_minmax(auto, 1fr)] grid-cols-6 md:grid-rows-1 md:grid-cols-12 gap-x-4 gap-y-0 items-end px-(--padding-side)`}
      style={{ zIndex: props.index }}
    >
      {/* LEFT IMAGE SECTION */}
      <div
        className={`${props.textOnLeft ? 'md:mr-0 md:col-[1/span_7]': 'md:ml-0 md:col-[span_7/-1]'}  col-span-full md:row-1 h-full -mx-(--padding-side) overflow-clip`}
      >
        {props.imageSrc && <Image
          unoptimized
          src={props.imageSrc}
          alt={props.imageAlt ?? "Text with Image"}
          width={1100}
          height={900}
          data-animation-atoms
          data-from={`{ "y": "-50%"}`}
          data-middle='{"y": "0%"}'
          data-to={`{"y": "50%"}`}
          data-mobile-from='{"scale": "1.1"}'
          data-mobile-middle='{"scale": "1"}'
          className={`w-full h-full ${props?.isAnimation ? '' : 'max-h-[80vh]'} aspect-square object-cover`}
        />}
      </div>
      {/* RIGHT TEXT SECTION */}
      <div
        className={`text-container ${!props.textOnLeft
          ? (props.text ? 'flex-row-reverse md:mr-0 md:col-[1/span_7]' : 'flex-row-reverse md:mr-0 md:col-[1/span_9] 2xl:col-[1/span_7]')
          : (props.text ? 'md:ml-0 md:col-[span_7/-1]' : 'md:ml-0  md:col-[span_7/-1]  2xl:col-[span_7/-1]')
        }  md:mt-4xl md:justify-end relative pb-10 md:pb-0 md:row-1 col-span-full -mx-(--padding-side) flex`}
      >
        <div
          data-animation-atoms
          data-from='{"y": "100%"}'
          data-middle='{"y": "0%" }'
          data-to='{"y": "-80%"}'
          data-mobile-from='{"y": "-10%"}'
          data-mobile-middle='{"y": "0%" }'
          data-mobile-trigger=".text-container"
          data-mobile-start="top 90%"
          className={`relative z-1 bg-white md:w-[85%] px-8 py-10 md:px-3xl max-w-[calc(100%-2rem)] md:max-w-unset ${desktopVerticalPaddingClass} flex flex-col  overflow-clip`}
        >
          {props.title &&
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreak]} 
                components={{
                  p: ({ children }) => (
                    props.text
                      ? <TextXl attributes={{ ...getAnimationAttributes('title'), ...getMobileAnimationAttributes('title') }}>{children}</TextXl>
                      : <TitleSm attributes={{ ...getAnimationAttributes('title'), ...getMobileAnimationAttributes('title') }}>{children}</TitleSm>
                  ),
                  strong: ({children}) => <TitleSm as="span" className={`text-${props?.color || 'bright-red'}  `} style={{ fontSize: 'inherit', lineHeight: 'inherit' }}
>{children}</TitleSm>
                }}
            > 
                {props?.title}
            </ReactMarkdown> 
          }
          {props.text &&
            <BodyMarkdown
              color={props?.color}
              className="mt-sm"
              components={{
                    p: ({ children }) => <Text attributes={{...getAnimationAttributes('text'), ...getMobileAnimationAttributes('text')}}
                    className="xl:w-[85%]"
                    textSize="text-base">{children}</Text>,
                }}
            >{props?.text}</BodyMarkdown>
          }
          {props.cta &&
            <div className="mt-md">
              <Button
              attributes={{...getAnimationAttributes('button'), ...getMobileAnimationAttributes('button')}}
              icon="right-arrow"
              type={props.cta.type || "text"}
              textColor="text-bright-red"
              href={props.cta.href || "#"}

            >
              {props.cta.text}
            </Button>
            </div>
          }
            {/* <Button
              attributes={{...getAnimationAttributes('button'), ...getMobileAnimationAttributes('button')}}
              icon="right-arrow"
              type="text"
              textColor="text-bright-red"
              href={props.buttonHref || "#"}
            >
              {props.buttonText}
            </Button> */}
        </div>
        <div
          data-animation-atoms
          data-from='{"y": "-80%", "scaleY": "0", "transformOrigin": "top"}'
          data-middle='{"scaleY": "1", "y": "0%"}'
          data-to='{"scaleY": "0", "transformOrigin": "bottom"}'
          data-mobile-from='{"scaleY": "0", "transformOrigin": "top"}'
          data-mobile-middle='{"scaleY": "1", "y": "0%"}'
          data-mobile-trigger=".text-container"
          data-mobile-start="top 85%"
          data-mobile-duration="0.6"
          className={`  ${props.textOnLeft ? 'left-0' : 'right-0'} absolute bottom-0 top-0 md:static w-19 md:w-(--space-3xl) shrink-0 bg-${props?.color || "bright-red"}`} />
      </div>
    </div>
  );
};

export default memo(TextWithImage);
