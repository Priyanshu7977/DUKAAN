export interface FAQItem {
  question: string;
  answer: string;
  category: 'Orders & Delivery' | 'Sizes & Fit' | 'Fabrics & Washing' | 'Returns & Exchanges' | 'Payments';
}

export const FAQ_DATA: FAQItem[] = [
  {
    category: 'Orders & Delivery',
    question: 'How fast is delivery across India?',
    answer: 'Orders are dispatched within 24 to 48 hours. Delivery takes 2 to 3 working days in metro cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune) and 3 to 5 working days for the rest of India.',
  },
  {
    category: 'Orders & Delivery',
    question: 'Is shipping free?',
    answer: 'Yes! All orders of ₹1,999 or more get 100% FREE express delivery anywhere in India. For orders below ₹1,999, a flat delivery charge of ₹150 is applied at checkout.',
  },
  {
    category: 'Payments',
    question: 'Do you offer Cash on Delivery (COD)?',
    answer: 'Yes, Cash on Delivery (COD) is available across most Indian PIN codes. You can also pay safely online using UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards, or Net Banking.',
  },
  {
    category: 'Sizes & Fit',
    question: 'How do Dukaan garments fit?',
    answer: 'Our pieces have a relaxed, modern unisex fit designed for all-day comfort. Shirts feature an effortless dropped shoulder, and pants have a comfortable pull-on waist. Choose your standard size (S, M, L, XL, XXL) or check our detailed Size Guide on any product page.',
  },
  {
    category: 'Returns & Exchanges',
    question: 'What if the size does not fit me properly?',
    answer: 'We provide easy 7-day doorstep size exchanges and returns. Simply message us on WhatsApp at +91 7977641125 with your order ID, and our courier partner will pick up the garment right from your doorstep.',
  },
  {
    category: 'Fabrics & Washing',
    question: 'What fabrics do you use?',
    answer: 'We use 100% natural and breathable fabrics: pure European linen, soft double-crinkle cotton gauze, and textured corduroy. We do not use polyester or cheap synthetic blends.',
  },
  {
    category: 'Fabrics & Washing',
    question: 'How should I wash and care for my clothes?',
    answer: 'Wash in cold water on a gentle cycle or hand wash with mild liquid detergent. Avoid harsh bleaches and tumble drying. Dry naturally in the shade and use a medium steam iron for a crisp, fresh look.',
  },
  {
    category: 'Orders & Delivery',
    question: 'How do I track my order?',
    answer: 'As soon as your parcel is shipped, you will receive an SMS and WhatsApp message with your live tracking link. You can also message us anytime at +91 7977641125 for an instant delivery status update.',
  }
];
