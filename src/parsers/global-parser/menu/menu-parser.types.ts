export interface MenuRequestProps {
    id: string; 
    title: string | undefined;
    seoSlug: string | undefined;
    url?: string | undefined;
    menuDetails?: string | undefined;
    menuPosition?: 'top' | 'bottom' |undefined;
    menuOrderHeader: number | undefined;
    showInHeaderMenu: boolean | undefined;
    menuHasLink: boolean | undefined;
    menuItemHasSubmenu: boolean | undefined;
    subMenuIsMegaMenu: boolean | undefined;
    children: MenuRequestProps[];
    ctaContainer?: {
        backgroundColor?: string;
        ctaMediaType?: string;
        ctaTitle?: string;
        ctaText?: string;
        ctaLink?: string;
        ctaMedia?: string;
        color?: string;
        arrow?: boolean
    };
}