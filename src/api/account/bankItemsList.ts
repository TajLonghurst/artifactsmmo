import { AxiosError } from "axios";
import { errorCode } from "../../utils/errorCodes";
import { apiBase as api } from "../apis";

type Data = {
  data: {
    code: string;
    quantity: number;
  }[];
  total: number;
  page: number;
  size: number;
  pages: number;
};

interface IItems {
  querys?: {
    content_code?: string;
    page?: number;
    size?: number;
  };
}

type ApiResponse = {
  data?: Data;
  status: number;
};

export default async function bankItemsList({
  querys = {},
}: IItems): Promise<ApiResponse> {
  const { content_code, page = 1, size = 50 } = querys;

  const params = new URLSearchParams();

  if (content_code) params.append("content_code", content_code);
  if (page) params.append("page", String(page));
  if (size) params.append("size", String(size));

  const url = `/bank/items?${params.toString()}`;

  try {
    const response = await api.get<Data>(url);

    return { data: response.data, status: response.status };
  } catch (err: any) {
    if (err instanceof AxiosError) {
      const statusCode = err.response?.status;
      const errorKey = statusCode ? errorCode(statusCode) : "Unknown Error";

      console.error(`Error: BankItems API ${errorKey}` + " " + statusCode);
    } else {
      console.error("Unexpected Error:", err);
    }

    return { status: err.status };
  }
}
