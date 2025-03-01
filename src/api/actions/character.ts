import { apiActions as api } from "../apis";

export default async function character() {
  try {
    const response = await api.get("/");

    return { data: response.data.data, cooldown: response.data.data.cooldown };
  } catch (err: any) {
    console.log(err.status);
  }
}
