
const LeftArrowIcon: React.FC<React.SVGAttributes<SVGElement>> = (props: React.SVGAttributes<SVGElement>) => (
    <svg className={`min-w-sm min-h-sm ${props?.className || ''}`} viewBox="0 0 18 14" fill="none">
        <path d="M7.066 14L7.87486 13.1869L2.20229 7.56521H18V6.43479H2.20229L7.87486 0.813057L7.066 0L0 7L7.066 14Z" fill={props?.fill || "#333333"}/>
    </svg>
);


export default LeftArrowIcon;