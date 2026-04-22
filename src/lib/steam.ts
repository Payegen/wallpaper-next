const STEAM_API_KEY = process.env.STEAM_WEB_API_KEY;

export async function getSteamWorkshopDetails(publishedFileId: string) {
  if (!STEAM_API_KEY) {
    throw new Error("Missing STEAM_WEB_API_KEY");
  }

  // Steam 创意工坊查询接口 (POST请求)
  const apiUrl = "https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/";
  
  const params = new URLSearchParams();
  params.append("itemcount", "1");
  params.append("publishedfileids[0]", publishedFileId);

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Steam API Error: ${res.statusText}`);
  }

  const data = await res.json();
  console.log('steam data respones', data);
  
  const details = data.response?.publishedfiledetails?.[0];

  if (!details) {
    throw new Error("No details found for this ID");
  }

  return details;
}

// 辅助函数：从 URL 中提取 ID
export function extractSteamId(url: string): string | null {
  // 支持格式: https://steamcommunity.com/sharedfiles/filedetails/?id=3361033230
  const regex = /[?&]id=(\d+)/;
 
  const match = url.match(regex);
  console.log(match,url,'data');
  
  return match ? match[1] : null;
}