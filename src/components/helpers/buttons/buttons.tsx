import Link from "next/link";
import { ExternalLinkIcon, RightArrowIcon, LeftArrowIcon, LoaderIcon } from "../icons";


export interface CTAButtonProps {
    text?: string;
    link?: string;
    type?: 'filled' | 'outlined' | 'text';
    isExternal?: boolean;
    icon?: string;
    backgroundColor?: string;
    goBack?: boolean;
    textColor?: string;
    slug?: string;
}
interface ButtonProps {
    dynamicIconColor?: string | null;
    loader?: boolean | undefined;
    children?: React.ReactNode | string;
    buttonClassName?: string;
    type?: 'filled' | 'outlined' | 'text';
    icon?: 'right-arrow' | 'left-arrow' | 'external-link' | any;
    backgroundColor?: string;
    textColor?: string;
    href?: string;
    isExternal?: boolean;
    iconClassName?: string;
    CustomRightIcon?: React.FC<any>;
    CustomLeftIcon?: React.FC<any>;
    outlineColor?: string;
    innerButtonClassName?:string;
    style?: any;
    onClick?: (e?:any) => void;
    attributes?: React.HTMLAttributes<HTMLElement> & Record<string, any>;
    wrapUnderline?: boolean; // text type: underline every wrapped line instead of only the last
}

const getFilledTextColor = (backgroundColor?: string) => {
    if (backgroundColor?.includes("bright-red")) return { className: "text-black" };
    if (/(yellow|light-|bright-green)/.test(backgroundColor || '') && !backgroundColor?.includes('dark-yellow')) {
        return { className: "text-dark-gray" };
    }
    return { className: "text-white" };
};

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    

    if(props?.type === 'filled'){
        // WCAG 1.4.3: white text is under 4.5:1 on the bright brand fills, so those get dark text
        const fillTextColor = getFilledTextColor(props?.backgroundColor);
        const baseClasses = `cursor-pointer group text-base px-md py-xs ${fillTextColor.className} cursor-pointer font-modern-era-medium before:absolute before:bottom-0  before:top-0  before:content-[""] before:bg-dark-gray before:transition-all before:duration-300  before:z-0 relative hover:text-white hover:border-dark-gray transition-left group ${props?.icon === 'down=arrow' ? 'items-baseline': `${props?.icon === 'left-arrow' ? 'items-baseline before:left-full before:right-0 hover:before:left-0' : 'items-center before:right-full before:left-0 hover:before:right-0'}` } `;

        if(props?.href){
            return (
                <Link target={props?.isExternal ? '_blank' : undefined} rel={props?.isExternal ? 'noopener noreferrer' : undefined} {...props?.attributes} style={props?.style} className={`${props?.buttonClassName || ''} ${props?.backgroundColor || 'bg-dark-gray'}  ${baseClasses} flex items-center gap-x-xs max-w-fit`} href={props?.href || '#'}>
                    <div className={`relative flex justify-center items-center gap-x-xs ${props?.innerButtonClassName}`}>
                        {props?.icon === 'left-arrow' && <LeftArrowIcon className={props?.iconClassName || ''} fill="currentColor" />}
                        {props?.children}
                        {props?.isExternal && <span className="sr-only"> (opens in new tab)</span>}
                        {props?.icon === 'right-arrow' && <RightArrowIcon className={`${props?.iconClassName || ''} w-sm h-sm group-hover:translate-x-[.2vw] transition duration-300`} fill="currentColor" />}
                        {props?.icon === 'down-arrow' && <RightArrowIcon className={`${props?.iconClassName || ''} w-sm h-sm transform rotate-90 group-hover:translate-y-[.2vw] transition duration-300 `} fill="currentColor" />}
                        {props?.icon === 'external-link' && <ExternalLinkIcon className={props?.iconClassName || ''} fill="currentColor" />}
                    </div>
                </Link>
            )
        }
        
        return (
            <button {...props?.attributes} onClick={props?.onClick} style={props?.style} className={`${props?.buttonClassName || ''} ${props?.backgroundColor || 'bg-dark-gray'} ${baseClasses} flex items-center gap-x-xs max-w-fit`}>
                <div className="relative flex justify-center items-center gap-x-xs">
                    {props?.loader && <LoaderIcon className="w-sm h-sm" />}
                    {props?.icon === 'left-arrow' && !props?.loader && <LeftArrowIcon className={props?.iconClassName || ''} fill="currentColor" />}
                    {props?.children}
                    {props?.icon === 'right-arrow' && !props?.loader && <RightArrowIcon className={`${props?.iconClassName || ''} w-sm h-sm group-hover:translate-x-[.2vw] transition duration-300`} fill="currentColor" />}
                    {props?.icon === 'down-arrow' && !props?.loader && <RightArrowIcon className={`${props?.iconClassName || ''} w-sm h-sm transform rotate-90 group-hover:translate-y-[.2vw] transition duration-300 `} fill="currentColor" />}

                    {props?.icon === 'external-link' && !props?.loader && <ExternalLinkIcon className={props?.iconClassName || ''} fill="currentColor" />}
                </div>
            </button>
        )
    }

    if(props?.type === 'outlined'){
        const baseClasses = `cursor-pointer  text-base px-md py-xs  cursor-pointer font-modern-era-medium border-[.11vw]  flex items-center gap-x-xs max-w-fit overflow-hidden before:absolute before:bottom-0  before:top-0  before:content-[""] before:bg-dark-gray before:transition-all before:duration-300   before:z-0 relative hover:text-white hover:border-dark-gray transition-all group ${props?.icon === 'down=arrow' ? '' : `${props?.icon === 'left-arrow' ? 'before:left-full before:right-0 hover:before:left-0' : 'before:right-full before:left-0 hover:before:right-0'}` } `;

        if(props?.href){
            return (
                <Link target={props?.isExternal ? '_blank' : undefined} rel={props?.isExternal ? 'noopener noreferrer' : undefined} style={props?.style} className={`relative ${props?.buttonClassName || ''} ${props?.textColor || 'text-dark-gray'} ${props?.outlineColor || 'border-dark-gray'} ${baseClasses}`} href={props?.href || '#'}>
                    <div className="relative flex justify-center items-center gap-x-xs">
                        
                        {props?.icon === 'left-arrow' && <LeftArrowIcon className={`${props?.iconClassName}  group-hover:fill-white `} fill={props?.dynamicIconColor ||  "inherit"} />}

                        {props?.children}
                        {props?.isExternal && <span className="sr-only"> (opens in new tab)</span>}
                        
                        {props?.icon === 'right-arrow' && <RightArrowIcon className={`${props?.iconClassName}  group-hover:fill-white `} fill={props?.dynamicIconColor ||  "inherit"} />}

                        {props?.icon === 'down-arrow' && <RightArrowIcon className={`${props?.iconClassName} transform rotate-90 group-hover:fill-white `} fill={props?.dynamicIconColor ||  "inherit"} />}

                        {props?.icon === 'external-link' && <ExternalLinkIcon className={`${props?.iconClassName}  group-hover:fill-white `} fill={props?.dynamicIconColor ||  "inherit"} />}
                    </div>
                </Link>
            )
        }
        return (
            <button{...props?.attributes} onClick={props?.onClick}  style={props?.style} className={`${props?.buttonClassName || ''} ${props?.textColor || 'text-dark-gray'} ${props?.outlineColor || 'border-dark-gray'} ${baseClasses}`}>
                <div className="relative flex justify-center items-center gap-x-xs">
                    {props?.loader && <LoaderIcon className="w-sm h-sm" />}
                    
                    {props?.icon === 'left-arrow' && <LeftArrowIcon className={`${props?.iconClassName}  group-hover:fill-white `} fill={props?.dynamicIconColor ||  "inherit"} />}

                    {props?.children}
                    
                    {props?.icon === 'right-arrow' && <RightArrowIcon className={`${props?.iconClassName}  group-hover:fill-white `} fill={props?.dynamicIconColor ||  "inherit"} />}

                    {props?.icon === 'down-arrow' && <RightArrowIcon className={`${props?.iconClassName}  group-hover:fill-white `} fill={props?.dynamicIconColor ||  "inherit"} />}

                    {props?.icon === 'external-link' && <ExternalLinkIcon className={`${props?.iconClassName}  group-hover:fill-white `} fill={props?.dynamicIconColor ||  "inherit"} />}
                </div>
            </button>
        )
    }

    if(props?.type === 'text'){ 
        const underlineClasses = props?.wrapUnderline ? '' : `after:absolute after:bottom-0 after:content-[""] after:block after:w-0 after:h-[.13vw] hover:after:w-full after:bg-current after:transition-all after:duration-300 ${props?.icon === 'left-arrow' ? 'after:right-0' : 'after:left-0'}`;
        const baseClasses = `
        text-base cursor-pointer group font-modern-era-medium flex  gap-x-1 max-w-fit relative items-center ${props?.outlineColor} max-h-fit ${underlineClasses}
        `;

        // an inline background underline is painted under each line the text wraps onto
        const children = props?.wrapUnderline ? (
            <span>
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-left-bottom bg-[length:0%_.13vw] group-hover:bg-[length:100%_.13vw] transition-[background-size] duration-300">
                    {props?.children}
                </span>
            </span>
        ) : props?.children;

        if(props?.href){
            return (
                <Link target={props?.isExternal ? '_blank' : undefined} rel={props?.isExternal ? 'noopener noreferrer' : undefined} {...props?.attributes} style={props?.style} className={`${props?.buttonClassName || ''} ${props?.textColor || 'text-dark-gray'} ${baseClasses}`} href={props?.href || '#'}>
                    
                    {props?.CustomLeftIcon && <props.CustomLeftIcon />}

                    {!(props?.CustomLeftIcon || props?.CustomRightIcon) && props?.icon === 'left-arrow' && <LeftArrowIcon className={`${props?.iconClassName || ''} w-sm h-sm group-hover:translate-x-[-.2vw] transition duration-300 `} fill={props?.dynamicIconColor || `var(--color-${props?.textColor?.replace('text-', '')})`} />}
                    
                    {children}
                        {props?.isExternal && <span className="sr-only"> (opens in new tab)</span>}
                
                    {!(props?.CustomLeftIcon || props?.CustomRightIcon) && props?.icon === 'right-arrow' && <RightArrowIcon className={`${props?.iconClassName || ''} w-sm h-sm group-hover:translate-x-[.2vw] transition duration-300 `} fill={props?.dynamicIconColor || `var(--color-${props?.textColor?.replace('text-', '')})`} />}

                    {!(props?.CustomLeftIcon || props?.CustomRightIcon) && props?.icon === 'external-link' && <ExternalLinkIcon className={`${props?.iconClassName || ''} w-sm h-sm group-hover:translate-x-[.2vw]  transition duration-300 `} fill={props?.dynamicIconColor || `var(--color-${props?.textColor?.replace('text-', '')})`} />}

                    {props?.CustomRightIcon && <props.CustomRightIcon />}
                </Link>
            )
        } 
        return (
            <button {...props?.attributes} onClick={props?.onClick}  style={props?.style} className={`${props?.buttonClassName || ''} ${props?.textColor || 'text-dark-gray'} ${baseClasses} `}>
                {props?.CustomLeftIcon && <props.CustomLeftIcon />}

                {!(props?.CustomLeftIcon || props?.CustomRightIcon) && props?.icon === 'left-arrow' && <LeftArrowIcon className={`${props?.iconClassName || ''} w-sm h-sm group-hover:translate-x-[-.2vw] transition duration-300 `} fill={props?.dynamicIconColor || `var(--color-${props?.textColor?.replace('text-', '')})`} />}
                
                {children}
            
                {!(props?.CustomLeftIcon || props?.CustomRightIcon) && props?.icon === 'right-arrow' && <RightArrowIcon className={`${props?.iconClassName || ''} w-sm h-sm group-hover:translate-x-[.2vw] transition duration-300 `} fill={props?.dynamicIconColor || `var(--color-${props?.textColor?.replace('text-', '')})`} />}

                {!(props?.CustomLeftIcon || props?.CustomRightIcon) && props?.icon === 'external-link' && <ExternalLinkIcon className={`${props?.iconClassName || ''} w-sm h-sm group-hover:translate-x-[.2vw]  transition duration-300 `} fill={props?.dynamicIconColor || `var(--color-${props?.textColor?.replace('text-', '')})`} />}

                {props?.CustomRightIcon && <props.CustomRightIcon />}
            </button>
        )
    }

    return (
        <></>
    )
}

export default Button;