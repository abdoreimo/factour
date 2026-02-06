
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Printer, Settings, FileText, RotateCcw, CreditCard, Banknote, Users, Archive, Save, Building2, Truck } from 'lucide-react';
import { InvoiceData, InvoiceItem, PaymentMethod, ClientInfo, CompanyInfo } from './types';
import InvoicePreview from './components/InvoicePreview';
import DeliveryNotePreview from './components/DeliveryNotePreview';

const COMPANY_KEY = 'algerian_company_data';
const CLIENTS_KEY = 'algerian_clients_data';
const ARCHIVE_KEY = 'algerian_archive_data';

const initialCompany: CompanyInfo = {
  name: "مؤسسة الابتكار للخدمات الرقمية",
  address: "حي 1200 مسكن، الدار البيضاء، الجزائر",
  phone: "+213 23 45 67 89",
  rc: "16/00-9876543B21",
  nif: "001916012345678",
  nis: "192016001234567",
  ai: "16011234567",
  bankName: "القرض الشعبي الجزائري (CPA)",
  bankAccount: "004 00123 4123456789 22"
};

const createNewInvoice = (company: CompanyInfo): InvoiceData => ({
  id: Math.random().toString(36).substr(2, 9),
  invoiceNumber: `${new Date().getFullYear()}/${(Math.floor(Math.random() * 900) + 100)}`,
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  company: { ...company },
  client: { id: '', name: "", address: "", phone: "", nif: "" },
  items: [{ id: '1', description: '', price: 0, quantity: 1 }],
  tvaRate: 19,
  paymentMethod: 'TRANSFER',
  notes: "تعتبر هذه الفاتورة بمثابة عقد بيع بين الطرفين."
});

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'clients' | 'archive' | 'settings'>('editor');
  
  const [company, setCompany] = useState<CompanyInfo>(() => {
    const saved = localStorage.getItem(COMPANY_KEY);
    return saved ? JSON.parse(saved) : initialCompany;
  });

  const [data, setData] = useState<InvoiceData>(() => createNewInvoice(company));
  const [clients, setClients] = useState<ClientInfo[]>(() => JSON.parse(localStorage.getItem(CLIENTS_KEY) || '[]'));
  const [archive, setArchive] = useState<InvoiceData[]>(() => JSON.parse(localStorage.getItem(ARCHIVE_KEY) || '[]'));

  useEffect(() => {
    localStorage.setItem(COMPANY_KEY, JSON.stringify(company));
    setData(prev => ({ ...prev, company: { ...company } }));
  }, [company]);

  useEffect(() => {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archive));
  }, [archive]);

  const handleAddItem = () => {
    const newItem: InvoiceItem = { id: Math.random().toString(36).substr(2, 9), description: '', price: 0, quantity: 1 };
    setData(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setData(prev => ({ ...prev, items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item) }));
  };

  const handleRemoveItem = (id: string) => {
    setData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
  };

  const handleSaveToArchive = () => {
    const isDuplicate = archive.some(inv => inv.invoiceNumber === data.invoiceNumber && inv.id !== data.id);
    if (isDuplicate) {
      alert(`خطأ: رقم الفاتورة (${data.invoiceNumber}) موجود مسبقاً في الأرشيف. يرجى تغيير الرقم.`);
      return;
    }

    const subtotal = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tva = subtotal * (data.tvaRate / 100);
    const archivedItem = { ...data, total: subtotal + tva };
    
    const existingIndex = archive.findIndex(inv => inv.id === data.id);
    if (existingIndex > -1) {
      const newArchive = [...archive];
      newArchive[existingIndex] = archivedItem;
      setArchive(newArchive);
      alert("تم تحديث الفاتورة في الأرشيف");
    } else {
      setArchive([archivedItem, ...archive]);
      alert("تم حفظ الفاتورة في الأرشيف بنجاح");
    }
  };

  const handleNewInvoice = () => {
    if (confirm("هل تريد البدء بفاتورة جديدة؟")) {
      setData(createNewInvoice(company));
      setActiveTab('editor');
    }
  };

  const handleAddClient = () => {
    const newClient: ClientInfo = { id: Date.now().toString(), name: 'عميل جديد', address: '', phone: '', nif: '' };
    setClients([newClient, ...clients]);
  };

  const updateClient = (id: string, field: keyof ClientInfo, value: string) => {
    setClients(clients.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const selectClientForInvoice = (client: ClientInfo) => {
    setData({ ...data, client: { ...client } });
    setActiveTab('editor');
  };

  return (
    <div className="min-h-screen pb-12">
      <header className="no-print bg-white border-b shadow-sm sticky top-0 z-30 px-4 py-2 flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-pink-600 p-2 rounded-lg shadow-md rotate-2">
            <FileText className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 font-reem leading-none">نظام الفواتير الجزائري</h1>
            <p className="text-[10px] text-pink-500 font-bold mt-1">الاحترافي المتكامل</p>
          </div>
        </div>

        <nav className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto max-w-full">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'settings' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Building2 size={16} /> معلومات المؤسسة
          </button>
          <button 
            onClick={() => setActiveTab('clients')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'clients' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Users size={16} /> العملاء
          </button>
          <button 
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'editor' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Plus size={16} /> إنشاء فاتورة
          </button>
          <button 
            onClick={() => setActiveTab('archive')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'archive' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Archive size={16} /> الأرشيف
          </button>
        </nav>

        <div className="flex gap-2">
          {activeTab === 'editor' && (
            <>
              <button onClick={handleNewInvoice} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600" title="فاتورة جديدة"><RotateCcw size={20} /></button>
              <button onClick={handleSaveToArchive} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-green-700 transition-all active:scale-95"><Save size={18} /> حفظ</button>
              <button onClick={() => window.print()} className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-pink-700 transition-all active:scale-95"><Printer size={18} /> طباعة</button>
            </>
          )}
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto mt-8 px-4">
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
            {/* إزالة max-h و overflow-y-auto للسماح للمحتوى بالتمدد طبيعياً */}
            <div className="no-print xl:col-span-2 space-y-6 pb-20 px-1">
              <div className="bg-white p-6 rounded-2xl shadow-md border">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800"><FileText size={20} className="text-pink-500" /> تفاصيل الفاتورة والزبون</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="رقم الفاتورة" value={data.invoiceNumber} onChange={v => setData({...data, invoiceNumber: v})} />
                  <Input label="التاريخ" type="date" value={data.date} onChange={v => setData({...data, date: v})} />
                  
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pr-1">طريقة الدفع</label>
                    <div className="flex gap-2">
                      {(['TRANSFER', 'CHECK', 'CASH'] as PaymentMethod[]).map(m => (
                        <button key={m} onClick={() => setData({...data, paymentMethod: m})} className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${data.paymentMethod === m ? 'bg-pink-600 border-pink-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                          {m === 'TRANSFER' ? 'تحويل' : m === 'CHECK' ? 'صك' : 'نقداً'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 border-t pt-4 mt-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">بيانات الزبون</label>
                      <button onClick={() => setActiveTab('clients')} className="text-[10px] text-pink-600 font-bold hover:underline">اختيار من القائمة</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="اسم الزبون" value={data.client.name} onChange={v => setData(d => ({...d, client: {...d.client, name: v}}))} />
                      <Input label="هاتف الزبون" value={data.client.phone} onChange={v => setData(d => ({...d, client: {...d.client, phone: v}}))} />
                      <Input label="عنوان الزبون" className="col-span-2" value={data.client.address} onChange={v => setData(d => ({...d, client: {...d.client, address: v}}))} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md border">
                <div className="flex justify-between mb-4 items-center">
                  <h2 className="text-lg font-bold text-gray-800">السلع والخدمات</h2>
                  <button onClick={handleAddItem} className="bg-pink-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md hover:bg-pink-700 transition-all active:scale-95">+ إضافة سطر</button>
                </div>
                <div className="space-y-3">
                  {data.items.map(item => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200 items-end">
                      <div className="col-span-12 md:col-span-6">
                        <label className="text-[9px] font-bold text-gray-400 block mb-1">الوصف</label>
                        <input className="w-full p-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-pink-500" placeholder="وصف السلعة..." value={item.description} onChange={e => handleUpdateItem(item.id, 'description', e.target.value)} />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <label className="text-[9px] font-bold text-gray-400 block mb-1">كمية</label>
                        <input type="number" className="w-full p-2 rounded-lg border text-sm text-center font-bold" value={item.quantity} onChange={e => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} />
                      </div>
                      <div className="col-span-6 md:col-span-3">
                        <label className="text-[9px] font-bold text-gray-400 block mb-1">سعر الوحدة</label>
                        <input type="number" className="w-full p-2 rounded-lg border text-sm font-bold" value={item.price} onChange={e => handleUpdateItem(item.id, 'price', parseFloat(e.target.value) || 0)} />
                      </div>
                      <div className="col-span-2 md:col-span-1 flex justify-center">
                        <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md border">
                <h2 className="text-lg font-bold mb-3 text-gray-800">ملاحظات إضافية</h2>
                <textarea className="w-full p-3 border rounded-xl text-sm min-h-[80px] outline-none focus:ring-2 focus:ring-pink-500" value={data.notes} onChange={e => setData({...data, notes: e.target.value})} />
              </div>
            </div>

            <div className="xl:col-span-3 sticky top-24 self-start">
              {/* المعاينة تظل ثابتة أثناء تمرير منطقة الإدخال على اليسار */}
              <div className="print-container bg-gray-50 p-2 lg:p-4 rounded-2xl shadow-inner border border-gray-100 flex flex-col gap-8 no-scrollbar overflow-visible">
                <div className="bg-white shadow-2xl rounded-lg overflow-hidden border">
                   <InvoicePreview data={data} />
                </div>
                <div className="bg-white shadow-2xl rounded-lg overflow-hidden relative border">
                   <div className="no-print absolute top-4 right-4 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                     <Truck size={14}/> سند تسليم مرافق
                   </div>
                   <DeliveryNotePreview data={data} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold font-reem text-gray-800">دليل العملاء</h2>
                <p className="text-sm text-gray-400">إدارة وحفظ بيانات زبائنك لسرعة الوصول</p>
              </div>
              <button onClick={handleAddClient} className="bg-pink-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-pink-700 transition-all shadow-lg active:scale-95"><Plus size={24} /> إضافة عميل جديد</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {clients.map(client => (
                <div key={client.id} className="bg-gray-50 border border-gray-200 p-6 rounded-2xl hover:shadow-xl transition-all relative group hover:border-pink-200">
                  <button onClick={() => setClients(clients.filter(c => c.id !== client.id))} className="absolute top-4 left-4 p-2 text-red-300 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500 rounded-full"><Trash2 size={20} /></button>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="bg-pink-100 p-2 rounded-lg text-pink-600"><Users size={20}/></div>
                       <h3 className="font-bold text-gray-700">{client.name || 'عميل بدون اسم'}</h3>
                    </div>
                    <Input label="اسم العميل الكامل" value={client.name} onChange={v => updateClient(client.id, 'name', v)} />
                    <Input label="العنوان الجغرافي" value={client.address} onChange={v => updateClient(client.id, 'address', v)} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="رقم الهاتف" value={client.phone} onChange={v => updateClient(client.id, 'phone', v)} />
                      <Input label="NIF" value={client.nif || ''} onChange={v => updateClient(client.id, 'nif', v)} />
                    </div>
                    <button onClick={() => selectClientForInvoice(client)} className="w-full bg-white text-pink-600 border-2 border-pink-100 py-3 rounded-xl font-bold text-sm hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all shadow-sm">إنشاء فاتورة لهذا العميل</button>
                  </div>
                </div>
              ))}
              {clients.length === 0 && (
                <div className="col-span-full py-32 text-center flex flex-col items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <Users size={64} className="text-gray-200 mb-4" />
                  <p className="text-gray-400 font-bold">لا يوجد زبائن مضافون بعد</p>
                  <button onClick={handleAddClient} className="mt-4 text-pink-600 font-bold hover:underline">أضف أول عميل الآن</button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'archive' && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 animate-in fade-in duration-300">
            <div className="mb-8">
              <h2 className="text-3xl font-bold font-reem text-gray-800">سجل الفواتير المؤرشفة</h2>
              <p className="text-sm text-gray-400">تتبع وأرشفة كافة العمليات التجارية</p>
            </div>
            <div className="overflow-hidden border border-gray-200 rounded-2xl">
              <table className="w-full text-right">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="p-5 text-sm font-bold uppercase tracking-widest font-reem">رقم الفاتورة</th>
                    <th className="p-5 text-sm font-bold uppercase tracking-widest font-reem">الزبون</th>
                    <th className="p-5 text-sm font-bold uppercase tracking-widest font-reem">التاريخ</th>
                    <th className="p-5 text-sm font-bold uppercase tracking-widest font-reem text-left">المبلغ الإجمالي</th>
                    <th className="p-5 text-sm font-bold uppercase tracking-widest font-reem text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {archive.map(inv => (
                    <tr key={inv.id} className="hover:bg-pink-50/30 transition-all group">
                      <td className="p-5 text-sm font-bold text-pink-600">{inv.invoiceNumber}</td>
                      <td className="p-5 text-sm font-bold text-gray-700">{inv.client.name}</td>
                      <td className="p-5 text-sm text-gray-500 font-mono">{inv.date}</td>
                      <td className="p-5 text-sm font-bold text-left text-gray-900">{inv.total?.toLocaleString('ar-DZ')} دج</td>
                      <td className="p-5 flex justify-center gap-3">
                        <button onClick={() => { setData(inv); setActiveTab('editor'); }} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-bold text-xs hover:bg-blue-600 hover:text-white transition-all"><RotateCcw size={14} /> فتح وتحرير</button>
                        <button onClick={() => setArchive(archive.filter(a => a.id !== inv.id))} className="p-2 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-4 mb-8 border-b pb-6">
              <div className="bg-pink-600 p-4 rounded-2xl shadow-lg shadow-pink-100">
                <Building2 className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-bold font-reem text-gray-800">إدارة معلومات المؤسسة</h2>
                <p className="text-sm text-gray-400">البيانات القانونية والبنكية التي ستظهر في ترويسة الفاتورة</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-pink-600 flex items-center gap-2 border-r-4 border-pink-500 pr-3">المعلومات العامة</h3>
                <Input label="اسم المؤسسة / العلامة التجارية" value={company.name} onChange={v => setCompany({...company, name: v})} />
                <Input label="العنوان التجاري" value={company.address} onChange={v => setCompany({...company, address: v})} />
                <Input label="رقم الهاتف والاتصال" value={company.phone} onChange={v => setCompany({...company, phone: v})} />
                
                <h3 className="text-lg font-bold text-pink-600 flex items-center gap-2 border-r-4 border-pink-500 pr-3 mt-8">البيانات البنكية</h3>
                <Input label="اسم البنك (Bank Name)" value={company.bankName} onChange={v => setCompany({...company, bankName: v})} />
                <Input label="رقم الحساب البنكي (RIB/RIB)" value={company.bankAccount} onChange={v => setCompany({...company, bankAccount: v})} />
              </div>

              <div className="space-y-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-r-4 border-gray-400 pr-3">المعلومات القانونية (الجزائر)</h3>
                <div className="space-y-4">
                  <Input label="السجل التجاري (RC)" value={company.rc} onChange={v => setCompany({...company, rc: v})} />
                  <Input label="الرقم التعريفي الضريبي (NIF)" value={company.nif} onChange={v => setCompany({...company, nif: v})} />
                  <Input label="الرقم التعريفي الإحصائي (NIS)" value={company.nis} onChange={v => setCompany({...company, nis: v})} />
                  <Input label="رقم المادة (AI)" value={company.ai} onChange={v => setCompany({...company, ai: v})} />
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t flex justify-end gap-4">
               <button onClick={() => setActiveTab('editor')} className="px-8 py-3 bg-pink-600 text-white rounded-2xl font-bold shadow-lg shadow-pink-100 hover:bg-pink-700 transition-all active:scale-95">العودة لإنشاء الفواتير</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const Input: React.FC<{ label: string; value: string | number; onChange: (val: string) => void; type?: string; className?: string }> = ({ label, value, onChange, type = "text", className = "" }) => (
  <div className={className}>
    <label className="text-[10px] font-bold text-gray-500 block mb-1 uppercase tracking-wider pr-1">{label}</label>
    <input type={type} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:ring-4 focus:ring-pink-50 focus:border-pink-500 outline-none transition-all shadow-sm" value={value} onChange={e => onChange(e.target.value)} />
  </div>
);

export default App;
