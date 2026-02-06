
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
    Plus, Trash2, Printer, FileText, RotateCcw, 
    Save, Building2, Truck, Users, Archive
} from 'lucide-react';

/** --- Utility: Amount to words --- **/
const convertAmountToWords = (amount: number): string => {
    return `هذه الفاتورة محددة بمبلغ إجمالي قدره: ${amount.toLocaleString('ar-DZ')} دينار جزائري فقط لا غير.`;
};

/** --- Interfaces --- **/
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
}

interface ClientInfo {
    id: string;
    name: string;
    address: string;
    phone: string;
}

interface InvoiceData {
    invoiceNumber: string;
    date: string;
    dueDate: string;
    company: CompanyInfo;
    client: ClientInfo;
    items: InvoiceItem[];
    tvaRate: number;
    paymentMethod: 'CASH' | 'TRANSFER';
    notes: string;
}

/** --- Component: Invoice Preview --- **/
const InvoicePreview: React.FC<{ data: InvoiceData }> = ({ data }) => {
    const subtotal = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tvaAmount = subtotal * (data.tvaRate / 100);
    const timbre = data.paymentMethod === 'CASH' ? Math.min(Math.max((subtotal + tvaAmount) * 0.01, 5), 10000) : 0;
    const total = subtotal + tvaAmount + timbre;

    return (
        <div className="invoice-page">
            {/* Header */}
            <div className="text-center border-b-[4px] border-black pb-4 mb-6">
                <h1 className="text-5xl font-reem font-bold mb-2 text-black">{data.company.name}</h1>
                <p className="text-[14px] font-amiri font-bold text-gray-800">{data.company.address} | الهاتف: {data.company.phone}</p>
                
                <div className="flex justify-between items-center mt-8 px-6">
                    <div dir="ltr" className="text-[11px] font-mono text-black text-left border-l-[4px] border-black pl-4 leading-relaxed font-bold">
                        <div>RC: {data.company.rc}</div>
                        <div>NIF: {data.company.nif}</div>
                        <div>NIS: {data.company.nis}</div>
                        <div>AI: {data.company.ai}</div>
                    </div>
                    <div className="bg-black text-white px-12 py-4 rounded-xl border-4 border-black shadow-xl">
                        <h2 className="text-4xl font-bold font-reem">فـاتـورة</h2>
                        <p className="text-[14px] font-mono mt-1 font-bold tracking-widest">N°: {data.invoiceNumber}</p>
                    </div>
                </div>
            </div>

            {/* Client Section */}
            <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="border-[3px] border-black p-5 rounded-2xl bg-gray-50/50">
                    <h4 className="text-[12px] font-bold border-b-2 border-black mb-3 pb-1 text-black uppercase tracking-widest">الزبون السيد / المؤسسة:</h4>
                    <div className="font-bold text-3xl font-amiri text-black mb-1">{data.client.name || '................................'}</div>
                    <div className="text-[15px] font-bold text-black">{data.client.address || '................................'}</div>
                    <div className="text-[14px] mt-2 font-bold text-black">الهاتف: {data.client.phone || '................................'}</div>
                </div>
                <div className="border-[3px] border-black p-5 rounded-2xl text-left flex flex-col justify-center gap-2">
                    <div className="text-[16px] font-bold text-black">تاريخ الفاتورة: <span className="mr-3 font-mono">{data.date}</span></div>
                    <div className="text-[16px] font-bold text-black">تاريخ الاستحقاق: <span className="mr-3 font-mono">{data.dueDate}</span></div>
                    <div className="mt-3 font-bold text-[14px] bg-black text-white px-6 py-2 inline-block rounded-full self-start shadow-md">
                        طريقة الدفع: {data.paymentMethod === 'CASH' ? 'نقداً (ESPECES)' : 'تحويل بنكي / صك'}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-grow">
                <table className="table-custom">
                    <thead>
                        <tr className="bg-dark-print">
                            <th className="w-14 text-center">#</th>
                            <th className="text-right">البيان وتعيين السلعة</th>
                            <th className="w-24 text-center">الكمية</th>
                            <th className="w-36 text-center">سعر الوحدة</th>
                            <th className="w-44 text-left">المبلغ الصافي</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.map((item, idx) => (
                            <tr key={item.id}>
                                <td className="text-center font-bold">{idx + 1}</td>
                                <td className="font-amiri font-bold text-[20px] text-black py-3">{item.description}</td>
                                <td className="text-center font-bold text-[20px] text-black">{item.quantity}</td>
                                <td className="text-center font-bold text-black">{item.price.toLocaleString()}</td>
                                <td className="text-left font-bold text-[20px] text-black">{(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                        ))}
                        {/* Fill rows to avoid layout collapse */}
                        {[...Array(Math.max(0, 8 - data.items.length))].map((_, i) => (
                            <tr key={`f-${i}`} className="h-10"><td colSpan={5}></td></tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className="mt-6 flex gap-8">
                <div className="flex-grow border-[3px] border-black p-5 rounded-2xl">
                    <h4 className="text-[13px] font-bold mb-3 border-b-2 border-black inline-block text-black">المبلغ الإجمالي بالحروف:</h4>
                    <p className="text-[18px] font-amiri font-bold italic text-black leading-relaxed">{convertAmountToWords(total)}</p>
                    <div className="mt-6 text-[12px] font-bold italic text-gray-700 border-t border-black/20 pt-2">ملاحظات: {data.notes}</div>
                </div>
                <div className="w-80 border-[3px] border-black p-5 rounded-2xl space-y-3 bg-gray-50/50">
                    <div className="flex justify-between text-[15px] font-bold text-black"><span>المجموع HT:</span><span>{subtotal.toLocaleString()} دج</span></div>
                    <div className="flex justify-between text-[15px] font-bold text-black"><span>الرسم TVA ({data.tvaRate}%):</span><span>{tvaAmount.toLocaleString()} دج</span></div>
                    {timbre > 0 && <div className="flex justify-between text-[15px] border-t-2 border-black pt-2 font-bold text-black"><span>حق الطابع:</span><span>{timbre.toLocaleString()} دج</span></div>}
                    <div className="flex justify-between text-2xl font-bold border-t-[4px] border-black pt-3 mt-2 text-black"><span>الإجمالي النهائي:</span><span className="text-red-700 underline">{total.toLocaleString()} دج</span></div>
                </div>
            </div>

            {/* Signature */}
            <div className="mt-8 flex justify-end">
                <div className="text-center border-[3pt] border-black p-8 rounded-3xl w-80 min-h-[170px] relative bg-white">
                    <p className="text-[15px] font-bold uppercase mb-24 border-b-2 border-black pb-1 text-black">إمضاء وختم المؤسسة</p>
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                        <div className="border-[5px] border-black rounded-full w-36 h-36 flex items-center justify-center rotate-12">
                            <span className="text-black font-bold text-lg uppercase">ORIGINAL</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/** --- Component: Delivery Note Preview --- **/
const DeliveryNotePreview: React.FC<{ data: InvoiceData }> = ({ data }) => {
    return (
        <div className="invoice-page">
            <div className="text-center border-b-[4px] border-black pb-4 mb-6">
                <h1 className="text-5xl font-reem font-bold mb-2 text-black">{data.company.name}</h1>
                <p className="text-[14px] font-amiri font-bold text-black">{data.company.address}</p>
                <div className="flex justify-between items-center mt-8 px-6">
                    <div className="text-[12px] font-bold border-l-[5px] border-blue-900 pl-4 font-mono text-black uppercase tracking-tighter">Bordereau de Livraison</div>
                    <div className="bg-blue-900 text-white px-12 py-4 rounded-xl border-4 border-black shadow-xl">
                        <h2 className="text-3xl font-bold font-reem">سند تسليم</h2>
                        <p className="text-[14px] font-mono mt-1 font-bold">N°: {data.invoiceNumber}</p>
                    </div>
                </div>
            </div>

            <div className="border-[3px] border-black p-6 rounded-2xl mb-6 bg-blue-50/20">
                <h4 className="text-[12px] font-bold border-b-2 border-black mb-3 pb-1 text-black">المرسل إليه (الزبون):</h4>
                <div className="text-3xl font-bold font-amiri text-black">{data.client.name || '................................'}</div>
                <div className="text-[16px] font-bold text-black mt-2">{data.client.address || '................................'}</div>
                <div className="text-[15px] mt-6 font-bold text-black border-t-2 border-black/10 pt-3 inline-block">تاريخ الاستلام الفعلي: <span className="underline mr-4 font-mono">{data.date}</span></div>
            </div>

            <div className="flex-grow">
                <table className="table-custom">
                    <thead className="bg-blue-900">
                        <tr className="bg-blue-900 text-white">
                            <th className="w-16 text-center border-blue-900">#</th>
                            <th className="text-right border-blue-900">تعيين السلع المسلمة / الوصف</th>
                            <th className="w-48 text-center border-blue-900">الكمية المستلمة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.map((item, idx) => (
                            <tr key={item.id}>
                                <td className="text-center font-bold text-black">{idx + 1}</td>
                                <td className="font-amiri font-bold text-[22px] text-black py-4">{item.description}</td>
                                <td className="text-center text-[24px] font-bold text-black">{item.quantity}</td>
                            </tr>
                        ))}
                        {[...Array(Math.max(0, 10 - data.items.length))].map((_, i) => (
                            <tr key={`dl-${i}`} className="h-12"><td colSpan={3}></td></tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-20">
                <div className="text-center border-[3px] border-black p-8 rounded-3xl min-h-[180px] bg-white">
                    <p className="text-[14px] font-bold uppercase mb-24 border-b-2 border-black pb-1 text-black">إمضاء واستلام الزبون</p>
                    <p className="text-[11px] text-gray-600 font-bold italic tracking-tight leading-none">أقر أنا الموقع أدناه باستلام السلع المذكورة في حالة جيدة</p>
                </div>
                <div className="text-center border-[3px] border-black p-8 rounded-3xl min-h-[180px] bg-white relative">
                    <p className="text-[14px] font-bold uppercase mb-24 border-b-2 border-black pb-1 text-black">ختم وإمضاء المؤسسة</p>
                    <div className="absolute top-1/2 right-1/4 w-36 h-36 border-[2pt] border-blue-200 rounded-full opacity-5 rotate-12 pointer-events-none"></div>
                </div>
            </div>
        </div>
    );
};

/** --- Main Application Component --- **/
const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState('editor');
    const [company, setCompany] = useState<CompanyInfo>(() => {
        const saved = localStorage.getItem('dz_comp_final');
        return saved ? JSON.parse(saved) : {
            name: "مؤسسة الابتكار والتميز",
            address: "حي 500 مسكن، الطابق 02، الجزائر العاصمة",
            phone: "+213 (0) 23 45 67 89",
            rc: "16/00-1234567B21",
            nif: "001616012345678",
            nis: "192016001234567",
            ai: "16011234567"
        };
    });

    const [data, setData] = useState<InvoiceData>(() => ({
        invoiceNumber: `${new Date().getFullYear()}/${Math.floor(Math.random() * 900) + 100}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        company: company,
        client: { id: '1', name: "", address: "", phone: "" },
        items: [{ id: '1', description: 'مثال: توريد وتركيب أجهزة إلكترونية', price: 15000, quantity: 1 }],
        tvaRate: 19,
        paymentMethod: 'TRANSFER',
        notes: "السلعة المباعة لا ترد ولا تستبدل بعد مرور 48 ساعة."
    }));

    useEffect(() => {
        localStorage.setItem('dz_comp_final', JSON.stringify(company));
        setData(prev => ({ ...prev, company }));
    }, [company]);

    const Input = ({ label, value, onChange, type = "text", className = "" }: any) => (
        <div className={className}>
            <label className="text-[11px] font-bold text-gray-500 block mb-1 uppercase pr-1">{label}</label>
            <input type={type} className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl text-sm font-bold focus:border-black outline-none transition-all shadow-sm" value={value} onChange={e => onChange(e.target.value)} />
        </div>
    );

    return (
        <div className="min-h-screen text-black">
            <header className="no-print bg-white border-b-2 border-gray-100 sticky top-0 z-50 px-8 py-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="bg-black text-white p-2.5 rounded-xl shadow-xl"><FileText size={28} /></div>
                    <h1 className="text-2xl font-bold font-reem">نظام إدارة الفواتير الجزائري</h1>
                </div>
                <nav className="flex gap-2 bg-gray-50 p-2 rounded-2xl">
                    {['editor', 'settings'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-10 py-2.5 rounded-xl text-[15px] font-bold transition-all ${activeTab === tab ? 'bg-black text-white shadow-xl' : 'text-gray-500 hover:text-black hover:bg-white'}`}>
                            {tab === 'editor' ? 'الفاتورة والسند' : 'إعدادات المؤسسة'}
                        </button>
                    ))}
                </nav>
                <div>
                    <button onClick={() => window.print()} className="bg-red-600 text-white px-10 py-3 rounded-2xl font-bold flex items-center gap-3 shadow-xl hover:bg-red-700 active:scale-95 transition-all"><Printer size={22} /> طباعة المستندات</button>
                </div>
            </header>

            <main className="max-w-[1700px] mx-auto mt-10 px-8 pb-32">
                {activeTab === 'editor' && (
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-12 items-start">
                        <div className="no-print xl:col-span-2 space-y-8">
                            <div className="bg-white p-10 rounded-[40px] border-2 border-gray-50 shadow-sm">
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 border-b pb-4"><Users className="text-black" /> معلومات الزبون</h2>
                                <div className="grid grid-cols-2 gap-6">
                                    <Input label="رقم الفاتورة" value={data.invoiceNumber} onChange={(v:any)=>setData({...data, invoiceNumber:v})} />
                                    <Input label="التاريخ" type="date" value={data.date} onChange={(v:any)=>setData({...data, date:v})} />
                                    <Input label="اسم الزبون / الشركة" value={data.client.name} onChange={(v:any)=>setData({...data, client:{...data.client, name:v}})} className="col-span-2" />
                                    <Input label="عنوان الزبون الكامل" value={data.client.address} onChange={(v:any)=>setData({...data, client:{...data.client, address:v}})} className="col-span-2" />
                                    <Input label="رقم هاتف الزبون" value={data.client.phone} onChange={(v:any)=>setData({...data, client:{...data.client, phone:v}})} className="col-span-2" />
                                </div>
                            </div>

                            <div className="bg-white p-10 rounded-[40px] border-2 border-gray-50 shadow-sm">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-bold flex items-center gap-3"><Truck className="text-black" /> قائمة السلع</h2>
                                    <button onClick={()=>setData({...data, items:[...data.items,{id:Date.now().toString(),description:'',price:0,quantity:1}]})} className="bg-black text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-xl hover:bg-gray-800 transition-all">+ إضافة سطر</button>
                                </div>
                                <div className="space-y-4">
                                    {data.items.map(item => (
                                        <div key={item.id} className="flex gap-4 items-end bg-gray-50 p-6 rounded-3xl border-2 border-gray-100">
                                            <div className="flex-grow"><input className="w-full p-3 border-2 border-gray-200 rounded-2xl text-sm font-bold shadow-inner" placeholder="وصف السلعة..." value={item.description} onChange={e=>setData({...data, items:data.items.map(it=>it.id===item.id?{...it,description:e.target.value}:it)})} /></div>
                                            <div className="w-20"><input type="number" className="w-full p-3 border-2 border-gray-200 rounded-2xl text-sm text-center font-bold" value={item.quantity} onChange={e=>setData({...data, items:data.items.map(it=>it.id===item.id?{...it,quantity:parseFloat(e.target.value)||0}:it)})} /></div>
                                            <div className="w-36"><input type="number" className="w-full p-3 border-2 border-gray-200 rounded-2xl text-sm font-bold" value={item.price} onChange={e=>setData({...data, items:data.items.map(it=>it.id===item.id?{...it,price:parseFloat(e.target.value)||0}:it)})} /></div>
                                            <button onClick={()=>setData({...data, items:data.items.filter(it=>it.id!==item.id)})} className="text-red-500 font-bold p-3 hover:bg-red-50 rounded-2xl transition-all">×</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="xl:col-span-3 print-container">
                            <div className="flex flex-col gap-12 bg-gray-200/50 p-12 rounded-[80px] border-4 border-gray-200 shadow-inner">
                                <InvoicePreview data={data} />
                                <DeliveryNotePreview data={data} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="max-w-4xl mx-auto bg-white p-16 rounded-[60px] border-2 border-gray-50 shadow-2xl">
                        <h2 className="text-4xl font-bold mb-12 border-b-4 border-black pb-4 font-reem">إدارة بيانات المؤسسة الرسمية</h2>
                        <div className="grid gap-10">
                            <Input label="اسم المؤسسة (Raison Sociale)" value={company.name} onChange={(v:any)=>setCompany({...company, name:v})} />
                            <Input label="العنوان التجاري الكامل" value={company.address} onChange={(v:any)=>setCompany({...company, address:v})} />
                            <Input label="رقم الهاتف والفاكس" value={company.phone} onChange={(v:any)=>setCompany({...company, phone:v})} />
                            <div className="grid grid-cols-2 gap-8 p-10 bg-gray-50 rounded-[40px] border-2 border-gray-100 shadow-inner">
                                <Input label="السجل التجاري (RC)" value={company.rc} onChange={(v:any)=>setCompany({...company, rc:v})} />
                                <Input label="الرقم التعريفي الضريبي (NIF)" value={company.nif} onChange={(v:any)=>setCompany({...company, nif:v})} />
                                <Input label="الرقم التعريفي الإحصائي (NIS)" value={company.nis} onChange={(v:any)=>setCompany({...company, nis:v})} />
                                <Input label="رقم المادة (AI)" value={company.ai} onChange={(v:any)=>setCompany({...company, ai:v})} />
                            </div>
                        </div>
                        <div className="mt-12 flex justify-end">
                            <button onClick={()=>setActiveTab('editor')} className="bg-black text-white px-12 py-4 rounded-2xl font-bold shadow-2xl hover:bg-gray-800 transition-all flex items-center gap-3">حفظ والعودة <RotateCcw size={20}/></button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
