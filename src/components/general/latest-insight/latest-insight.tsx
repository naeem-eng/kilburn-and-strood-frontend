"use client";

import { Button } from "@/components/helpers/buttons";
import { Text, TextLg, TextMd, TextXl, TitleSm, TitleXl } from "@/components/helpers/typography";
import Image from "next/image";
import { LatestInsightProps } from "./latest-insight.types";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreak from 'remark-breaks';
import { createIncrementalAnimationAttributes } from "@/components/helpers/animation";
import BodyMarkdown from "@/components/helpers/body-markdown/BodyMarkdown";
import { colorParser, textSafeColor, textOnFillClass } from "@/parsers";

const LatestInsight: React.FC<LatestInsightProps> = (props) => {
  const isAnimation = props?.isAnimation || false;
  const isLightAnimation = props?.isLightAnimation || false;
  const gridRows = props.card
    ? 'md:grid-rows-[auto_2vh_minmax(2fr,6fr)_minmax(0,1fr)] xl:grid-rows-[auto_2vh_minmax(0,1fr)_minmax(0,22vh)]'
    : 'md:grid-rows-[auto_5vh_auto_minmax(0,19vh)] xl:grid-rows-[auto_5vh_auto_minmax(0,45vh)]'
  
  const titleLength = (props?.title || "").length;
  const textLength = (props?.text || "").length;
  const titleColSpanClass = titleLength > 60
    ? 'xl:col-span-9'
    : titleLength > 50
      ? 'xl:col-span-8'
      : titleLength > 40
        ? 'xl:col-span-7'
        : 'xl:col-span-6';
  const textMaxWidthClass = textLength > 150
    ? 'lg:max-w-[100%] xl:max-w-[90%]'
    : 'lg:max-w-[100%] xl:max-w-[60%]';

  type AnimatedFieldKey = 'title' | 'text' | 'button'

  const animatedFieldsOrder: AnimatedFieldKey[] = []
  if (props?.title) animatedFieldsOrder.push('title')
  if (props?.text) animatedFieldsOrder.push('text')
  if (props?.cta?.text) animatedFieldsOrder.push('button')

  const getAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
    distances: ['20svh', '12svh'],
    fieldsOrder: animatedFieldsOrder
  })

  const getTabletAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
    distances: ['10svh', '10svh'],
    negativeOnReverse: false,
    fieldsOrder: animatedFieldsOrder,
    start: 'top 80%',
    screenSize: 'mobile-',
    trigger: '.text-container',
    delay: 0.1,
    stagger: true,
    staggerAmount: 0.05
  })

  const getMobileAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
    distances: ['10svh', '10svh'],
    negativeOnReverse: false,
    fieldsOrder: animatedFieldsOrder,
    start: 'top 90%',
    screenSize: 'mobile-',
    trigger: '.text-container',
    delay: 0.1,
    stagger: true,
    staggerAmount: 0.05
  })

  return (
    <div
      data-animation={isAnimation}
      data-light-animation={isLightAnimation}
      data-section-type="latest-insight"
      data-animation-component
      className={`${isAnimation || isLightAnimation ? 'invisible' : ''} latestInsight relative w-full h-full md:max-h-[100svh] xl:h-[100svh] xl:max-h-[100svh] grid grid-cols-6 grid-rows-[1fr_auto_auto] ${gridRows} md:grid-cols-12 gap-x-4 ${props.titleAboveImage ? '' : 'pt-(--padding-top)'} px-(--padding-side) items-end bg-white overflow-clip`}
      style={{ zIndex: props.index }}
    >
      {/* Left Section - Dark with K&S Logo and Server Image */}
      {/* @Naeem I had to comment this out because it broke the component, I updated the classes so feel free to swap out with the title above! */}
      {/* {props?.titleAboveImage && <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreak]} 
        
        components={{
          p: ({ children }) => <TitleSm className="hidden md:block col-span-6 row-1 py-xl">{children}</TitleSm>
          }}
          > 
          {props?.titleAboveImage}
          </ReactMarkdown>} */}
      {(props.titleAboveImage && props.title) &&
        <TitleSm className="hidden md:block col-span-6 row-1 py-xl">
          {props.titleAboveImage}
        </TitleSm>
      }
      {props.mediaSrc &&
        <div className="relative col-[1/span_5] row-1 md:col-[1/span_4] md:row-[2/span_3] h-full -ml-(--padding-side)">
          {props.media1Type === "image" && <Image
            unoptimized
            src={props.mediaSrc}
            alt={props.mediaAlt || ""}
            width={props.mediaWidth || 535}
            height={props.mediaHeight || 769}
            className={`md:absolute inset-0 h-full w-full object-cover`}
            data-animation-atoms
            data-from='{"clip-path": "inset(100% 0% 0%)"}'
            data-middle='{"clip-path": "inset(0% 0% 0%)"}'
            data-to='{"clip-path": "inset(0% 0% 100%)"}'
            data-mobile-from='{"clip-path": "inset(0 0 100% 0)"}'
            data-mobile-middle='{"clip-path": "inset(0 0 0% 0)"}'
          />}
          {
            props.media1Type === "video" && <video
              src={props.mediaSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
              data-animation-atoms
              data-from='{"clip-path": "inset(100% 0% 0%)"}'
              data-middle='{"clip-path": "inset(0% 0% 0%)"}'
              data-to='{"clip-path": "inset(0% 0% 100%)"}'
              data-mobile-from='{"clip-path": "inset(0 0 100% 0)"}'
              data-mobile-middle='{"clip-path": "inset(0 0 0% 0)"}'
            />
          }
        </div>
      }
      {props.card && <div
        data-animation-atoms
        data-from='{"y": "-100%"}'
        data-middle='{"y": "0%" }'
        data-to='{"y": "100%"}'
        data-mobile-from='{"y": "20%"}'
        data-mobile-middle='{"y": "0%" }'
        data-mobile-delay="0.2"
        className={`z-1 col-[1/span_5] w-max ml-auto row-1 md:col-[3/span_2] md:row-4 bg-white flex flex-col items-center justify-center px-xl md:px-xl py-3xl md:min-h-0 md:max-h-full md:overflow-hidden`}
      >
        {props.card.title && <TitleXl as="span" className="!text-6xl md:text-4xl text-dark-purple !leading-5xl md:!leading-2xl">
          {props.card.title}
        </TitleXl>}

        {props.card.text && <TextMd className="!leading-xtight">
          {props.card.text}
        </TextMd>}
      </div>
      }
      <div
        className="col-span-1 row-1 relative h-full md:col-[span_8/-1] md:row-4 -ml-4 -mr-(--padding-side) overflow-clip md:min-h-0 md:max-h-full"
      >
        {props?.mediaBottomType === "image" && props.mediaSrcBottom &&
          <Image
            data-animation-atoms
            data-from='{"x": "100%"}'
            data-middle='{"x": "0%" }'
            data-to='{"x": "-100%"}'
            data-mobile-from='{"scaleY": "0"}'
            data-mobile-middle='{"scaleY": "1"}'
            unoptimized
            src={props.mediaSrcBottom}
            alt={props.mediaAltBottom || ""}
            width={props.mediaWidthBottom || 535}
            height={props.mediaHeightBottom || 769}
            className={`absolute inset-0 w-full mt-auto h-3/5 md:h-full object-cover`}
          />
        }
        {
          props?.mediaBottomType === "video" && props.mediaSrcBottom && 
          <video 
            src={props.mediaSrcBottom} 
            autoPlay 
            loop 
            muted 
            playsInline 
            preload="auto" 
            className={`absolute inset-0 w-full mt-auto h-3/5 md:h-full object-cover`} />
        }
      </div>


      {/* Right Section - White with Content */}

      <div
        data-animation-atoms
        data-from='{"y": "50%"}'
        data-middle='{"y": "0%" }'
        data-to='{"y": "-50%"}'
        className={`text-container col-span-full row-2 md:col-span-8 ${titleColSpanClass} md:row-3 pb-26 pt-xl px-lg md:px-2xl md:py-3xl h-full flex flex-col justify-center gap-y-md`}
      >
        {(props.titleAboveText) &&
          <TextXl
            as="h2"
            className={`text-balance text-${textSafeColor(props?.color || 'dark-purple')}`}
          >
            {props.titleAboveText}
          </TextXl>
        }
        {(props.title) &&
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreak]}
            components={{
              p: ({ children }) => {
                const titleAttributes = {
                  ...getAnimationAttributes('title'),
                  ...getTabletAnimationAttributes('title'),
                  ...getMobileAnimationAttributes('title')
                };

                return props.text ? (
                  <TextXl
                    as="span"
                    className="text-balance"
                    attributes={titleAttributes}
                  >
                    {children}
                  </TextXl>
                ) : (
                  <TitleSm
                    as="span"
                    className="text-balance"
                    attributes={titleAttributes}
                  >
                    {children}
                  </TitleSm>
                );
              }
            }}
          >
            {props?.title}
          </ReactMarkdown>}
        
        {props.text &&
          <BodyMarkdown
            color={"bright-red"}
            components={{
              p: ({ children }) => <Text
                className={`!leading-tight max-w-[100%] ${textMaxWidthClass}`}
                attributes={{
                  ...getAnimationAttributes('text'),
                  ...getTabletAnimationAttributes('text'),
                  ...getMobileAnimationAttributes('text')
                }}
              >{children}</Text>
            }}
          >{props?.text}</BodyMarkdown>
        }
        {/* Read More Button */}
        {
          props?.cta &&
          <Button
            attributes={{
              ...getAnimationAttributes('button'),
              ...getTabletAnimationAttributes('button'),
              ...getMobileAnimationAttributes('button')
            }}
            icon="right-arrow"
            type={props?.cta?.type || "text"}
            textColor={`text-${textSafeColor(props?.cta?.color || props?.color || 'bright-red')}`}
            buttonClassName=""
            href={props?.cta?.href || "#"}
          >
            {props?.cta?.text}
          </Button>
        }
      </div>


      {/* Bottom Right - Latest Insights Button */}
      {/* Yellow Box with Title */}
      {props.topCta && <div className="col-[3/span_3] row-3 md:col-[span_3/-1] md:row-[1/span_2] -mt-(--padding-top)">
        <div
          data-animation-atoms
          data-from='{"y": "-100%"}'
          data-middle='{"y": "0%" }'
          data-to='{"y": "-100%"}'
          data-mobile-from='{"y": "100%"}'
          data-mobile-middle='{"y": "0%" }'
          data-mobile-trigger=".text-container"
          style={{
            "backgroundColor": colorParser(props?.color || "bg-yellow")
          } as any }
          className="bg-yellow px-lg pt-md pb-3xl md:pb-sm md:pt-[clamp(10vh,13vw,20vh)] xl:pt-[clamp(10vh,20vw,20vh)] w-max ml-auto"
        >

          {
            props?.topCta &&
            <Button
              icon="right-arrow"
              type={props?.topCta?.type || "text"}
              textColor={textOnFillClass(props?.color || "yellow")}
              buttonClassName=""
              href={props?.topCta?.href || "#"}
            >
              {props?.topCta?.text}
            </Button>
          }
        </div>
      </div>}
    </div>

  );
};

export default LatestInsight;
