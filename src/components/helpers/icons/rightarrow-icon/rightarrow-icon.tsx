const RightArrowIcon: React.FC<React.SVGAttributes<SVGElement>> = (props: React.SVGAttributes<SVGElement>) => (
    <svg aria-hidden="true" focusable="false" className={`min-w-sm min-h-sm ${props?.className || ''}`} viewBox="0 0 20 14" fill={props?.fill || "none"}>
        <path d="M12.934 14L12.1251 13.1869L17.7977 7.56521H0V6.43479H17.7977L12.1251 0.813057L12.934 0L20 7L12.934 14Z" fill={props?.fill || "#333333"}/>
    </svg>
)

export default RightArrowIcon;