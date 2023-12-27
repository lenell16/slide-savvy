import { google, Auth } from "googleapis";
import { isNotNil } from "ramda";

let auth: Auth.OAuth2Client | null = null;

export function createAuthClient({
  access_token,
  refresh_token,
}: {
  access_token?: string | null;
  refresh_token?: string | null;
}) {
  if (auth) {
    if (
      (isNotNil(refresh_token) &&
        auth.credentials.refresh_token !== refresh_token) ||
      (isNotNil(access_token) && auth.credentials.access_token !== access_token)
    ) {
      auth.setCredentials({ access_token, refresh_token });
    }
    return auth;
  }
  if (!refresh_token || !access_token) {
    return null;
  }
  auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token, refresh_token });
  return auth;
}

export async function getPresentation(
  auth: Auth.OAuth2Client,
  presentationId: string
) {
  const slides = google.slides({ version: "v1", auth });
  const { data } = await slides.presentations.get({
    presentationId,
  });
  return data;
}

export async function getPresentations(auth: Auth.OAuth2Client) {
  const drive = google.drive({ version: "v3", auth });
  const { data } = await drive.files.list({
    q: "mimeType='application/vnd.google-apps.presentation'",
    fields:
      "files(id, name, thumbnailLink, lastModifyingUser, viewedByMeTime, shared)",
  });

  return data.files ?? [];
}
