import { AxiosError } from "axios";
import { errorCode } from "../../utils/errorCodes";
import { apiBase as api } from "../apis";
import { Resources } from "../../types/types";

interface IResources {
  querys?: {
    code?: string;
    max_level?: number;
    min_level?: number;
    page?: number;
  };
}

type ApiResponse = {
  data?: Resources;
  status: number;
};

export default async function resources({
  querys = {},
}: IResources): Promise<ApiResponse> {
  const params = new URLSearchParams();
  const { code, max_level, min_level, page = 1 } = querys;

  if (code) params.append("drop", code);
  if (max_level) params.append("max_level", String(min_level));
  if (min_level) params.append("min_level", String(min_level));
  if (page) params.append("page", String(page));

  const url = `/resources?${params.toString()}`;

  try {
    const response = await api.get<Resources>(url);

    return { data: response.data, status: response.status };
  } catch (err: any) {
    if (err instanceof AxiosError) {
      const statusCode = err.response?.status;
      const errorKey = statusCode ? errorCode(statusCode) : "Unknown Error";

      console.error(`Error: Resources API ${errorKey}` + " " + statusCode);
    } else {
      console.error("Unexpected Error:", err);
    }

    return { status: err.status };
  }
}
