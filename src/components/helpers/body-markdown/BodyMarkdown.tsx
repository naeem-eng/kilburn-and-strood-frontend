import React, { Fragment, memo, ReactNode } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Text, TextLg, TextMd, TextXl, TitleLg, TitleMd, TitleSm } from "@/components/helpers/typography";
import { Button } from "../buttons";
import { colorParser } from "@/parsers";
import rehypeRaw from "rehype-raw";



type BodyMarkdownProps = {
  children: string;
  components?: Components;
  className?: string;
  color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red' | 'yellow' | 'white' | 'dark-gray' | 'light-gray' | 'medium-gray' | 'light-green' | 'light-blue' | 'light-purple';
  attributes?: React.HTMLAttributes<HTMLDivElement>;
};

const renderWithSuperscript = (content: string) => {
  return content.replace(/\[(\d+(?:,\s*\d+)*)\]/g, (match, nums) => {
    // //console.log("match", match);
    return `<sup>${nums}</sup>`;
  });
};

const BodyMarkdown: React.FC<BodyMarkdownProps> = ({
  children,
  components,
  color,
  className,
  attributes
}) => {

  const normalizedContent = renderWithSuperscript(
    children.replace(/\r\n/g, '\n')         
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\n{3,}/g, '\n\n') 
      .replaceAll('-x-', '<br/>')
      .trim()
  )

  // //console.log({ normalizedContent })




  return (
    <div className={(className || '') + ' '} {...attributes}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={{
          br: () => <br />,
          h1: ({ children }) => <TitleLg as={"h1"} className="mb-lg">{children}</TitleLg>,
          h2: ({ children }) => <TitleMd className="mb-lg">{children}</TitleMd>,
          h3: ({ children }) => <TitleSm className="mb-lg">{children}</TitleSm>,
          h4: ({ children }) => <TextXl className="mb-lg">{children}</TextXl>,
          h5: ({ children }) => <TextLg className="mb-lg">{children}</TextLg>,
          h6: ({ children }) => <TextMd className="font-modern-era-bold">{children}</TextMd>,
          blockquote: ({ children }) => (
            <blockquote
              style={{ "--dynamic-colors": colorParser(color || "dark-purple") } as any}
              className="mb-sm border-l-4 border-[var(--dynamic-colors)] pl-sm italic text-dark-gray"
            >
              {children}
            </blockquote>
          ),
          p: ({ children }) => <Text as={"p"} className="mb-lg">{children}</Text>,
          strong: ({ children }) => <Text as="b" className="font-semibold" style={{ fontSize: 'inherit', lineHeight: 'inherit' }}>{children}</Text>,
          ul: ({ children }) => <ul className="unorderedList sm my-sm">{children}</ul>,
          ol: ({ children }) => <ol className="orderedList sm my-sm">{children}</ol>,
          li: ({ children }) => (
            <li className="listItem">
              <Text className="" as="span">{children}</Text>
            </li>
          ),
          // i: ({ children }) => <Text as={"i"} className="italic">{children}</Text>,
          a: ({ children, href }) => (
            <Button href={href} type="text" textColor={`text-${color || 'bright-red'} inline text-md!`}>
              {children}
            </Button>
          ),
          em: ({ children }) => <Text as={"i"} className="italic font-modern-era-italic! inherit-all">{children}</Text>,
          u: ({ children }) => <Text as={"u"} className="underline inherit-all">{children}</Text>,
          img: ({ src, alt }) => {
            if (!src) return <></>;
            return <img src={src} alt={alt} className="max-w-full my-sm" />;
          },
          table: ({ children }) => <table className="w-full border border-gray-300 text-sm mb-10">{children}</table>,
          th: ({ children }) => <th className="border border-gray-300 px-4 py-3 text-left">{children}</th>,
          ...components,
          td: ({ children }) => <td className="border border-gray-300 px-4 py-4 align-top">{children}</td>,
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>

  );
};

export default memo(BodyMarkdown);
