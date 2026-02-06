
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { 
    Plus, Trash2, Printer, FileText, RotateCcw, 
    Users, Archive, Save, Building2, Truck 
} from 'lucide-react';

/** --- Interfaces & Types --- **/
interface InvoiceItem {
    id: string;
    description: string;
    price: number;
    quantity: number;
}

interface CompanyInfo {
    name: string;
    address: string;
    phone: string;
    rc: string;
    nif: string;
    nis: string;
    ai: string;
    bankName: string;
    bankAccount: string;
}

interface ClientInfo {
    id: string;
    name: string;
    address: string;
    phone: string;
    nif?: string;
}

type PaymentMethod = 'CASH' | 'TRANSFER' | 'CHECK';

interface InvoiceData {
    id: string;
    invoiceNumber: string;
    date: string;
    dueDate: string;
    company: CompanyInfo;
    client: ClientInfo;
    items: InvoiceItem[];
    tvaRate: number;
    paymentMethod: PaymentMethod;
    notes: string;
    total?: number;
}

/** --- Utilities --- **/
const convertAmountToWords = (amount: number): string => {
    return `هذه الفاتورة محددة بمبلغ إجمالي قدره: ${amount.toLocaleString('ar-DZ')} دينار جزائري فقط لا غير.`;
};

/** --- Sub-Component: Invoice Preview --- **/
const InvoicePreview: React.FC<{ data: InvoiceData }> = ({ data }) => {
    const subtotal = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tvaAmount = subtotal * (data.tvaRate / 100);
    const timbre = data.paymentMethod === 'CASH' ? Math.min(Math.max((subtotal + tvaAmount) * 0.01, 5), 10000) : 0;
    const total = subtotal + tvaAmount + timbre;

    const formatDate = (dateStr: string) => {
        try { return new Date(dateStr).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' }); }
        catch { return dateStr; }
    };

    return (
        <div className="invoice-page bg-white p-10 min-h-[1120px] relative flex flex-col font-cairo text-gray-800 border-[10px] border-pink-50/50">
            {/* Header: Centered Company Name */}
            <div className="mb-6 border-b pb-6 text-center">
                <h1 className="text-4xl font-reem text-gray-900 mb-2 leading-relaxed">{data.company.name}</h1>
                <p className="text-[13px] text-gray-600 font-amiri italic mb-4">
                    {data.company.address} | الهاتف: {data.company.phone}
                </p>
                <div className="flex justify-between items-end text-right">
                    <div dir="ltr" className="grid grid-cols-2 gap-x-6 gap-y-0.5 text-[10px] text-gray-500 font-mono border-r-4 border-pink-600 pr-4 text-left">
                        <div><strong>RC:</strong> {data.company.rc}</div>
                        <div><strong>NIF:</strong> {data.company.nif}</div>
                        <div><strong>NIS:</strong> {data.company.nis}</div>
                        <div><strong>AI:</strong> {data.company.ai}</div>
                    </div>
                    <div className="text-left">
                        <div className="bg-gray-900 text-white px-8 py-3 rounded-bl-3xl shadow-lg transform -translate-x-4">
                            <h2 className="text-2xl font-bold font-reem text-center">فـاتـورة</h2>
                            <p className="text-[11px] opacity-70 mt-1 font-mono tracking-widest text-center">N°: {data.invoiceNumber}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-2 gap-8 mb-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <div className="space-y-1 border-r-2 border-pink-100 pr-4">
                    <h4 className="text-[10px] font-bold text-pink-500 uppercase mb-1">بيانات الزبون:</h4>
                    <h3 className="text-xl font-bold font-amiri text-gray-900">{data.client.name}</h3>
                    <p className="text-[13px] text-gray-600 font-amiri">{data.client.address}</p>
                    <p className="text-[11px] text-gray-500">الهاتف: {data.client.phone}</p>
                </div>
                <div className="text-left flex flex-col items-end justify-center space-y-2">
                    <div className="text-[12px] flex gap-2">
                        <span className="text-gray-400 font-bold">تاريخ الفاتورة:</span>
                        <span className="font-bold text-gray-800">{formatDate(data.date)}</span>
                    </div>
                    <div className="text-[12px] flex gap-2">
                        <span className="text-gray-400 font-bold">الاستحقاق:</span>
                        <span className="font-bold text-gray-800">{formatDate(data.dueDate)}</span>
                    </div>
                    <div className="mt-2">
                        <span className="bg-pink-600 text-white px-4 py-1 rounded-full text-[11px] font-bold">
                            {data.paymentMethod === 'TRANSFER' ? 'تحويل بنكي' : data.paymentMethod === 'CHECK' ? 'صك بريدي' : 'نقداً'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="flex-grow">
                <table className="w-full text-right table-fixed border-collapse">
                    <thead>
                        <tr className="bg-gray-900 text-white">
                            <th className="p-3 text-[11px] font-reem w-12 text-center border-l border-gray-700">#</th>
                            <th className="p-3 text-[11px] font-reem text-right border-l border-gray-700">الوصف والبيان</th>
                            <th className="p-3 text-[11px] font-reem w-20 text-center border-l border-gray-700">الكمية</th>
                            <th className="p-3 text-[11px] font-reem w-32 text-center border-l border-gray-700">سعر الوحدة</th>
                            <th className="p-3 text-[11px] font-reem w-32 text-left">المبلغ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 border-x border-b border-gray-100">
                        {data.items.map((item, idx) => (
                            <tr key={item.id} className="hover:bg-gray-50/50">
                                <td className="px-1 py-2 text-center text-[12px] text-gray-400 font-mono border-l border-gray-50">{idx + 1}</td>
                                <td className="px-4 py-2 font-amiri text-[16px] text-gray-800 leading-tight border-l border-gray-50">{item.description}</td>
                                <td className="px-1 py-2 text-center text-[14px] font-bold text-gray-600 border-l border-gray-50">{item.quantity}</td>
                                <td className="px-1 py-2 text-center text-[14px] text-gray-600 border-l border-gray-50">{item.price.toLocaleString('ar-DZ')}</td>
                                <td className="px-4 py-2 text-left text-[15px] font-bold text-gray-900">{(item.price * item.quantity).toLocaleString('ar-DZ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className="mt-6 flex justify-between items-start gap-8">
                <div className="w-3/5">
                    <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 shadow-inner mb-4">
                        <h4 className="text-[10px] font-bold text-pink-600 mb-1">المبلغ الإجمالي بالحروف:</h4>
                        <p className="text-[14px] font-amiri font-bold text-gray-800 italic leading-snug">
                            {convertAmountToWords(total)}
                        </p>
                    </div>
                    <div className="text-[11px] text-gray-500 font-amiri italic leading-tight">
                        <strong>ملاحظات:</strong> {data.notes}
                    </div>
                </div>

                <div className="w-1/3 bg-gray-50 rounded-2xl p-4 space-y-2 border border-gray-100">
                    <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-500 font-bold">المجموع (HT):</span>
                        <span className="font-bold">{subtotal.toLocaleString('ar-DZ')} دج</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-500 font-bold">رسم TVA ({data.tvaRate}%):</span>
                        <span className="font-bold">{tvaAmount.toLocaleString('ar-DZ')} دج</span>
                    </div>
                    {timbre > 0 && (
                        <div className="flex justify-between items-center text-[11px] text-pink-600 border-t border-dashed pt-2">
                            <span className="font-bold text-[10px]">حق الطابع (Timbre):</span>
                            <span className="font-bold">{timbre.toLocaleString('ar-DZ')} دج</span>
                        </div>
                    )}
                    <div className="h-px bg-gray-300 my-1"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-reem font-bold text-gray-900">الصافي للدفع:</span>
                        <span className="text-xl font-bold text-pink-600">{total.toLocaleString('ar-DZ')} دج</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <div className="text-center relative pr-12">
                    <p className="text-[10px] font-bold text-gray-400 mb-16 uppercase tracking-widest">ختم وإمضاء المؤسسة</p>
                    <div className="w-48 h-px bg-gray-200 mx-auto"></div>
                    <div className="absolute top-2 -left-8 w-24 h-24 border-2 border-pink-100 rounded-full flex items-center justify-center opacity-10 rotate-12 pointer-events-none">
                        <p className="text-[9px] text-pink-600 font-bold text-center">ORIGINAL</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

/** --- Sub-Component: Delivery Note Preview --- **/
const DeliveryNotePreview: React.FC<{ data: InvoiceData }> = ({ data }) => {
    const formatDate = (dateStr: string) => {
        try { return new Date(dateStr).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' }); }
        catch { return dateStr; }
    };

    return (
        <div className="invoice-page bg-white p-10 min-h-[1120px] relative flex flex-col font-cairo text-gray-800 border-[10px] border-blue-50/50">
            {/* Header: Centered Company Name */}
            <div className="mb-6 border-b pb-6 text-center">
                <h1 className="text-4xl font-reem text-gray-900 mb-2 leading-relaxed">{data.company.name}</h1>
                <p className="text-[13px] text-gray-600 font-amiri italic mb-4">
                    {data.company.address} | الهاتف: {data.company.phone}
                </p>
                <div className="flex justify-between items-end text-right">
                    <div dir="ltr" className="grid grid-cols-2 gap-x-6 gap-y-0.5 text-[10px] text-gray-500 font-mono border-r-4 border-blue-600 pr-4 text-left">
                        <div><strong>RC:</strong> {data.company.rc}</div>
                        <div><strong>NIF:</strong> {data.company.nif}</div>
                        <div><strong>NIS:</strong> {data.company.nis}</div>
                        <div><strong>AI:</strong> {data.company.ai}</div>
                    </div>
                    <div className="text-left">
                        <div className="bg-blue-900 text-white px-8 py-3 rounded-bl-3xl shadow-lg transform -translate-x-4">
                            <h2 className="text-2xl font-bold font-reem text-center">سند تسليم</h2>
                            <p className="text-[11px] opacity-70 mt-1 font-mono tracking-widest text-center">N°: {data.invoiceNumber}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-6 bg-blue-50/30 p-6 rounded-3xl border border-blue-100">
                <div className="space-y-1 border-r-2 border-blue-200 pr-4">
                    <h4 className="text-[10px] font-bold text-blue-500 uppercase mb-1">المرسل إليه:</h4>
                    <h3 className="text-xl font-bold font-amiri text-gray-900">{data.client.name}</h3>
                    <p className="text-[13px] text-gray-600 font-amiri">{data.client.address}</p>
                </div>
                <div className="text-left flex flex-col items-end justify-center">
                    <div className="text-[12px] flex gap-2">
                        <span className="text-gray-400 font-bold">تاريخ التسليم:</span>
                        <span className="font-bold text-gray-800">{formatDate(data.date)}</span>
                    </div>
                    <div className="mt-4 px-4 py-1.5 border border-blue-200 bg-white rounded-lg text-[11px] text-blue-600 font-bold uppercase italic">
                        BORDEREAU DE LIVRAISON
                    </div>
                </div>
            </div>

            <div className="flex-grow">
                <table className="w-full text-right table-fixed border-collapse">
                    <thead>
                        <tr className="bg-blue-900 text-white">
                            <th className="p-3 text-[11px] font-reem w-14 text-center border-l border-blue-700">#</th>
                            <th className="p-3 text-[11px] font-reem text-right border-l border-blue-700">تعيين السلعة / الخدمة</th>
                            <th className="p-3 text-[11px] font-reem w-32 text-center">الكمية</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 border-x border-b border-gray-100">
                        {data.items.map((item, idx) => (
                            <tr key={item.id}>
                                <td className="px-1 py-3 text-center text-[12px] text-gray-400 font-mono border-l border-gray-50">{idx + 1}</td>
                                <td className="px-5 py-3 font-amiri text-[17px] text-gray-800 border-l border-gray-50">{item.description}</td>
                                <td className="px-1 py-3 text-center text-[16px] font-bold text-gray-900">{item.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-24">
                <div className="text-center">
                    <p className="text-[11px] font-bold text-gray-400 mb-24 uppercase tracking-widest">إمضاء المستلم</p>
                    <div className="w-56 h-px bg-gray-200 mx-auto"></div>
                </div>
                <div className="text-center relative">
                    <p className="text-[11px] font-bold text-gray-400 mb-24 uppercase tracking-widest">ختم وإمضاء المؤسسة</p>
                    <div className="w-56 h-px bg-gray-200 mx-auto"></div>
                    <div className="absolute top-2 right-1/4 w-24 h-24 border-2 border-blue-100 rounded-full flex items-center justify-center opacity-10 rotate-12 pointer-events-none">
                        <p className="text-[9px] text-blue-600 font-bold text-center">LIVRÉ</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

/** --- Main App Component --- **/
const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState('editor');
    const [company, setCompany] = useState<CompanyInfo>(() => {
        const saved = localStorage.getItem('dz_comp_v2');
        return saved ? JSON.parse(saved) : {
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
    });

    const createNewInvoice = (c: CompanyInfo): InvoiceData => ({
        id: Math.random().toString(36).substr(2, 9),
        invoiceNumber: `${new Date().getFullYear()}/${Math.floor(Math.random() * 900) + 100}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        company: { ...c },
        client: { id: '', name: "", address: "", phone: "" },
        items: [{ id: '1', description: '', price: 0, quantity: 1 }],
        tvaRate: 19,
        paymentMethod: 'TRANSFER',
        notes: "تعتبر هذه الفاتورة بمثابة عقد بيع."
    });

    const [data, setData] = useState<InvoiceData>(() => createNewInvoice(company));
    const [clients, setClients] = useState<ClientInfo[]>(() => JSON.parse(localStorage.getItem('dz_clients_v2') || '[]'));
    const [archive, setArchive] = useState<InvoiceData[]>(() => JSON.parse(localStorage.getItem('dz_archive_v2') || '[]'));

    useEffect(() => localStorage.setItem('dz_comp_v2', JSON.stringify(company)), [company]);
    useEffect(() => localStorage.setItem('dz_clients_v2', JSON.stringify(clients)), [clients]);
    useEffect(() => localStorage.setItem('dz_archive_v2', JSON.stringify(archive)), [archive]);
    useEffect(() => setData(prev => ({ ...prev, company })), [company]);

    const handleSaveToArchive = () => {
        const sub = data.items.reduce((s,i)=>s+(i.price*i.quantity),0);
        const tva = sub * (data.tvaRate/100);
        const tim = data.paymentMethod==='CASH'?Math.min(Math.max((sub+tva)*0.01,5),10000):0;
        const newArch = [{...data, total: sub+tva+tim}, ...archive];
        setArchive(newArch);
        alert("تم الحفظ في الأرشيف بنجاح");
    };

    const Input: React.FC<{ label: string; value: string | number; onChange: (v: string) => void; type?: string; className?: string }> = ({ label, value, onChange, type = "text", className = "" }) => (
        <div className={className}>
            <label className="text-[10px] font-bold text-gray-500 block mb-1 uppercase pr-1 tracking-wider">{label}</label>
            <input type={type} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:ring-4 focus:ring-pink-50 focus:border-pink-500 outline-none transition-all" value={value} onChange={e => onChange(e.target.value)} />
        </div>
    );

    return (
        <div className="min-h-screen">
            <header className="no-print bg-white border-b shadow-sm sticky top-0 z-50 px-6 py-2 flex flex-col lg:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-pink-600 p-2 rounded-lg shadow-md rotate-2">
                        <FileText className="text-white" size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800 font-reem leading-none">نظام الفواتير الجزائري</h1>
                        <p className="text-[10px] text-pink-500 font-bold mt-1 uppercase">Smart Billing Solution</p>
                    </div>
                </div>

                <nav className="flex bg-gray-100 p-1 rounded-xl">
                    <button onClick={() => setActiveTab('settings')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'}`}>معلومات المؤسسة</button>
                    <button onClick={() => setActiveTab('clients')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'clients' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'}`}>العملاء</button>
                    <button onClick={() => setActiveTab('editor')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'editor' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'}`}>إنشاء فاتورة</button>
                    <button onClick={() => setActiveTab('archive')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'archive' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'}`}>الأرشيف</button>
                </nav>

                <div className="flex gap-2">
                    {activeTab === 'editor' && (
                        <>
                            <button onClick={() => confirm("هل تريد البدء بفاتورة جديدة؟") && setData(createNewInvoice(company))} className="p-2 bg-gray-100 rounded-lg text-gray-500 hover:bg-gray-200"><RotateCcw size={20}/></button>
                            <button onClick={handleSaveToArchive} className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow hover:bg-green-700 transition-all"><Save size={18}/> حفظ</button>
                            <button onClick={() => window.print()} className="bg-pink-600 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow hover:bg-pink-700 transition-all"><Printer size={18}/> طباعة</button>
                        </>
                    )}
                </div>
            </header>

            <main className="max-w-[1440px] mx-auto mt-8 px-6 pb-12">
                {activeTab === 'editor' && (
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
                        <div className="no-print xl:col-span-2 space-y-6">
                            <div className="bg-white p-6 rounded-2xl border shadow-sm">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><FileText size={20} className="text-pink-500"/> بيانات الفاتورة</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="رقم الفاتورة" value={data.invoiceNumber} onChange={v=>setData({...data, invoiceNumber:v})} />
                                    <Input label="تاريخ الإصدار" type="date" value={data.date} onChange={v=>setData({...data, date:v})} />
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">طريقة الدفع</label>
                                        <div className="flex gap-2">
                                            {(['TRANSFER', 'CHECK', 'CASH'] as PaymentMethod[]).map(m => (
                                                <button key={m} onClick={()=>setData({...data, paymentMethod:m})} className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${data.paymentMethod === m ? 'bg-pink-600 text-white border-pink-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                                                    {m === 'TRANSFER' ? 'تحويل' : m === 'CHECK' ? 'صك' : 'نقداً'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-span-2 border-t pt-4 mt-2">
                                        <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase">بيانات الزبون</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="اسم الزبون" value={data.client.name} onChange={v=>setData(d=>({...d, client:{...d.client, name:v}}))} className="col-span-2" />
                                            <Input label="الهاتف" value={data.client.phone} onChange={v=>setData(d=>({...d, client:{...d.client, phone:v}}))} />
                                            <Input label="العنوان" value={data.client.address} onChange={v=>setData(d=>({...d, client:{...d.client, address:v}}))} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold">السلع والخدمات</h2>
                                    <button onClick={()=>setData(prev=>({...prev, items:[...prev.items,{id:Math.random().toString(36).substr(2,9),description:'',price:0,quantity:1}]}))} className="bg-pink-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md hover:bg-pink-700 transition-all">+ إضافة سطر</button>
                                </div>
                                <div className="space-y-4">
                                    {data.items.map(item => (
                                        <div key={item.id} className="grid grid-cols-12 gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100 items-end">
                                            <div className="col-span-12 md:col-span-6">
                                                <label className="text-[9px] font-bold text-gray-400 block mb-1">الوصف</label>
                                                <input className="w-full p-2 border rounded-lg text-sm" value={item.description} onChange={e=>setData(d=>({...d, items:d.items.map(it=>it.id===item.id?{...it,description:e.target.value}:it)}))} />
                                            </div>
                                            <div className="col-span-4 md:col-span-2">
                                                <label className="text-[9px] font-bold text-gray-400 block mb-1 text-center">كمية</label>
                                                <input type="number" className="w-full p-2 border rounded-lg text-sm text-center" value={item.quantity} onChange={e=>setData(d=>({...d, items:d.items.map(it=>it.id===item.id?{...it,quantity:parseFloat(e.target.value)||0}:it)}))} />
                                            </div>
                                            <div className="col-span-6 md:col-span-3">
                                                <label className="text-[9px] font-bold text-gray-400 block mb-1">سعر الوحدة</label>
                                                <input type="number" className="w-full p-2 border rounded-lg text-sm" value={item.price} onChange={e=>setData(d=>({...d, items:d.items.map(it=>it.id===item.id?{...it,price:parseFloat(e.target.value)||0}:it)}))} />
                                            </div>
                                            <div className="col-span-2 md:col-span-1 flex justify-center">
                                                <button onClick={()=>setData(d=>({...d, items:d.items.filter(it=>it.id!==item.id)}))} className="text-red-300 hover:text-red-500 transition-all"><Trash2 size={20}/></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Preview Section - Right Side */}
                        <div className="xl:col-span-3 sticky top-24 self-start">
                            <div className="print-container bg-gray-50 p-4 lg:p-8 rounded-[40px] shadow-inner border border-gray-100 flex flex-col gap-10">
                                <div className="bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-100">
                                    <InvoicePreview data={data} />
                                </div>
                                <div className="bg-white shadow-2xl rounded-lg overflow-hidden relative border border-gray-100">
                                    <div className="no-print absolute top-6 right-6 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm">
                                        <Truck size={16}/> سند تسليم مرافق
                                    </div>
                                    <DeliveryNotePreview data={data} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border p-10 animate-in slide-in-from-bottom-8 duration-500">
                        <div className="flex items-center gap-4 mb-8 border-b pb-6">
                            <div className="bg-pink-600 p-4 rounded-2xl text-white shadow-lg shadow-pink-100"><Building2 size={32}/></div>
                            <div>
                                <h2 className="text-3xl font-bold font-reem text-gray-900 leading-none mb-2">إدارة المؤسسة</h2>
                                <p className="text-xs text-gray-400 tracking-wide">البيانات القانونية والبنكية التي تظهر في ترويسة الفاتورة</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <Input label="اسم المؤسسة / العلامة التجارية" value={company.name} onChange={v=>setCompany({...company, name:v})} />
                                <Input label="العنوان التجاري" value={company.address} onChange={v=>setCompany({...company, address:v})} />
                                <Input label="رقم الهاتف" value={company.phone} onChange={v=>setCompany({...company, phone:v})} />
                            </div>
                            <div className="space-y-6 bg-gray-50 p-6 rounded-2xl border">
                                <Input label="السجل التجاري (RC)" value={company.rc} onChange={v=>setCompany({...company, rc:v})} />
                                <Input label="الرقم التعريفي الضريبي (NIF)" value={company.nif} onChange={v=>setCompany({...company, nif:v})} />
                                <Input label="الرقم التعريفي الإحصائي (NIS)" value={company.nis} onChange={v=>setCompany({...company, nis:v})} />
                                <Input label="رقم المادة (AI)" value={company.ai} onChange={v=>setCompany({...company, ai:v})} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'clients' && (
                    <div className="bg-white rounded-3xl shadow-sm border p-10 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-bold font-reem">دليل العملاء</h2>
                            <button onClick={()=>setClients([{id:Date.now().toString(),name:'عميل جديد',address:'',phone:''},...clients])} className="bg-pink-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-pink-700 shadow-lg active:scale-95"><Plus size={20}/> إضافة عميل</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {clients.map(c => (
                                <div key={c.id} className="bg-gray-50 p-6 rounded-2xl border hover:shadow-xl transition-all relative group">
                                    <button onClick={()=>setClients(clients.filter(cl=>cl.id!==c.id))} className="absolute top-4 left-4 p-2 text-red-200 opacity-0 group-hover:opacity-100 transition-all hover:text-red-500"><Trash2 size={20}/></button>
                                    <div className="space-y-4">
                                        <Input label="اسم العميل" value={c.name} onChange={v=>setClients(clients.map(cl=>cl.id===c.id?{...cl,name:v}:cl))} />
                                        <Input label="العنوان" value={c.address} onChange={v=>setClients(clients.map(cl=>cl.id===c.id?{...cl,address:v}:cl))} />
                                        <Input label="الهاتف" value={c.phone} onChange={v=>setClients(clients.map(cl=>cl.id===c.id?{...cl,phone:v}:cl))} />
                                        <button onClick={()=>{setData({...data, client:c}); setActiveTab('editor'); window.scrollTo(0,0);}} className="w-full bg-white text-pink-600 border-2 border-pink-100 py-3 rounded-xl font-bold text-sm hover:bg-pink-600 hover:text-white transition-all">اختيار للفاتورة</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'archive' && (
                    <div className="bg-white rounded-3xl shadow-sm border p-10 animate-in fade-in duration-500">
                        <h2 className="text-3xl font-bold font-reem mb-6">أرشيف الفواتير</h2>
                        <div className="overflow-hidden border rounded-2xl">
                            <table className="w-full text-right">
                                <thead className="bg-gray-900 text-white">
                                    <tr>
                                        <th className="p-5 text-sm font-reem">الرقم</th>
                                        <th className="p-5 text-sm font-reem">الزبون</th>
                                        <th className="p-5 text-sm font-reem">التاريخ</th>
                                        <th className="p-5 text-sm font-reem">المبلغ الإجمالي</th>
                                        <th className="p-5 text-sm font-reem text-center">إجراء</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {archive.map(inv => (
                                        <tr key={inv.id} className="hover:bg-pink-50/20">
                                            <td className="p-5 text-sm font-bold text-pink-600">{inv.invoiceNumber}</td>
                                            <td className="p-5 text-sm font-bold">{inv.client.name}</td>
                                            <td className="p-5 text-sm text-gray-500">{inv.date}</td>
                                            <td className="p-5 text-sm font-bold">{inv.total?.toLocaleString('ar-DZ')} دج</td>
                                            <td className="p-5 flex justify-center gap-2">
                                                <button onClick={()=>{setData(inv); setActiveTab('editor'); window.scrollTo(0,0);}} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold text-xs">فتح</button>
                                                <button onClick={()=>setArchive(archive.filter(a=>a.id!==inv.id))} className="text-red-200 hover:text-red-500"><Trash2 size={20}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
