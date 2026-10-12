export type ArticleHeaderProps = {
    title?: string;
    articalType: string[];
    shareable?: boolean;
    date?: string;
    color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red';
    cta?: {
        text: string;
        href: string;
        type: 'filled' | 'outlined' | 'text';
        icon: string;
        textColor?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red';
        backgroundColor?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red';
    }[];
}
