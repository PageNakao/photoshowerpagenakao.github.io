// スライドショーコンテナの要素を取得
const slideshowElement = document.getElementById("slideshow");

// 写真をランダムにシャッフルする関数
function shufflePhotos() {
  for (let i = photoUrls.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [photoUrls[i], photoUrls[j]] = [photoUrls[j], photoUrls[i]];
  }
}

// スライドショーを表示する関数
function showSlideshow() {
  // 写真の順番をランダムにシャッフルする
  shufflePhotos();

  // スライドショーのHTMLを生成
  const slideshowHtml = photoUrls.map(photoUrl => `<img src="${photoUrl}">`).join("");
  // スライドショーコンテナにHTMLを設定
  slideshowElement.innerHTML = slideshowHtml;
}

// 初回のスライドショー表示を実行
showSlideshow();
