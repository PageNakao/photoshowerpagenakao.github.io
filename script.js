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
        const photoUrl = event.target.result;
        photoUrls.push(photoUrl);
        showSlideshow();
      };
      reader.readAsDataURL(file);
    }
  }
}

// スライドショーを表示する関数
function showSlideshow() {
  // スライドショーのHTMLを生成
  const slideshowHtml = photoUrls.map(photoUrl => `<img src="${photoUrl}">`).join("");
  // スライドショーコンテナにHTMLを設定
  slideshowElement.innerHTML = slideshowHtml;
}
