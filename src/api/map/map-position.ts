import { apiMap as api } from "../apis";

export default async function mapPosition(xAxis: number, yAxis: number) {
  const body = { x: xAxis, y: yAxis };

  try {
    const { data } = await api.post("/map", body);

    return { data: data, cooldown: data.cooldown };
  } catch (err: any) {
    console.log(err.status);
  }
}
