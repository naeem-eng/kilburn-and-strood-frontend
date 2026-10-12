import { strapiFetch } from "@/requests/lib/strapi";
import { NextRequest, NextResponse } from "next/server";


const buildFilters = (sectors: string[], event_types: string[], services: string[], search: string | null) => {
  const filters: any = {};
  const orConditions: any[] = [];

  if (search) {
    filters.title = { $containsi: search };
  }

  if (event_types.length > 0) {
    orConditions.push({ event_types: { title: { $in: event_types } } });
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

  const event_types = searchParams.getAll("event_types").length
    ? searchParams.getAll("event_types")
    : [...searchParams.entries()]
        .filter(([key]) => key.startsWith("event_types["))
        .map(([, value]) => value);




  const services = searchParams.getAll("services").length
    ? searchParams.getAll("services")
    : [...searchParams.entries()]
        .filter(([key]) => key.startsWith("services["))
        .map(([, value]) => value);


  const filters: any = buildFilters(sectors, event_types, services, search);



  const now = new Date().toISOString();

  // Upcoming events (event_date > now)
  const upcomingData = await strapiFetch("/api/events", {
    filters: {
      ...filters,
      event_date: { $gt: now },
    },
    populate: {
      event_types: { populate: "*" },
      featured_image: { populate: "*" },
      cta: { populate: "*" },
    },
    sort: ["event_date:asc"], // ascending for upcoming
    pagination: {
      page: 1,
      pageSize: 5,
    },
  });

  // Past events (event_date <= now)
  const pastData = await strapiFetch("/api/events", {
    filters: {
      ...filters,
      event_date: { $lte: now },
    },
    populate: {
      event_types: { populate: "*" },
      featured_image: { populate: "*" },
      cta: { populate: "*" },
    },
    sort: ["event_date:desc"], // descending for past
    pagination: {
      page: Number(page),
      pageSize: Number(pageSize),
    },
  });

  // // //console.log(data)

  return NextResponse.json({
    upcoming: {
      data: upcomingData?.data,
      pagination: upcomingData?.meta?.pagination,
    },
    past: {
      data: pastData?.data,
      pagination: pastData?.meta?.pagination,
    },
  });


}