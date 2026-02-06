
import React from 'react';
import { InvoiceData } from '../types';

interface Props {
  data: InvoiceData;
}

const DeliveryNotePreview: React.FC<Props> = ({ data }) => {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white p-8 min-h-[1100px] border-[10px] border-blue-50 relative flex flex-col font-cairo text-gray-800 print:mt-8 page-break-before-always" style={{ pageBreakBefore: 'always' }}>
      
      {/* Header Updated: Company Name Centered */}
      <div className="mb-6 border-b pb-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-reem text-gray-900 mb-2">{data.company.name}</h1>
          <p className="text-[12px] text-gray-600 font-amiri italic">
            {data.company.address} | الهاتف: {data.company.phone}
          </p>
        </div>
        
        <div className="flex justify-between items-end">
          <div dir="ltr" className="grid grid-cols-2 gap-x-6 gap-y-1 text-[10px] text-gray-500 font-mono border-r-2 border-blue-500 pr-4 text-left">
             <div className="flex gap-2"><strong>RC:</strong> <span>{data.company.rc}</span></div>
             <div className="flex gap-2"><strong>NIF:</strong> <span>{data.company.nif}</span></div>
             <div className="flex gap-2"><strong>NIS:</strong> <span>{data.company.nis}</span></div>
             <div className="flex gap-2"><strong>AI:</strong> <span>{data.company.ai}</span></div>
          </div>
          
          <div className="text-left">
            <div className="bg-blue-900 text-white px-8 py-3 rounded-bl-3xl shadow-lg transform -translate-x-4">
              <h2 className="text-2xl font-bold font-reem text-center">سند تسليم</h2>
              <p className="text-[11px] opacity-80 mt-1 font-mono tracking-widest text-center">NO: {data.invoiceNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Info Section */}
      <div className="grid grid-cols-2 gap-8 mb-6 bg-blue-50/30 p-6 rounded-2xl border border-blue-100 shadow-sm">
        <div className="space-y-1 border-r-2 border-blue-100 pr-4">
          <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">المرسل إليه:</h4>
          <h3 className="text-xl font-bold font-amiri text-gray-900">{data.client.name}</h3>
          <p className="text-[12px] text-gray-600 font-amiri">{data.client.address}</p>
          <p className="text-[11px] text-gray-500">الهاتف: {data.client.phone}</p>
        </div>
        <div className="text-left flex flex-col items-end justify-center">
           <div className="text-[12px] flex gap-2">
              <span className="text-gray-400 font-bold">تاريخ التسليم:</span>
              <span className="font-bold text-gray-800">{formatDate(data.date)}</span>
           </div>
           <div className="mt-3 text-[11px] text-blue-600 font-bold uppercase italic border border-blue-200 px-3 py-1 rounded">
             Bordereau de Livraison
           </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-grow">
        <table className="w-full text-right table-fixed border-collapse overflow-hidden rounded-t-xl">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="p-3 text-xs font-reem w-12 text-center border-l border-blue-700">#</th>
              <th className="p-3 text-xs font-reem text-right border-l border-blue-700">تعيين السلع والخدمات</th>
              <th className="p-3 text-xs font-reem w-32 text-center">الكمية المسلمة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-x border-b border-gray-100">
            {data.items.map((item, idx) => (
              <tr key={item.id} className="hover:bg-blue-50/10 transition-colors">
                <td className="px-2 py-3 text-center text-[12px] text-gray-400 font-mono border-l border-gray-50">{idx + 1}</td>
                <td className="px-4 py-3 font-amiri text-[17px] text-gray-800 leading-tight border-l border-gray-50">{item.description}</td>
                <td className="px-2 py-3 text-center text-[16px] font-bold text-gray-900">{item.quantity}</td>
              </tr>
            ))}
            {data.items.length < 12 && [...Array(Math.max(0, 12 - data.items.length))].map((_, i) => (
              <tr key={`filler-${i}`} className="h-12 border-none">
                <td colSpan={3}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Signatures */}
      <div className="mt-12 grid grid-cols-2 gap-24">
        <div className="text-center">
          <p className="text-[11px] font-bold text-gray-400 mb-20 uppercase tracking-widest">إمضاء المستلم</p>
          <div className="w-56 h-px bg-gray-200 mx-auto"></div>
          <p className="mt-3 text-[10px] text-gray-400 italic">(يرجى كتابة الاسم واللقب وتاريخ الاستلام)</p>
        </div>
        <div className="text-center relative">
          <p className="text-[11px] font-bold text-gray-400 mb-20 uppercase tracking-widest">ختم وإمضاء المؤسسة</p>
          <div className="w-56 h-px bg-gray-200 mx-auto"></div>
          <div className="absolute top-2 right-1/4 w-28 h-28 border-2 border-blue-100 rounded-full flex items-center justify-center opacity-10 rotate-12 pointer-events-none">
            <p className="text-[10px] text-blue-600 font-bold text-center p-3 leading-none uppercase">LIVRAISON<br/>CONFORME</p>
          </div>
          <p className="mt-3 font-bold text-gray-900 uppercase tracking-widest text-[10px]">{data.company.name}</p>
        </div>
      </div>

      <div className="mt-auto pt-8 text-center border-t border-gray-50">
        <p className="text-[10px] text-gray-400 italic">
          سند التسليم هذا يثبت خروج السلعة من مخازننا واستلامها من طرف الزبون في حالة جيدة.
        </p>
      </div>

    </div>
  );
};

export default DeliveryNotePreview;
