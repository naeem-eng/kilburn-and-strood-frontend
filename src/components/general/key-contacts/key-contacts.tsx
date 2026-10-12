"use client";

import { TitleSm } from "@/components/helpers/typography";
import { memo, useState } from "react";
import { GetKeyContactsParserType } from "@/parsers/key-contact-parser/key-contact-parser";
import { PeopleCardProps } from "../people-card/people-card.types";
import PeopleCard from "../people-card";
import { Button } from "@/components/helpers/buttons";

const PAGE_SIZE = 8;

const KeyContacts: React.FC<GetKeyContactsParserType> = (props: GetKeyContactsParserType) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  //console.log(props)
  const visiblePeople = props?.peoples.slice(0, visibleCount);
  const hasMore = visibleCount < props?.peoples.length;

  return (
    <div className="mt-5">
      {props?.title && (
        <TitleSm className="text-dark-gray mb-lg px-sm md:px-xl">
          {props?.title}
        </TitleSm>
      )}
      <div className="px-sm md:px-xl flex flex-row flex-wrap gap-y-md bg-white justify-start items-start pb-lg content-start -mx-xs min-w-full">
        {visiblePeople.map((person: PeopleCardProps, index: number) => (
          <PeopleCard {...person} key={index} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center items-center my-lg w-full">
          <Button
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            buttonClassName="gap-x-2xs!"
            type="filled"
            backgroundColor="bg-bright-red"
          >
            Load More<span className="text-md min-h-0 leading-sm mt-1">+</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default memo(KeyContacts);