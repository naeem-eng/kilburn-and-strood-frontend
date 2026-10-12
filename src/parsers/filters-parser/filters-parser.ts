

const keyMapper = {
    roles: "Role",
    expertises: "Expertise",
    sectors: "Sectors",
    services: "Services",
    offices: "Office",
    article_types: "Type of insight",
    event_types: "Event Type"
} as any;

export const keyMapperReverse = {
    "Role": "roles",
    "Expertise": "expertises",
    "Sectors": "sectors",
    "Services": "services",
    "Office": "offices",
    "Type of insight": "article_types",
    "Event Type": "event_types"
} as any;

const filtersParser = (todos: any) => {

    const parsedTodos = [] as any;

    Object.keys(todos).map((key: any) => {
        const value = todos[key];
        if(value.length) {
            parsedTodos.push({
                title: keyMapper[key] || key,
                items: value?.map((todo: any) => {
                    return {
                        title: todo?.title || todo?.name || null
                    }
                })
            })
        };
    });

    return parsedTodos;
}

export default filtersParser;