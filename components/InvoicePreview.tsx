
import React from 'react';
import { InvoiceData } from '../types';
import { convertAmountToWords } from '../utils/numberToWords';

interface Props {
  data: InvoiceData;
}

const InvoicePreview: React.FC<Props> = ({ data }) => {
  const subtotal = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tvaAmount = subtotal * (data.tvaRate / 100);
  
  let timbre = 0;
  if (data.paymentMethod === 'CASH') {
    timbre = Math.min(Math.max((subtotal + tvaAmount) * 0.01, 5), 10000);
  }
  
  const total = subtotal + tvaAmount + timbre;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const getPaymentLabel = () => {
    switch(data.paymentMethod) {
      case 'CASH': return 'نقداً (ESPECES)';
      case 'CHECK': return 'بصك (CHEQUE)';
      case 'TRANSFER': return 'تحويل بنكي (VIREMENT)';
      default: return '';
    }
  };

  return (
    <div className="bg-white p-8 min-h-[1100px] border-[10px] border-pink-50 relative flex flex-col font-cairo text-gray-800 invoice-print" style={{ pageBreakInside: 'avoid' }}>
      
      {/* Header Updated: Company Name Centered */}
      <div className="mb-6 border-b pb-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-reem text-gray-900 mb-2">{data.company.name}</h1>
          <p className="text-[12px] text-gray-600 font-amiri italic">
            {data.company.address} | الهاتف: {data.company.phone}
          </p>
        </div>
        
        <div className="flex justify-between items-end">
          <div dir="ltr" className="grid grid-cols-2 gap-x-6 gap-y-1 text-[10px] text-gray-500 font-mono border-r-2 border-pink-500 pr-4 text-left">
             <div className="flex gap-2"><strong>RC:</strong> <span>{data.company.rc}</span></div>
             <div className="flex gap-2"><strong>NIF:</strong> <span>{data.company.nif}</span></div>
             <div className="flex gap-2"><strong>NIS:</strong> <span>{data.company.nis}</span></div>
             <div className="flex gap-2"><strong>AI:</strong> <span>{data.company.ai}</span></div>
          </div>
          
          <div className="text-left">
            <div className="bg-gray-900 text-white px-8 py-3 rounded-bl-3xl shadow-lg transform -translate-x-4">
              <h2 className="text-2xl font-bold font-reem text-center">فـاتـورة</h2>
              <p className="text-[11px] opacity-80 mt-1 font-mono tracking-widest text-center">NO: {data.invoiceNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Info Section */}
      <div className="grid grid-cols-2 gap-8 mb-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="space-y-1 border-r-2 border-pink-100 pr-4">
          <h4 className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-1">بيانات الزبون:</h4>
          <h3 className="text-xl font-bold font-amiri text-gray-900">{data.client.name}</h3>
          <p className="text-[12px] text-gray-600 font-amiri">{data.client.address}</p>
          <p className="text-[11px] text-gray-500">الهاتف: {data.client.phone}</p>
          {data.client.nif && <p className="text-[10px] text-gray-400 mt-2">NIF: {data.client.nif}</p>}
        </div>
        <div className="text-left flex flex-col items-end justify-center space-y-3">
           <div className="text-[12px] flex gap-2">
              <span className="text-gray-400 font-bold">تاريخ الفاتورة:</span>
              <span className="font-bold text-gray-800">{formatDate(data.date)}</span>
           </div>
           <div className="text-[12px] flex gap-2">
              <span className="text-gray-400 font-bold">تاريخ الاستحقاق:</span>
              <span className="font-bold text-gray-800">{formatDate(data.dueDate)}</span>
           </div>
           <div className="mt-2">
              <span className="bg-pink-600 text-white px-4 py-1 rounded-lg text-[11px] font-bold shadow-sm">
                {getPaymentLabel()}
              </span>
           </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-grow">
        <table className="w-full text-right table-fixed border-collapse overflow-hidden rounded-t-xl">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="p-3 text-xs font-reem w-12 text-center border-l border-gray-700">#</th>
              <th className="p-3 text-xs font-reem text-right border-l border-gray-700">الوصف والبيان</th>
              <th className="p-3 text-xs font-reem w-20 text-center border-l border-gray-700">الكمية</th>
              <th className="p-3 text-xs font-reem w-32 text-center border-l border-gray-700">سعر الوحدة</th>
              <th className="p-3 text-xs font-reem w-32 text-left">المبلغ الصافي</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-x border-b border-gray-100">
            {data.items.map((item, idx) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-2 py-2 text-center text-[12px] text-gray-400 font-mono border-l border-gray-50">{idx + 1}</td>
                <td className="px-4 py-2 font-amiri text-[16px] text-gray-800 leading-tight border-l border-gray-50">{item.description}</td>
                <td className="px-2 py-2 text-center text-[14px] font-bold text-gray-600 border-l border-gray-50">{item.quantity}</td>
                <td className="px-2 py-2 text-center text-[14px] text-gray-600 border-l border-gray-50">{item.price.toLocaleString('ar-DZ')}</td>
                <td className="px-4 py-2 text-left text-[15px] font-bold text-gray-900">{(item.price * item.quantity).toLocaleString('ar-DZ')}</td>
              </tr>
            ))}
            {data.items.length < 12 && [...Array(Math.max(0, 12 - data.items.length))].map((_, i) => (
              <tr key={`filler-${i}`} className="h-10 border-none">
                <td colSpan={5}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 flex justify-between items-start gap-8">
        <div className="w-3/5">
          <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 shadow-sm mb-4">
            <h4 className="text-[10px] font-bold text-pink-600 mb-2">المبلغ الإجمالي بالحروف:</h4>
            <p className="text-[15px] font-amiri font-bold text-gray-800 italic leading-snug">
              {convertAmountToWords(total)}
            </p>
          </div>
          <div>
             <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-1">ملاحظات وشروط:</h4>
             <p className="text-[12px] text-gray-500 font-amiri leading-relaxed italic">{data.notes}</p>
          </div>
        </div>

        <div className="w-1/3 bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100 shadow-inner">
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-gray-500 font-bold">المجموع خارج الرسم:</span>
            <span className="font-bold text-gray-800">{subtotal.toLocaleString('ar-DZ')} دج</span>
          </div>
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-gray-500 font-bold">الرسم (TVA {data.tvaRate}%):</span>
            <span className="font-bold text-gray-800">{tvaAmount.toLocaleString('ar-DZ')} دج</span>
          </div>
          {timbre > 0 && (
            <div className="flex justify-between items-center text-[12px] text-pink-600 border-t border-dashed pt-2 mt-2">
              <span className="font-bold">حق الطابع (TIMBRE):</span>
              <span className="font-bold">{timbre.toLocaleString('ar-DZ')} دج</span>
            </div>
          )}
          <div className="h-px bg-gray-300 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-reem font-bold text-gray-900">المبلغ الإجمالي:</span>
            <span className="text-2xl font-bold text-pink-600">{total.toLocaleString('ar-DZ')} دج</span>
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="mt-12 flex justify-end">
        <div className="text-center relative pr-12">
          <p className="text-[11px] font-bold text-gray-400 mb-16 uppercase tracking-widest">إمضاء وختم المؤسسة</p>
          <div className="w-48 h-px bg-gray-200 mx-auto"></div>
          <div className="absolute top-2 -left-8 w-24 h-24 border-2 border-pink-100 rounded-full flex items-center justify-center opacity-10 rotate-12 pointer-events-none">
            <p className="text-[10px] text-pink-600 font-bold text-center p-2 leading-none uppercase">ORIGINAL<br/>DOCUMENT</p>
          </div>
          <p className="mt-3 font-bold text-gray-900 uppercase tracking-widest text-[10px]">{data.company.name}</p>
        </div>
      </div>

      <div className="mt-auto pt-8 text-center border-t border-gray-50">
        <p className="text-[10px] text-gray-400 italic">
          شكراً لتعاملكم معنا. هذه الوثيقة تم إنتاجها بواسطة النظام الرقمي للمؤسسة.
        </p>
      </div>

    </div>
  );
};

export default InvoicePreview;
