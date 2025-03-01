import { apiMap as api } from "../apis";

interface IMap {
  querys?: {
    content_code?: string;
    content_type?:
      | "monster"
      | "resource"
      | "workshop"
      | "bank"
      | "grand_exchange"
      | "tasks_master"
      | "npc";
    page?: number;
    size?: number;
  };
}

type Data = {
  code: string;
  level: number;
  type: "monsters" | "items";
  min_quantity: number;
  max_quantity: number;
  skill: string;
  rewards: {
    items: {
      code: string;
      quantity: number;
    }[];
    gold: number;
  };
  total: number;
  page: number;
  size: number;
  pages: number;
}[];

type ApiResponse = Data | undefined;

export default async function map({ querys = {} }: IMap): Promise<ApiResponse> {
  const params = new URLSearchParams();
  const { content_code, content_type, page = 1, size = 50 } = querys;

  if (content_code) params.append("content_code", content_code);
  if (content_type) params.append("content_type", content_type);
  if (page) params.append("page", String(page));
  if (size) params.append("size", String(size));

  const url = `/maps?${params.toString()}`;

  try {
    const response = await api.get<Data>(url);

    return response.data;
  } catch (err: any) {
    console.error("Map API Error:", err.response?.status);
    return;
  }
}
