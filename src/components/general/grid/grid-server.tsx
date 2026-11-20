import Grid from "./grid";
import { GridProps } from "./grid.types";
import { queryGrid } from "@/requests/grid-requests/grid-queries";

// Server wrapper: fetches the grid's first page while the page is rendered, so search engines (and visitors before
// JavaScript loads) get the cards in the HTML. Load more, search and filters then run in the browser as before.
const GridServer = async (props: GridProps) => {
    if (!props.renders?.length) return null;
    const params = new URLSearchParams({
        renders: props.renders.join(","),
        enums: (props.filterEnums || []).join(","),
    });
    const initialData = await queryGrid(params).catch(() => null);
    return <Grid {...props} initialData={initialData} />;
};

export default GridServer;
