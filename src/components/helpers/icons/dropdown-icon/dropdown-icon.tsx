

export default function DropdownIcon(props: React.SVGAttributes<SVGElement>) {
    return (
        <svg className={props?.className} width="9" height="17" viewBox="0 0 9 17" fill={'none'}>
            <path d="M0.353516 7L4.35352 11L8.35352 7" strokeWidth={props?.strokeWidth || undefined} stroke={props?.fill ||"#333333"}/>
        </svg>
    )
}