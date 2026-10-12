import { strapiFetch } from "@/requests/lib/strapi";
import { NextRequest, NextResponse } from "next/server";


const buildFilters = (sectors: string[], roles: string[], services: string[], offices: string[], expertise: string[], search: string | null) => {
  const filters: any = {};
  const andConditions: any[] = [];

  if (search) {
    andConditions.push({ name: { $containsi: search } });
  }

  if (roles.length > 0) {
    andConditions.push({ people_roles: { title: { $in: roles } } });
  }

  if (expertise.length > 0) {
    andConditions.push({ expertise: { title: { $in: expertise } } });
  }

  if (sectors.length > 0) {
    andConditions.push({ sector: { title: { $in: sectors } } });
  }

  if (services.length > 0) {
    andConditions.push({
      $or: [
        { services: { name:  { $in: services } } },
        { services: { title: { $in: services } } },
      ]
    });
  }

  if (offices.length > 0) {
    andConditions.push({
      $or: [
        { office: { name:  { $in: offices } } },
        { office: { title: { $in: offices } } },
      ]
    });
  }

  if (andConditions.length > 0) {
    filters.$and = andConditions;
  }

  return filters;
};


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
 

  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");

  const sectors = searchParams.getAll("sectors").length 
    ? searchParams.getAll("sectors") 
    : [...searchParams.entries()]
        .filter(([key]) => key.startsWith("sectors["))
        .map(([, value]) => value);

  const expertise = searchParams.getAll("expertises").length 
    ? searchParams.getAll("expertises") 
    : [...searchParams.entries()]
        .filter(([key]) => key.startsWith("expertises["))
        .map(([, value]) => value);

        // //console.log({sectors})

  const roles = searchParams.getAll("roles").length
    ? searchParams.getAll("roles")
    : [...searchParams.entries()]
        .filter(([key]) => key.startsWith("roles["))
        .map(([, value]) => value);


  const offices = searchParams.getAll("offices").length
    ? searchParams.getAll("offices")
    : [...searchParams.entries()]
        .filter(([key]) => key.startsWith("offices["))
        .map(([, value]) => value);


  const services = searchParams.getAll("services").length
    ? searchParams.getAll("services")
    : [...searchParams.entries()]
        .filter(([key]) => key.startsWith("services["))
        .map(([, value]) => value);


  const filters: any = buildFilters(sectors, roles, services, offices, expertise, search);

  // //console.log(JSON.stringify(filters))
  const data = await strapiFetch("/api/peoples", {
    ...(Object.keys(filters).length ? { filters } : {}),
    populate: "*",
    sort: ["people_roles.sort_order:asc"],
    pagination: {
      page: Number(page),
      pageSize: Number(pageSize),
    },
  });

  // // //console.log(data)

  return NextResponse.json({
    data: data?.data,
    pagination: data?.meta?.pagination,  // { page, pageSize, pageCount, total }
  });

}