const API_KEY = import.meta.env.VITE_RAPID_API_KEY;
const API_HOST = "indian-railway-irctc.p.rapidapi.com";

export async function getTrainInfo(train: string) {
  const response = await fetch(
    `https://${API_HOST}/api/trains-search/v1/train/${train}?isH5=true&client=web`,
    {
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": API_HOST,
      },
    }
  );

  const data = await response.json();

  console.log("TRAIN API DATA:", data);

  return data;
}