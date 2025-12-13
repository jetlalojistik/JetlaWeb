/**
 * Google Apps Script - Kurye ve İşletme Başvuru Formları
 * 
 * Bu script, web formlarından gelen verileri Google Sheets'e kaydeder.
 * Hem kurye hem de işletme başvurularını aynı sheet'te farklı sayfalara kaydeder.
 * 
 * KURULUM ADIMLARI:
 * 1. Google Sheets dosyanızı açın: https://docs.google.com/spreadsheets/d/1Us1BUsm9GPCk1qQGUgeoBSPQ8x-iwq8ubKaNvZBJc0I/edit
 * 2. Menüden: Extensions > Apps Script
 * 3. Aşağıdaki kodu yapıştırın
 * 4. SHEET_ID değişkenindeki ID'yi kontrol edin
 * 5. Deploy > New deployment > Type: Web app
 * 6. Execute as: Me (your email)
 * 7. Who has access: Anyone
 * 8. Deploy butonuna tıklayın
 * 9. Web app URL'ini kopyalayın ve HTML dosyalarındaki SCRIPT_URL'e yapıştırın
 */

// Google Sheets ID'nizi buraya yapıştırın
const SHEET_ID = "1Us1BUsm9GPCk1qQGUgeoBSPQ8x-iwq8ubKaNvZBJc0I";

// CORS header'larını ekleyen yardımcı fonksiyon
function setCORSHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}

// GET isteği için test (Web App'in çalışıp çalışmadığını kontrol eder)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      "result": "success",
      "message": "Google Apps Script çalışıyor!",
      "sheets": ["Adaylar", "İşletme Başvuruları"]
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// OPTIONS isteği için (CORS preflight)
function doOptions() {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    // CORS header'larını ayarla
    const headers = setCORSHeaders();
    
    // Gelen veriyi parse et
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      throw new Error("Veri alınamadı");
    }
    
    // Form tipini kontrol et (kurye veya işletme)
    const formType = data.formType || 'kurye';
    
    // Google Sheets'i aç
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    
    if (formType === 'isletme') {
      // İşletme Başvuruları sayfası
      let sheet = spreadsheet.getSheetByName("İşletme Başvuruları");
      
      // Eğer sheet yoksa oluştur
      if (!sheet) {
        sheet = spreadsheet.insertSheet("İşletme Başvuruları");
        
        // Başlıkları ekle
        sheet.getRange(1, 1, 1, 9).setValues([[
          "İşletme Adı",
          "Yetkili Kişi Adı Soyadı",
          "Telefon Numarası",
          "E-posta Adresi",
          "İşletme Türü",
          "İşletme Adresi",
          "İşletme Konum",
          "İşletme Konum Linki",
          "Mesaj"
        ]]);
        
        // Başlık satırını kalın yap
        sheet.getRange(1, 1, 1, 9).setFontWeight("bold");
      }
      
      // Veriyi ekle
      sheet.appendRow([
        data.isletmeAdi || "",
        data.yetkiliKisi || "",
        data.telefon || "",
        data.email || "",
        data.isletmeTuru || "",
        data.adres || "",
        data.isletmeKonum || "",
        data.isletmeKonumLink || "",
        data.mesaj || ""
      ]);
      
    } else {
      // Kurye Başvuruları sayfası (varsayılan)
      let sheet = spreadsheet.getSheetByName("Adaylar");
      
      // Eğer sheet yoksa oluştur
      if (!sheet) {
        sheet = spreadsheet.insertSheet("Adaylar");
        
        // Başlıkları ekle
        sheet.getRange(1, 1, 1, 12).setValues([[
          "Ad Soyad",
          "Cinsiyet",
          "TC Kimlik No",
          "Telefon Numarası",
          "Doğum Tarihi",
          "Adres",
          "Araç Türü",
          "Ehliyet",
          "Motorsiklet Modeli",
          "Adli Sicil Kaydı",
          "Şirket Durumu",
          "Tecrübe"
        ]]);
        
        // Başlık satırını kalın yap
        sheet.getRange(1, 1, 1, 12).setFontWeight("bold");
      }
      
      // Veriyi ekle
      sheet.appendRow([
        data.adSoyad || "",
        data.cinsiyet || "",
        data.tcKimlikNo || "",
        data.telefon || "",
        data.dogumTarihi || "",
        data.adres || "",
        data.aracTuru || "",
        data.ehliyet || "",
        data.motorsikletModeli || "",
        data.adliSicilKaydi || "",
        data.sirketDurumu || "",
        data.tecrube || ""
      ]);
    }
    
    // Başarılı yanıt döndür
    return ContentService
      .createTextOutput(JSON.stringify({
        "result": "success",
        "message": "Başvuru başarıyla kaydedildi.",
        "formType": formType
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Hata durumunda
    Logger.log("Hata: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        "result": "error",
        "message": error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test fonksiyonu (opsiyonel)
function test() {
  const testData = {
    adSoyad: "Test Kullanıcı",
    cinsiyet: "Erkek",
    tcKimlikNo: "12345678901",
    telefon: "05551234567",
    dogumTarihi: "1990-01-01",
    adres: "Test Adres",
    aracTuru: "Motorsiklet",
    ehliyet: "A2",
    motorsikletModeli: "Honda CBR",
    adliSicilKaydi: "Yok",
    sirketDurumu: "Şirketsiz",
    tecrube: "2"
  };
  
  const e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  doPost(e);
}

