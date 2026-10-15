import React from 'react';
import Image from 'next/image';
import { HeroOneProps } from './hero-one.types';
import { useValidateChildren } from '../../../hooks/validateChildren';

type SlideImageProps = React.ComponentProps<typeof Image> & { priority?: boolean };

// Subcomponents
const Content = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function Content({ children, className, style, ...rest }, ref) {
  return (
    <div
      ref={ref}
      className={className}
      style={{
        paddingTop: 'calc(var(--hero-vpad) * 1.2)',
        paddingBottom: 'calc(var(--hero-vpad) * 2)',
        ...style
      }}
      {...rest}
    >
      {children}
    </div>
  );
});
Content.displayName = 'HeroOne.Content';

const Title: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className, style, ...rest }) => (
  <h1 className={`leading-tight ${className}`} style={{ fontSize: 'var(--title-size)', marginBottom: 'calc(var(--title-size) * 0.5)', ...style }} {...rest}>{children}</h1>
);
Title.displayName = 'HeroOne.Title';

const Description: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className, style, ...rest }) => (
  <p className={className} style={{ fontSize: 'clamp(1rem, calc(var(--title-size) * 0.3), 2rem)', marginBottom: 'calc(var(--title-size) * 0.5)', ...style}} {...rest}>{children}</p>
);
Description.displayName = 'HeroOne.Description';

const Button: React.FC<React.HTMLAttributes<HTMLElement> & { href?: string; onClick?: () => void }> = ({ children, href, onClick, className, style, ...rest }) => {  
  if (href) return <a className={className} style={{ fontSize: 'clamp(1rem, calc(var(--title-size) * 0.3), 2rem)', ...style }} href={href} {...(rest as any)}>{children}</a>;
  return <button className={className} style={{ fontSize: 'clamp(1rem, calc(var(--title-size) * 0.3), 2rem)', ...style }} onClick={onClick} {...(rest as any)}>{children}</button>;
};
Button.displayName = 'HeroOne.Button';

const ImageContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function ImageContainer({ children, className, style, ...rest }, ref) {
  return (
    <div ref={ref} className={className} style={style} {...rest}>{children}</div>
  );
});
ImageContainer.displayName = 'HeroOne.ImageContainer';

const HeroImage: React.FC<SlideImageProps> = (props) => <Image {...props} />;
HeroImage.displayName = 'HeroOne.Image';

const ImageContainer1 = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function ImageContainer1({ children, className, style, ...rest }, ref) {
  return (
    <div ref={ref} className={`flex flex-col justify-start items-end col-span-2 ${className}`} style={style} {...rest}>{children}</div>
  );
});
ImageContainer1.displayName = 'HeroOne.ImageContainer1';

const ImageContainer2 = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function ImageContainer2({ children, className, style, ...rest }, ref) {
  return (
    <div ref={ref} className={`relative w-full h-78 ${className}`} style={style} {...rest}>{children}</div>
  );
});
ImageContainer2.displayName = 'HeroOne.ImageContainer2';

type HeroOneComponent = React.FC<HeroOneProps> & {
  Content: typeof Content;
  Title: typeof Title;
  Description: typeof Description;
  Button: typeof Button;
  Image: typeof HeroImage;
  ImageContainer1: typeof ImageContainer1;
  ImageContainer2: typeof ImageContainer2;
};

const HeroOne: HeroOneComponent = ({
  title,
  description,
  buttonText,
  buttonHref,
  image1Src,
  image1Alt = "",
  image2Src,
  image2Alt = "Hero Image 2",
  onButtonClick,
  children
}) => {

  const handleButtonClick = () => {
    if (onButtonClick) onButtonClick();
  };

  const childrenArray = React.Children.toArray(children);
  const contentSlot = childrenArray.find((c) => React.isValidElement(c) && ((c.type as any).displayName === Content.displayName));
  const image1Slot = childrenArray.find((c) => React.isValidElement(c) && ((c.type as any).displayName === ImageContainer1.displayName));
  const image2Slot = childrenArray.find((c) => React.isValidElement(c) && ((c.type as any).displayName === ImageContainer2.displayName));

  // //console.log(image2Src, image1Src);

  // validate children in development only
  useValidateChildren(
    children,
    [
      Content.displayName,
      ImageContainer1.displayName,
      ImageContainer2.displayName,
    ].filter(Boolean) as string[],
    { devOnly: true, allowDOM: true, allowAnonymous: true, throwOnInvalid: true, componentName: 'HeroOne' }
  );

  return (
    <section
      className="w-full max-w-screen-2xl mx-auto"
      style={{
        ['--title-size' as any]: 'clamp(2.5rem, calc(4.8vw), 4.4rem)',
        ['--hero-vpad' as any]: 'clamp(0rem, calc(5vh), 6rem)',
        ['--hero-hpad' as any]: 'clamp(2rem, 5vw, 5rem)',
        ['--hero-gap' as any]: 'clamp(0.75rem, calc(var(--title-size) * 0.9), 5rem)',
        paddingTop: 'calc(var(--hero-vpad) * 3)',
      }}
    >
      <div className="grid grid-cols-6 h-full gap-[var(--hero-gap)]">
        {/* Text Content */}
        <div className="col-span-4">
          {contentSlot ? (
            // If user provided a Content subcomponent, render it
            contentSlot
          ) : (
            <Content>
              {title && <Title>{title}</Title>}
              {description && <Description>{description}</Description>}
              {buttonHref && <Button href={buttonHref} onClick={handleButtonClick}>
                {buttonText}
              </Button>}
            </Content>
          )}

          {/* secondary large image (kept in same column) */}
          {image2Slot ? (
              image2Slot
            ) : (
              image2Src && <ImageContainer2>
                <HeroImage
                  src={image2Src}
                  alt={image2Alt}
                  priority
                  width={942}
                  height={418}
                  className="w-full"
                />
              </ImageContainer2>
            )}
        </div>

        {/* Images column */}
        {image1Slot ? (
            image1Slot
          ) : (
             image1Src && <ImageContainer1>
              <HeroImage
                src={image1Src}
                alt={image1Alt}
                width={412}
                height={678}
                priority
              />
            </ImageContainer1>
          )}
      </div>
    </section>
  );
};

// attach subcomponents
HeroOne.Content = Content;
HeroOne.Title = Title;
HeroOne.Description = Description;
HeroOne.Button = Button;
HeroOne.Image = HeroImage;
HeroOne.ImageContainer1 = ImageContainer1;
HeroOne.ImageContainer2 = ImageContainer2;

export default HeroOne;
