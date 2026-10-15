


const QuoteIcon: React.FC<React.SVGAttributes<SVGElement>> = (props: React.SVGAttributes<SVGElement>) => (
    <svg aria-hidden="true" focusable="false" className={props?.className} width="23" height="22" viewBox="0 0 23 22" fill="none">
        <path d="M13.0682 11.5172C13.0682 5.31034 16.5966 0.965517 23 0V4.82759C20.2557 5.31035 18.2955 7.10345 18.2955 11.5172H23V22H13.0682V11.5172ZM0 22V11.5172C0 5.31034 3.52841 0.965517 9.93182 0V4.82759C7.1875 5.31035 5.22727 7.10345 5.22727 11.5172H9.93182V22H0Z" fill={props?.fill || "white"}/>
    </svg>
)

export default QuoteIcon;