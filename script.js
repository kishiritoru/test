// header.html を動的に読み込むスクリプト
fetch('header.html')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch header.html');
    }
    return response.text();
  })
  .then(data => {
    document.getElementById('header-container').innerHTML = data;

    // メニューボタン、閉じるボタン、オーバーレイを取得
    const menuButton = document.getElementById('menu-button');
    const sideMenu = document.getElementById('side-menu');
    const closeButton = document.getElementById('close-button');
    const overlay = document.getElementById('overlay');

    if (menuButton && sideMenu && closeButton && overlay) {
      // メニューボタンを押したときの動作
      menuButton.addEventListener('click', () => {
        sideMenu.classList.add('open'); // メニューを開く
        overlay.classList.add('active'); // オーバーレイを表示
      });

      // 閉じるボタンを押したときの動作
      closeButton.addEventListener('click', () => {
        sideMenu.classList.remove('open'); // メニューを閉じる
        overlay.classList.remove('active'); // オーバーレイを非表示
      });

      // オーバーレイを押したときの動作
      overlay.addEventListener('click', () => {
        sideMenu.classList.remove('open'); // メニューを閉じる
        overlay.classList.remove('active'); // オーバーレイを非表示
      });
    }
  })
  .catch(error => {
    console.error('Error loading header:', error);
  });

// Swiper.js の初期化
document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.swiper-container', {
    loop: true, // 無限ループ
    autoplay: {
      delay: 3000, // 自動再生（3秒ごと）
    },
    pagination: {
      el: '.swiper-pagination', // ページネーション
      clickable: true, // ページネーションをクリック可能に
    },
  });
});
