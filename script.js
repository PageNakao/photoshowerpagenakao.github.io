// Google Photos APIのクライアントIDとクライアントシークレット
const CLIENT_ID = "666930798185-ruo9o41icdghbp1hcf6rlt0rrianlj23.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
// リダイレクトURI（Google API Consoleで設定したものと一致させる）
const REDIRECT_URI = "YOUR_REDIRECT_URI";

// 認証用URL
const AUTH_URL = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/photoslibrary.readonly`;

// フォトシャワーの要素
const slideshowElement = document.getElementById("slideshow");

// Google Photos APIの初期化と認証
function init() {
  gapi.load("client:auth2", () => {
    gapi.client.init({
      clientId: CLIENT_ID,
      discoveryDocs: ["https://photoslibrary.googleapis.com/$discovery/rest?version=v1"],
      scope: "https://www.googleapis.com/auth/photoslibrary.readonly",
    }).then(() => {
      // 認証状態を確認
      if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
        // 未認証なら認証ページにリダイレクト
        window.location.href = AUTH_URL;
      } else {
        // 認証済みなら写真の取得を開始
        fetchPhotos();
      }
    });
  });
}

// 写真を取得してフォトシャワーに追加
function fetchPhotos() {
  gapi.client.photoslibrary.albums.list({
    pageSize: 50,
  }).then((response) => {
    const albums = response.result.albums;
    albums.forEach((album) => {
      gapi.client.photoslibrary.mediaItems.search({
        albumId: album.id,
        pageSize: 10,
      }).then((response) => {
        const mediaItems = response.result.mediaItems;
        mediaItems.forEach((mediaItem) => {
          const imgElement = document.createElement("img");
          imgElement.src = mediaItem.baseUrl;
          slideshowElement.appendChild(imgElement);
        });
      });
    });
  });
}

// ページ読み込み時に初期化を行う
window.onload = init;
