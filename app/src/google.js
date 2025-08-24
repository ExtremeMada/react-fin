import { gapi } from "gapi-script";

const CLIENT_ID = process.env.REACT_CLIENT_ID;
const SHEET_ID = process.env.REACT_SHEET_ID;
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

// // Fetch Google Sheets values
export async function sheetsValuesGet(range) {
  if (!accessToken) throw new Error("Not signed in");

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const data = await res.json();
  return data.values || [];
}


const DISCOVERY_DOCS = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
];



let tokenClient;
let accessToken = null;
let expiresAtMs = null;
let initPromise;
const listeners = new Set();

/**
 * Load GIS script
 */
function loadGisScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) return resolve();
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Failed to load Google API script"));
    document.body.appendChild(script);
  });
}

/**
 * Init GIS client
 */
export async function initClient() {
  if (!initPromise) {
    initPromise = loadGisScript().then(() => {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: () => {}, // replaced dynamically
      });

      // restore from localStorage
      const saved = JSON.parse(localStorage.getItem("googleAuth") || "{}");
      if (saved?.accessToken && saved?.expiresAtMs > Date.now()) {
        accessToken = saved.accessToken;
        expiresAtMs = saved.expiresAtMs;
      }
    });
  }
  return initPromise;
}

function saveToken() {
  localStorage.setItem(
    "googleAuth",
    JSON.stringify({ accessToken, expiresAtMs })
  );
}

function emitAuthChange() {
  listeners.forEach((cb) => cb(isSignedIn()));
}

function hasValidToken() {
  return accessToken && expiresAtMs && Date.now() < expiresAtMs;
}
async function ensureAccessToken(prompt = "consent") {
  await initClient();

  return new Promise((resolve, reject) => {
    tokenClient.callback = (resp) => {
      if (resp && resp.access_token) {
        accessToken = resp.access_token;
        const expiresInMs = (resp.expires_in || 3600) * 1000;
        expiresAtMs = Date.now() + expiresInMs;
        saveToken();
        emitAuthChange();
        resolve(accessToken);
      } else {
        console.error("Token error:", resp);
        reject(resp?.error || new Error("Token request failed"));
      }
    };

    try {
      tokenClient.requestAccessToken({ prompt }); // "consent" always shows chooser/consent
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Explicit Sign-in: always interactive first time
 */
export async function signIn() {
  // Always interactive on purpose for debugging
  return await ensureAccessToken("consent");
}
/**
 * Sign out
 */
export function signOut() {
  accessToken = null;
  expiresAtMs = null;
  localStorage.removeItem("googleAuth");
  emitAuthChange();
}

export function isSignedIn() {
  return hasValidToken();
}

export function onSignInStatusChange(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export async function getAccessToken() {
  if (hasValidToken()) return accessToken;
  return await ensureAccessToken("none");
}