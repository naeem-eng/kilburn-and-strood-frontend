"use client";

import { memo, useEffect } from "react";
import { LayoutContainerProps } from "./layout-container.types";

const LayoutContainer: React.FC<LayoutContainerProps> = (props) => {
      
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            if(width > 768) {
              if(width < height) {
                  document.body.classList.add("tablet");
              } else {
                if(width - height < 700) {
                  document.body.classList.add("boxTablet");
                } else {
                  document.body.classList.remove("tablet");
                  document.body.classList.remove("boxTablet");
                }
              }
            } else {
              document.body.classList.remove("tablet");
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    },[]);

    useEffect(() => {
      const lock = () => {
        if (window.innerWidth < window.innerHeight) {
          document.body.classList.add("force-portrait");
        } else {
          document.body.classList.remove("force-portrait");
        }
      };

      lock();
      window.addEventListener("resize", lock);
      return () => window.removeEventListener("resize", lock);
    }, []);

    return (
      <div className="portrait-wrapper" id="lockScrollbar">{props.children}</div>
    );
};

export default memo(LayoutContainer);
