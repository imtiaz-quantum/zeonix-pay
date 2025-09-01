import { Eye, EyeOff, Copy } from "lucide-react";

interface RevealableFieldProps {
  label: string;
  value: string;
  show: boolean;
  toggleShow: () => void;
  onCopy: () => void;
}

export function RevealableField({ label, value, show, toggleShow, onCopy }: RevealableFieldProps) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center border rounded-lg px-3 py-2 bg-white">
        <input
          type={show ? "text" : "password"}
          readOnly
          value={value}
          className="flex-1 text-sm text-gray-900 bg-transparent focus:outline-none"
        />
        <button
          type="button"
          onClick={toggleShow}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
        <button
          type="button"
          onClick={onCopy}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          <Copy className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
/* function RevealableField({
  label,
  value,
  onCopy,
  show,
  toggleShow,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  show: boolean;
  toggleShow: () => void;
}) {
  return (
    <div className="space-y-1">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-slate-500">{label}</span>
        <button
          onClick={toggleShow}  // Toggle visibility on button click
          className="text-xs text-blue-500 hover:text-blue-700"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
      <div className="flex gap-2">
        <input
          readOnly
          type={show ? "text" : "password"} // Toggle between 'text' and 'password' for visibility
          value={value}
          className="mt-0 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-2 ring-transparent focus:ring-violet-200"
        />
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Copy className="h-4 w-4" /> Copy
        </button>
      </div>
    </div>
  );
}
 */