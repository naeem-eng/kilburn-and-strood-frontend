interface HeroOneProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  image1Src?: string;
  image1Alt?: string;
  image2Src?: string;
  image2Alt?: string;
  onButtonClick?: () => void;
  children?: React.ReactNode;
}
export type { HeroOneProps };