var mapContainer = document.createElement('div');
mapContainer.id = 'map';
document.body.appendChild(mapContainer);

//banner
var banner = document.createElement('div');
banner.id = 'banner';
banner.className = 'hidden';
banner.innerHTML = '<p id="banner-content"></p>';
document.body.appendChild(banner);

//leafret
var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
document.head.appendChild(link);

//map.css
var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'map.css';
document.head.appendChild(link);

//leafret
var script = document.createElement('script');
script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
script.onload = function() {
  
  var map = L.map('map').setView([35.682839, 139.759455], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  //ここでマーカを追加するよ。
  var markers = [
    {
      position: [35.71366835962503, 139.77613130188482],
      content: 'ここ上野駅ね',
      content_detail: 'こんな感じで作ってみたよ。',
    },
    {
      position: [35.612805966761215, 140.11372769961613],
      content: '千葉駅だ',
      content_detail: '千葉駅（ちばえき）は、千葉県千葉市中央区新千葉一丁目にある、東日本旅客鉄道（JR東日本）・千葉都市モノレールの駅である。隣接する京成電鉄の京成千葉駅は、乗換駅となっている。(wikipedia)より引用',
    }
  ];

  markers.forEach(marker => {
    const mapMarker = L.marker(marker.position).addTo(map)
      .bindPopup(marker.content);

    mapMarker.on('click', function() {
      showBanner(marker.content_detail); // バナーを表示する
    });
  });
};
document.head.appendChild(script);

// バナー表示関数
function showBanner(content_detail) {
  const banner = document.getElementById('banner');
  const bannerContent = document.getElementById('banner-content');

  bannerContent.textContent = content_detail; // バナーに内容をセット
  banner.classList.remove('hidden');
  banner.classList.add('visible');

  // 一定時間後に自動で隠す　これいらなくない？
  setTimeout(() => {
    banner.classList.remove('visible');
    banner.classList.add('hidden');
  }, 7000); // 7秒後に戻る
}