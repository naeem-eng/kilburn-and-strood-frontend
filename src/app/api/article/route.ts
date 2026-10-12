import { strapiFetch } from "@/requests/lib/strapi";
import { NextRequest, NextResponse } from "next/server";


const buildFilters = (sectors: string[], article_types: string[], services: string[], search: string | null) => {
  const filters: any = {};
  const orConditions: any[] = [];

  if (search) {
    filters.title = { $containsi: search };
  }

  if (article_types.length > 0) {
    orConditions.push({ article_types: { title: { $in: article_types } } });
  }

  if (sectors.length > 0) {
    orConditions.push({ sectors: { title: { $in: sectors } } });
  }

  if (services.length > 0) {
    orConditions.push({ services: { name: { $in: services } } });
    orConditions.push({ services: { title: { $in: services } } });
  }

  

  if (orConditions.length > 0) {
    filters.$or = orConditions;
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

  const article_types = searchParams.getAll("article_types").length
    ? searchParams.getAll("article_types")
    : [...searchParams.entries()]
        .filter(([key]) => key.startsWith("article_types["))
        .map(([, value]) => value);




  const services = searchParams.getAll("services").length
    ? searchParams.getAll("services")
    : [...searchParams.entries()]
        .filter(([key]) => key.startsWith("services["))
        .map(([, value]) => value);


  const filters: any = buildFilters(sectors, article_types, services, search);



  const data = await strapiFetch("/api/articles", {
    ...(Object.keys(filters).length ? { filters } : {}),
    populate: "*",
    sort: ["publish_date:desc"],
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