const ExternalLinkIcon: React.FC<React.SVGAttributes<SVGElement>> = (props: React.SVGAttributes<SVGElement>) => (
    <svg className={`w-sm h-sm ${props?.className || ''}`}  width="19" height="24" viewBox="0 0 19 24" fill="none">
        <path d="M15.2038 18.7972L13.8732 18.7938L13.915 9.5285L4.65094 18.7914L3.7236 17.864L12.9876 8.60116L3.72236 8.64287L3.71892 7.31233L15.2579 7.25819L15.2038 18.7972Z" fill={props?.fill || "#7469CD"}/>
    </svg>
);

export default ExternalLinkIcon;