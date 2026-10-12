export type PeopleExpertiseProps = {
    title?: string | React.ReactNode;
    color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red';
    services?: Array<{
        text: string;
        href: string;
    }>;
    role?: Array<string>;
    sectors?: Array<{
        text: string;
    }>
}
