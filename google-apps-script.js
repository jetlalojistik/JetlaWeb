/**
 * Google Apps Script - Kurye Başvuru Formu
 * 
 * Bu script, web formundan gelen verileri Google Sheets'e kaydeder.
 * 
 * KURULUM ADIMLARI:
 * 1. Google Sheets dosyanızı açın: https://docs.google.com/spreadsheets/d/1Us1BUsm9GPCk1qQGUgeoBSPQ8x-iwq8ubKaNvZBJc0I/edit
 * 2. Menüden: Extensions > Apps Script
 * 3. Aşağıdaki kodu yapıştırın
 * 4. SCRIPT_PROP değişkenindeki ID'yi kendi Sheets ID'nizle değiştirin
 * 5. Deploy > New deployment > Type: Web app
 * 6. Execute as: Me (your email)
 * 7. Who has access: Anyone
 * 8. Deploy butonuna tıklayın
 * 9. Web app URL'ini kopyalayın ve index.html dosyasındaki SCRIPT_URL'e yapıştırın
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
      "sheet": "Adaylar"
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
    
    // Google Sheets'i aç
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    // Tab/Sheet adı: "Adaylar" (Google Sheets'teki tab adı)
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
    
    // Başarılı yanıt döndür
    return ContentService
      .createTextOutput(JSON.stringify({
        "result": "success",
        "message": "Başvuru başarıyla kaydedildi."
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

