// CLIENT_ID、CLIENT_SECRET、REDIRECT_URI を差し込む
const CLIENT_ID = "666930798185-jvgutuj2ikd8t0dpkee0b3u2565acv8h.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://pagenakao.github.io/photoshowerpagenakao.github.io/";

// スライドショーコンテナの要素を取得
const slideshowElement = document.getElementById("slideshow");

// スライドショーの画像URLの配列
const photoUrls = [];

// GoogleフォトAPIのURL
const googlePhotosApiUrl = "https://photoslibrary.googleapis.com/v1";

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

  fetch(`${googlePhotosApiUrl}/uploads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/octet-stream",
      "X-Goog-Upload-File-Name": "photo.jpg",
      "X-Goog-Upload-Protocol": "raw",
    },
    body: photoDataUrl,
  })
    .then(response => response.json())
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

  fetch(`${googlePhotosApiUrl}/mediaItems:batchCreate`, {
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
