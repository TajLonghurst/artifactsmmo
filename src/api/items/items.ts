import { AxiosError } from "axios";
import { errorCode } from "../../utils/errorCodes";
import { apiBase as api } from "../apis";
import { Resources, SearchItems } from "../../types/types";

interface IItems {
  querys?: {
    code?: string;
  };
}

type ApiResponse = {
  data?: SearchItems;
  status: number;
};

export default async function Items({
  querys = {},
}: IItems): Promise<ApiResponse> {
  const { code } = querys;

  const url = `/items/${code}`;

  try {
    const response = await api.get<SearchItems>(url);

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
