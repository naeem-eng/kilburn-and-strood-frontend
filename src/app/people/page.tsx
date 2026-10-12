import React, { memo } from 'react';

import PeopleCardsContainer from '@/components/general/people-cards-container';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import { getComponentsPopulateObj, getSeoObject } from '@/utils/utils';
import fetchPeopleSetting from '@/requests/people-setting-requests';
import Sections from '@/components/sections';
import { FullPageSlider } from '@/components/interactive/fullpage';


export const dynamic = 'force-static';
export const fetchCache = 'force-cache'; // Forces all fetches to cache, even with Auth headers
export const revalidate = 3600; 


export async function generateMetadata() {

    const page = await fetchPeopleSetting({
        populate: "*", 
        isPreview: false
    });

    if (!page) notFound();
    const { seo } = page;
    return getSeoObject(seo, page);
}


const PeopleList = async () => {

    const draft = await draftMode();
    const isPreview = draft.isEnabled;
    
    const page = await fetchPeopleSetting({
        populate: {
            hero_sections: {
                on: {
                    ...getComponentsPopulateObj()
                },
            },
            peoples: {
                populate: "*"
            }
        },
        isPreview: false
    });

    // // //console.log(page, searchParams);

    if (!page) notFound();
    const data = page
    // if(!data?.heroSections && data.peoples) {
    //     if(data?.heroComponent === "secondary header") {
    //         data.heroSections = data?.peoples?.map((person: any) => ({
    //             component: 'components.secondary-header',
    //     }
    // }

    return (
        <div className="relative z-10 bg-white">
            {data?.heroSections &&
            <FullPageSlider interactive={data?.type === "interactive"}>
                {data?.heroSections && <Sections sections={data?.heroSections || []} isAnimation={false} />}
                <PeopleCardsContainer
                    color='bright-red'
                    className='mt-xl'
                    isFilters={true}
                    isTabbed={true}
                    isLoadMore={true}
                />                
            </FullPageSlider>}
        </div>
    );
}


export default (PeopleList);
