

export default function MenuIcon(props: React.SVGAttributes<SVGElement>) {
    return (
        <svg aria-hidden="true" focusable="false" className={props?.className} xmlns="http://www.w3.org/2000/svg" width="26" height="19" viewBox="0 0 26 19" fill="none">
            <path d="M4.44651e-05 19L0 16H20L20 19H4.44651e-05ZM4.44651e-05 11L0.000125468 8H26.0001L26 11H4.44651e-05ZM0 3L4.44651e-05 0H26L26 3H0Z" fill={props?.fill || "#333333"} />
        </svg>
    )
}