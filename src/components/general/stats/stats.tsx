"use client";

import { Text, TextLg, TextMd, TitleLg } from "@/components/helpers/typography";
import { StatsProps } from "./stats.types";
import CountUp from "react-countup";



const parseStats = (value: string) => {
  const match = value.match(/^([^0-9]*)([\d,.]+)(.*)$/);
  if (!match) {
    return {
      prefix: "",
      number: 0,
      suffix: "",
    };
  }

  const [, prefix, num, suffix] = match;

  return {
    prefix,
    number: parseFloat(num.replace(/,/g, "")),
    suffix,
  };
}

const Stats: React.FC<StatsProps> = (props) => {

    return (
      <div className={`${props.className || ''} flex flex-row gap-y-md -mx-md py-lg flex-wrap`}>
        {
          props?.values?.map((value, index) => {
            const parsed = value.value ? parseStats(value.value) : null
            return (
              <div className="min-w-full mx-0 px-md sm:min-w-1/2 sm:w-1/2 sm:max-w-1/2 md:min-w-1/3 md:w-1/3 md:max-w-1/3  ${props.statsClassName || ''}" key={index}>
                <div key={index} className={`border-t-[2px] md:border-t-[.2vw] border-t-dark-gray pt-md`}>
                  {parsed && <TitleLg className="text-dark-gray md:text-5xl!">
                    {
                      parsed?.prefix ? parsed.prefix : ''
                    }
                  {parsed.number ? <CountUp
                      end={parsed.number}
                      duration={2}
                      decimals={String(parsed.number).includes(".") ? 1 : 0}
                      enableScrollSpy
                    /> : ''}
                    {
                      parsed?.suffix ? parsed.suffix : ''
                    }
                  </TitleLg>}
                  
                  <TextMd className="text-dark-gray mt-sm">
                    {value.details}
                  </TextMd>
                </div>
              </div>
            )
          })
        }
      </div>
    );
};

export default Stats;
