
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
    Plus, Trash2, Printer, FileText, RotateCcw, 
    Save, Building2, Truck 
} from 'lucide-react';

/** --- Utilities --- **/
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

interface InvoiceData {
    invoiceNumber: string;
    date: string;
    dueDate: string;
    company: CompanyInfo;
    client: { name: string; address: string; phone: string };
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
            <div className="text-center border-b-[3px] border-black pb-4 mb-4">
                <h1 className="text-4xl font-reem font-bold mb-2 text-black">{data.company.name}</h1>
                <p className="text-[14px] font-amiri font-bold text-gray-800">{data.company.address} | هاتف: {data.company.phone}</p>
                
                <div className="flex justify-between items-center mt-6 px-4">
                    <div dir="ltr" className="text-[10px] font-mono text-black text-left border-l-[3px] border-black pl-4 leading-relaxed font-bold">
                        <div>RC: {data.company.rc}</div>
                        <div>NIF: {data.company.nif}</div>
                        <div>NIS: {data.company.nis}</div>
                        <div>AI: {data.company.ai}</div>
                    </div>
                    <div className="bg-black text-white px-10 py-3 rounded-lg border-2 border-black bg-black-print shadow-md">
                        <h2 className="text-3xl font-bold font-reem text-white-print">فـاتـورة</h2>
                        <p className="text-[12px] font-mono mt-1 text-white-print">N°: {data.invoiceNumber}</p>
                    </div>
                </div>
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="border-[2px] border-black p-4 rounded-xl bg-gray-50/50">
                    <h4 className="text-[11px] font-bold border-b-2 border-black mb-2 pb-1 text-black uppercase">الزبون:</h4>
                    <div className="font-bold text-2xl font-amiri text-black">{data.client.name}</div>
                    <div className="text-[14px] mt-1 font-bold text-black">{data.client.address}</div>
                    <div className="text-[13px] mt-1 font-bold text-black">الهاتف: {data.client.phone}</div>
                </div>
                <div className="border-[2px] border-black p-4 rounded-xl text-left flex flex-col justify-center gap-2">
                    <div className="text-[14px] font-bold text-black">تاريخ الإصدار: <span className="mr-2 underline">{data.date}</span></div>
                    <div className="text-[14px] font-bold text-black">تاريخ الاستحقاق: <span className="mr-2 underline">{data.dueDate}</span></div>
                    <div className="mt-2 font-bold text-[12px] bg-black text-white px-4 py-1 inline-block rounded-full self-start bg-black-print text-white-print">
                        طريقة الدفع: {data.paymentMethod === 'CASH' ? 'نقداً' : 'تحويل بنكي / صك'}
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="flex-grow">
                <table className="table-custom">
                    <thead>
                        <tr>
                            <th className="w-12 text-center">#</th>
                            <th className="text-right">البيان / تعيين السلعة</th>
                            <th className="w-24 text-center">الكمية</th>
                            <th className="w-32 text-center">سعر الوحدة</th>
                            <th className="w-40 text-left">المبلغ الصافي</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.map((item, idx) => (
                            <tr key={item.id}>
                                <td className="text-center font-bold">{idx + 1}</td>
                                <td className="font-amiri font-bold text-[18px] text-black">{item.description}</td>
                                <td className="text-center font-bold text-[18px] text-black">{item.quantity}</td>
                                <td className="text-center font-bold text-black">{item.price.toLocaleString()}</td>
                                <td className="text-left font-bold text-[18px] text-black">{(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                        ))}
                        {/* Fill with empty rows to maintain layout */}
                        {[...Array(Math.max(0, 8 - data.items.length))].map((_, i) => (
                            <tr key={`empty-${i}`} className="h-10"><td colSpan={5}></td></tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Calculations and Summary */}
            <div className="mt-4 flex gap-4">
                <div className="flex-grow border-[2px] border-black p-4 rounded-xl">
                    <h4 className="text-[12px] font-bold mb-2 border-b-2 border-black inline-block text-black">المبلغ الإجمالي بالحروف:</h4>
                    <p className="text-[16px] font-amiri font-bold italic text-black leading-relaxed">{convertAmountToWords(total)}</p>
                    <div className="mt-4 text-[11px] font-bold italic text-black opacity-80 border-t border-black/20 pt-2">ملاحظات: {data.notes}</div>
                </div>
                <div className="w-72 border-[2px] border-black p-4 rounded-xl space-y-2 bg-gray-50/50">
                    <div className="flex justify-between text-[13px] font-bold text-black"><span>المجموع (HT):</span><span>{subtotal.toLocaleString()} دج</span></div>
                    <div className="flex justify-between text-[13px] font-bold text-black"><span>الرسم (TVA {data.tvaRate}%):</span><span>{tvaAmount.toLocaleString()} دج</span></div>
                    {timbre > 0 && <div className="flex justify-between text-[13px] border-t-2 border-black pt-2 font-bold text-black"><span>حق الطابع:</span><span>{timbre.toLocaleString()} دج</span></div>}
                    <div className="flex justify-between text-[20px] font-bold border-t-4 border-black pt-2 mt-2 text-black"><span>الإجمالي:</span><span className="text-red-700">{total.toLocaleString()} دج</span></div>
                </div>
            </div>

            {/* Signature Area */}
            <div className="mt-6 flex justify-end">
                <div className="text-center border-[2.5px] border-black p-6 rounded-2xl w-80 min-h-[150px] relative bg-white">
                    <p className="text-[14px] font-bold uppercase mb-20 border-b-2 border-black pb-1 text-black">ختم وإمضاء المؤسسة</p>
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                        <div className="border-[4px] border-black rounded-full w-32 h-32 flex items-center justify-center rotate-12">
                            <span className="text-black font-bold text-[14px] uppercase">ORIGINAL</span>
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
        <div className="invoice-page border-blue-100">
            <div className="text-center border-b-[3px] border-black pb-4 mb-4">
                <h1 className="text-4xl font-reem font-bold mb-2 text-black">{data.company.name}</h1>
                <p className="text-[14px] font-amiri font-bold text-black">{data.company.address}</p>
                <div className="flex justify-between items-center mt-6 px-4">
                    <div className="text-[11px] font-bold border-l-[4px] border-blue-900 pl-4 font-mono text-black uppercase">Bordereau de Livraison</div>
                    <div className="bg-blue-900 text-white px-10 py-3 rounded-lg border-2 border-black bg-blue-print shadow-md">
                        <h2 className="text-3xl font-bold font-reem text-white-print">سند تسليم</h2>
                        <p className="text-[12px] font-mono mt-1 text-white-print">N°: {data.invoiceNumber}</p>
                    </div>
                </div>
            </div>

            <div className="border-[2px] border-black p-5 rounded-2xl mb-4 bg-blue-50/30">
                <h4 className="text-[11px] font-bold border-b-2 border-black mb-2 pb-1 text-black">المرسل إليه (الزبون):</h4>
                <div className="text-2xl font-bold font-amiri text-black">{data.client.name}</div>
                <div className="text-[15px] font-bold text-black mt-1">{data.client.address}</div>
                <div className="text-[14px] mt-4 font-bold text-black border-t border-black/20 pt-2 inline-block">تاريخ الاستلام الفعلي: <span className="underline mr-2">{data.date}</span></div>
            </div>

            <div className="flex-grow">
                <table className="table-custom">
                    <thead className="bg-blue-900 !text-white">
                        <tr className="bg-blue-print">
                            <th className="w-16 text-center text-white-print">#</th>
                            <th className="text-right text-white-print">تعيين السلعة / الوصف</th>
                            <th className="w-44 text-center text-white-print">الكمية المستلمة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.map((item, idx) => (
                            <tr key={item.id}>
                                <td className="text-center font-bold text-black">{idx + 1}</td>
                                <td className="font-amiri font-bold text-[20px] text-black py-4">{item.description}</td>
                                <td className="text-center text-[22px] font-bold text-black">{item.quantity}</td>
                            </tr>
                        ))}
                        {[...Array(Math.max(0, 10 - data.items.length))].map((_, i) => (
                            <tr key={`empty-dl-${i}`} className="h-12"><td colSpan={3}></td></tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-16">
                <div className="text-center border-[2px] border-black p-6 rounded-2xl min-h-[160px] bg-white">
                    <p className="text-[13px] font-bold uppercase mb-24 border-b-2 border-black pb-1 text-black">إمضاء واستلام الزبون</p>
                    <p className="text-[10px] text-gray-500 italic font-bold">أقر أنا الموقع أدناه باستلام السلع في حالة جيدة</p>
                </div>
                <div className="text-center border-[2px] border-black p-6 rounded-2xl min-h-[160px] bg-white">
                    <p className="text-[13px] font-bold uppercase mb-24 border-b-2 border-black pb-1 text-black">ختم وإمضاء المؤسسة</p>
                    <div className="absolute top-1/2 right-1/4 w-32 h-32 border-[2px] border-blue-200 rounded-full opacity-5 rotate-12 pointer-events-none"></div>
                </div>
            </div>
        </div>
    );
};

/** --- Main App Component --- **/
const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState('editor');
    const [company, setCompany] = useState<CompanyInfo>(() => {
        const saved = localStorage.getItem('dz_comp_v_final');
        return saved ? JSON.parse(saved) : {
            name: "مؤسسة الابتكار للخدمات الرقمية",
            address: "حي 1200 مسكن، الدار البيضاء، الجزائر",
            phone: "+213 23 45 67 89",
            rc: "16/00-9876543B21",
            nif: "001916012345678",
            nis: "192016001234567",
            ai: "16011234567"
        };
    });

    const [data, setData] = useState<InvoiceData>(() => ({
        invoiceNumber: `${new Date().getFullYear()}/${Math.floor(Math.random() * 900) + 100}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        company: company,
        client: { name: "", address: "", phone: "" },
        items: [{ id: '1', description: 'منتج أو خدمة تجريبية', price: 1000, quantity: 1 }],
        tvaRate: 19,
        paymentMethod: 'TRANSFER',
        notes: "السلعة المباعة لا ترد ولا تستبدل بعد 48 ساعة."
    }));

    useEffect(() => {
        localStorage.setItem('dz_comp_v_final', JSON.stringify(company));
        setData(prev => ({ ...prev, company }));
    }, [company]);

    const Input = ({ label, value, onChange, type = "text", className = "" }: any) => (
        <div className={className}>
            <label className="text-[11px] font-bold text-gray-500 block mb-1 uppercase tracking-wider">{label}</label>
            <input type={type} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-bold focus:border-black outline-none transition-all shadow-sm" value={value} onChange={e => onChange(e.target.value)} />
        </div>
    );

    return (
        <div className="min-h-screen text-black font-cairo">
            <header className="no-print bg-white border-b-2 border-gray-200 sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-3">
                    <div className="bg-black text-white p-2 rounded-lg"><FileText size={24} /></div>
                    <h1 className="text-2xl font-bold font-reem">نظام الفواتير الجزائري</h1>
                </div>
                <nav className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl">
                    {['editor', 'settings'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-2 rounded-xl text-[14px] font-bold transition-all ${activeTab === tab ? 'bg-black text-white shadow-lg' : 'text-gray-600 hover:text-black'}`}>
                            {tab === 'editor' ? 'الفاتورة والسند' : 'بيانات المؤسسة'}
                        </button>
                    ))}
                </nav>
                <div className="flex gap-2">
                    {activeTab === 'editor' && (
                        <button onClick={() => window.print()} className="bg-red-600 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-red-700 active:scale-95 transition-all"><Printer size={20} /> طباعة الكل</button>
                    )}
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto mt-8 px-6 pb-20">
                {activeTab === 'editor' && (
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-10 items-start">
                        <div className="no-print xl:col-span-2 space-y-6">
                            <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm">
                                <h2 className="text-xl font-bold mb-6 border-b pb-4">بيانات الفاتورة والزبون</h2>
                                <div className="grid grid-cols-2 gap-5">
                                    <Input label="رقم الفاتورة" value={data.invoiceNumber} onChange={(v:any)=>setData({...data, invoiceNumber:v})} />
                                    <Input label="التاريخ" type="date" value={data.date} onChange={(v:any)=>setData({...data, date:v})} />
                                    <Input label="اسم الزبون" value={data.client.name} onChange={(v:any)=>setData({...data, client:{...data.client, name:v}})} className="col-span-2" />
                                    <Input label="عنوان الزبون" value={data.client.address} onChange={(v:any)=>setData({...data, client:{...data.client, address:v}})} className="col-span-2" />
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold">السلع المسجلة</h2><button onClick={()=>setData({...data, items:[...data.items,{id:Date.now().toString(),description:'',price:0,quantity:1}]})} className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-gray-800 transition-all">+ إضافة سطر جديد</button></div>
                                <div className="space-y-4">
                                    {data.items.map(item => (
                                        <div key={item.id} className="flex gap-3 items-end bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
                                            <div className="flex-grow"><input className="w-full p-2.5 border-2 border-gray-200 rounded-xl text-sm font-bold" placeholder="وصف السلعة" value={item.description} onChange={e=>setData({...data, items:data.items.map(it=>it.id===item.id?{...it,description:e.target.value}:it)})} /></div>
                                            <div className="w-20"><input type="number" className="w-full p-2.5 border-2 border-gray-200 rounded-xl text-sm text-center font-bold" value={item.quantity} onChange={e=>setData({...data, items:data.items.map(it=>it.id===item.id?{...it,quantity:parseFloat(e.target.value)||0}:it)})} /></div>
                                            <div className="w-32"><input type="number" className="w-full p-2.5 border-2 border-gray-200 rounded-xl text-sm font-bold" value={item.price} onChange={e=>setData({...data, items:data.items.map(it=>it.id===item.id?{...it,price:parseFloat(e.target.value)||0}:it)})} /></div>
                                            <button onClick={()=>setData({...data, items:data.items.filter(it=>it.id!==item.id)})} className="text-red-500 font-bold p-2 hover:bg-red-50 rounded-lg transition-all">×</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="xl:col-span-3 print-container">
                            <div className="flex flex-col gap-10 bg-gray-300 p-10 rounded-[50px] shadow-inner border-4 border-gray-400">
                                <InvoicePreview data={data} />
                                <DeliveryNotePreview data={data} />
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'settings' && (
                    <div className="max-w-3xl mx-auto bg-white p-12 rounded-[40px] border-2 border-gray-100 shadow-xl">
                        <h2 className="text-3xl font-bold mb-10 border-b-4 border-black pb-4">إعدادات المؤسسة</h2>
                        <div className="grid gap-8">
                            <Input label="اسم المؤسسة الرسمي" value={company.name} onChange={(v:any)=>setCompany({...company, name:v})} />
                            <Input label="العنوان الجغرافي" value={company.address} onChange={(v:any)=>setCompany({...company, address:v})} />
                            <Input label="رقم الهاتف" value={company.phone} onChange={(v:any)=>setCompany({...company, phone:v})} />
                            <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 rounded-3xl border-2 border-gray-100">
                                <Input label="السجل التجاري (RC)" value={company.rc} onChange={(v:any)=>setCompany({...company, rc:v})} />
                                <Input label="الرقم التعريفي الضريبي (NIF)" value={company.nif} onChange={(v:any)=>setCompany({...company, nif:v})} />
                                <Input label="الرقم الإحصائي (NIS)" value={company.nis} onChange={(v:any)=>setCompany({...company, nis:v})} />
                                <Input label="رقم المادة (AI)" value={company.ai} onChange={(v:any)=>setCompany({...company, ai:v})} />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
