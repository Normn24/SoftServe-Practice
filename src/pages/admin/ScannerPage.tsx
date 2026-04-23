import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useValidateTicketMutation } from "../../services/ticketsApi";
import { CheckCircle, XCircle, ScanLine, RefreshCw, ShieldCheck } from "lucide-react";

const SCANNER_ELEMENT_ID = "qr-scanner-container";

type ScanStatus = "idle" | "loading" | "success" | "error" | "already_used";

interface ScanResult {
  status: ScanStatus;
  message: string;
  seatNumber?: number;
  movieId?: number;
}

interface ApiError {
  status?: number;
  data?: { message?: string };
}

/**
 * Utility for parsing ticket ID
 */
const extractTicketId = (qrContent: string): string | null => {
  try {
    const url = new URL(qrContent);
    const parts = url.pathname.split("/");
    const validateIdx = parts.indexOf("validate");
    return validateIdx > 0 ? parts[validateIdx - 1] : null;
  } catch {
    return /^[a-f\d]{24}$/i.test(qrContent.trim()) ? qrContent.trim() : null;
  }
};

interface StatusCardProps {
  result: ScanResult;
  onReset: () => void;
}

/**
 * Dumb/Presentational Component
 */
const StatusCard: React.FC<StatusCardProps> = memo(({ result, onReset }) => {
  const config = {
    success: {
      icon: CheckCircle,
      iconClass: "text-green-400",
      bg: "bg-green-400/10 border-green-400/30",
      title: "Ticket is valid",
    },
    error: {
      icon: XCircle,
      iconClass: "text-red-400",
      bg: "bg-red-400/10 border-red-400/30",
      title: "Error",
    },
    already_used: {
      icon: XCircle,
      iconClass: "text-orange-400",
      bg: "bg-orange-400/10 border-orange-400/30",
      title: "Already used",
    },
    loading: {
      icon: RefreshCw,
      iconClass: "text-yellow-400 animate-spin",
      bg: "bg-yellow-400/10 border-yellow-400/30",
      title: "Verification...",
    },
    idle: {
      icon: ScanLine,
      iconClass: "text-gray-400",
      bg: "bg-gray-800 border-gray-700",
      title: "",
    },
  }[result.status];

  const Icon = config.icon;

  return (
    <div className={`rounded-xl border p-6 flex flex-col items-center gap-4 text-center transition-all duration-300 ${config.bg}`}>
      <Icon className={`w-14 h-14 ${config.iconClass}`} strokeWidth={1.5} />
      {config.title && (
        <div>
          <p className="text-xl font-bold text-white">{config.title}</p>
          <p className="text-gray-400 text-sm mt-1">{result.message}</p>
          {result.seatNumber !== undefined && (
            <div className="flex gap-4 justify-center mt-3 text-sm">
              <span className="text-gray-400">
                Місце <span className="text-white font-semibold">{result.seatNumber}</span>
              </span>
            </div>
          )}
        </div>
      )}
      {result.status !== "idle" && result.status !== "loading" && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition"
        >
          <ScanLine className="w-4 h-4" />
          Scan again
        </button>
      )}
    </div>
  );
});

StatusCard.displayName = "StatusCard";

/**
 * Smart/Container Component
 */
const ScannerPage: React.FC = () => {
  const [validateTicket] = useValidateTicketMutation();
  const [scanResult, setScanResult] = useState<ScanResult>({
    status: "idle",
    message: "Put the camera on the ticket QR code",
  });
  const [isScanning, setIsScanning] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef(false);
  const isStartingRef = useRef(false);

  const stopScanner = useCallback(async () => {
    if (!scannerRef.current) return;
    try {
      if (scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }
      scannerRef.current.clear();
    } catch (err) {
      console.error("Scanner cleanup error:", err);
    } finally {
      setIsScanning(false);
    }
  }, []);

  const handleScanSuccess = useCallback(
    async (decodedText: string) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      const ticketId = extractTicketId(decodedText);

      if (!ticketId) {
        setScanResult({
          status: "error",
          message: "Invalid QR code. This is not a CD Player Cinema ticket.",
        });
        await stopScanner();
        isProcessingRef.current = false;
        return;
      }

      setScanResult({ status: "loading", message: "Verifying ticket..." });
      await stopScanner();

      try {
        const data = await validateTicket(ticketId).unwrap();
        setScanResult({
          status: "success",
          message: "Passage is allowed",
          seatNumber: data.ticket.seatNumber,
          movieId: data.ticket.movieInCinema,
        });
      } catch (error) {
        const err = error as ApiError;
        const status = err.status === 409 ? "already_used" : "error";
        setScanResult({
          status,
          message: status === "already_used" ? "This ticket has already been used" : "Ticket not found or server error",
        });
      } finally {
        isProcessingRef.current = false;
      }
    },
    [validateTicket, stopScanner]
  );

  const startScanner = useCallback(async () => {
    if (isStartingRef.current || scannerRef.current?.isScanning || isProcessingRef.current) return;
    
    isStartingRef.current = true;
    setScanResult({ status: "idle", message: "Point the camera at the ticket QR code" });

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(SCANNER_ELEMENT_ID);
      }

      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        handleScanSuccess,
        () => {} // Ігноруємо помилки кадрів під час сканування
      );

      setIsScanning(true);
    } catch {
      setScanResult({
        status: "error",
        message: "Could not access the camera. Please check browser permissions.",
      });
    } finally {
      isStartingRef.current = false;
    }
  }, [handleScanSuccess]);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      await startScanner();
      // Захист від гонки потоків: якщо компонент встиг розмонтуватися до завершення ініціалізації
      if (!isMounted && scannerRef.current?.isScanning) {
        await stopScanner();
      }
    };

    init();

    return () => {
      isMounted = false;
      stopScanner();
    };
  }, [startScanner, stopScanner]);

  return (
    <div className="min-h-screen bg-[#0e0e1b] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md flex flex-col gap-6">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-400/15 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Ticket verification</h1>
            <p className="text-gray-500 text-xs">Administrator scanner</p>
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden bg-gray-900 border border-gray-800 min-h-[300px] flex items-center justify-center">
          <div id={SCANNER_ELEMENT_ID} className="w-full" />
          
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[250px] h-[250px] relative">
                {(["tl", "tr", "bl", "br"] as const).map((corner) => (
                  <span
                    key={corner}
                    className={`absolute w-8 h-8 border-yellow-400 border-2 ${
                      corner === "tl" ? "top-0 left-0 border-r-0 border-b-0 rounded-tl-lg" :
                      corner === "tr" ? "top-0 right-0 border-l-0 border-b-0 rounded-tr-lg" :
                      corner === "bl" ? "bottom-0 left-0 border-r-0 border-t-0 rounded-bl-lg" :
                      "bottom-0 right-0 border-l-0 border-t-0 rounded-br-lg"
                    }`}
                  />
                ))}
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-yellow-400/60 animate-pulse" />
              </div>
            </div>
          )}

          {!isScanning && scanResult.status === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-600 bg-gray-900 z-10">
              <ScanLine className="w-12 h-12" />
              <p className="text-sm">Initializing camera...</p>
            </div>
          )}
        </div>
        
        <StatusCard result={scanResult} onReset={startScanner} />

      </div>
    </div>
  );
};

export default ScannerPage;