import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  onClose?: () => void; // called when modal closed/cancelled
  onConfirm?: () => void; // called when user clicks Aceptar
  showAccept?: boolean; // whether to show Accept button
  showCancel?: boolean; // whether to show Cancel button
  autoClose?: boolean; // optional auto close (rare for modals)
  duration?: number;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  onConfirm,
  showAccept = true,
  showCancel = false,
  autoClose = false,
  duration = 5000
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;
    if (autoClose) {
      const t = setTimeout(() => {
        setVisible(false);
        const fn = onConfirm || onClose;
        if (fn) fn();
      }, duration);
      return () => clearTimeout(t);
    }
  }, [autoClose, duration, onClose, onConfirm, visible]);

  if (!visible) return null;

  const styleMap: Record<AlertType, any> = {
    success: { accent: 'from-emerald-500 to-emerald-600', icon: CheckCircle, color: 'text-emerald-700' },
    error: { accent: 'from-red-500 to-red-600', icon: AlertCircle, color: 'text-red-700' },
    warning: { accent: 'from-amber-500 to-amber-600', icon: AlertTriangle, color: 'text-amber-700' },
    info: { accent: 'from-teal-500 to-teal-600', icon: Info, color: 'text-teal-700' }
  };

  const { accent, icon: Icon, color } = styleMap[type];

  const handleConfirm = () => {
    setVisible(false);
    if (onConfirm) onConfirm();
    else onClose && onClose();
  };

  const handleCancel = () => {
    setVisible(false);
    onClose && onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />

      <div role="dialog" aria-modal="true" className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-auto overflow-hidden">
        <div className={`py-6 px-6 bg-gradient-to-r ${accent} text-white`}>
          <div className="flex items-center gap-3">
            <Icon size={28} />
            <div>
              <h3 className="text-lg font-semibold">{title || (type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Information')}</h3>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className={`text-sm ${color}`}>{message}</p>
        </div>

        <div className="px-6 pb-6 flex justify-end gap-3">
          {showCancel && (
            <button onClick={handleCancel} className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm">Cancel</button>
          )}
          {showAccept && (
            <button onClick={handleConfirm} className={`px-4 py-2 rounded-md text-white bg-gradient-to-r ${accent} text-sm`}>Accept</button>
          )}
        </div>
      </div>
    </div>
  );
};

// Demo actualizado
export const AlertDemo: React.FC = () => {
  const [show, setShow] = useState(false);
  const [cfg, setCfg] = useState<{ type: AlertType; title?: string; message: string }>({ type: 'success', title: 'Success', message: 'Operation completed successfully.' });

  return (
    <div className="min-h-screen flex items-start justify-center p-8 bg-slate-50">
      <div className="max-w-3xl w-full">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Alert Modal Demo</h2>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => { setCfg({ type: 'success', title: 'Success', message: 'The book has been added.' }); setShow(true); }} className="px-4 py-2 bg-emerald-600 text-white rounded">Success</button>
            <button onClick={() => { setCfg({ type: 'error', title: 'Error', message: 'The operation failed.' }); setShow(true); }} className="px-4 py-2 bg-red-600 text-white rounded">Error</button>
            <button onClick={() => { setCfg({ type: 'warning', title: 'Warning', message: 'This action may have consequences.' }); setShow(true); }} className="px-4 py-2 bg-amber-600 text-white rounded">Warning</button>
            <button onClick={() => { setCfg({ type: 'info', title: 'Info', message: 'There are new messages available.' }); setShow(true); }} className="px-4 py-2 bg-teal-600 text-white rounded">Info</button>
          </div>
        </div>

        {show && (
          <Alert
            type={cfg.type}
            title={cfg.title}
            message={cfg.message}
            onClose={() => setShow(false)}
            onConfirm={() => { setShow(false); window.alert('You accepted.'); }}
            showAccept={true}
          />
        )}
      </div>
    </div>
  );
};

export default Alert;