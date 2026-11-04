import React, { useState } from 'react';
import { X, Key, Check, ShieldCheck, ExternalLink, Zap } from 'lucide-react';

interface BYOPModalProps {
  apiKey: string;
  onSaveKey: (key: string) => void;
  onClose: () => void;
}

export const BYOPModal: React.FC<BYOPModalProps> = ({
  apiKey,
  onSaveKey,
  onClose,
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [copied, setCopied] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKey(inputKey.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#141620] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-zinc-950 flex items-center justify-center font-bold text-sm">
              <Zap className="w-4 h-4 fill-zinc-950" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Bring Your Own Pollen (BYOP)</h3>
              <p className="text-[11px] text-zinc-400 font-mono">Pollinations Pay Authentication</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-200 leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Users authorize Towers AI to direct company agents using their own Pollen. You stay in control of your balance and revocation.
            </span>
          </div>

          {/* Direct Key Input */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Pollinations Secret API Key (sk_...)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="sk_..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
              <p className="text-[11px] text-zinc-500 mt-1.5 flex items-center gap-1">
                <span>Get your personal key from</span>
                <a
                  href="https://enter.pollinations.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline inline-flex items-center gap-0.5"
                >
                  <span>enter.pollinations.ai/keys</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Save Key & Connect</span>
              </button>

              {apiKey && (
                <button
                  type="button"
                  onClick={() => {
                    setInputKey('');
                    onSaveKey('');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-red-400 text-xs font-medium transition-colors"
                >
                  Disconnect
                </button>
              )}
            </div>
          </form>

          {/* Drop-in Web Button integration info */}
          <div className="pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-500 font-mono text-center">
            Drop-in OAuth / Device Flow enabled via Pollinations Connect
          </div>
        </div>
      </div>
    </div>
  );
};
