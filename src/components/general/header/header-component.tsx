import { CustomHeaderComponent } from "./header-components";
import { memo } from "react";


const HeaderComponent = async (props: any) => {
    
    const {header} = props;
    if(!header) return <></>;

    return (
        <>
            <CustomHeaderComponent menu={header.menu} logo={header.logo} />
        </>
    )
}

export default memo(HeaderComponent);