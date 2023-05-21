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
