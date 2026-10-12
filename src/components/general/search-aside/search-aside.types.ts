

export type SearchAsideProps = {
    data: any; 
    setCollection: (collection: string | null) => void;
    selected: string | null;
}

export type ArrCountObject = {
        key: string;
        name: string;
        count: number;
        selected?: boolean;
}[]