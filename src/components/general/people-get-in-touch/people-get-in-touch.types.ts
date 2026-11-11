export type PeopleGetInTouchPhone = {
    text: string;
    href: string;
};

export type PeopleGetInTouchProps = {
    firstName: string;
    color?: string;
    email?: string;
    phones: PeopleGetInTouchPhone[];
    vcardUrl?: string;
    linkedin?: string;
    imageSrc?: string;
    imageAlt?: string;
    imageWidth?: number;
    imageHeight?: number;
    isAnimation?: boolean;
};
