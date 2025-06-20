const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: 'https://CapsuleMarket/tonconnect-manifest.json'
});
tonConnectUI.uiOptions = {
  twaReturnUrl: 'https://t.me/CapsuleMarket/CapMarket'
};
window.tonConnectUI = tonConnectUI;

document.addEventListener('DOMContentLoaded', function() {
  const tonConnectBtn = document.getElementById('ton-connect-btn');
  const walletStatusText = document.querySelector('.wallet-status-text');
  let tonWalletAddress = null;

  if (tonConnectBtn && window.tonConnectUI) {
    tonConnectBtn.addEventListener('click', function() {
      window.tonConnectUI.openModal();
    });

    window.tonConnectUI.onStatusChange(wallet => {
      if (wallet && wallet.account) {
        tonWalletAddress = wallet.account.address;
        walletStatusText.textContent = 'Connected: ' + tonWalletAddress.slice(0, 6) + '...' + tonWalletAddress.slice(-4);
        tonConnectBtn.textContent = 'Connected';
        tonConnectBtn.disabled = true;
      } else {
        walletStatusText.textContent = 'Wallet not connected';
        tonConnectBtn.textContent = 'Connect';
        tonConnectBtn.disabled = false;
      }
    });
  }
});
