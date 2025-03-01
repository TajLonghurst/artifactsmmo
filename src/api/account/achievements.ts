import { apiAccount as api } from "../apis";

export default async function achievements() {
  try {
    const response = await api.get("/achievements");

    return { data: response.data, stats: response.status };
  } catch (err: any) {
    return err.response.status;
  }
}
