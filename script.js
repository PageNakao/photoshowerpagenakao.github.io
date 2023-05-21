// CLIENT_ID、CLIENT_SECRET、REDIRECT_URI を差し込む
const CLIENT_ID = "666930798185-jvgutuj2ikd8t0dpkee0b3u2565acv8h.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://pagenakao.github.io/photoshowerpagenakao.github.io/";

// スライドショーコンテナの要素を取得
const slideshowElement = document.getElementById("slideshow");

// スライドショーの画像URLの配列
const photoUrls = [];

// 写真をアップロードする関数
function uploadPhoto() {
  const photoInput = document.getElementById("photoInput");
  const file = photoInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const photoUrl = event.target.result;
      photoUrls.push(photoUrl);
      showSlideshow();
    };
    reader.readAsDataURL(file);
  }
}

// スライドショーを表示する関数
function showSlideshow() {
  // スライドショーのHTMLを生成
  const slideshowHtml = photoUrls.map(photoUrl => `<img src="${photoUrl}">`).join("");
  // スライドショーコンテナにHTMLを設定
  slideshowElement.innerHTML = slideshowHtml;
}
