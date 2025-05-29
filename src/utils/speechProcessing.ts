/**
 * Interface untuk menggambarkan struktur hasil ekstraksi
 */
interface ExtractedItemPrice {
  itemName: string;
  price: number;
}

/**
 * Mapping angka kata ke nilai numerik untuk parsing suara Indonesia
 */
const WORD_TO_NUMBER: Record<string, number> = {
  // Angka dasar 0-19
  nol: 0,
  satu: 1,
  dua: 2,
  tiga: 3,
  empat: 4,
  lima: 5,
  enam: 6,
  tujuh: 7,
  delapan: 8,
  sembilan: 9,
  sepuluh: 10,
  sebelas: 11,
  'dua belas': 12,
  'tiga belas': 13,
  'empat belas': 14,
  'lima belas': 15,
  'enam belas': 16,
  'tujuh belas': 17,
  'delapan belas': 18,
  'sembilan belas': 19,
  // Tambahan untuk variasi pengucapan
  se: 1,
  seratus: 100,
  seribu: 1000,
  sejuta: 1000000,
};

const MULTIPLIERS: Record<string, number> = {
  puluh: 10,
  ratus: 100,
  ribu: 1000,
  juta: 1000000,
  rb: 1000, // singkatan ribu
  rb: 1000,
  k: 1000, // untuk format 80k
};

/**
 * Ekstraksi nama item dan harga dari transkrip suara - ENHANCED VERSION 2.0
 */
export const extractItemAndPrice = (
  transcript: string
): ExtractedItemPrice | null => {
  if (!transcript || typeof transcript !== 'string') {
    return null;
  }

  // Normalisasi yang lebih baik
  const normalizedTranscript = transcript
    .trim()
    .toLowerCase()
    .replace(/[.,!?]/g, '') // Hapus tanda baca
    .replace(/\s+/g, ' ') // Normalize spasi
    .replace(/rp\.?\s*/gi, 'rp '); // Standardisasi format Rp

  if (normalizedTranscript.length === 0) {
    return null;
  }

  console.log('Processing transcript:', normalizedTranscript);

  // Coba ekstraksi dengan berbagai pola (urutan penting!)
  const patterns = [
    extractWithRupiahFormat,
    extractWithIndonesianWords,
    extractWithNumbersAndUnits,
    extractWithDirectNumbers,
  ];

  for (const pattern of patterns) {
    const result = pattern(normalizedTranscript);
    if (result) {
      console.log('Successfully extracted with pattern:', pattern.name, result);
      return result;
    }
  }

  console.log('❌ Failed to extract from transcript:', normalizedTranscript);
  return null;
};

/**
 * Ekstraksi format "Pizza Hut Rp75.000" atau "Pizza Hut rp 75000"
 */
const extractWithRupiahFormat = (
  transcript: string
): ExtractedItemPrice | null => {
  console.log('🔍 Trying Rupiah format extraction...');

  // Pattern yang lebih komprehensif untuk format Rupiah
  const patterns = [
    // "Pizza Hut Rp75.000" atau "Pizza Hut Rp 75.000"
    /^(.+?)\s+rp\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)$/i,
    // "Pizza Hut 75000 rupiah" atau "Pizza Hut 75.000 rupiah"
    /^(.+?)\s+(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)\s*rupiah?$/i,
  ];

  for (const pattern of patterns) {
    const match = transcript.match(pattern);
    if (match) {
      const itemName = match[1].trim();
      let priceStr = match[2];

      console.log('🎯 Rupiah match found:', { itemName, priceStr });

      // Bersihkan dan konversi harga
      // Hapus titik/koma sebagai pemisah ribuan, tapi pertahankan desimal
      if (priceStr.includes('.') || priceStr.includes(',')) {
        // Jika ada titik/koma, asumsikan sebagai pemisah ribuan jika > 3 digit
        const cleanPrice = priceStr.replace(/[.,]/g, '');
        const price = parseInt(cleanPrice, 10);

        if (itemName && price > 0) {
          return {
            itemName: capitalizeItemName(itemName),
            price: price,
          };
        }
      } else {
        const price = parseInt(priceStr, 10);
        if (itemName && price > 0) {
          return {
            itemName: capitalizeItemName(itemName),
            price: price,
          };
        }
      }
    }
  }

  return null;
};

/**
 * Ekstraksi dengan angka dan unit "Nabati Dan Oreo 80 ribu"
 */
const extractWithNumbersAndUnits = (
  transcript: string
): ExtractedItemPrice | null => {
  console.log('🔍 Trying numbers with units extraction...');

  // Pattern untuk menangkap angka + unit
  const patterns = [
    // "Nabati Dan Oreo 80 ribu" atau "Nabati Dan Oreo 80ribu"
    /^(.+?)\s+(\d+)\s*(ribu|rb|k)$/i,
    // "Mangga 1 juta" atau "Mangga satu juta"
    /^(.+?)\s+(\d+|satu|dua|tiga|empat|lima|enam|tujuh|delapan|sembilan)\s*(juta)$/i,
    // "Apel 50 ratus" (jarang tapi mungkin)
    /^(.+?)\s+(\d+)\s*(ratus)$/i,
  ];

  for (const pattern of patterns) {
    const match = transcript.match(pattern);
    if (match) {
      const itemName = match[1].trim();
      const numberStr = match[2];
      const unit = match[3].toLowerCase();

      console.log('🎯 Number+Unit match found:', { itemName, numberStr, unit });

      // Konversi angka
      let baseNumber = 0;
      if (/^\d+$/.test(numberStr)) {
        baseNumber = parseInt(numberStr, 10);
      } else if (WORD_TO_NUMBER[numberStr]) {
        baseNumber = WORD_TO_NUMBER[numberStr];
      }

      // Aplikasikan multiplier
      let multiplier = 1;
      switch (unit) {
        case 'ribu':
        case 'rb':
        case 'k':
          multiplier = 1000;
          break;
        case 'juta':
          multiplier = 1000000;
          break;
        case 'ratus':
          multiplier = 100;
          break;
      }

      const price = baseNumber * multiplier;

      if (itemName && price > 0) {
        return {
          itemName: capitalizeItemName(itemName),
          price: price,
        };
      }
    }
  }

  return null;
};

/**
 * Ekstraksi format Indonesia tradisional "mangga lima puluh ribu"
 */
const extractWithIndonesianWords = (
  transcript: string
): ExtractedItemPrice | null => {
  console.log('🔍 Trying Indonesian words extraction...');

  const words = transcript.split(' ');
  let priceStartIndex = -1;

  // Cari kata pertama yang menunjukkan angka/harga
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (
      WORD_TO_NUMBER[word] !== undefined ||
      Object.keys(MULTIPLIERS).includes(word) ||
      /^\d+$/.test(word) ||
      word === 'se' // untuk "seratus", "seribu"
    ) {
      priceStartIndex = i;
      break;
    }
  }

  if (priceStartIndex === -1 || priceStartIndex === 0) {
    return null;
  }

  const itemName = words.slice(0, priceStartIndex).join(' ');
  const priceWords = words.slice(priceStartIndex);

  console.log('🎯 Indonesian words found:', { itemName, priceWords });

  const price = parseIndonesianPrice(priceWords);

  if (price > 0 && itemName.trim()) {
    return {
      itemName: capitalizeItemName(itemName),
      price: price,
    };
  }

  return null;
};

/**
 * Ekstraksi format angka langsung "Indomie 5000"
 */
const extractWithDirectNumbers = (
  transcript: string
): ExtractedItemPrice | null => {
  console.log('🔍 Trying direct numbers extraction...');

  // Pattern untuk angka di akhir
  const patterns = [
    // "Indomie 5000" - angka minimal 3 digit
    /^(.+?)\s+(\d{3,})$/,
    // "Aqua 2500" dengan jarak
    /^(.+?)\s+(\d{3,})\s*$/,
  ];

  for (const pattern of patterns) {
    const match = transcript.match(pattern);
    if (match) {
      const itemName = match[1].trim();
      const price = parseInt(match[2], 10);

      console.log('🎯 Direct number match found:', { itemName, price });

      // Untuk angka kecil (100-999), asumsikan dalam ribuan
      let finalPrice = price;
      if (price >= 100 && price <= 999) {
        finalPrice = price * 1000;
      }

      if (itemName && finalPrice > 0) {
        return {
          itemName: capitalizeItemName(itemName),
          price: finalPrice,
        };
      }
    }
  }

  return null;
};

/**
 * Parsing harga Indonesia yang lebih akurat - FIXED VERSION
 */
const parseIndonesianPrice = (words: string[]): number => {
  console.log('🔧 Parsing Indonesian price from words:', words);

  let result = 0;
  let currentNumber = 0;
  let tempValue = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    console.log(
      `Processing word: "${word}", current: ${currentNumber}, temp: ${tempValue}, result: ${result}`
    );

    // Handle angka langsung (termasuk format dengan titik/koma)
    if (/^\d+([.,]\d+)*$/.test(word)) {
      const cleanNumber = word.replace(/[.,]/g, '');
      currentNumber = parseInt(cleanNumber, 10);
      continue;
    }

    // Handle angka kata
    if (WORD_TO_NUMBER[word] !== undefined) {
      const value = WORD_TO_NUMBER[word];

      // Special handling untuk "satu juta" -> harus jadi 1000000, bukan 500
      if (word === 'satu' && i + 1 < words.length && words[i + 1] === 'juta') {
        currentNumber = 1;
      } else if (value < 10 && currentNumber > 0 && currentNumber < 20) {
        // Handle kasus seperti "dua puluh lima" -> 25
        currentNumber += value;
      } else {
        currentNumber = value;
      }
      continue;
    }

    // Handle multipliers
    switch (word) {
      case 'puluh':
        if (currentNumber === 0) currentNumber = 1;
        tempValue += currentNumber * 10;
        currentNumber = 0;
        break;

      case 'ratus':
        if (currentNumber === 0) currentNumber = 1;
        tempValue += currentNumber * 100;
        currentNumber = 0;
        break;

      case 'ribu':
        // Kumpulkan semua nilai sebelumnya
        const thousands = tempValue + currentNumber || 1;
        result += thousands * 1000;
        tempValue = 0;
        currentNumber = 0;
        break;

      case 'juta':
        // PERBAIKAN: pastikan "satu juta" = 1.000.000
        const millions = tempValue + currentNumber || 1;
        result += millions * 1000000;
        tempValue = 0;
        currentNumber = 0;
        break;
    }
  }

  // Tambahkan sisa nilai
  const finalResult = result + tempValue + currentNumber;

  console.log('🎯 Final parsed price:', finalResult);

  // Jika hasil terlalu kecil dan tidak ada unit besar, mungkin perlu dikalikan
  if (finalResult < 1000 && finalResult > 0 && !hasIndonesianUnit(words)) {
    return finalResult * 1000;
  }

  return finalResult;
};

/**
 * Cek apakah ada unit Indonesia dalam kata-kata
 */
const hasIndonesianUnit = (words: string[]): boolean => {
  return words.some((word) =>
    ['ribu', 'juta', 'ratus', 'puluh', 'rb', 'k'].includes(word.toLowerCase())
  );
};

const capitalizeItemName = (itemName: string): string => {
  return itemName
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatToRupiah = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

/**
 * Test cases untuk debugging - COMPREHENSIVE VERSION
 */
export const testCases = [
  // Format tradisional Indonesia
  {
    input: 'mangga lima puluh ribu',
    expected: { itemName: 'Mangga', price: 50000 },
  },
  {
    input: 'mangga satu juta',
    expected: { itemName: 'Mangga', price: 1000000 },
  },

  // Format Rupiah (yang bermasalah)
  {
    input: 'pizza hut rp75000',
    expected: { itemName: 'Pizza Hut', price: 75000 },
  },
  {
    input: 'pizza hut rp 75000',
    expected: { itemName: 'Pizza Hut', price: 75000 },
  },
  {
    input: 'pizza hut rp75.000',
    expected: { itemName: 'Pizza Hut', price: 75000 },
  },

  // Format angka + unit (yang bermasalah)
  {
    input: 'nabati dan oreo 80 ribu',
    expected: { itemName: 'Nabati Dan Oreo', price: 80000 },
  },
  {
    input: 'nabati dan oreo 80ribu',
    expected: { itemName: 'Nabati Dan Oreo', price: 80000 },
  },

  // Format angka langsung
  {
    input: 'indomie 3000',
    expected: { itemName: 'Indomie', price: 3000 },
  },
  {
    input: 'aqua 500',
    expected: { itemName: 'Aqua', price: 500000 }, // 500 -> 500k
  },
];

// Enhanced debugging - uncomment untuk test
console.log('🧪 Testing ENHANCED speech processing:');
testCases.forEach((test, index) => {
  console.log(`\n--- Test ${index + 1} ---`);
  console.log(`Input: "${test.input}"`);
  console.log(`Expected:`, test.expected);

  const result = extractItemAndPrice(test.input);
  console.log(`Result:`, result);

  const isCorrect =
    result?.price === test.expected.price &&
    result?.itemName === test.expected.itemName;
  console.log(isCorrect ? '✅ PASS' : '❌ FAIL');
});
