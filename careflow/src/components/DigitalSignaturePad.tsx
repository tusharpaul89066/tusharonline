import React, { useRef, useState, useEffect } from "react";
import { ShieldAlert, Image as ImageIcon } from "lucide-react";

interface DigitalSignaturePadProps {
  onSave: (signatureDataUrl: string) => void;
  onClear: () => void;
  value: string;
  nurseName?: string;
  disabled?: boolean;
}

export default function DigitalSignaturePad({
  onSave,
  onClear,
  value,
  nurseName = "Nursing Officer",
  disabled = false,
}: DigitalSignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [signMode, setSignMode] = useState<"draw" | "type">("type");
  const [typedName, setTypedName] = useState(nurseName);
  const [selectedCursiveStyle, setSelectedCursiveStyle] = useState("GreatVibes");

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      onClear();
    }
  };

  useEffect(() => {
    if (signMode === "type" && typedName) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.strokeStyle = "#f1f5f9";
          ctx.lineWidth = 1;
          ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);

          ctx.fillStyle = "#1e293b";

          let fontStyle = "italic 36px 'Great Vibes', 'Dancing Script', cursive";
          if (selectedCursiveStyle === "DancingScript") {
            fontStyle = "bold italic 30px 'Dancing Script', sans-serif";
          } else if (selectedCursiveStyle === "ClassicSerif") {
            fontStyle = "italic 28px serif";
          }

          ctx.font = fontStyle;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(typedName, canvas.width / 2, canvas.height / 2);

          ctx.strokeStyle = "#e2e8f0";
          ctx.beginPath();
          ctx.moveTo(30, canvas.height - 25);
          ctx.lineTo(canvas.width - 30, canvas.height - 25);
          ctx.stroke();

          ctx.fillStyle = "#10b981";
          ctx.font = "bold 8px sans-serif";
          ctx.fillText(
            "DIGITALLY SECURED TRANS-LOG • MOHFW VERIFIED",
            canvas.width / 2,
            canvas.height - 12
          );

          const dataUrl = canvas.toDataURL("image/png");
          onSave(dataUrl);
        }
      }
    }
  }, [signMode, typedName, selectedCursiveStyle, nurseName]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  useEffect(() => {
    if (nurseName) {
      setTypedName(nurseName);
    }
  }, [nurseName]);

  const getEventPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled || signMode !== "draw") return;
    const pos = getEventPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
    setLastX(pos.x);
    setLastY(pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled || !isDrawing || signMode !== "draw") return;
    const pos = getEventPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#0f766e"; 
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    setLastX(pos.x);
    setLastY(pos.y);
  };

  const stopDrawing = () => {
    if (disabled) return;
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        const dataUrl = canvas.toDataURL("image/png");
        onSave(dataUrl);
      }
    }
  };

  return (
    <div id="digital-signature-pad" className="border border-emerald-100 shadow-sm rounded-2xl rounded-xl p-3 bg-white space-y-3.5 relative overflow-hidden">
      {disabled && (
        <div className="absolute inset-0 bg-emerald-50/80/85  rounded-xl flex flex-col justify-center items-center z-20 text-center p-4">
          <ShieldAlert className="w-8 h-8 text-amber-500 animate-bounce mb-1.5" />
          <h4 className="text-amber-400 font-extrabold text-[11px] uppercase tracking-wider">
            Access Restricted to Authorized Staff Only
          </h4>
          <p className="text-zinc-300 text-[10px] mt-1 pr-1 pl-1 max-w-xs font-semibold leading-relaxed">
            শুধুমাত্র প্যাথলজিস্ট/নার্স স্বাক্ষর করতে পারবেন। ক্রিয়াকলাপের জন্য অনুগ্রহ করে উপরে সংশ্লিষ্ট সিমুলেটর রোল নির্বাচন করুন।
          </p>
        </div>
      )}
      <div className="flex justify-between items-center bg-slate-100 p-1 rounded-lg">
        <span className="text-[10px] font-black uppercase text-slate-800 tracking-wide flex items-center gap-1.5 pl-1">
          Authorized Signature (অনুমোদিত ডিজিটাল স্বাক্ষর প্যাড)
        </span>
        <div className="flex gap-1 bg-white p-0.5 rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => {
              setSignMode("draw");
              handleClear();
            }}
            className={`px-3 py-1 rounded text-[9px] uppercase font-black cursor-pointer border-none transition-all duration-150 ${signMode === "draw" ? "bg-teal-500 text-slate-950 font-black" : "text-slate-9000 hover:text-slate-900"}`}
          >
            Draw freehand (আঁকুন)
          </button>
          <button
            type="button"
            onClick={() => {
              setSignMode("type");
            }}
            className={`px-3 py-1 rounded text-[9px] uppercase font-black cursor-pointer border-none transition-all duration-150 ${signMode === "type" ? "bg-teal-500 text-slate-950 font-black" : "text-slate-9000 hover:text-slate-900"}`}
          >
            Generate Type (টাইপ)
          </button>
        </div>
      </div>

      <div className="relative border border-emerald-100 shadow-sm rounded-2xl/80 rounded-xl overflow-hidden bg-white shadow-inner flex flex-col justify-center items-center">
        <canvas
          ref={canvasRef}
          width={450}
          height={120}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-[120px] max-w-[450px] cursor-crosshair bg-white"
        />
        {signMode === "draw" && !value && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-9000 select-none pointer-events-none text-center">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-9000">
                SIGN HERE (অফিসিয়াল স্বাক্ষর প্যাড)
              </p>
              <p className="text-[8.5px] text-zinc-300">
                Draw with your mouse, stylus or finger
              </p>
            </div>
          </div>
        )}
      </div>

      {signMode === "type" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-emerald-100 shadow-sm rounded-2xl/60 font-sans text-xs">
          <div>
            <label className="block text-[10px]  mb-1 tracking-wide font-black uppercase text-slate-900">
              Staff Full Name:
            </label>
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2 rounded-xl outline-none text-slate-900 font-mono text-xs focus:border-teal-500 bg-white"
              placeholder="Type name..."
            />
          </div>
          <div>
            <label className="block text-[10px]  mb-1 tracking-wide font-black uppercase text-slate-900">
              Handwriting style:
            </label>
            <select
              value={selectedCursiveStyle}
              onChange={(e) => setSelectedCursiveStyle(e.target.value)}
              className="w-full border border-emerald-100 shadow-sm rounded-2xl p-1.5 rounded-xl bg-white outline-none text-xs focus:border-teal-500 cursor-pointer"
            >
              <option value="GreatVibes">Standard Cursive / Great Vibes</option>
              <option value="DancingScript">Modern Display Style</option>
              <option value="ClassicSerif">Formal Business Serif Italic</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-between items-center text-[10px] text-slate-405 text-slate-9000 gap-2 font-mono">
        <span className="text-emerald-700 font-bold font-sans flex items-center gap-1">
          ✓ Secure Electronic Log-seal Certified Certified Sync
        </span>
        <button
          type="button"
          onClick={handleClear}
          className="text-stone-500 hover:text-rose-600 hover:bg-rose-50 border border-emerald-100 shadow-sm rounded-2xl hover:border-rose-200 px-3 py-1 rounded-lg uppercase tracking-wider font-extrabold cursor-pointer text-[9px] transition-all bg-white"
        >
          Clear (পরিষ্কার)
        </button>
      </div>
    </div>
  );
}
