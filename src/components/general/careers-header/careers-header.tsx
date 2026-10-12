"use client";

import { Button } from "@/components/helpers/buttons";
import { CareersHeaderProps } from "./careers-header.types";
import { Text, TitleSm } from "@/components/helpers/typography";
import ShareableIcon from "@/components/helpers/icons/shareable-icon/shareable-icon";

const CareersHeader: React.FC<CareersHeaderProps> = (props) => {
     return (
      <div className={`w-full relative flex flex-col md:flex-row pt-[20vw] md:pt-[10vw] justify-start items-start bg-white px-sm md:px-xl gap-y-lg`}>

        <div className="md:min-w-[20%] md:w-[20%]">
          <Button icon='left-arrow' type="text" textColor="text-dark-gray"  buttonClassName=" text-2md! font-modern-era-medium items-baseline" iconClassName="w-sm h-xs">Back</Button>
        </div>

        <div className="md:min-w-[50%] md:w-[50%] flex flex-col gap-y-md justify-start items-start">
         

          <TitleSm>
            {props?.title}
          </TitleSm>

          <div className="flex flex-row gap-x-md justify-start items-center mt-xs mb-sm">
            <Button type={props?.buttonCTA?.type || 'text'} href={props?.buttonCTA?.href || '#'} textColor="text-dark-gray" backgroundColor="bg-bright-red" icon={"right-arrow"}>
              {props?.buttonCTA?.text}
            </Button>
            <button className="flex flex-row gap-x-xs justify-start items-center cursor-pointer">
              <Text className="text-dark-gray">
                Share
              </Text>
              <ShareableIcon className="w-2sm h-2sm" />
            </button>
          </div>

        </div>

      </div>
    );
};

export default CareersHeader;
