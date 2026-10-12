
export type getInTouchSectionParserType = {
    component: 'components.get-in-touch';
    props: {
        title?: string;
        text?: string;
        cta?: {
            text: string;
            href?: string;
            type: 'filled' | 'outlined' | 'text';
            icon: string;
            textColor?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red';
            backgroundColor?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red';
        }[];
        embedCode?: string;
        formUrl?: string;
        enableForm?: boolean;
    }
}