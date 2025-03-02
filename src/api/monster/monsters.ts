import { AxiosError } from "axios";
import { errorCode } from "../../utils/errorCodes";
import { apiMap as api } from "../apis";
import { Monsters } from "../../types/types";

interface IMonster {
  querys?: {
    drop?: string;
    max_level?: number;
    min_level?: number;
    page?: number;
  };
}

type ApiResponse = {
  data?: Monsters;
  status: number;
};

export default async function monsters({
  querys = {},
}: IMonster): Promise<ApiResponse> {
  const params = new URLSearchParams();
  const { drop, max_level, min_level, page = 1 } = querys;

  if (drop) params.append("drop", drop);
  if (max_level) params.append("max_level", String(min_level));
  if (min_level) params.append("min_level", String(min_level));
  if (page) params.append("page", String(page));

  const url = `/monsters?${params.toString()}`;

  try {
    const response = await api.get<Monsters>(url);

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
