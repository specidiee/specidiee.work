import { ToastProvider } from '@/contexts/ToastContext';

export default function GTDLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ToastProvider>
            {children}
        </ToastProvider>
    );
}
