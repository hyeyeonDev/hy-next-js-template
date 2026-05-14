import { X } from "lucide-react";

interface MobileMenuProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function MobileMenu({ open, onClose, children }: MobileMenuProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="absolute left-0 top-0 h-full w-72 bg-surface shadow-xl">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <span className="text-sm font-semibold text-text">메뉴</span>
                    <button onClick={onClose} className="text-text-muted hover:text-text" aria-label="닫기">
                        <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
