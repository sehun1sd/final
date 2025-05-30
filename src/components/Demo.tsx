import React, { useEffect, useState } from 'react';
import {
  Mic,
  MicOff,
  Plus,
  Trash2,
  AlertCircle,
  ShoppingCart,
} from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { extractItemAndPrice, formatToRupiah } from '../utils/speechProcessing';
import { useVoiceCart } from '../hooks/useVoiceCart';

// Interface definitions
interface Item {
  id: number;
  name: string;
  price: number;
}

interface StatusMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}

const Demo: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('demo');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  // Custom hook that handles all the cart logic
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

  // Speech recognition callbacks
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

  // Speech recognition hook
  const { isListening, startListening, stopListening, isSupported } =
    useSpeechRecognition({
      language: 'id-ID',
      onResult: handleSpeechResult,
      onError: handleSpeechError,
    });

  // Toggle voice recognition
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
      id="demo"
      className={`min-h-screen py-12 bg-gradient-to-br from-gray-900 via-indigo-900 to-black relative overflow-hidden transition-all duration-1000 ${
        isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-10'
      }`}
    >
      <BackgroundDecorations />

      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        <Header />

        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.15)]">
            <StatusMessageDisplay statusMessage={statusMessage} />

            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <InputSection
                  inputMode={inputMode}
                  onInputModeChange={handleInputModeChange}
                  isListening={isListening}
                  isSupported={isSupported}
                  onToggleVoice={toggleVoiceRecognition}
                  manualName={manualName}
                  manualPrice={manualPrice}
                  onManualNameChange={setManualName}
                  onManualPriceChange={setManualPrice}
                  onManualAdd={handleManualAdd}
                />

                <ShoppingCartSection
                  items={items}
                  itemCount={itemCount}
                  totalPrice={totalPrice}
                  onDeleteItem={handleDeleteItem}
                  onClearCart={handleClearCart}
                />
              </div>
            </div>
          </div>
        </div>

        <InstructionsFooter />
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(79, 70, 229, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(79, 70, 229, 0.5);
          }
        }
        
        .animate-pulse-glow {
          animation: pulseGlow 2s infinite;
        }
      `}</style>
    </section>
  );
};

// UI Components (no logic, pure presentation)
const BackgroundDecorations: React.FC = () => (
  <>
    <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-900/50 to-transparent"></div>
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/8 rounded-full filter blur-3xl animate-pulse"></div>
    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/8 rounded-full filter blur-3xl animate-pulse"></div>
    <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-blue-500/5 rounded-full filter blur-2xl animate-pulse"></div>
  </>
);

const Header: React.FC = () => (
  <div className="text-center max-w-3xl mx-auto mb-12">
    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
      Coba VoiceCart
    </h2>
    <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
      Rasakan kemudahan mencatat belanja dengan teknologi pengenalan suara
      VoiceCart. Cukup sebutkan nama produk dan harganya!
    </p>
  </div>
);

const StatusMessageDisplay: React.FC<{
  statusMessage: StatusMessage | null;
}> = ({ statusMessage }) => {
  if (!statusMessage) return null;

  return (
    <div
      className={`mx-6 mt-6 p-4 rounded-xl flex items-start border transform transition-all duration-500 ${
        statusMessage.type === 'error'
          ? 'bg-red-900/20 border-red-700/30 text-red-300'
          : statusMessage.type === 'success'
          ? 'bg-green-900/20 border-green-700/30 text-green-300'
          : 'bg-blue-900/20 border-blue-700/30 text-blue-300'
      } animate-slideInDown`}
    >
      <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
      <span className="text-sm font-medium">{statusMessage.text}</span>
    </div>
  );
};

interface InputSectionProps {
  inputMode: 'voice' | 'manual';
  onInputModeChange: (mode: 'voice' | 'manual') => void;
  isListening: boolean;
  isSupported: boolean;
  onToggleVoice: () => void;
  manualName: string;
  manualPrice: string;
  onManualNameChange: (value: string) => void;
  onManualPriceChange: (value: string) => void;
  onManualAdd: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  inputMode,
  onInputModeChange,
  isListening,
  isSupported,
  onToggleVoice,
  manualName,
  manualPrice,
  onManualNameChange,
  onManualPriceChange,
  onManualAdd,
}) => (
  <div className="space-y-6">
    <InputModeToggle
      inputMode={inputMode}
      onInputModeChange={onInputModeChange}
    />

    {inputMode === 'voice' ? (
      <VoiceInputInterface
        isListening={isListening}
        isSupported={isSupported}
        onToggleVoice={onToggleVoice}
      />
    ) : (
      <ManualInputInterface
        manualName={manualName}
        manualPrice={manualPrice}
        onManualNameChange={onManualNameChange}
        onManualPriceChange={onManualPriceChange}
        onManualAdd={onManualAdd}
      />
    )}
  </div>
);

const InputModeToggle: React.FC<{
  inputMode: 'voice' | 'manual';
  onInputModeChange: (mode: 'voice' | 'manual') => void;
}> = ({ inputMode, onInputModeChange }) => (
  <div className="flex space-x-2">
    <button
      className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 ${
        inputMode === 'voice'
          ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-500/25 animate-pulse-glow'
          : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50 hover:shadow-lg hover:shadow-gray-500/10'
      }`}
      onClick={() => onInputModeChange('voice')}
    >
      🎤 Voice Input
    </button>
    <button
      className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 ${
        inputMode === 'manual'
          ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-500/25 animate-pulse-glow'
          : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50 hover:shadow-lg hover:shadow-gray-500/10'
      }`}
      onClick={() => onInputModeChange('manual')}
    >
      ✏️ Manual Input
    </button>
  </div>
);

const VoiceInputInterface: React.FC<{
  isListening: boolean;
  isSupported: boolean;
  onToggleVoice: () => void;
}> = ({ isListening, isSupported, onToggleVoice }) => (
  <div className="bg-gray-800/30 rounded-xl p-8 text-center border border-gray-700/30">
    <button
      onClick={onToggleVoice}
      disabled={!isSupported}
      className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto transition-all duration-300 transform hover:scale-110 active:scale-95 ${
        !isSupported
          ? 'bg-gray-600/50 cursor-not-allowed'
          : isListening
          ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg shadow-red-500/40 animate-pulse hover:shadow-red-500/60'
          : 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-lg shadow-indigo-500/40 hover:shadow-indigo-500/60'
      }`}
    >
      {isListening ? (
        <MicOff className="h-8 w-8 text-white animate-pulse" />
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

    <div className="bg-gray-700/20 rounded-lg p-4 text-left">
      <p className="text-gray-300 text-xs font-medium mb-2">Contoh:</p>
      <ul className="text-gray-400 text-xs space-y-1">
        <li>• "mangga lima puluh ribu"</li>
        <li>• "apel tiga puluh ribu"</li>
        <li>• "jeruk dua puluh lima ribu"</li>
      </ul>
    </div>
  </div>
);

const ManualInputInterface: React.FC<{
  manualName: string;
  manualPrice: string;
  onManualNameChange: (value: string) => void;
  onManualPriceChange: (value: string) => void;
  onManualAdd: () => void;
}> = ({
  manualName,
  manualPrice,
  onManualNameChange,
  onManualPriceChange,
  onManualAdd,
}) => (
  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
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
          onChange={(e) => onManualNameChange(e.target.value)}
          placeholder="Contoh: Mangga"
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all focus:scale-105"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">
          Harga (Rupiah)
        </label>
        <input
          type="number"
          value={manualPrice}
          onChange={(e) => onManualPriceChange(e.target.value)}
          placeholder="Contoh: 55000"
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all focus:scale-105"
        />
      </div>

      <button
        onClick={onManualAdd}
        className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center shadow-lg shadow-indigo-500/25 transform hover:scale-105 hover:-translate-y-0.5 active:scale-95"
      >
        <Plus className="h-5 w-5 mr-2" />
        Tambah ke Keranjang
      </button>
    </div>
  </div>
);

interface ShoppingCartSectionProps {
  items: Item[];
  itemCount: number;
  totalPrice: number;
  onDeleteItem: (id: number) => void;
  onClearCart: () => void;
}

const ShoppingCartSection: React.FC<ShoppingCartSectionProps> = ({
  items,
  itemCount,
  totalPrice,
  onDeleteItem,
  onClearCart,
}) => (
  <div className="space-y-6">
    <CartHeader
      itemCount={itemCount}
      onClearCart={onClearCart}
      itemsLength={items.length}
    />
    <CartItemsList items={items} onDeleteItem={onDeleteItem} />
    {items.length > 0 && (
      <CartSummary totalPrice={totalPrice} itemCount={itemCount} />
    )}
  </div>
);

const CartHeader: React.FC<{
  itemCount: number;
  onClearCart: () => void;
  itemsLength: number;
}> = ({ itemCount, onClearCart, itemsLength }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <ShoppingCart className="h-6 w-6 text-indigo-400" />
      <h3 className="text-white font-semibold text-xl">
        Keranjang ({itemCount} item)
      </h3>
    </div>

    {itemsLength > 0 && (
      <button
        onClick={onClearCart}
        className="text-red-400 hover:text-red-300 text-sm font-medium transition-all duration-300 flex items-center space-x-1 hover:scale-105 transform active:scale-95"
      >
        <Trash2 className="h-4 w-4" />
        <span>Hapus Semua</span>
      </button>
    )}
  </div>
);

const CartItemsList: React.FC<{
  items: Item[];
  onDeleteItem: (id: number) => void;
}> = ({ items, onDeleteItem }) => (
  <div className="bg-gray-800/20 rounded-xl border border-gray-700/30 max-h-96 overflow-y-auto">
    {items.length === 0 ? (
      <EmptyCart />
    ) : (
      <div className="divide-y divide-gray-700/30">
        {items.map((item, index) => (
          <CartItem
            key={item.id}
            item={item}
            index={index}
            onDeleteItem={onDeleteItem}
          />
        ))}
      </div>
    )}
  </div>
);

const EmptyCart: React.FC = () => (
  <div className="p-8 text-center">
    <ShoppingCart className="h-12 w-12 text-gray-600 mx-auto mb-3" />
    <p className="text-gray-400">Keranjang masih kosong</p>
    <p className="text-gray-500 text-sm mt-1">
      Tambahkan produk dengan voice atau manual input
    </p>
  </div>
);

const CartItem: React.FC<{
  item: Item;
  index: number;
  onDeleteItem: (id: number) => void;
}> = ({ item, index, onDeleteItem }) => (
  <div className="p-4 flex items-center justify-between hover:bg-gray-700/20 transition-all duration-300 transform hover:scale-[1.02]">
    <div className="flex-1">
      <div className="flex items-center space-x-3">
        <span className="text-gray-400 text-sm font-mono w-6">
          {index + 1}.
        </span>
        <div>
          <h4 className="text-white font-medium">{item.name}</h4>
          <p className="text-indigo-400 font-semibold">
            {formatToRupiah(item.price)}
          </p>
        </div>
      </div>
    </div>

    <button
      onClick={() => onDeleteItem(item.id)}
      className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/20 transition-all duration-300 transform hover:scale-110 active:scale-95"
      title={`Hapus ${item.name}`}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  </div>
);

const CartSummary: React.FC<{
  totalPrice: number;
  itemCount: number;
}> = ({ totalPrice, itemCount }) => (
  <div className="bg-gradient-to-r from-indigo-900/30 to-blue-900/30 rounded-xl p-6 border border-indigo-500/20 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/10">
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
);

const InstructionsFooter: React.FC = () => (
  <div className="max-w-4xl mx-auto mt-12 text-center">
    <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-700/30 p-6 transform transition-all duration-300 hover:scale-[1.02] hover:bg-gray-900/40">
      <h3 className="text-white font-semibold text-lg mb-4">
        💡 Tips Penggunaan
      </h3>
      <div className="grid md:grid-cols-2 gap-6 text-left">
        <div>
          <h4 className="text-indigo-400 font-medium mb-2">Voice Input:</h4>
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
);

export default Demo;