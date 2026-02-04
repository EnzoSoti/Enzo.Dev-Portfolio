// QR Code functionality
const qrCodeBtn = document.getElementById('qrCodeBtn');
const qrModal = document.getElementById('qrModal');
const closeQrModal = document.getElementById('closeQrModal');
const qrcodeDiv = document.getElementById('qrcode');
const downloadQr = document.getElementById('downloadQr');

let qrCodeGenerated = false;

qrCodeBtn.addEventListener('click', () => {
    qrModal.classList.remove('hidden');
    qrModal.classList.add('flex');
    
    if (!qrCodeGenerated) {
        // Clear any existing QR code
        qrcodeDiv.innerHTML = '';
        
        // Generate QR code with production URL
        new QRCode(qrcodeDiv, {
            text: 'https://enzo-dev-portfolio.vercel.app/',
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
        
        qrCodeGenerated = true;
    }
});

closeQrModal.addEventListener('click', () => {
    qrModal.classList.add('hidden');
    qrModal.classList.remove('flex');
});

qrModal.addEventListener('click', (e) => {
    if (e.target === qrModal) {
        qrModal.classList.add('hidden');
        qrModal.classList.remove('flex');
    }
});

downloadQr.addEventListener('click', () => {
    const canvas = qrcodeDiv.querySelector('canvas');
    if (canvas) {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'enzo-dev-qr-code.png';
        link.href = url;
        link.click();
    }
});
