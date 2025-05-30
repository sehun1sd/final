import React, { useEffect, useRef, useState } from 'react';
import {
  Mic,
  MicOff,
  Plus,
  Trash2,
  AlertCircle,
  ShoppingCart,
} from 'lucide-react';

// Simplified interfaces (same as original)
interface Item {
  id: number;
  name: string;
  price: number;
}

interface StatusMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}

// Mock hooks for demo (replace with your actual hooks)
const useSpeechRecognition = ({ language, onResult, onError }) => ({
  isListening: false,
  startListening: () => {},
  stopListening: () => {},
  isSupported: true,
});

const useVoiceCart = () => ({
  items: [
    { id: 1, name: 'Mangga', price: 50000 },
    { id: 2, name: 'Apel', price: 30000 },
  ],
  inputMode: 'voice' as 'voice' | 'manual',
  manualName: '',
  manualPrice: '',
  statusMessage: { text: 'Siap mendengarkan...', type: 'info' as const },
  totalPrice: 80000,
  itemCount: 2,
  setInputMode: () => {},
  setManualName: () => {},
  setManualPrice: () => {},
  handleDeleteItem: () => {},
  handleManualAdd: () => {},
  handleClearCart: () => {},
  addItem: () => {},
  setStatusWithClear: () => {},
});

const extractItemAndPrice = (transcript: string) => null;
const formatToRupiah = (price: number) => `Rp ${price.toLocaleString('id-ID')}`;

const Demo: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Simplified intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const {
    items,
    inputMode,
    manualName,
    manualPrice,
    statusMessage,
    totalPrice,
    itemCount,
    setInputMode,
    setManualName,
    setManualPrice,
    handleDeleteItem,
    handleManualAdd,
    handleClearCart,
    addItem,
    setStatusWithClear,
  } = useVoiceCart();

  const handleSpeechResult = (transcript: string) => {
    console.log('Processing transcript:', transcript);
    setStatusWithClear(`Memproses: "${transcript}"`, 'info');
    const extractedData = extractItemAndPrice(transcript);
    if (extractedData) {
      addItem(extractedData.itemName, extractedData.price);
    } else {
      setStatusWithClear(
        `❌ Tidak dapat memahami: "${transcript}". Coba ucapkan seperti "mangga lima puluh ribu"`,
        'error',
        6000
      );
    }
  };

  const handleSpeechError = (error: string) => {
    console.error('Speech recognition error:', error);
    setStatusWithClear(error, 'error', 5000);
  };

  const { isListening, startListening, stopListening, isSupported } =
    useSpeechRecognition({
      language: 'id-ID',
      onResult: handleSpeechResult,
      onError: handleSpeechError,
    });

  const toggleVoiceRecognition = () => {
    if (isListening) {
      stopListening();
      setStatusWithClear('🔇 Pengenalan suara dihentikan', 'info', 2000);
    } else {
      if (!isSupported) {
        setStatusWithClear(
          '❌ Speech recognition tidak didukung di browser ini. Gunakan Chrome atau Edge.',
          'error',
          5000
        );
        return;
      }
      startListening();
      setStatusWithClear(
        '🎤 Mendengarkan... Ucapkan nama produk dan harga (contoh: "mangga lima puluh ribu")',  
        'info'
      );
    }
  };

  const handleInputModeChange = (mode: 'voice' | 'manual') => {
    if (isListening) {
      stopListening();
    }
    setInputMode(mode);
  };

  return (
    <section
      ref={sectionRef}
      id="demo"
      className={`min-h-screen py-12 bg-gradient-to-b from-gray-900 to-gray-800 relative transition-all duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Simplified background - single static gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/5 to-indigo-900/10"></div>

      <div className={`container mx-auto px-4 md:px-6 max-w-6xl relative z-10 transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Coba VoiceCart
          </h2>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
            Rasakan kemudahan mencatat belanja dengan teknologi pengenalan suara
            VoiceCart. Cukup sebutkan nama produk dan harganya!
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Main card - simplified styling */}
          <div className={`bg-gray-800/60 border border-gray-700/40 rounded-2xl overflow-hidden transition-all duration-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}>
            
            {/* Status Message */}
            {statusMessage && (
              <div
                className={`mx-6 mt-6 p-4 rounded-xl flex items-start border ${
                  statusMessage.type === 'error'
                    ? 'bg-red-900/30 border-red-700/50 text-red-300'
                    : statusMessage.type === 'success'
                    ? 'bg-green-900/30 border-green-700/50 text-green-300'
                    : 'bg-blue-900/30 border-blue-700/50 text-blue-300'
                }`}
              >
                <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{statusMessage.text}</span>
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Input Section */}
                <div className="space-y-6">
                  {/* Mode Toggle */}
                  <div className="flex space-x-2">
                    <button
                      className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                        inputMode === 'voice'
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-gray-700/60 text-gray-300 border border-gray-600/40'
                      }`}
                      onClick={() => handleInputModeChange('voice')}
                    >
                      🎤 Voice Input
                    </button>
                    <button
                      className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                        inputMode === 'manual'
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-gray-700/60 text-gray-300 border border-gray-600/40'
                      }`}
                      onClick={() => handleInputModeChange('manual')}
                    >
                      ✏️ Manual Input
                    </button>
                  </div>

                  {/* Voice/Manual Input Interface */}
                  {inputMode === 'voice' ? (
                    <div className="bg-gray-700/40 rounded-xl p-8 text-center border border-gray-600/30">
                      <button
                        onClick={toggleVoiceRecognition}
                        disabled={!isSupported}
                        className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto transition-all duration-300 ${
                          !isSupported
                            ? 'bg-gray-600/50 cursor-not-allowed'
                            : isListening
                            ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-lg shadow-red-500/20'
                            : 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/20'
                        }`}
                      >
                        {isListening ? (
                          <MicOff className="h-8 w-8 text-white" />
                        ) : (
                          <Mic className="h-8 w-8 text-white" />
                        )}
                      </button>

                      <h3 className="text-white font-semibold text-lg mb-3">
                        {!isSupported
                          ? 'Speech Recognition Tidak Didukung'
                          : isListening
                          ? 'Sedang Mendengarkan...'
                          : 'Siap Mendengarkan'}
                      </h3>

                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {!isSupported
                          ? 'Gunakan browser Chrome atau Edge untuk fitur voice recognition'
                          : isListening
                          ? 'Ucapkan nama produk dan harga dengan jelas'
                          : 'Tekan tombol mikrofon dan ucapkan produk dengan harga'}
                      </p>

                      <div className="bg-gray-600/30 rounded-lg p-4 text-left border border-gray-500/20">
                        <p className="text-gray-300 text-xs font-medium mb-2">Contoh:</p>
                        <ul className="text-gray-400 text-xs space-y-1">
                          <li>• "mangga lima puluh ribu"</li>
                          <li>• "apel tiga puluh ribu"</li>
                          <li>• "jeruk dua puluh lima ribu"</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-700/40 rounded-xl p-6 border border-gray-600/30">
                      <h3 className="text-white font-semibold text-lg mb-4">
                        Tambah Item Manual
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">
                            Nama Produk
                          </label>
                          <input
                            type="text"
                            value={manualName}
                            onChange={(e) => setManualName(e.target.value)}
                            placeholder="Contoh: Mangga"
                            className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-transparent transition-colors duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">
                            Harga (Rupiah)
                          </label>
                          <input
                            type="number"
                            value={manualPrice}
                            onChange={(e) => setManualPrice(e.target.value)}
                            placeholder="Contoh: 55000"
                            className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-transparent transition-colors duration-200"
                          />
                        </div>

                        <button
                          onClick={handleManualAdd}
                          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-colors duration-200 flex items-center justify-center"
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          Tambah ke Keranjang
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shopping Cart Section */}
                <div className="space-y-6">
                  {/* Cart Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ShoppingCart className="h-6 w-6 text-purple-400" />
                      <h3 className="text-white font-semibold text-xl">
                        Keranjang ({itemCount} item)
                      </h3>
                    </div>

                    {items.length > 0 && (
                      <button
                        onClick={handleClearCart}
                        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200 flex items-center space-x-1 px-3 py-1 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Hapus Semua</span>
                      </button>
                    )}
                  </div>

                  {/* Cart Items */}
                  <div className="bg-gray-700/30 rounded-xl border border-gray-600/30 max-h-96 overflow-y-auto">
                    {items.length === 0 ? (
                      <div className="p-8 text-center">
                        <ShoppingCart className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">Keranjang masih kosong</p>
                        <p className="text-gray-500 text-sm mt-1">
                          Tambahkan produk dengan voice atau manual input
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-600/30">
                        {items.map((item, index) => (
                          <div
                            key={item.id}
                            className="p-4 flex items-center justify-between hover:bg-gray-600/20 transition-colors duration-200"
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <span className="text-gray-400 text-sm font-mono w-6">
                                  {index + 1}.
                                </span>
                                <div>
                                  <h4 className="text-white font-medium">{item.name}</h4>
                                  <p className="text-purple-400 font-semibold">
                                    {formatToRupiah(item.price)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/20 transition-colors duration-200"
                              title={`Hapus ${item.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cart Summary */}
                  {items.length > 0 && (
                    <div className="bg-gradient-to-r from-purple-800/40 to-blue-800/40 rounded-xl p-6 border border-purple-500/30">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-300 font-medium">Total Belanja:</span>
                        <span className="text-2xl font-bold text-white">
                          {formatToRupiah(totalPrice)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>{itemCount} produk dalam keranjang</span>
                        <span>Siap untuk checkout</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Footer */}
        <div className={`max-w-4xl mx-auto mt-12 text-center transition-all duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/40 p-6">
            <h3 className="text-white font-semibold text-lg mb-4">
              💡 Tips Penggunaan
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="text-purple-400 font-medium mb-2">Voice Input:</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Ucapkan dengan jelas dan tidak terburu-buru</li>
                  <li>• Format: "[nama produk] [harga dalam kata]"</li>
                  <li>• Contoh: "mangga lima puluh ribu"</li>
                  <li>• Pastikan mikrofon mendapat izin akses</li>
                </ul>
              </div>
              <div>
                <h4 className="text-blue-400 font-medium mb-2">Manual Input:</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Masukkan nama produk dan harga</li>
                  <li>• Harga dalam format angka (contoh: 55000)</li>
                  <li>• Tekan "Tambah ke Keranjang" untuk menyimpan</li>
                  <li>• Bisa digunakan sebagai backup voice input</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;