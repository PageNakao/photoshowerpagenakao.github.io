// CLIENT_ID、CLIENT_SECRET、REDIRECT_URI を差し込む
const CLIENT_ID = "666930798185-jvgutuj2ikd8t0dpkee0b3u2565acv8h.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://pagenakao.github.io/photoshowerpagenakao.github.io/";

// 認証URLを生成する関数
function generateAuthUrl() {
  const scopes = ["https://www.googleapis.com/auth/photoslibrary"];
  const params = {
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: scopes.join(" "),
  };
  const authUrl = `https://accounts.google.com/o/oauth2/auth?${encodeQueryString(params)}`;
  return authUrl;
}

// クエリ文字列をエンコードする関数
function encodeQueryString(params) {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
}

// 認証コードからアクセストークンを取得する関数
function getAccessToken(code) {
  const params = {
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  };

  return fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: encodeQueryString(params),
  })
    .then(response => response.json())
    .then(data => data.access_token)
    .catch(error => {
      console.error("Error getting access token:", error);
    });
}

// 認証コードの取得とアクセストークンの取得を行う関数
function handleAuthCode(code) {
  getAccessToken(code)
    .then(accessToken => {
      saveTokenToLocalStorage(accessToken); // アクセストークンを保存する処理
      // ここから写真のアップロードやスライドショー表示などの処理を続ける
    })
    .catch(error => {
      console.error("Error handling auth code:", error);
    });
}

// スライドショーコンテナの要素を取得
const slideshowElement = document.getElementById("slideshow");

// スライドショーの画像URLの配列
const photoUrls = [];

// 写真をアップロードする関数
function uploadPhoto() {
  const photoInput = document.getElementById("photoInput");
  const files = photoInput.files;

  if (files.length > 0) {
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const photoDataUrl = event.target.result;
        uploadPhotoToGooglePhotos(photoDataUrl);
      };
      reader.readAsDataURL(file);
    }
  }
}

// Googleフォトに写真をアップロードする関数
function uploadPhotoToGooglePhotos(photoDataUrl) {
  const token = getTokenFromLocalStorage(); // ローカルストレージからトークンを取得する処理を追加してください

  fetch("https://photoslibrary.googleapis.com/v1/uploads", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/octet-stream",
      "X-Goog-Upload-File-Name": "photo.jpg",
      "X-Goog-Upload-Protocol": "raw",
    },
    body: photoDataUrl,
  })
    .then(response => response.text())
    .then(uploadToken => {
      createMediaItem(uploadToken);
    })
    .catch(error => {
      console.error("Error uploading photo:", error);
    });
}

// アップロードした写真をGoogleフォトに登録する関数
function createMediaItem(uploadToken) {
  const token = getTokenFromLocalStorage(); // ローカルストレージからトークンを取得する処理を追加してください

  const requestBody = {
    newMediaItems: [
      {
        simpleMediaItem: {
          uploadToken: uploadToken,
        },
      },
    ],
  };

  fetch("https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then(response => response.json())
    .then(data => {
      const photoUrl = data.newMediaItemResults[0].mediaItem.productUrl;
      photoUrls.push(photoUrl);
      showSlideshow();
    })
    .catch(error => {
      console.error("Error creating media item:", error);
    });
}

// スライドショーを表示する関数
function showSlideshow() {
  // スライドショーのHTMLを生成
  const slideshowHtml = photoUrls.map(photoUrl => `<img src="${photoUrl}">`).join("");
  // スライドショーコンテナにHTMLを設定
  slideshowElement.innerHTML = slideshowHtml;
}

// ローカルストレージにトークンを保存する関数
function saveTokenToLocalStorage(token) {
  localStorage.setItem("accessToken", token);
}

// ローカルストレージからトークンを取得する関数
function getTokenFromLocalStorage() {
  return localStorage.getItem("accessToken");
}
