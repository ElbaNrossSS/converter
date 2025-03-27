document.addEventListener('DOMContentLoaded', function() {
    // Dil değişkenini en başta tanımlayalım
    let currentLanguage = localStorage.getItem('language') || 'tr';
    
    // Dosya yükleme alanı işlevselliği
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const fileList = document.getElementById('fileList');
    
    // Gizlilik Politikası ve Kullanım Şartları bağlantıları
    const privacyLink = document.querySelector('a[data-section="privacy"]');
    const termsLink = document.querySelector('a[data-section="terms"]');
    
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
        // Varsa mevcut modalı kaldır
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
                    <h2>${title}</h2>
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
        
        // Kapat butonuna tıklandığında
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            closeModal(modal);
        });
        
        // ESC tuşuna basıldığında modalı kapat
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal(modal);
            }
        });
        
        // Modalı göster (animasyonlu)
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
                <h3>Gizlilik Politikası</h3>
                <p>Son güncellenme: 27.03.2025</p>
                
                <h4>1. Toplanan Bilgiler</h4>
                <p>DönüştürBunu hizmeti, dosya dönüştürme işlemlerini gerçekleştirmek için geçici olarak dosyalarınızı işler. Dönüştürme işlemi tamamlandıktan sonra, dosyalarınız sunucularımızdan otomatik olarak silinir. Kalıcı olarak hiçbir kullanıcı dosyası saklanmaz.</p>
                
                <h4>2. Çerezler ve İzleme Teknolojileri</h4>
                <p>Sitemiz, hizmetlerimizi iyileştirmek ve kullanıcı deneyimini geliştirmek amacıyla çerezler kullanabilir. Bu çerezler, tercihlerinizi hatırlamak ve site trafiğini analiz etmek için kullanılır.</p>
                
                <h4>3. Bilgilerin Paylaşımı</h4>
                <p>Kullanıcı dosyaları veya kişisel bilgiler üçüncü taraflarla paylaşılmaz. Ancak, yasal zorunluluk durumunda veya hizmetlerimizin düzgün çalışması için gerekli olduğunda bilgilerinizi paylaşabiliriz.</p>
                
                <h4>4. Veri Güvenliği</h4>
                <p>Dosyalarınızın güvenliği bizim için önemlidir. Tüm dosya transferleri güvenli SSL bağlantısı üzerinden gerçekleştirilir ve işlem tamamlandıktan sonra dosyalarınız sunucularımızdan silinir.</p>
                
                <h4>5. Kullanıcı Hakları</h4>
                <p>Kullanıcılar, kendileri hakkında toplanan bilgilere erişme, düzeltme veya silme hakkına sahiptir. Herhangi bir sorunuz veya talebiniz varsa, lütfen bizimle iletişime geçin.</p>
                
                <h4>6. Politika Değişiklikleri</h4>
                <p>Bu gizlilik politikası zaman zaman güncellenebilir. Değişiklikler bu sayfada yayınlanacaktır. Sitemizi kullanmaya devam ederek, güncellenmiş politikayı kabul etmiş sayılırsınız.</p>
            `;
        } else {
            return `
                <h3>Privacy Policy</h3>
                <p>Last updated: 03/27/2025</p>
                
                <h4>1. Information Collected</h4>
                <p>The DönüştürBunu service temporarily processes your files to perform conversion operations. After the conversion is completed, your files are automatically deleted from our servers. No user files are permanently stored.</p>
                
                <h4>2. Cookies and Tracking Technologies</h4>
                <p>Our site may use cookies to improve our services and enhance user experience. These cookies are used to remember your preferences and analyze site traffic.</p>
                
                <h4>3. Information Sharing</h4>
                <p>User files or personal information are not shared with third parties. However, we may share your information when legally required or necessary for the proper functioning of our services.</p>
                
                <h4>4. Data Security</h4>
                <p>The security of your files is important to us. All file transfers are conducted over secure SSL connections, and your files are deleted from our servers after processing is complete.</p>
                
                <h4>5. User Rights</h4>
                <p>Users have the right to access, correct, or delete information collected about them. If you have any questions or requests, please contact us.</p>
                
                <h4>6. Policy Changes</h4>
                <p>This privacy policy may be updated from time to time. Changes will be posted on this page. By continuing to use our site, you are deemed to have accepted the updated policy.</p>
            `;
        }
    }
    
    // Kullanım Şartları içeriği
    function getTermsContent(language) {
        if (language === 'tr') {
            return `
                <h3>Kullanım Şartları</h3>
                <p>Son güncellenme: 27.03.2025</p>
                
                <h4>1. Hizmet Kullanımı</h4>
                <p>DönüştürBunu hizmetini kullanarak, bu kullanım şartlarını kabul etmiş olursunuz. Hizmetimizi yasa dışı amaçlarla veya bu şartları ihlal edecek şekilde kullanmayı kabul etmiyorsunuz.</p>
                
                <h4>2. Dosya Dönüştürme</h4>
                <p>Hizmetimiz, çeşitli dosya formatları arasında dönüştürme yapmanıza olanak tanır. Dönüştürülen dosyaların kalitesi, orijinal dosyanın kalitesine ve seçilen formata bağlıdır.</p>
                
                <h4>3. Telif Hakkı</h4>
                <p>Kullanıcılar, telif hakkı sahibi oldukları veya dönüştürme hakkına sahip oldukları dosyaları yüklemelidir. Telif hakkı ihlali durumunda sorumluluk kullanıcıya aittir.</p>
                
                <h4>4. Hizmet Sınırlamaları</h4>
                <p>Dosya boyutu ve dönüştürme sıklığı konusunda sınırlamalar uygulayabiliriz. Bu sınırlamalar, hizmetin tüm kullanıcılar için adil ve verimli bir şekilde çalışmasını sağlamak içindir.</p>
                
                <h4>5. Sorumluluk Reddi</h4>
                <p>Hizmetimiz "olduğu gibi" sunulmaktadır. Dönüştürülen dosyaların doğruluğu, kalitesi veya belirli bir amaca uygunluğu konusunda hiçbir garanti vermiyoruz.</p>
                
                <h4>6. Şartlarda Değişiklik</h4>
                <p>Bu kullanım şartları zaman zaman güncellenebilir. Değişiklikler bu sayfada yayınlanacaktır. Hizmeti kullanmaya devam ederek, güncellenmiş şartları kabul etmiş sayılırsınız.</p>
            `;
        } else {
            return `
                <h3>Terms of Use</h3>
                <p>Last updated: 03/27/2025</p>
                
                <h4>1. Service Usage</h4>
                <p>By using the DönüştürBunu service, you agree to these terms of use. You agree not to use our service for illegal purposes or in a way that violates these terms.</p>
                
                <h4>2. File Conversion</h4>
                <p>Our service allows you to convert between various file formats. The quality of converted files depends on the quality of the original file and the selected format.</p>
                
                <h4>3. Copyright</h4>
                <p>Users should upload files for which they own the copyright or have the right to convert. The user is responsible in case of copyright infringement.</p>
                
                <h4>4. Service Limitations</h4>
                <p>We may apply limitations on file size and conversion frequency. These limitations are to ensure the service works fairly and efficiently for all users.</p>
                
                <h4>5. Disclaimer</h4>
                <p>Our service is provided "as is". We make no warranties regarding the accuracy, quality, or fitness for a particular purpose of the converted files.</p>
                
                <h4>6. Changes to Terms</h4>
                <p>These terms of use may be updated from time to time. Changes will be posted on this page. By continuing to use the service, you are deemed to have accepted the updated terms.</p>
            `;
        }
    }
    
    // CSS stillerini ekle
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .modal.show {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-content {
            background-color: white;
            border-radius: 8px;
            max-width: 800px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            transform: translateY(-20px);
            transition: transform 0.3s ease;
        }
        
        .modal.show .modal-content {
            transform: translateY(0);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #eee;
        }
        
        .modal-header h2 {
            margin: 0;
            color: #333;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #777;
            transition: color 0.3s ease;
        }
        
        .close-modal:hover {
            color: #333;
        }
        
        .modal-body {
            padding: 1.5rem;
        }
        
        .modal-body h3 {
            margin-top: 0;
            color: #333;
        }
        
        .modal-body h4 {
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
            color: #444;
        }
        
        .modal-body p {
            margin-bottom: 1rem;
            line-height: 1.6;
            color: #666;
        }
        
        /* Karanlık tema için */
        [data-theme="dark"] .modal-content {
            background-color: #333;
        }
        
        [data-theme="dark"] .modal-header {
            border-bottom-color: #444;
        }
        
        [data-theme="dark"] .modal-header h2 {
            color: #fff;
        }
        
        [data-theme="dark"] .close-modal {
            color: #aaa;
        }
        
        [data-theme="dark"] .close-modal:hover {
            color: #fff;
        }
        
        [data-theme="dark"] .modal-body h3,
        [data-theme="dark"] .modal-body h4 {
            color: #fff;
        }
        
        [data-theme="dark"] .modal-body p {
            color: #ccc;
        }
        
        @media (max-width: 768px) {
            .modal-content {
                width: 95%;
                max-height: 85vh;
            }
        }
    `;
    
    document.head.appendChild(modalStyles);
    
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
            
            // Dönüştürme seçeneklerini göster (animasyonlu)
            const conversionOptions = document.querySelector('.conversion-options');
            conversionOptions.style.display = 'block';
            
            // Animasyon için kısa bir gecikme
            setTimeout(() => {
                conversionOptions.classList.add('show');
            }, 10);
            
            // Dönüştür butonunu etkinleştir
            convertBtn.disabled = false;
            
            // Dosya yükleme alanına başarılı sınıfı ekle
            uploadArea.classList.add('file-loaded');
            
            // Dosya türüne göre format seçeneklerini güncelle
            updateFormatOptions(files[0].type);
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
            
            // Dosya listesi boşsa dönüştürme seçeneklerini gizle
            if (fileList.children.length === 0) {
                clearFileList();
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
                container.innerHTML = `
                    <audio controls class="preview-audio">
                        <source src="${e.target.result}" type="${file.type}">
                        ${currentLanguage === 'tr' ? 'Tarayıcınız ses dosyasını desteklemiyor.' : 'Your browser does not support the audio element.'}
                    </audio>
                `;
            };
            reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
            // Video önizleme
            const reader = new FileReader();
            reader.onload = (e) => {
                container.innerHTML = `
                    <video controls class="preview-video">
                        <source src="${e.target.result}" type="${file.type}">
                        ${currentLanguage === 'tr' ? 'Tarayıcınız video dosyasını desteklemiyor.' : 'Your browser does not support the video element.'}
                    </video>
                `;
            };
            reader.readAsDataURL(file);
        } else {
            // Diğer dosya türleri için önizleme yok
            container.innerHTML = `<p class="preview-not-available">${currentLanguage === 'tr' ? 'Bu dosya türü için önizleme kullanılamıyor.' : 'Preview not available for this file type.'}</p>`;
        }
    }
    
    // Dosya boyutunu formatla
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Dosya türüne göre ikon belirle
    function getFileIcon(fileType) {
        if (fileType.startsWith('image/')) {
            return 'fa-file-image';
        } else if (fileType.startsWith('audio/')) {
            return 'fa-file-audio';
        } else if (fileType.startsWith('video/')) {
            return 'fa-file-video';
        } else if (fileType.includes('pdf')) {
            return 'fa-file-pdf';
        } else if (fileType.includes('word') || fileType.includes('document')) {
            return 'fa-file-word';
        } else if (fileType.includes('text')) {
            return 'fa-file-alt';
        } else {
            return 'fa-file';
        }
    }
    
    // Dosya türüne göre format seçeneklerini güncelleme
    function updateFormatOptions(fileType) {
        const convertToSelect = document.getElementById('convertTo');
        
        // Mevcut seçenekleri temizle
        convertToSelect.innerHTML = '';
        
        // Dosya türüne göre uygun format seçeneklerini ekle
        if (fileType.startsWith('video/')) {
            // Video formatları
            addOption(convertToSelect, 'mp4', 'MP4');
            addOption(convertToSelect, 'avi', 'AVI');
            addOption(convertToSelect, 'mov', 'MOV');
            addOption(convertToSelect, 'wmv', 'WMV');
            addOption(convertToSelect, 'mkv', 'MKV');
            addOption(convertToSelect, 'gif', 'GIF');
            addOption(convertToSelect, 'mp3', 'MP3 (Sadece Ses)');
        } else if (fileType.startsWith('audio/')) {
            // Ses formatları
            addOption(convertToSelect, 'mp3', 'MP3');
            addOption(convertToSelect, 'wav', 'WAV');
            addOption(convertToSelect, 'ogg', 'OGG');
            addOption(convertToSelect, 'aac', 'AAC');
            addOption(convertToSelect, 'flac', 'FLAC');
            addOption(convertToSelect, 'm4a', 'M4A');
        } else if (fileType.startsWith('image/')) {
            // Görsel formatları
            addOption(convertToSelect, 'jpg', 'JPG');
            addOption(convertToSelect, 'png', 'PNG');
            addOption(convertToSelect, 'gif', 'GIF');
            addOption(convertToSelect, 'webp', 'WEBP');
            addOption(convertToSelect, 'bmp', 'BMP');
            addOption(convertToSelect, 'tiff', 'TIFF');
            addOption(convertToSelect, 'svg', 'SVG');
        } else if (fileType.includes('pdf') || fileType.includes('word') || fileType.includes('document') || fileType.includes('text')) {
            // Belge formatları
            addOption(convertToSelect, 'pdf', 'PDF');
            addOption(convertToSelect, 'docx', 'DOCX');
            addOption(convertToSelect, 'doc', 'DOC');
            addOption(convertToSelect, 'txt', 'TXT');
            addOption(convertToSelect, 'rtf', 'RTF');
            addOption(convertToSelect, 'odt', 'ODT');
            addOption(convertToSelect, 'html', 'HTML');
        } else {
            // Bilinmeyen dosya türü için genel formatlar
            addOption(convertToSelect, 'pdf', 'PDF');
            addOption(convertToSelect, 'jpg', 'JPG');
            addOption(convertToSelect, 'mp3', 'MP3');
            addOption(convertToSelect, 'mp4', 'MP4');
            addOption(convertToSelect, 'txt', 'TXT');
        }
    }
    
    // Select'e seçenek ekleme yardımcı fonksiyonu
    function addOption(selectElement, value, text) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        selectElement.appendChild(option);
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
    
    // Dosya listesi temizlendiğinde dönüştürme seçeneklerini gizle
    function clearFileList() {
        fileList.innerHTML = '';
        
        // Dönüştürme seçeneklerini gizle (animasyonlu)
        const conversionOptions = document.querySelector('.conversion-options');
        conversionOptions.classList.remove('show');
        
        // Animasyon bittikten sonra tamamen gizle
        setTimeout(() => {
            conversionOptions.style.display = 'none';
        }, 300);
        
        // Dönüştür butonunu devre dışı bırak
        convertBtn.disabled = true;
        
        // Dosya yükleme alanından başarılı sınıfını kaldır
        uploadArea.classList.remove('file-loaded');
    }
    
    // Dönüştür butonuna tıklandığında
    convertBtn.addEventListener('click', () => {
        // Dönüştürülecek dosyaları al
        const fileItems = document.querySelectorAll('.file-item');
        if (fileItems.length === 0) return;
        
        // Dönüştürme formatını al
        const convertTo = document.getElementById('convertTo').value;
        
        // Dönüştürme işlemi simülasyonu
        convertBtn.disabled = true;
        convertBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${currentLanguage === 'tr' ? 'Dönüştürülüyor...' : 'Converting...'}`;
        
        // Dönüştürme işlemi başladı bildirimi
        showNotification(
            currentLanguage === 'tr' ? 'Dönüştürme başladı' : 'Conversion started',
            currentLanguage === 'tr' ? 'Dosyalarınız dönüştürülüyor...' : 'Your files are being converted...',
            'info'
        );
        
        // Dönüştürme işlemi simülasyonu (2 saniye)
        setTimeout(() => {
            // Dönüştürme tamamlandı
            convertBtn.innerHTML = `<i class="fas fa-check"></i> ${currentLanguage === 'tr' ? 'Dönüştürüldü' : 'Converted'}`;
            
            // Dönüştürme tamamlandı bildirimi
            showNotification(
                currentLanguage === 'tr' ? 'Dönüştürme tamamlandı' : 'Conversion completed',
                currentLanguage === 'tr' ? 'Dosyalarınız başarıyla dönüştürüldü!' : 'Your files have been successfully converted!',
                'success'
            );
            
            // İlk dosyayı al
            const firstFile = fileItems[0];
            const fileName = firstFile.querySelector('.file-name').textContent;
            const fileSize = firstFile.querySelector('.file-size').textContent;
            const fileType = firstFile.querySelector('.file-type').textContent;
            
            // Yeni dosya adı oluştur
            const newFileName = `${fileName.split('.')[0]}.${convertTo}`;
            
            // Dönüştürme sonuç bölümünü oluştur
            createConversionResult(newFileName, fileSize, fileType);
        }, 2000);
    });
    
    // Dönüştürme sonuç bölümü oluşturma
    function createConversionResult(fileName, fileSize, fileType) {
        // Varsa önceki sonuç bölümünü kaldır
        const existingResult = document.querySelector('.conversion-result');
        if (existingResult) {
            existingResult.remove();
        }
        
        // Yeni sonuç bölümü oluştur
        const resultSection = document.createElement('div');
        resultSection.className = 'conversion-result';
        
        resultSection.innerHTML = `
            <h3>${currentLanguage === 'tr' ? 'Dönüştürme Tamamlandı' : 'Conversion Complete'}</h3>
            <div class="result-file">
                <div class="file-icon">
                    <i class="fas fa-file-download"></i>
                </div>
                <div class="file-details">
                    <div class="file-name">${fileName}</div>
                    <div class="file-size">${fileSize}</div>
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
            // İndirme işlemi başladı
            downloadBtn.disabled = true;
            downloadBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${currentLanguage === 'tr' ? 'İndiriliyor...' : 'Downloading...'}`;
            
            // Dosya indirme işlemi
            downloadFile(fileName, fileType);
            
            // İndirme tamamlandı
            setTimeout(() => {
                downloadBtn.innerHTML = `<i class="fas fa-check"></i> ${currentLanguage === 'tr' ? 'İndirildi' : 'Downloaded'}`;
                
                showNotification(
                    currentLanguage === 'tr' ? 'İndirme başladı' : 'Download started',
                    currentLanguage === 'tr' ? `${fileName} dosyası indiriliyor...` : `Downloading ${fileName}...`,
                    'success'
                );
                
                // Dönüştürme geçmişine ekle
                addToHistory(fileName, fileSize, fileType);
                
                // Dönüştürme geçmişini göster
                showConversionHistory();
            }, 1000);
        });
        
        // Sonuç bölümünü görünür yap (animasyonlu)
        setTimeout(() => {
            resultSection.classList.add('show');
            
            // Sonuç bölümüne kaydır
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
    
    // Dosya indirme fonksiyonu
    function downloadFile(fileName, fileType) {
        // Dosya türüne göre MIME tipi belirle
        let mimeType = 'application/octet-stream'; // Varsayılan
        
        if (fileName.endsWith('.mp3')) {
            mimeType = 'audio/mpeg';
        } else if (fileName.endsWith('.mp4')) {
            mimeType = 'video/mp4';
        } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
            mimeType = 'image/jpeg';
        } else if (fileName.endsWith('.png')) {
            mimeType = 'image/png';
        } else if (fileName.endsWith('.webp')) {
            mimeType = 'image/webp';
        } else if (fileName.endsWith('.pdf')) {
            mimeType = 'application/pdf';
        } else if (fileName.endsWith('.docx')) {
            mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        } else if (fileName.endsWith('.txt')) {
            mimeType = 'text/plain';
        }
        
        // Örnek bir dosya içeriği oluştur (gerçek uygulamada bu sunucudan gelir)
        // Bu örnekte sadece bir metin dosyası oluşturuyoruz
        const content = 'Bu bir örnek dönüştürülmüş dosya içeriğidir. Gerçek bir uygulamada, bu içerik sunucudan gelir.';
        
        // Blob oluştur
        const blob = new Blob([content], { type: mimeType });
        
        // URL oluştur
        const url = URL.createObjectURL(blob);
        
        // İndirme bağlantısı oluştur
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        
        // Bağlantıyı gizle ve tıkla
        document.body.appendChild(a);
        a.style.display = 'none';
        a.click();
        
        // Bağlantıyı kaldır
        document.body.removeChild(a);
        
        // URL'yi serbest bırak
        URL.revokeObjectURL(url);
    }
    
    // Dönüştürme geçmişini gösterme
    function showConversionHistory() {
        // Varsa önceki geçmiş bölümünü kaldır
        const existingHistory = document.querySelector('.conversion-history');
        if (existingHistory) {
            existingHistory.remove();
        }
        
        // Geçmiş bölümü oluştur
        const historySection = document.createElement('div');
        historySection.className = 'conversion-history';
        
        // Geçmiş verilerini al
        const history = getConversionHistory();
        
        // Geçmiş içeriğini oluştur
        historySection.innerHTML = `
            <div class="history-header">
                <h3>${currentLanguage === 'tr' ? 'Dönüştürme Geçmişi' : 'Conversion History'}</h3>
                <button class="clear-history">
                    ${currentLanguage === 'tr' ? 'Geçmişi Temizle' : 'Clear History'}
                </button>
            </div>
            <div class="history-list">
                ${history.length > 0 ? 
                    history.map(item => `
                        <div class="history-item">
                            <div class="file-icon">
                                <i class="fas fa-file"></i>
                            </div>
                            <div class="file-details">
                                <div class="file-name">${item.fileName}</div>
                                <div class="file-meta">
                                    <span class="file-date">${item.date}</span>
                                    <span class="file-size">${item.fileSize}</span>
                                </div>
                            </div>
                        </div>
                    `).join('') : 
                    `<p class="no-history">${currentLanguage === 'tr' ? 'Henüz dönüştürme geçmişi yok.' : 'No conversion history yet.'}</p>`
                }
            </div>
        `;
        
        // Geçmiş bölümünü sayfaya ekle
        document.querySelector('.converter-container').appendChild(historySection);
        
        // Geçmişi temizle butonuna tıklandığında
        const clearHistoryBtn = historySection.querySelector('.clear-history');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                clearConversionHistory();
                showConversionHistory(); // Geçmiş bölümünü güncelle
                
                showNotification(
                    currentLanguage === 'tr' ? 'Geçmiş temizlendi' : 'History cleared',
                    currentLanguage === 'tr' ? 'Dönüştürme geçmişi başarıyla temizlendi.' : 'Conversion history has been successfully cleared.',
                    'info'
                );
            });
        }
        
        // Geçmiş bölümünü görünür yap (animasyonlu)
        setTimeout(() => {
            historySection.classList.add('show');
        }, 200);
    }
    
    // Geçmiş verilerini alma
    function getConversionHistory() {
        const history = localStorage.getItem('conversionHistory');
        return history ? JSON.parse(history) : [];
    }
    
    // Geçmişe dönüştürme ekle
    function addToHistory(fileName, fileSize, fileType) {
        const history = getConversionHistory();
        
        // Yeni geçmiş öğesi
        const newItem = {
            fileName: fileName,
            fileSize: fileSize,
            fileType: fileType,
            date: new Date().toLocaleDateString()
        };
        
        // Geçmişin başına ekle (en yeni en üstte)
        history.unshift(newItem);
        
        // Geçmiş maksimum 10 öğe olsun
        if (history.length > 10) {
            history.pop();
        }
        
        // Geçmişi kaydet
        localStorage.setItem('conversionHistory', JSON.stringify(history));
    }
    
    // Geçmişi temizle
    function clearConversionHistory() {
        localStorage.removeItem('conversionHistory');
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
                'privacy': 'Gizlilik Politikası',
                'terms': 'Kullanım Şartları',
                'converters': 'Dönüştürücüler',
                'videoConverter': 'Video Dönüştürücü',
                'audioConverter': 'Ses Dönüştürücü',
                'imageConverter': 'Görsel Dönüştürücü',
                'documentConverter': 'Belge Dönüştürücü'
            },
            'en': {
                'home': 'Home',
                'contact': 'Contact',
                'privacy': 'Privacy Policy',
                'terms': 'Terms of Use',
                'converters': 'Converters',
                'videoConverter': 'Video Converter',
                'audioConverter': 'Audio Converter',
                'imageConverter': 'Image Converter',
                'documentConverter': 'Document Converter'
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

    // Dosya listesi temizlendiğinde dönüştürme seçeneklerini gizle
    function clearFileList() {
        fileList.innerHTML = '';
        
        // Dönüştürme seçeneklerini gizle (animasyonlu)
        const conversionOptions = document.querySelector('.conversion-options');
        conversionOptions.classList.remove('show');
        
        // Animasyon bittikten sonra tamamen gizle
        setTimeout(() => {
            conversionOptions.style.display = 'none';
        }, 300);
        
        // Dönüştür butonunu devre dışı bırak
        convertBtn.disabled = true;
        
        // Dosya yükleme alanından başarılı sınıfını kaldır
        uploadArea.classList.remove('file-loaded');
    }
}); 