export type CareersHeaderProps = {
    title?: string | React.ReactNode;
    shareable?: boolean;
    buttonCTA?: {
            text: React.ReactNode | string;
            href: string;
            type?: 'text' | 'filled' | 'outlined';
        };
}
