


export default function SearchIcon(props: React.SVGAttributes<SVGElement>) {
    return (
        <svg aria-hidden="true" focusable="false"  className={props?.className} width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 0C9.31371 0 12 2.68629 12 6C12 7.38619 11.5277 8.66087 10.7383 9.67676L15.5303 14.4688L14.4697 15.5293L9.67773 10.7373C8.66167 11.5273 7.38668 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0ZM6 1.5C3.51472 1.5 1.5 3.51472 1.5 6C1.5 8.48528 3.51472 10.5 6 10.5C8.48528 10.5 10.5 8.48528 10.5 6C10.5 3.51472 8.48528 1.5 6 1.5Z" fill={props.fill || "#1F1F1F"}/>
        </svg>
    )
}