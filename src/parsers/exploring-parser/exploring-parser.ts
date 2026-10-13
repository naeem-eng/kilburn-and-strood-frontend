import { getStrapiMedia } from "@/utils/utils";

type ServicesProps = {
    
    name?: string;
    href?: string;
}

  


function servicesParser(list: any) {
  
    const servicesList = list?.map((item: any) => {
        console.log({item})
        return {
            title: (item?.name)?.trim() || '',
            href: `services/${item?.slug}`,
            type: 'services'
        }
    });

    return servicesList
}

function sectorsParser(list: any) {
  
    const sectorsList = list?.map((item: any) => {
        console.log({item})
        return {
            title: (item?.name)?.trim() || '',
            href: `sectors/${item?.slug}`,
            type: 'sectors'
        }
    });

    return sectorsList
}



export function exploringParser(sevices: any, sectors: any) {
  
    const servicesList = servicesParser(sevices);
    const sectorsList = sectorsParser(sectors);

    return {
        servicesList,
        sectorsList
    }
}
