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
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    

    if(props?.type === 'filled'){
        const baseClasses = `cursor-pointer group text-base px-md py-xs text-white cursor-pointer font-modern-era-medium before:absolute before:bottom-0  before:top-0  before:content-[""] before:bg-dark-gray before:transition-all before:duration-300  before:z-0 relative hover:text-white hover:border-dark-gray transition-left group ${props?.icon === 'down=arrow' ? 'items-baseline': `${props?.icon === 'left-arrow' ? 'items-baseline before:left-full before:right-0 hover:before:left-0' : 'items-center before:right-full before:left-0 hover:before:right-0'}` } `;

        if(props?.href){
            return (
                <Link target={props?.isExternal ? '_blank' : undefined} {...props?.attributes} style={props?.style} className={`${props?.buttonClassName || ''} ${props?.backgroundColor || 'bg-dark-gray'}  ${baseClasses} flex items-center gap-x-xs max-w-fit`} href={props?.href || '#'}>
                    <div className={`relative flex justify-center items-center gap-x-xs ${props?.innerButtonClassName}`}>
                        {props?.icon === 'left-arrow' && <LeftArrowIcon className={props?.iconClassName || ''} fill="white" />}
                        {props?.children}
                        {props?.icon === 'right-arrow' && <RightArrowIcon className={`${props?.iconClassName || ''} w-sm h-sm group-hover:translate-x-[.2vw] transition duration-300`} fill="white" />}
                        {props?.icon === 'down-arrow' && <RightArrowIcon className={`${props?.iconClassName || ''} w-sm h-sm transform rotate-90 group-hover:translate-y-[.2vw] transition duration-300 `} fill="white" />}
                        {props?.icon === 'external-link' && <ExternalLinkIcon className={props?.iconClassName || ''} fill="white" />}
                    </div>
                </Link>
            )
        }
        
        return (
            <button {...props?.attributes} onClick={props?.onClick} style={props?.style} className={`${props?.buttonClassName || ''} ${props?.backgroundColor || 'bg-dark-gray'} ${baseClasses} flex items-center gap-x-xs max-w-fit`}>
                <div className="relative flex justify-center items-center gap-x-xs">
                    {props?.loader && <LoaderIcon className="w-sm h-sm" />}
                    {props?.icon === 'left-arrow' && !props?.loader && <LeftArrowIcon className={props?.iconClassName || ''} fill="white" />}
                    {props?.children}
                    {props?.icon === 'right-arrow' && !props?.loader && <RightArrowIcon className={`${props?.iconClassName || ''} w-sm h-sm group-hover:translate-x-[.2vw] transition duration-300`} fill="white" />}
                    {props?.icon === 'down-arrow' && !props?.loader && <RightArrowIcon className={`${props?.iconClassName || ''} w-sm h-sm transform rotate-90 group-hover:translate-y-[.2vw] transition duration-300 `} fill="white" />}

                    {props?.icon === 'external-link' && !props?.loader && <ExternalLinkIcon className={props?.iconClassName || ''} fill="white" />}
                </div>
            </button>
        )
    }

    if(props?.type === 'outlined'){
        const baseClasses = `cursor-pointer  text-base px-md py-xs  cursor-pointer font-modern-era-medium border-[.11vw]  flex items-center gap-x-xs max-w-fit overflow-hidden before:absolute before:bottom-0  before:top-0  before:content-[""] before:bg-dark-gray before:transition-all before:duration-300   before:z-0 relative hover:text-white hover:border-dark-gray transition-all group ${props?.icon === 'down=arrow' ? '' : `${props?.icon === 'left-arrow' ? 'before:left-full before:right-0 hover:before:left-0' : 'before:right-full before:left-0 hover:before:right-0'}` } `;

        if(props?.href){
            return (
                <Link target={props?.isExternal ? '_blank' : undefined} style={props?.style} className={`relative ${props?.buttonClassName || ''} ${props?.textColor || 'text-dark-gray'} ${props?.outlineColor || 'border-dark-gray'} ${baseClasses}`} href={props?.href || '#'}>
                    <div className="relative flex justify-center items-center gap-x-xs">
                        
                        {props?.icon === 'left-arrow' && <LeftArrowIcon className={`${props?.iconClassName}  group-hover:fill-white `} fill={props?.dynamicIconColor ||  "inherit"} />}

                        {props?.children}
                        
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
        const baseClasses = `
        text-base cursor-pointer group font-modern-era-medium flex  gap-x-1 max-w-fit relative after:absolute after:bottom-0 after:content-[""] after:block after:w-0 after:h-[.13vw] items-center hover:after:w-full after:bg-current ${props?.outlineColor} after:transition-all after:duration-300 max-h-fit ${props?.icon === 'left-arrow' ? 'after:right-0' : 'after:left-0'}
        `;

        if(props?.href){
            return (
                <Link target={props?.isExternal ? '_blank' : undefined} {...props?.attributes} style={props?.style} className={`${props?.buttonClassName || ''} ${props?.textColor || 'text-dark-gray'} ${baseClasses}`} href={props?.href || '#'}>
                    
                    {props?.CustomLeftIcon && <props.CustomLeftIcon />}

                    {!(props?.CustomLeftIcon || props?.CustomRightIcon) && props?.icon === 'left-arrow' && <LeftArrowIcon className={`${props?.iconClassName || ''} w-sm h-sm group-hover:translate-x-[-.2vw] transition duration-300 `} fill={props?.dynamicIconColor || `var(--color-${props?.textColor?.replace('text-', '')})`} />}
                    
                    {props?.children}
                
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
                
                {props?.children}
            
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