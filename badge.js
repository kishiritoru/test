function getRandomBadge() {
    const badgeIcons = [
      'images/badges/badge1.svg',
      'images/badges/badge2.svg',
      'images/badges/badge3.svg',
      'images/badges/badge4.svg'
    ];
    const randomIndex = Math.floor(Math.random() * badgeIcons.length);
    return badgeIcons[randomIndex];
  }
  
  // バッジを保存
  function saveBadge(badge) {
    const badges = JSON.parse(localStorage.getItem('badges')) || [];
    badges.push(badge);
    localStorage.setItem('badges', JSON.stringify(badges));
  }
  
  // バッジを表示
  function displayBadges() {
    const badgeContainer = document.getElementById('badge-container');
    badgeContainer.innerHTML = '';
  
    const badges = JSON.parse(localStorage.getItem('badges')) || [];
  
    if (badges.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'チェックインが完了するとバッジがもらえます';
      emptyMessage.style.color = '#aaa';
      emptyMessage.style.textAlign = 'center';
      badgeContainer.appendChild(emptyMessage);
    } else {
      badges.forEach(({ placeName, badgeIcon }) => {
        const badgeElement = document.createElement('div');
        badgeElement.className = 'badge';
        badgeElement.innerHTML = `<img src="${badgeIcon}" alt="バッジ" class="badge-image">`;
        badgeContainer.appendChild(badgeElement);
      });
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    displayBadges();
  });
  
  function handleCheckIn(placeName, encodedSuggestion) {
    const suggestion = JSON.parse(decodeURIComponent(encodedSuggestion));
    console.log('Check-in:', placeName, suggestion);
  
    const overlay = document.createElement('div');
    overlay.className = 'circle-overlay';
    document.body.appendChild(overlay);
  
    const mapCenter = document.getElementById('map').getBoundingClientRect();
    const circleX = mapCenter.left + mapCenter.width / 2;
    const circleY = mapCenter.top + mapCenter.height / 2;
  
    overlay.style.left = `${circleX}px`;
    overlay.style.top = `${circleY}px`;
  
    const messageBox = document.createElement('div');
    messageBox.className = 'message-box';
  
    const suggestionsHTML = suggestion
      .map((item, index) => `
        <div>
          <label>
            <input type="checkbox" class="suggestion-checkbox" data-index="${index}">
            ${item}
          </label>
        </div>
      `)
      .join('');
  
    messageBox.innerHTML = `
      <h2>${placeName} で防災チェックイン</h2>
      ${suggestionsHTML}
      <button onclick="closeCheckIn()">閉じる</button>
      <button id="completeButton" style="display: none;" onclick="completeCheckIn('${placeName}')">完了</button>
    `;
    document.body.appendChild(messageBox);
  
    setTimeout(() => {
      messageBox.style.display = 'block';
    }, 1000);
  
    const checkboxes = document.querySelectorAll('.suggestion-checkbox');
    const completeButton = document.getElementById('completeButton');
  
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        completeButton.style.display = allChecked ? 'inline-block' : 'none';
      });
    });
  }
  
  function closeCheckIn() {
    document.querySelector('.circle-overlay').remove();
    document.querySelector('.message-box').remove();
  }
  
  function completeCheckIn(placeName) {
    const overlay = document.querySelector('.circle-overlay');
    overlay.style.transition = 'opacity 1s ease-out';
    overlay.style.opacity = '0';
  
    setTimeout(() => {
      overlay.remove();
      document.querySelector('.message-box').remove();
  
      const randomBadge = getRandomBadge();
      saveBadge({ placeName, badgeIcon: randomBadge });
      displayBadges();
  
      alert(`おめでとうございます！「${placeName}」のバッジを獲得しました！`);
    }, 1000);
  }
  