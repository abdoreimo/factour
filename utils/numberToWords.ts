
export function convertAmountToWords(amount: number): string {
  // ملاحظة: هذه نسخة مبسطة جداً للغرض التوضيحي. 
  // في التطبيقات الحقيقية يفضل استخدام مكتبة متخصصة مثل "n2words" أو دالة كاملة.
  // سنقوم هنا بكتابة دالة أساسية لتمثيل "المبلغ بالحروف"
  
  const formatter = new Intl.NumberFormat('ar-DZ', {
    style: 'currency',
    currency: 'DZD',
  });
  
  // لغرض العرض الجمالي في الفاتورة:
  return `هذه الفاتورة محددة بمبلغ إجمالي قدره: ${amount.toLocaleString('ar-DZ')} دينار جزائري فقط لا غير.`;
}
