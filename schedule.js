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
  })
  .catch(error => {
    console.error('Error loading header:', error);
  });

// タブ切り替えの関数
function openTab(event, tabId) {
  // すべてのタブ内容を非表示にする
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(content => {
    content.classList.remove('active'); // activeクラスを削除
    content.style.display = 'none';    // 表示を非表示にする
  });

  // すべてのタブリンクを非アクティブにする
  const tabLinks = document.querySelectorAll('.tab-link');
  tabLinks.forEach(link => link.classList.remove('active'));

  // クリックされたタブ内容を表示
  const targetContent = document.getElementById(tabId);
  targetContent.classList.add('active'); // activeクラスを追加
  targetContent.style.display = 'block'; // 表示をブロックにする

  // クリックされたタブリンクをアクティブにする
  if (event) {
  event.currentTarget.classList.add('active');
  }
}

// **初期状態で1日目を表示**
document.addEventListener("DOMContentLoaded", function () {
  openTab(null, 'day1'); // 1日目を表示
  document.querySelector('.tab-link').classList.add('active'); // 1日目のタブをアクティブにする
});
