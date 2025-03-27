document.addEventListener('DOMContentLoaded', function() {
    // Dil değişkenini en başta tanımlayalım
    let currentLanguage = localStorage.getItem('language') || 'tr';
    
    // Dosya yükleme alanı işlevselliği
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileName = document.getElementById('fileName');
    const convertBtn = document.getElementById('convertBtn');
    const fileList = document.getElementById('fileList');
    
    // Dosya yükleme alanına tıklandığında dosya seçiciyi aç
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Dosya sürükleme olayları
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('active');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('active');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('active');
        
        const files = e.dataTransfer.files;
        handleFiles(files);
    });
    
    // Dosya seçildiğinde
    fileInput.addEventListener('change', () => {
        const files = fileInput.files;
        handleFiles(files);
    });
    
    // Dosya işleme fonksiyonu
    function handleFiles(files) {
        if (files.length > 0) {
            // Dosya listesini temizle
            fileList.innerHTML = '';
            
            // Her dosya için işlem yap
            Array.from(files).forEach((file, index) => {
                // Dosya boyutu kontrolü
                const maxSize = 20 * 1024 * 1024; // 20MB
                
                if (file.size > maxSize) {
                    showNotification(
                        currentLanguage === 'tr' ? 'Dosya boyutu çok büyük' : 'File size too large',
                        currentLanguage === 'tr' ? 'Maksimum 20MB boyutunda dosya yükleyebilirsiniz.' : 'You can upload files up to 20MB.',
                        'error'
                    );
                    return;
                }
                
                // Dosya öğesi oluştur
                createFileItem(file, index);
            });
            
            // Dönüştür butonunu etkinleştir
            convertBtn.disabled = files.length === 0;
            
            // Dosya yükleme alanına başarılı sınıfı ekle
            uploadArea.classList.add('file-loaded');
        }
    }
    
    // Dosya öğesi oluşturma
    function createFileItem(file, index) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.index = index;
        
        // Dosya boyutunu formatla
        const fileSize = formatFileSize(file.size);
        
        // Dosya türüne göre ikon belirle
        const fileIcon = getFileIcon(file.type);
        
        fileItem.innerHTML = `
            <div class="file-icon">
                <i class="fas ${fileIcon}"></i>
            </div>
            <div class="file-details">
                <div class="file-name">${file.name}</div>
                <div class="file-meta">
                    <span class="file-size">${fileSize}</span>
                    <span class="file-type">${file.type || 'Bilinmeyen'}</span>
                </div>
            </div>
            <div class="file-actions">
                <button class="action-btn preview" title="${currentLanguage === 'tr' ? 'Önizle' : 'Preview'}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn remove" title="${currentLanguage === 'tr' ? 'Kaldır' : 'Remove'}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="preview-container"></div>
        `;
        
        // Dosya listesine ekle
        fileList.appendChild(fileItem);
        
        // Kaldır butonuna tıklandığında
        const removeBtn = fileItem.querySelector('.remove');
        removeBtn.addEventListener('click', () => {
            fileItem.remove();
            
            // Dosya listesi boşsa dönüştür butonunu devre dışı bırak
            if (fileList.children.length === 0) {
                convertBtn.disabled = true;
                uploadArea.classList.remove('file-loaded');
            }
        });
        
        // Önizleme butonuna tıklandığında
        const previewBtn = fileItem.querySelector('.preview');
        const previewContainer = fileItem.querySelector('.preview-container');
        
        previewBtn.addEventListener('click', () => {
            // Önizleme konteynerini aç/kapat
            previewContainer.classList.toggle('show');
            
            // Önizleme içeriği henüz oluşturulmadıysa
            if (previewContainer.innerHTML === '') {
                createPreview(file, previewContainer);
            }
        });
    }
    
    // Dosya önizleme oluşturma
    function createPreview(file, container) {
        // Dosya türüne göre önizleme oluştur
        if (file.type.startsWith('image/')) {
            // Görsel önizleme
            const reader = new FileReader();
            reader.onload = (e) => {
                container.innerHTML = `<img src="${e.target.result}" class="preview-image" alt="${file.name}">`;
            };
            reader.readAsDataURL(file);
        } else if (file.type.startsWith('audio/')) {
            // Ses önizleme
            const reader = new FileReader();
            reader.onload = (e) => {
                container.innerHTML = `<audio controls class="preview-audio"><source src="${e.target.result}" type="${file.type}"></audio>`;
            };
            reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
            // Video önizleme
            const reader = new FileReader();
            reader.onload = (e) => {
                container.innerHTML = `<video controls class="preview-video"><source src="${e.target.result}" type="${file.type}"></video>`;
            };
            reader.readAsDataURL(file);
        } else {
            // Diğer dosya türleri için önizleme yok
            container.innerHTML = `<p>${currentLanguage === 'tr' ? 'Bu dosya türü için önizleme kullanılamıyor.' : 'Preview not available for this file type.'}</p>`;
        }
    }
    
    // Dosya türüne göre dönüştürme seçeneklerini güncelleme
    function updateConversionOptions(fileType) {
        const convertTo = document.getElementById('convertTo');
        convertTo.innerHTML = ''; // Mevcut seçenekleri temizle
        
        // Format açıklamaları bölümünü temizle
        if (document.getElementById('formatInfo')) {
            document.getElementById('formatInfo').remove();
        }
        
        let formatOptions = [];
        
        if (fileType.startsWith('video/')) {
            // Video dosyası için seçenekler
            formatOptions = [
                { value: 'mp3', text: 'MP3', desc: 'Ses dosyası formatı, sadece ses çıkarılır' },
                { value: 'mp4', text: 'MP4', desc: 'Yaygın video formatı, çoğu cihazla uyumlu' },
                { value: 'webm', text: 'WebM', desc: 'Web için optimize edilmiş video formatı' },
                { value: 'avi', text: 'AVI', desc: 'Yüksek kaliteli video formatı' }
            ];
        } else if (fileType.startsWith('audio/')) {
            // Ses dosyası için seçenekler
            formatOptions = [
                { value: 'mp3', text: 'MP3', desc: 'Yaygın ses formatı, iyi sıkıştırma' },
                { value: 'wav', text: 'WAV', desc: 'Sıkıştırılmamış, yüksek kaliteli ses' },
                { value: 'ogg', text: 'OGG', desc: 'Açık kaynaklı ses formatı' },
                { value: 'flac', text: 'FLAC', desc: 'Kayıpsız ses sıkıştırma formatı' }
            ];
        } else if (fileType.startsWith('image/')) {
            // Görsel dosyası için seçenekler
            formatOptions = [
                { value: 'jpg', text: 'JPG', desc: 'Fotoğraflar için yaygın format' },
                { value: 'png', text: 'PNG', desc: 'Kayıpsız sıkıştırma, şeffaflık desteği' },
                { value: 'webp', text: 'WebP', desc: 'Web için optimize edilmiş görsel formatı' },
                { value: 'gif', text: 'GIF', desc: 'Animasyonlu görsel formatı' }
            ];
        } else if (fileType.startsWith('application/')) {
            // Belge dosyası için seçenekler
            formatOptions = [
                { value: 'pdf', text: 'PDF', desc: 'Taşınabilir belge formatı' },
                { value: 'docx', text: 'DOCX', desc: 'Microsoft Word belgesi' },
                { value: 'txt', text: 'TXT', desc: 'Düz metin dosyası' }
            ];
        } else {
            // Varsayılan seçenekler
            formatOptions = [
                { value: 'mp3', text: 'MP3', desc: 'Yaygın ses formatı' },
                { value: 'mp4', text: 'MP4', desc: 'Yaygın video formatı' },
                { value: 'jpg', text: 'JPG', desc: 'Yaygın görsel formatı' },
                { value: 'pdf', text: 'PDF', desc: 'Taşınabilir belge formatı' }
            ];
        }
        
        // Seçenekleri ekle
        formatOptions.forEach(option => {
            addOption(convertTo, option.value, option.text);
        });
        
        // Format bilgisi bölümü oluştur
        createFormatInfo(formatOptions);
        
        // İlk seçeneğin açıklamasını göster
        showFormatDescription(formatOptions[0].value);
        
        // Format değiştiğinde açıklamayı güncelle
        convertTo.addEventListener('change', () => {
            showFormatDescription(convertTo.value);
        });
    }
    
    // Select'e seçenek ekleme yardımcı fonksiyonu
    function addOption(selectElement, value, text) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        selectElement.appendChild(option);
    }
    
    // Dönüştür butonuna tıklandığında
    convertBtn.addEventListener('click', () => {
        // Dosya listesindeki tüm dosyaları dönüştür
        const fileItems = document.querySelectorAll('.file-item');
        
        if (fileItems.length === 0) {
            showNotification(
                currentLanguage === 'tr' ? 'Hata' : 'Error',
                currentLanguage === 'tr' ? 'Lütfen dönüştürmek için dosya seçin.' : 'Please select a file to convert.',
                'error'
            );
            return;
        }
        
        const convertTo = document.getElementById('convertTo').value;
        
        // Her dosya için dönüştürme işlemi başlat
        fileItems.forEach((fileItem, index) => {
            // Dönüştürme işlemi simülasyonu
            setTimeout(() => {
                simulateConversion(fileInput.files[fileItem.dataset.index], convertTo);
            }, index * 1000); // Her dosya için 1 saniye gecikme
        });
    });
    
    // Dönüştürme sonuç bölümü oluşturma
    function createResultSection(file, convertTo) {
        // Mevcut sonuç bölümünü kaldır
        const existingResult = document.getElementById('conversionResult');
        if (existingResult) {
            existingResult.remove();
        }
        
        // Yeni dosya adı oluştur
        const newFileName = `${file.name.split('.')[0]}.${convertTo}`;
        
        // Dosya boyutu (örnek olarak orijinal dosyanın boyutunu kullanıyoruz)
        const fileSize = formatFileSize(file.size);
        
        // Dosya türüne göre ikon belirle
        const fileIcon = getFileIcon(convertTo);
        
        // Sonuç bölümü oluştur
        const resultSection = document.createElement('div');
        resultSection.id = 'conversionResult';
        resultSection.className = 'conversion-result';
        
        resultSection.innerHTML = `
            <h3>${currentLanguage === 'tr' ? 'Dönüştürme Tamamlandı' : 'Conversion Complete'}</h3>
            <div class="result-file">
                <div class="file-icon">
                    <i class="fas ${fileIcon}"></i>
                </div>
                <div class="file-details">
                    <div class="file-name">${newFileName}</div>
                    <p class="file-size">${fileSize}</p>
                </div>
                <button class="btn download-btn">
                    <i class="fas fa-download"></i> ${currentLanguage === 'tr' ? 'İndir' : 'Download'}
                </button>
            </div>
        `;
        
        // Sonuç bölümünü sayfaya ekle
        document.querySelector('.converter-container').appendChild(resultSection);
        
        // İndirme butonuna tıklandığında
        const downloadBtn = resultSection.querySelector('.download-btn');
        downloadBtn.addEventListener('click', () => {
            // İndirme simülasyonu
            simulateDownload(file, newFileName, convertTo);
        });
    }
    
    // İndirme simülasyonu
    function simulateDownload(file, newFileName, convertTo) {
        // Gerçek bir uygulamada, sunucudan dönüştürülmüş dosyayı indirme işlemi yapılır
        // Bu demo için bir dosya oluşturup indirme simülasyonu yapalım
        
        // Dosya türüne göre MIME tipi belirle
        let mimeType;
        switch(convertTo) {
            case 'mp3':
                mimeType = 'audio/mpeg';
                break;
            case 'mp4':
                mimeType = 'video/mp4';
                break;
            case 'jpg':
                mimeType = 'image/jpeg';
                break;
            case 'png':
                mimeType = 'image/png';
                break;
            case 'pdf':
                mimeType = 'application/pdf';
                break;
            case 'docx':
                mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                break;
            default:
                mimeType = 'application/octet-stream';
        }
        
        // Dosya içeriği (gerçek bir uygulamada dönüştürülmüş dosya içeriği olacak)
        // Bu demo için orijinal dosyayı kullanıyoruz
        const reader = new FileReader();
        reader.onload = function(e) {
            const blob = new Blob([e.target.result], { type: mimeType });
            const url = URL.createObjectURL(blob);
            
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = newFileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            // URL'yi serbest bırak
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 100);
            
            showNotification(
                currentLanguage === 'tr' ? 'İndirme başladı' : 'Download started',
                `${newFileName} ${currentLanguage === 'tr' ? 'indiriliyor...' : 'is downloading...'}`,
                'info'
            );
        };
        reader.readAsArrayBuffer(file);
    }
    
    // Dönüştürme geçmişine ekleme
    function addToHistory(file, convertTo) {
        // Geçmiş verilerini al
        let history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
        
        // Yeni dönüştürme kaydı
        const historyItem = {
            fileName: file.name,
            originalType: file.type,
            convertedType: convertTo,
            fileSize: file.size,
            date: new Date().toISOString()
        };
        
        // Geçmişin başına ekle (en son dönüştürme en üstte)
        history.unshift(historyItem);
        
        // Maksimum 10 kayıt tut
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        
        // Geçmişi kaydet
        localStorage.setItem('conversionHistory', JSON.stringify(history));
        
        // Geçmiş bölümünü güncelle
        updateHistorySection();
    }
    
    // Dönüştürme simülasyonu
    function simulateConversion(file, convertTo) {
        // Dönüştürme başladı bildirimi
        const startedText = currentLanguage === 'tr' ? 'Dönüştürme başladı' : 'Conversion started';
        const formatText = currentLanguage === 'tr' ? 'Hedef Format' : 'Target Format';
        
        showNotification(startedText, `${currentLanguage === 'tr' ? 'Dosya' : 'File'}: ${file.name} - ${formatText}: ${convertTo.toUpperCase()}`, 'info');
        
        // Dönüştürme işlemi sırasında buton görünümünü değiştir
        convertBtn.disabled = true;
        convertBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${currentLanguage === 'tr' ? 'Dönüştürülüyor...' : 'Converting...'}`;
        
        // Dönüştürme sonuç bölümünü temizle
        if (document.getElementById('conversionResult')) {
            document.getElementById('conversionResult').remove();
        }
        
        setTimeout(() => {
            convertBtn.innerHTML = currentLanguage === 'tr' ? 'Dönüştür' : 'Convert';
            convertBtn.disabled = false;
            
            // Dönüştürme tamamlandı bildirimi
            const completedText = currentLanguage === 'tr' ? 'Dönüştürme tamamlandı!' : 'Conversion completed!';
            const convertedText = currentLanguage === 'tr' ? 'Dosyanız formatına dönüştürüldü.' : 'Your file has been converted to';
            
            showNotification(completedText, `${convertedText} ${convertTo.toUpperCase()}`, 'success');
            
            // Dönüştürme sonuç bölümünü oluştur
            createResultSection(file, convertTo);
            
            // Dönüştürme geçmişine ekle
            addToHistory(file, convertTo);
            
            // Paylaşım seçeneklerini göster
            showShareOptions(file, convertTo);
            
        }, 3000); // 3 saniye gecikme
    }
    
    // Paylaşım seçeneklerini gösterme
    function showShareOptions(file, convertTo) {
        // Paylaşım bölümü yoksa oluştur
        const shareSection = document.createElement('div');
        shareSection.className = 'share-section';
        shareSection.innerHTML = `
            <h4>${currentLanguage === 'tr' ? 'Dönüştürülen Dosyayı Paylaş' : 'Share Converted File'}</h4>
            <div class="share-buttons">
                <a class="share-button share-facebook" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                <a class="share-button share-twitter" title="Twitter"><i class="fab fa-twitter"></i></a>
                <a class="share-button share-whatsapp" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                <a class="share-button share-telegram" title="Telegram"><i class="fab fa-telegram-plane"></i></a>
            </div>
        `;
        
        // Mevcut paylaşım bölümünü kaldır
        const existingShare = document.querySelector('.share-section');
        if (existingShare) {
            existingShare.remove();
        }
        
        // Paylaşım bölümünü ekle
        document.querySelector('.converter-container').appendChild(shareSection);
        
        // Paylaşım URL'si (gerçek uygulamada sunucudan gelecek)
        const shareUrl = `https://donusturbunu.com/share/${Date.now()}`;
        const shareText = `${currentLanguage === 'tr' ? 'Dosyamı DönüştürBunu ile dönüştürdüm' : 'I converted my file with DönüştürBunu'}: ${file.name} → ${convertTo.toUpperCase()}`;
        
        // Paylaşım butonlarına tıklandığında
        shareSection.querySelector('.share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        shareSection.querySelector('.share-twitter').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        shareSection.querySelector('.share-whatsapp').href = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        shareSection.querySelector('.share-telegram').href = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        
        // Yeni sekmede açılması için
        shareSection.querySelectorAll('.share-button').forEach(btn => {
            btn.setAttribute('target', '_blank');
            btn.setAttribute('rel', 'noopener noreferrer');
        });
    }
    
    // Dosya türüne göre ikon belirleme
    function getFileIcon(fileType) {
        switch(fileType) {
            case 'mp3':
            case 'wav':
            case 'ogg':
            case 'flac':
                return 'fa-file-audio';
            case 'mp4':
            case 'webm':
            case 'avi':
                return 'fa-file-video';
            case 'jpg':
            case 'png':
            case 'webp':
            case 'gif':
                return 'fa-file-image';
            case 'pdf':
                return 'fa-file-pdf';
            case 'docx':
            case 'txt':
                return 'fa-file-word';
            default:
                return 'fa-file';
        }
    }
    
    // Popüler dönüşüm butonları için olay dinleyicileri
    const conversionButtons = document.querySelectorAll('.conversion-type .btn');
    conversionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Sayfayı dönüştürücü bölümüne kaydır
            document.querySelector('.converter-section').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Hemen Başla butonuna tıklandığında
    const startButton = document.querySelector('.primary-btn');
    if (startButton) {
        startButton.addEventListener('click', () => {
            document.querySelector('.converter-section').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Format bilgisi bölümü oluşturma
    function createFormatInfo(formatOptions) {
        const formatInfo = document.createElement('div');
        formatInfo.id = 'formatInfo';
        formatInfo.className = 'format-info';
        
        // Format açıklamı için alan oluştur
        const formatDesc = document.createElement('p');
        formatDesc.id = 'formatDesc';
        formatDesc.className = 'format-desc';
        
        formatInfo.appendChild(formatDesc);
        
        // Format bilgisini sayfaya ekle
        document.querySelector('.option-group').appendChild(formatInfo);
    }

    // Format açıklamasını gösterme
    function showFormatDescription(formatValue) {
        const formatDesc = document.getElementById('formatDesc');
        const convertTo = document.getElementById('convertTo');
        
        // Tüm seçenekleri kontrol et
        for (let i = 0; i < convertTo.options.length; i++) {
            if (convertTo.options[i].value === formatValue) {
                // Seçilen formatın açıklamasını bul
                const selectedOption = convertTo.options[i];
                const formatOptions = getFormatOptions();
                
                const selectedFormat = formatOptions.find(option => option.value === formatValue);
                
                if (selectedFormat) {
                    formatDesc.textContent = selectedFormat.desc;
                }
                break;
            }
        }
    }

    // Format seçeneklerini alma
    function getFormatOptions() {
        return [
            { value: 'mp3', text: 'MP3', desc: 'Yaygın ses formatı, iyi sıkıştırma' },
            { value: 'mp4', text: 'MP4', desc: 'Yaygın video formatı, çoğu cihazla uyumlu' },
            { value: 'wav', text: 'WAV', desc: 'Sıkıştırılmamış, yüksek kaliteli ses' },
            { value: 'ogg', text: 'OGG', desc: 'Açık kaynaklı ses formatı' },
            { value: 'flac', text: 'FLAC', desc: 'Kayıpsız ses sıkıştırma formatı' },
            { value: 'jpg', text: 'JPG', desc: 'Fotoğraflar için yaygın format' },
            { value: 'png', text: 'PNG', desc: 'Kayıpsız sıkıştırma, şeffaflık desteği' },
            { value: 'webp', text: 'WebP', desc: 'Web için optimize edilmiş görsel formatı' },
            { value: 'gif', text: 'GIF', desc: 'Animasyonlu görsel formatı' },
            { value: 'webm', text: 'WebM', desc: 'Web için optimize edilmiş video formatı' },
            { value: 'avi', text: 'AVI', desc: 'Yüksek kaliteli video formatı' },
            { value: 'pdf', text: 'PDF', desc: 'Taşınabilir belge formatı' },
            { value: 'docx', text: 'DOCX', desc: 'Microsoft Word belgesi' },
            { value: 'txt', text: 'TXT', desc: 'Düz metin dosyası' }
        ];
    }

    // Dosya bilgilerini gösterme
    function showFileInfo(file) {
        // Dosya boyutunu formatla
        const fileSize = formatFileSize(file.size);
        
        // Dosya bilgisi alanını güncelle
        const fileInfo = document.getElementById('fileInfo');
        fileInfo.innerHTML = `
            <p>Seçilen dosya: <span id="fileName">${file.name}</span></p>
            <p>Dosya boyutu: <span>${fileSize}</span></p>
            <p>Dosya türü: <span>${file.type || 'Bilinmeyen'}</span></p>
        `;
    }

    // Dosya boyutunu formatla
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Tema değiştirici
    const themeSwitch = document.getElementById('themeSwitch');
    
    // Sayfa yüklendiğinde tema kontrolü
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeSwitch.checked = true;
    }
    
    // Tema değiştirme olayı
    themeSwitch.addEventListener('change', () => {
        if (themeSwitch.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Dil değiştirici
    const languageSelect = document.getElementById('languageSelect');
    
    // Sayfa yüklendiğinde dil seçimini ayarla
    if (currentLanguage) {
        languageSelect.value = currentLanguage;
    }
    
    // Dil değiştirme olayı
    languageSelect.addEventListener('change', () => {
        const selectedLanguage = languageSelect.value;
        localStorage.setItem('language', selectedLanguage);
        changeLanguage(selectedLanguage);
    });
    
    // Dil değiştirme fonksiyonu
    function changeLanguage(language) {
        const translations = {
            'tr': {
                'home': 'Ana Sayfa',
                'contact': 'İletişim',
                'video': 'Video',
                'audio': 'Ses',
                'image': 'Görsel',
                'document': 'Belge',
                'formatLabel': 'Dönüştürülecek format:',
                'convertBtn': 'Dönüştür',
                'dropText': 'Dosyanızı sürükleyin veya',
                'browse': 'gözatın',
                'fileSelected': 'Seçilen dosya:',
                'fileSize': 'Dosya boyutu:',
                'fileType': 'Dosya türü:',
                'conversionComplete': 'Dönüştürme Tamamlandı',
                'download': 'İndir',
                'conversionStarted': 'Dönüştürme başladı',
                'conversionCompleted': 'Dönüştürme tamamlandı!',
                'downloadStarted': 'İndirme başladı',
                'converting': 'Dönüştürülüyor...',
                'fileTooBig': 'Dosya boyutu çok büyük',
                'maxFileSize': 'Maksimum 20MB boyutunda dosya yükleyebilirsiniz.',
                'contactTitle': 'İletişim',
                'name': 'Adınız',
                'email': 'E-posta',
                'message': 'Mesajınız',
                'send': 'Gönder',
                'preview': 'Önizle',
                'remove': 'Kaldır',
                'previewNotAvailable': 'Bu dosya türü için önizleme kullanılamıyor.',
                'conversionHistory': 'Dönüştürme Geçmişi',
                'clearHistory': 'Geçmişi Temizle',
                'noHistory': 'Henüz dönüştürme geçmişi yok.',
                'shareFile': 'Dönüştürülen Dosyayı Paylaş',
                'multipleFilesHint': 'Birden fazla dosya seçmek için Ctrl tuşuna basılı tutun'
            },
            'en': {
                'home': 'Home',
                'contact': 'Contact',
                'video': 'Video',
                'audio': 'Audio',
                'image': 'Image',
                'document': 'Document',
                'formatLabel': 'Convert to format:',
                'convertBtn': 'Convert',
                'dropText': 'Drag your file or',
                'browse': 'browse',
                'fileSelected': 'Selected file:',
                'fileSize': 'File size:',
                'fileType': 'File type:',
                'conversionComplete': 'Conversion Complete',
                'download': 'Download',
                'conversionStarted': 'Conversion started',
                'conversionCompleted': 'Conversion completed!',
                'downloadStarted': 'Download started',
                'converting': 'Converting...',
                'fileTooBig': 'File size too large',
                'maxFileSize': 'You can upload files up to 20MB.',
                'contactTitle': 'Contact',
                'name': 'Your Name',
                'email': 'Email',
                'message': 'Your Message',
                'send': 'Send',
                'preview': 'Preview',
                'remove': 'Remove',
                'previewNotAvailable': 'Preview not available for this file type.',
                'conversionHistory': 'Conversion History',
                'clearHistory': 'Clear History',
                'noHistory': 'No conversion history yet.',
                'shareFile': 'Share Converted File',
                'multipleFilesHint': 'Hold Ctrl key to select multiple files'
            }
        };
        
        // Menü öğelerini güncelle
        document.querySelectorAll('.nav-links a').forEach(link => {
            const section = link.getAttribute('data-section');
            if (translations[language][section]) {
                link.textContent = translations[language][section];
            }
        });
        
        // Sekme butonlarını güncelle
        document.querySelectorAll('.tab-btn').forEach(btn => {
            const type = btn.getAttribute('data-type');
            if (translations[language][type]) {
                btn.textContent = translations[language][type];
            }
        });
        
        // İletişim formunu güncelle
        document.querySelector('.contact-section h2').textContent = translations[language]['contactTitle'];
        document.querySelector('label[for="name"]').textContent = translations[language]['name'];
        document.querySelector('label[for="email"]').textContent = translations[language]['email'];
        document.querySelector('label[for="message"]').textContent = translations[language]['message'];
        document.querySelector('.contact-form .btn').textContent = translations[language]['send'];
        
        // Diğer metinleri güncelle
        document.getElementById('formatLabel').textContent = translations[language]['formatLabel'];
        document.getElementById('convertBtn').textContent = translations[language]['convertBtn'];
        
        // Dosya yükleme alanını güncelle
        const uploadText = document.querySelector('.upload-area p');
        if (uploadText) {
            uploadText.innerHTML = `${translations[language]['dropText']} <span>${translations[language]['browse']}</span>`;
        }
        
        // Yeni çevirileri uygula
        document.querySelector('.upload-hint').textContent = translations[language]['multipleFilesHint'];
        
        // Geçmiş bölümünü güncelle
        const historyHeader = document.querySelector('.history-section .history-header h3');
        if (historyHeader) {
            historyHeader.textContent = translations[language]['conversionHistory'];
        }
        
        const clearHistory = document.querySelector('.history-section .clear-history');
        if (clearHistory) {
            clearHistory.textContent = translations[language]['clearHistory'];
        }
        
        const historyEmpty = document.querySelector('.history-section .history-empty');
        if (historyEmpty) {
            historyEmpty.textContent = translations[language]['noHistory'];
        }
        
        // Paylaşım bölümünü güncelle
        const shareTitle = document.querySelector('.share-section h4');
        if (shareTitle) {
            shareTitle.textContent = translations[language]['shareFile'];
        }
        
        // Diğer çevirileri uygula
        currentLanguage = language;
    }
    
    // Menü öğelerine tıklandığında
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Aktif sınıfını güncelle
            navLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
            
            // Seçilen bölüme göre içeriği göster/gizle
            const section = link.getAttribute('data-section');
            if (section === 'home') {
                document.querySelector('.converter-section').style.display = 'block';
                document.getElementById('contact-section').style.display = 'none';
            } else if (section === 'contact') {
                document.querySelector('.converter-section').style.display = 'none';
                document.getElementById('contact-section').style.display = 'block';
            }
        });
    });
    
    // Sekme butonlarına tıklandığında
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Aktif sınıfını güncelle
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Seçilen dönüştürücü türüne göre seçenekleri güncelle
            const type = button.getAttribute('data-type');
            updateConverterByType(type);
        });
    });
    
    // Dönüştürücü türüne göre seçenekleri güncelleme
    function updateConverterByType(type) {
        const convertTo = document.getElementById('convertTo');
        convertTo.innerHTML = ''; // Mevcut seçenekleri temizle
        
        // Format açıklamaları bölümünü temizle
        if (document.getElementById('formatInfo')) {
            document.getElementById('formatInfo').remove();
        }
        
        let formatOptions = [];
        
        switch(type) {
            case 'video':
                formatOptions = [
                    { value: 'mp4', text: 'MP4', desc: 'Yaygın video formatı, çoğu cihazla uyumlu' },
                    { value: 'webm', text: 'WebM', desc: 'Web için optimize edilmiş video formatı' },
                    { value: 'avi', text: 'AVI', desc: 'Yüksek kaliteli video formatı' },
                    { value: 'mp3', text: 'MP3', desc: 'Ses dosyası formatı, sadece ses çıkarılır' }
                ];
                break;
            case 'audio':
                formatOptions = [
                    { value: 'mp3', text: 'MP3', desc: 'Yaygın ses formatı, iyi sıkıştırma' },
                    { value: 'wav', text: 'WAV', desc: 'Sıkıştırılmamış, yüksek kaliteli ses' },
                    { value: 'ogg', text: 'OGG', desc: 'Açık kaynaklı ses formatı' },
                    { value: 'flac', text: 'FLAC', desc: 'Kayıpsız ses sıkıştırma formatı' }
                ];
                break;
            case 'image':
                formatOptions = [
                    { value: 'jpg', text: 'JPG', desc: 'Fotoğraflar için yaygın format' },
                    { value: 'png', text: 'PNG', desc: 'Kayıpsız sıkıştırma, şeffaflık desteği' },
                    { value: 'webp', text: 'WebP', desc: 'Web için optimize edilmiş görsel formatı' },
                    { value: 'gif', text: 'GIF', desc: 'Animasyonlu görsel formatı' }
                ];
                break;
            case 'document':
                formatOptions = [
                    { value: 'pdf', text: 'PDF', desc: 'Taşınabilir belge formatı' },
                    { value: 'docx', text: 'DOCX', desc: 'Microsoft Word belgesi' },
                    { value: 'txt', text: 'TXT', desc: 'Düz metin dosyası' },
                    { value: 'rtf', text: 'RTF', desc: 'Zengin metin formatı' }
                ];
                break;
        }
        
        // Seçenekleri ekle
        formatOptions.forEach(option => {
            addOption(convertTo, option.value, option.text);
        });
        
        // Format bilgisi bölümü oluştur
        createFormatInfo(formatOptions);
        
        // İlk seçeneğin açıklamasını göster
        if (formatOptions.length > 0) {
            showFormatDescription(formatOptions[0].value);
        }
    }
    
    // İletişim formu gönderimi
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Form verilerini al
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Gerçek bir uygulamada burada form verileri sunucuya gönderilir
            // Bu demo için sadece bir bildirim gösterelim
            showNotification(
                currentLanguage === 'tr' ? 'Mesajınız gönderildi' : 'Your message has been sent',
                currentLanguage === 'tr' ? 'Teşekkürler! En kısa sürede size dönüş yapacağız.' : 'Thank you! We will get back to you soon.',
                'success'
            );
            
            // Formu temizle
            contactForm.reset();
        });
    }

    // Bildirim gösterme fonksiyonu
    function showNotification(title, message, type) {
        // Mevcut bildirimleri temizle
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });
        
        // Yeni bildirim oluştur
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-header">
                <h3>${title}</h3>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <p>${message}</p>
        `;
        
        document.body.appendChild(notification);
        
        // Bildirim gösterme animasyonu
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Kapatma butonuna tıklandığında
        const closeBtn = notification.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Otomatik kapanma
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Geçmiş bölümünü güncelleme
    function updateHistorySection() {
        // Geçmiş bölümü yoksa oluştur
        if (!document.querySelector('.history-section')) {
            const historySection = document.createElement('div');
            historySection.className = 'history-section';
            historySection.innerHTML = `
                <div class="history-header">
                    <h3>${currentLanguage === 'tr' ? 'Dönüştürme Geçmişi' : 'Conversion History'}</h3>
                    <button class="clear-history">${currentLanguage === 'tr' ? 'Geçmişi Temizle' : 'Clear History'}</button>
                </div>
                <div class="history-items"></div>
            `;
            
            document.querySelector('.converter-container').appendChild(historySection);
            
            // Geçmişi temizle butonuna tıklandığında
            const clearBtn = historySection.querySelector('.clear-history');
            clearBtn.addEventListener('click', () => {
                localStorage.removeItem('conversionHistory');
                updateHistorySection();
            });
        }
        
        // Geçmiş öğelerini güncelle
        const historyItems = document.querySelector('.history-items');
        const history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
        
        if (history.length === 0) {
            historyItems.innerHTML = `<div class="history-empty">${currentLanguage === 'tr' ? 'Henüz dönüştürme geçmişi yok.' : 'No conversion history yet.'}</div>`;
            return;
        }
        
        historyItems.innerHTML = '';
        
        history.forEach(item => {
            const date = new Date(item.date).toLocaleDateString();
            const fileSize = formatFileSize(item.fileSize);
            
            const historyItem = document.createElement('div');
            historyItem.className = 'file-item';
            historyItem.innerHTML = `
                <div class="file-icon">
                    <i class="fas ${getFileIcon(item.convertedType)}"></i>
                </div>
                <div class="file-details">
                    <div class="file-name">${item.fileName} → ${item.convertedType.toUpperCase()}</div>
                    <div class="file-meta">
                        <span class="file-size">${fileSize}</span>
                        <span class="file-date">${date}</span>
                    </div>
                </div>
            `;
            
            historyItems.appendChild(historyItem);
        });
    }

    // Footer bağlantıları için işlevsellik
    const footerHomeLink = document.querySelector('.footer-column ul li:first-child a');
    const footerContactLink = document.querySelector('.footer-column ul li:nth-child(2) a');
    
    // Ana sayfa bağlantısına tıklandığında
    if (footerHomeLink) {
        footerHomeLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Ana sayfa sekmesini aktif et
            const homeNavLink = document.querySelector('.nav-links a[data-section="home"]');
            if (homeNavLink) {
                homeNavLink.click();
            }
            
            // Sayfanın en üstüne kaydır
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // İletişim bağlantısına tıklandığında
    if (footerContactLink) {
        footerContactLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // İletişim sekmesini aktif et
            const contactNavLink = document.querySelector('.nav-links a[data-section="contact"]');
            if (contactNavLink) {
                contactNavLink.click();
            }
            
            // İletişim bölümüne kaydır
            const contactSection = document.getElementById('contact-section');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Gizlilik Politikası ve Kullanım Şartları bağlantıları
    const privacyLink = document.querySelector('.footer-column ul li:nth-child(3) a');
    const termsLink = document.querySelector('.footer-column ul li:nth-child(4) a');
    
    // Gizlilik Politikası bağlantısına tıklandığında
    if (privacyLink) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Gizlilik Politikası modalını göster
            showModal(
                currentLanguage === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy',
                getPrivacyPolicyContent(currentLanguage)
            );
        });
    }
    
    // Kullanım Şartları bağlantısına tıklandığında
    if (termsLink) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Kullanım Şartları modalını göster
            showModal(
                currentLanguage === 'tr' ? 'Kullanım Şartları' : 'Terms of Use',
                getTermsContent(currentLanguage)
            );
        });
    }
    
    // Modal gösterme fonksiyonu
    function showModal(title, content) {
        // Mevcut modalı kaldır
        const existingModal = document.querySelector('.modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Yeni modal oluştur
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        // Modalı sayfaya ekle
        document.body.appendChild(modal);
        
        // Modal arka planına tıklandığında kapat
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
        
        // Kapatma butonuna tıklandığında
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            closeModal(modal);
        });
        
        // ESC tuşuna basıldığında kapat
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal(modal);
            }
        });
        
        // Modal açılma animasyonu
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
    
    // Modal kapatma fonksiyonu
    function closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    // Gizlilik Politikası içeriği
    function getPrivacyPolicyContent(language) {
        if (language === 'tr') {
            return `
                <h4>Gizlilik Politikamız</h4>
                <p>DönüştürBunu olarak, gizliliğinize saygı duyuyoruz ve kişisel verilerinizin korunmasını önemsiyoruz.</p>
                
                <h5>Toplanan Bilgiler</h5>
                <p>Sitemizi kullanırken, dönüştürdüğünüz dosyalar sunucularımıza yüklenir. Bu dosyalar, dönüştürme işlemi tamamlandıktan sonra 24 saat içinde otomatik olarak silinir.</p>
                
                <h5>Çerezler</h5>
                <p>Sitemiz, daha iyi bir kullanıcı deneyimi sunmak için çerezleri kullanır. Bu çerezler, tercihlerinizi hatırlamak ve site trafiğini analiz etmek için kullanılır.</p>
                
                <h5>Üçüncü Taraf Hizmetleri</h5>
                <p>Sitemiz, Google Analytics gibi üçüncü taraf hizmetlerini kullanabilir. Bu hizmetler, kendi gizlilik politikalarına sahiptir ve bu politikalar için ilgili hizmet sağlayıcılarının web sitelerini ziyaret etmenizi öneririz.</p>
                
                <h5>Değişiklikler</h5>
                <p>Gizlilik politikamızı zaman zaman güncelleyebiliriz. Değişiklikler bu sayfada yayınlanacaktır.</p>
                
                <p>Son güncelleme: 1 Ocak 2023</p>
            `;
        } else {
            return `
                <h4>Our Privacy Policy</h4>
                <p>At DönüştürBunu, we respect your privacy and are committed to protecting your personal data.</p>
                
                <h5>Information Collected</h5>
                <p>When using our site, the files you convert are uploaded to our servers. These files are automatically deleted within 24 hours after the conversion is completed.</p>
                
                <h5>Cookies</h5>
                <p>Our site uses cookies to enhance user experience. These cookies are used to remember your preferences and analyze site traffic.</p>
                
                <h5>Third-Party Services</h5>
                <p>Our site may use third-party services such as Google Analytics. These services have their own privacy policies, and we recommend visiting the respective service providers' websites for these policies.</p>
                
                <h5>Changes</h5>
                <p>We may update our privacy policy from time to time. Changes will be posted on this page.</p>
                
                <p>Last updated: January 1, 2023</p>
            `;
        }
    }
    
    // Kullanım Şartları içeriği
    function getTermsContent(language) {
        if (language === 'tr') {
            return `
                <h4>Kullanım Şartlarımız</h4>
                <p>DönüştürBunu'yu kullanarak, aşağıdaki şartları kabul etmiş olursunuz:</p>
                
                <h5>Hizmet Kullanımı</h5>
                <p>DönüştürBunu, dosya dönüştürme hizmeti sunar. Bu hizmeti yalnızca yasal amaçlar için kullanmalısınız.</p>
                
                <h5>Telif Hakkı</h5>
                <p>Dönüştürdüğünüz dosyaların telif haklarına saygı göstermelisiniz. Telif hakkı ihlali içeren dosyaları dönüştürmek için sitemizi kullanmamalısınız.</p>
                
                <h5>Sorumluluk Reddi</h5>
                <p>DönüştürBunu, dönüştürülen dosyaların kalitesi veya doğruluğu konusunda herhangi bir garanti vermez. Hizmetimizi kendi sorumluluğunuzda kullanırsınız.</p>
                
                <h5>Değişiklikler</h5>
                <p>Kullanım şartlarımızı zaman zaman güncelleyebiliriz. Değişiklikler bu sayfada yayınlanacaktır.</p>
                
                <p>Son güncelleme: 1 Ocak 2023</p>
            `;
        } else {
            return `
                <h4>Our Terms of Use</h4>
                <p>By using DönüştürBunu, you agree to the following terms:</p>
                
                <h5>Service Usage</h5>
                <p>DönüştürBunu provides file conversion services. You should use this service only for legal purposes.</p>
                
                <h5>Copyright</h5>
                <p>You must respect the copyright of the files you convert. You should not use our site to convert files that infringe copyright.</p>
                
                <h5>Disclaimer</h5>
                <p>DönüştürBunu does not provide any guarantee regarding the quality or accuracy of the converted files. You use our service at your own risk.</p>
                
                <h5>Changes</h5>
                <p>We may update our terms of use from time to time. Changes will be posted on this page.</p>
                
                <p>Last updated: January 1, 2023</p>
            `;
        }
    }
}); 