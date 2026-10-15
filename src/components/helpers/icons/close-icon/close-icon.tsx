

export default function CloseIcon(props: React.SVGAttributes<SVGElement>) {
    return (
        <svg aria-hidden="true" focusable="false" {...props} className={props.className || 'w-sm h-sm'}  width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M0.707031 0.707153L14.9048 14.9049" stroke={props?.fill || "white"} strokeWidth="2"/>
            <path d="M14.9062 0.707153L0.708527 14.9049" stroke={props?.fill || "white"} strokeWidth="2"/>
        </svg>
    )
}