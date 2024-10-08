export async function downloadVideo(url: string) {
  const data = await fetch(`${import.meta.env.VITE_API_URL}/video?url=${url}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': import.meta.env.VITE_YT_COOKIE,
      'id': import.meta.env.VITE_YT_ID_TOKEN
    }
  })
    .then(d => d.blob())

  return data;
}
