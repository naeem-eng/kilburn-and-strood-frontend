import Link from 'next/link';
import { Text, TextLg, TextXl } from '@/components/helpers/typography';
import RightArrowIcon from '@/components/helpers/icons/rightarrow-icon/rightarrow-icon';
import PeopleCard from '@/components/general/people-card';
import { PeopleCardProps } from '@/components/general/people-card/people-card.types';

export type ExploringItem = {
  title: string;
  href: string;
  type: 'services' | 'sectors';
};

export type PeopleAndExploringProps = {
  // left column: people (e.g. "Written by" on insights, the linked people on case studies)
  peopleTitle?: string;
  people?: PeopleCardProps[] | null;
  // right column: "Keep Exploring" links to the linked services and sectors
  exploring?: ExploringItem[] | null;
  className?: string;
};

// Two-column block shared by insights and case study inner pages.
const PeopleAndExploring = ({ peopleTitle = 'Written by', people, exploring, className = '' }: PeopleAndExploringProps) => {
  const hasPeople = Boolean(people?.length);
  const hasExploring = Boolean(exploring?.length);
  if (!hasPeople && !hasExploring) return null;

  return (
    <div className={`flex flex-col md:flex-row mt-4xl gap-y-[5vw] md:gap-x-[5vw] px-sm md:px-xl ${className}`}>
      {hasPeople && <div className='w-full md:max-w-1/2'>
        <TextXl>
          {peopleTitle}
        </TextXl>
        <div className={`mt-md flex flex-row flex-wrap gap-y-md bg-white justify-start items-start pb-lg content-start min-w-full `}>
          {people!.map((person) => (
            <PeopleCard type="list" {...person} key={person?.slug || person?.title} />
          ))}
        </div>
      </div>}

      {hasExploring && <div className='w-full md:max-w-1/2 '>
        <TextXl>
          Keep Exploring
        </TextXl>
        <div className="mt-md flex flex-col">
          {exploring!.map((item, i) => (
            <Link
              key={item.href + i}
              href={item.href?.startsWith("/") ? item.href : `/${item.href}`}
              className="group block border-t-2 border-bright-red py-md"
            >
              <Text as="span" className="block text-bright-red font-modern-era-medium mb-2xs">
                {item.type === "sectors" ? "Sector" : "Service"}
              </Text>
              <div className="flex items-center justify-between gap-x-md">
                <TextLg as="span" className="text-dark-gray">{item.title}</TextLg>
                <RightArrowIcon
                  fill="currentColor"
                  className="w-lg h-lg shrink-0 text-dark-gray transition-transform duration-300 ease-in-out group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>}
    </div>
  );
};

export default PeopleAndExploring;
