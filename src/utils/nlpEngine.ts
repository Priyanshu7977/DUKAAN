export type SentimentType = 'positive' | 'neutral' | 'negative_moderate' | 'negative_severe';

export interface SentimentAnalysisResult {
  score: number;
  type: SentimentType;
  isFrustrated: boolean;
  priorityEscalation: boolean;
}

export type CustomerIntent =
  | 'ORDER_TRACKING'
  | 'RETURNS_EXCHANGES'
  | 'SIZING_FIT'
  | 'FABRIC_CARE'
  | 'SHIPPING_DELIVERY'
  | 'PAYMENTS_REFUND'
  | 'PRODUCT_RECOMMENDATIONS'
  | 'ORDER_CANCELLATION'
  | 'DAMAGED_DEFECTIVE'
  | 'HUMAN_CONCIERGE'
  | 'DISCOUNTS_PROMOS'
  | 'BRAND_STORY'
  | 'GREETINGS'
  | 'GRATITUDE'
  | 'HOSTILITY_DISMISSAL'
  | 'ADDRESS_UPDATE'
  | 'AFFIRMATIVE'
  | 'NEGATIVE'
  | 'PLAYFUL_BANTER'
  | 'FALLBACK';

export interface ExtractedEntities {
  orderId?: string;
  phone?: string;
  size?: string;
  category?: string;
  address?: string;
}

export interface NLPClassificationResult {
  intent: CustomerIntent;
  confidence: number;
  sentiment: SentimentAnalysisResult;
  entities: ExtractedEntities;
}

export interface ConversationContext {
  lastIntent?: CustomerIntent;
  pendingAction?: 'AWAITING_ADDRESS' | 'AWAITING_SIZE' | 'AWAITING_ORDER_ID' | 'AWAITING_EXCHANGE' | null;
  orders?: any[];
  products?: any[];
  activeUser?: any;
}

export interface BotResponsePayload {
  text: string;
  type: 'text' | 'order_card' | 'return_card' | 'product_card' | 'ticket_card' | 'address_card';
  data?: any;
  quickReplies: string[];
  pendingAction?: 'AWAITING_ADDRESS' | 'AWAITING_SIZE' | 'AWAITING_ORDER_ID' | 'AWAITING_EXCHANGE' | null;
}

const CONTRACTIONS: Record<string, string> = {
  "i'm": "i am",
  "i've": "i have",
  "i'll": "i will",
  "don't": "do not",
  "didn't": "did not",
  "can't": "cannot",
  "couldn't": "could not",
  "won't": "will not",
  "doesn't": "does not",
  "isn't": "is not",
  "aren't": "are not",
  "it's": "it is",
  "what's": "what is",
  "where's": "where is",
  "how's": "how is",
  "dont": "do not",
  "cant": "cannot",
  "wont": "will not",
};

const SENTIMENT_LEXICON: Record<string, number> = {
  fuck: -4.0,
  fucking: -4.0,
  fucked: -4.0,
  stfu: -4.0,
  shit: -3.5,
  bullshit: -3.5,
  bitch: -3.5,
  bastard: -3.5,
  asshole: -3.5,
  ass: -2.5,
  crap: -2.5,
  idiot: -3.0,
  stupid: -3.0,
  dumb: -2.5,
  rubbish: -2.5,
  nonsense: -2.5,
  fraud: -3.5,
  scam: -3.5,
  cheat: -3.5,
  cheated: -3.5,
  fake: -3.0,
  stolen: -3.0,
  worst: -3.0,
  horrible: -3.0,
  terrible: -3.0,
  furious: -3.0,
  angry: -2.5,
  upset: -2.0,
  hate: -2.5,
  disgusted: -2.5,
  ridiculous: -2.0,
  pathetic: -2.5,
  useless: -2.0,
  damaged: -2.5,
  broken: -2.5,
  defective: -2.5,
  torn: -2.5,
  stain: -2.0,
  stained: -2.0,
  delayed: -2.0,
  late: -1.8,
  waiting: -1.0,
  slow: -1.2,
  lost: -2.0,
  wrong: -1.8,
  missing: -2.0,
  poor: -1.5,
  bad: -1.5,
  disappointed: -2.0,
  annoyed: -1.8,
  unhappy: -1.8,
  issue: -1.0,
  problem: -1.0,
  complaint: -1.5,
  refund: -0.5,
  cancel: -0.8,
  return: -0.2,
  exchange: 0.0,
  good: 1.5,
  great: 2.0,
  nice: 1.2,
  love: 2.5,
  loved: 2.5,
  loving: 2.2,
  perfect: 2.5,
  excellent: 2.5,
  best: 2.2,
  awesome: 2.2,
  wonderful: 2.2,
  beautiful: 2.0,
  amazing: 2.2,
  pleased: 1.8,
  happy: 1.8,
  fast: 1.5,
  quick: 1.2,
  smooth: 1.5,
  thanks: 1.5,
  thank: 1.5,
  helpful: 1.5,
  brilliant: 2.2,
  impressed: 2.0,
  superb: 2.2,
  luxurious: 1.8,
  comfortable: 1.5,
};

const INTENT_PATTERNS: Record<CustomerIntent, string[]> = {
  ORDER_TRACKING: [
    'where is my order',
    'track my order',
    'track parcel',
    'order status',
    'when will my order arrive',
    'package location',
    'tracking number',
    'track shipment',
    'delivery status',
    'where is duk',
    'has my order shipped',
    'dispatch status',
    'dtdc tracking',
    'bluedart tracking',
    'courier status',
    'is my order out for delivery',
    'check order',
    'track',
    'find my order',
    'order update',
  ],
  RETURNS_EXCHANGES: [
    'i want to return',
    'how to return',
    'exchange size',
    'exchange my shirt',
    'return policy',
    'doorstep pickup',
    'doorstep exchange',
    'can i exchange',
    'wrong size exchange',
    'return period',
    '7 day return',
    'initiate return',
    'how do i send it back',
    'replacement request',
    'swap size',
    'courier pickup for return',
    'return charges',
    'is return free',
  ],
  SIZING_FIT: [
    'size guide',
    'how do your clothes fit',
    'does it run big or small',
    'what size should i get',
    'chest measurement',
    'waist size',
    'trouser length',
    'is it oversized',
    'relaxed fit',
    'how does small fit',
    'fit consultation',
    'size chart',
    'measurements table',
    'shoulder drop fit',
    'size help',
    'baggy fit sizing',
    'i am 5 feet 11',
    'unisex sizing',
  ],
  FABRIC_CARE: [
    'how to wash',
    'how do i wash',
    'how do i wash pure european linen',
    'wash pure european linen',
    'wash linen',
    'washing linen',
    'washing pure linen',
    'fabric care',
    'linen care instructions',
    'can i machine wash',
    'does linen shrink',
    'how to iron',
    'steam iron',
    'dry clean only',
    'washing guide',
    'shrinkage prevention',
    'bleach safe',
    'cold water wash',
    'corduroy washing',
    'cotton gauze maintenance',
    'slub poplin care',
    'stain removal',
  ],
  SHIPPING_DELIVERY: [
    'how long does delivery take',
    'delivery timeline',
    'metro shipping time',
    'shipping charges',
    'is delivery free',
    'free shipping',
    'minimum order for free shipping',
    'do you deliver to my pincode',
    'do you ship across india',
    'international shipping',
    'express delivery',
    'same day dispatch',
    'delhi delivery time',
    'mumbai shipping time',
    'bengaluru delivery',
  ],
  PAYMENTS_REFUND: [
    'is cash on delivery available',
    'cod available',
    'payment options',
    'how to pay',
    'upi payment',
    'google pay phonepe paytm',
    'when will i get refund',
    'refund timeline',
    'money deducted but order not placed',
    'payment failed',
    'how is refund credited',
    'bank refund time',
    'credit card payment',
    'net banking',
    'invoice copy',
  ],
  PRODUCT_RECOMMENDATIONS: [
    'recommend a shirt',
    'what should i buy',
    'best seller',
    'best shirts for summer',
    'vacation outfit',
    'resort wear',
    'linen trousers recommend',
    'matching co ord sets',
    'gifts for men',
    'gifts for women',
    'what is trending',
    'collection 04 solstice',
    'lightweight shirts',
    'breathable clothing',
    'casual gathering look',
  ],
  ORDER_CANCELLATION: [
    'cancel my order',
    'i want to cancel',
    'how to cancel',
    'change my delivery address',
    'wrong address entered',
    'update phone number',
    'change size in existing order',
    'stop shipment',
  ],
  DAMAGED_DEFECTIVE: [
    'received damaged product',
    'torn shirt',
    'defective item',
    'stain on my garment',
    'broken button',
    'wrong item delivered',
    'cloth quality issue',
    'damaged parcel',
    'package was open',
    'flawed fabric',
  ],
  HUMAN_CONCIERGE: [
    'talk to human',
    'speak to an agent',
    'customer care number',
    'call me',
    'human support',
    'representative',
    'whatsapp number',
    'email support',
    'connect to manager',
    'escalate to supervisor',
    'phone contact',
  ],
  DISCOUNTS_PROMOS: [
    'discount code',
    'coupon code',
    'first order discount',
    'any offer available',
    'promo code',
    'welcome discount',
    'sale discount',
    'festival offers',
    'coupon not working',
  ],
  BRAND_STORY: [
    'who is dukaan',
    'about your brand',
    'where are you located',
    'where are fabrics sourced',
    'porto studio',
    'brand philosophy',
    'why european flax',
    'physical store address',
    'are you an indian brand',
  ],
  GREETINGS: [
    'hello',
    'hi',
    'hey',
    'good morning',
    'good afternoon',
    'good evening',
    'who are you',
    'what can you do',
    'how can you help me',
    'namaste',
    'hola',
  ],
  GRATITUDE: [
    'thank you',
    'thanks',
    'thanks a lot',
    'thank you so much',
    'thx',
    'appreciate it',
    'great help',
    'you are awesome',
    'helpful thanks',
    'ok thanks',
    'okay thank you',
  ],
  HOSTILITY_DISMISSAL: [
    'fuck off',
    'fuck you',
    'fucking',
    'fuck',
    'shut up',
    'stfu',
    'leave me alone',
    'go away',
    'get lost',
    'piss off',
    'screw you',
    'stop it',
    'stop messaging',
    'stop talking',
    'waste of time',
    'useless bot',
    'stupid bot',
    'idiot bot',
    'nonsense',
    'rubbish',
    'dont talk to me',
    'don t talk to me',
  ],
  ADDRESS_UPDATE: [
    'need address change',
    'change my address',
    'update delivery address',
    'wrong address',
    'change address',
    'change shipping address',
    'new address',
    'modify address',
    'wrong delivery address',
    'update shipping address',
  ],
  AFFIRMATIVE: [
    'yes',
    'sure',
    'ok',
    'okay',
    'yup',
    'yeah',
    'please',
    'confirm',
    'proceed',
  ],
  NEGATIVE: [
    'no',
    'nope',
    'cancel',
    'never mind',
    'not now',
  ],
  PLAYFUL_BANTER: [
    'sex',
    'sexy',
    'hot',
    'are you sexy',
    'you are sexy',
    'hot guy',
    'hot girl',
    'date me',
    'marry me',
    'will you marry me',
    'love you',
    'i love you',
    'kiss me',
    'are you single',
    'nude',
    'naked',
    'send nudes',
    'girlfriend',
    'boyfriend',
    'handsome',
    'cute',
    'babe',
    'baby',
    'hook up',
    'wanna hook up',
    'flirt',
    'make love',
  ],
  FALLBACK: [],
};

export class NLPEngine {
  static cleanText(input: string): string {
    let text = input.toLowerCase().trim();
    for (const [contraction, expansion] of Object.entries(CONTRACTIONS)) {
      text = text.replace(new RegExp(contraction, 'g'), expansion);
    }
    return text.replace(/[^\w\s-]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  static tokenize(text: string): string[] {
    return this.cleanText(text)
      .split(' ')
      .filter((w) => w.length > 0);
  }

  static getNGrams(tokens: string[], n: number = 2): string[] {
    const ngrams: string[] = [];
    for (let i = 0; i <= tokens.length - n; i++) {
      ngrams.push(tokens.slice(i, i + n).join(' '));
    }
    return ngrams;
  }

  static analyzeSentiment(input: string): SentimentAnalysisResult {
    const tokens = this.tokenize(input);
    if (tokens.length === 0) {
      return { score: 0, type: 'neutral', isFrustrated: false, priorityEscalation: false };
    }

    let totalScore = 0;
    let countedWords = 0;
    let severeCount = 0;
    let moderateCount = 0;

    for (const word of tokens) {
      if (SENTIMENT_LEXICON[word] !== undefined) {
        const val = SENTIMENT_LEXICON[word];
        totalScore += val;
        countedWords++;
        if (val <= -2.5) severeCount++;
        else if (val <= -1.5) moderateCount++;
      }
    }

    const normalizedScore = countedWords > 0 ? totalScore / Math.sqrt(tokens.length) : 0;

    let type: SentimentType = 'neutral';
    if (normalizedScore <= -2.2 || severeCount >= 1) {
      type = 'negative_severe';
    } else if (normalizedScore <= -0.7 || moderateCount >= 1) {
      type = 'negative_moderate';
    } else if (normalizedScore >= 0.8) {
      type = 'positive';
    }

    const isFrustrated = type === 'negative_moderate' || type === 'negative_severe';
    const priorityEscalation = type === 'negative_severe' || (type === 'negative_moderate' && severeCount > 0);

    return {
      score: Number(normalizedScore.toFixed(2)),
      type,
      isFrustrated,
      priorityEscalation,
    };
  }

  static extractEntities(input: string, context?: ConversationContext): ExtractedEntities {
    const raw = input.trim();
    const cleaned = this.cleanText(input);
    const entities: ExtractedEntities = {};

    const orderMatch = raw.match(/\b(duk[- ]?\d{4,8}|\d{5,8})\b/i);
    if (orderMatch) {
      entities.orderId = orderMatch[1].toUpperCase().replace(/\s+/g, '-');
      if (!entities.orderId.startsWith('DUK-') && !entities.orderId.startsWith('DUK')) {
        entities.orderId = `DUK-${entities.orderId}`;
      }
    }

    const phoneMatch = raw.match(/\b([6-9]\d{9})\b/);
    if (phoneMatch) {
      entities.phone = phoneMatch[1];
    }

    const sizeMatch = raw.match(/\b(xxl|xl|xs|[sml]|28|30|32|34|36|38|40)\b/i);
    if (sizeMatch) {
      entities.size = sizeMatch[1].toUpperCase();
    } else if (['m', 'l', 's', 'xl', 'xs', 'xxl', 'medium', 'large', 'small'].includes(cleaned)) {
      entities.size = cleaned.toUpperCase();
    }

    const catMatch = raw.match(/\b(shirts?|trousers?|pants?|co-?ords?|jackets?|overshirts?|knitwear|sweaters?)\b/i);
    if (catMatch) {
      const c = catMatch[1].toLowerCase();
      if (c.includes('shirt') && !c.includes('over')) entities.category = 'shirts';
      else if (c.includes('trouser') || c.includes('pant')) entities.category = 'trousers';
      else if (c.includes('coord') || c.includes('co-ord')) entities.category = 'co-ords';
      else if (c.includes('jacket') || c.includes('over')) entities.category = 'outerwear';
      else if (c.includes('knit') || c.includes('sweater')) entities.category = 'knitwear';
    }

    if (context?.pendingAction === 'AWAITING_ADDRESS' || raw.includes(',') || (/\d/.test(raw) && raw.length >= 4 && !orderMatch && !phoneMatch)) {
      entities.address = raw;
    }

    return entities;
  }

  static classifyIntent(input: string, context?: ConversationContext): { intent: CustomerIntent; confidence: number } {
    const cleaned = this.cleanText(input);
    const tokens = this.tokenize(input);

    if (tokens.length === 0) {
      return { intent: 'GREETINGS', confidence: 1.0 };
    }

    const STANDALONE_SIZES = new Set(['xs', 's', 'm', 'l', 'xl', 'xxl', '2xl', '3xl', 'medium', 'large', 'small', '30', '32', '34', '36', '38', '40']);
    if (STANDALONE_SIZES.has(cleaned)) {
      return { intent: 'SIZING_FIT', confidence: 1.0 };
    }

    const AFFIRMATIVE_WORDS = new Set(['yes', 'sure', 'ok', 'okay', 'yup', 'yeah', 'please', 'confirm', 'proceed']);
    if (AFFIRMATIVE_WORDS.has(cleaned)) {
      return { intent: 'AFFIRMATIVE', confidence: 1.0 };
    }

    const NEGATIVE_WORDS = new Set(['no', 'nope', 'cancel', 'never mind', 'not now']);
    if (NEGATIVE_WORDS.has(cleaned)) {
      return { intent: 'NEGATIVE', confidence: 1.0 };
    }

    if (context?.pendingAction === 'AWAITING_ADDRESS') {
      if (!cleaned.includes('hello') && !cleaned.includes('hi') && cleaned.length >= 3) {
        return { intent: 'ADDRESS_UPDATE', confidence: 0.95 };
      }
    }

    if (context?.pendingAction === 'AWAITING_SIZE') {
      return { intent: 'SIZING_FIT', confidence: 0.95 };
    }

    if (context?.pendingAction === 'AWAITING_ORDER_ID') {
      const orderMatch = input.match(/\b(duk[- ]?\d{4,8}|\d{5,8})\b/i);
      if (orderMatch) {
        return { intent: 'ORDER_TRACKING', confidence: 0.95 };
      }
    }

    const bigrams = this.getNGrams(tokens, 2);
    const trigrams = this.getNGrams(tokens, 3);
    const allFeatures = new Set([...tokens, ...bigrams, ...trigrams]);

    let bestIntent: CustomerIntent = 'FALLBACK';
    let highestScore = 0;

    const KEYWORD_BOOSTS: Partial<Record<CustomerIntent, string[]>> = {
      FABRIC_CARE: ['wash', 'washing', 'washed', 'iron', 'ironing', 'shrink', 'shrinkage', 'detergent', 'dryclean', 'steam'],
      RETURNS_EXCHANGES: ['return', 'returns', 'exchange', 'exchanges', 'replacement', 'swap'],
      ORDER_TRACKING: ['track', 'tracking', 'package', 'parcel', 'shipment', 'bluedart', 'dtdc', 'dispatch'],
      SIZING_FIT: ['size', 'sizes', 'measurement', 'measurements', 'chest', 'waist', 'oversized', 'fitting'],
      PAYMENTS_REFUND: ['cod', 'upi', 'gpay', 'phonepe', 'paytm', 'refund', 'banking'],
      DAMAGED_DEFECTIVE: ['damaged', 'defect', 'defective', 'torn', 'stain', 'stained', 'broken'],
      HUMAN_CONCIERGE: ['human', 'agent', 'representative', 'whatsapp', 'call', 'talk', 'speak'],
      DISCOUNTS_PROMOS: ['discount', 'coupon', 'promo', 'code', 'sale'],
      HOSTILITY_DISMISSAL: ['fuck', 'stfu', 'shut', 'idiot', 'stupid', 'bastard', 'bitch', 'asshole', 'rubbish', 'nonsense', 'piss', 'screw'],
      GRATITUDE: ['thank', 'thanks', 'thx', 'appreciate'],
      ADDRESS_UPDATE: ['address', 'destination', 'location', 'pincode', 'street', 'house', 'flat', 'city'],
      PLAYFUL_BANTER: ['sex', 'sexy', 'hot', 'nude', 'naked', 'date', 'single', 'kiss', 'babe', 'baby', 'marry'],
    };

    for (const [intentKey, patterns] of Object.entries(INTENT_PATTERNS) as [CustomerIntent, string[]][]) {
      if (intentKey === 'FALLBACK') continue;

      const boostKeywords = KEYWORD_BOOSTS[intentKey];
      let keywordBoost = 0;
      if (boostKeywords) {
        for (const kw of boostKeywords) {
          if (allFeatures.has(kw)) keywordBoost += 0.35;
        }
      }

      for (const pattern of patterns) {
        if (cleaned === pattern) {
          return { intent: intentKey, confidence: 1.0 };
        }

        const patternTokens = pattern.split(' ');
        let matches = 0;
        for (const pt of patternTokens) {
          if (allFeatures.has(pt)) matches++;
        }

        const jaccard = matches / (patternTokens.length + tokens.length - matches);
        let score = jaccard * 1.5 + keywordBoost;

        if (cleaned.includes(pattern)) {
          score += 0.6;
        }

        if (score > highestScore) {
          highestScore = score;
          bestIntent = intentKey;
        }
      }
    }

    if (highestScore < 0.25) {
      const orderMatch = input.match(/\b(duk[- ]?\d{4,8}|\d{5,8})\b/i);
      if (orderMatch) {
        return { intent: 'ORDER_TRACKING', confidence: 0.85 };
      }
      return { intent: 'FALLBACK', confidence: highestScore };
    }

    return {
      intent: bestIntent,
      confidence: Math.min(Number(highestScore.toFixed(2)), 0.99),
    };
  }

  static processInput(input: string, context?: ConversationContext): NLPClassificationResult {
    const sentiment = this.analyzeSentiment(input);
    const entities = this.extractEntities(input, context);
    const { intent, confidence } = this.classifyIntent(input, context);

    return {
      intent,
      confidence,
      sentiment,
      entities,
    };
  }

  static generateResponse(
    classification: NLPClassificationResult,
    storeContext?: ConversationContext
  ): BotResponsePayload {
    const { intent, sentiment, entities } = classification;

    if (intent === 'HOSTILITY_DISMISSAL') {
      return {
        text: `I apologize if I caused any frustration. I will step back and give you space.\n\nIf you ever need assistance with an order or would like to speak directly with our human team, we are here for you anytime.`,
        type: 'text',
        quickReplies: ['Speak to Human Concierge', 'Track an Order', 'Clear Chat'],
      };
    }

    if (sentiment.priorityEscalation) {
      const ticketRef = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;
      return {
        text: `I truly apologize for the distress and inconvenience this has caused you. As a brand dedicated to uncompromising client satisfaction, I have immediately prioritized your request under VIP Support Ticket **#${ticketRef}**. A senior concierge will directly attend to this. You can also connect with our direct leadership line on WhatsApp right away.`,
        type: 'ticket_card',
        data: {
          ticketId: ticketRef,
          status: 'High Priority Escalated',
          reason: 'Client Satisfaction Priority',
          phone: '+91 7977641125',
          email: 'concierge@dukaan-store.com',
        },
        quickReplies: ['Open WhatsApp Chat', 'Check Order', '7-Day Returns', 'Sizing Help'],
      };
    }

    switch (intent) {
      case 'ADDRESS_UPDATE': {
        const address = entities.address || '';
        const isProvidingAddress = storeContext?.pendingAction === 'AWAITING_ADDRESS' || address.includes(',') || /\d/.test(address);

        if (isProvidingAddress && address.length >= 3) {
          const modRef = `REQ-ADDR-${Math.floor(100000 + Math.random() * 900000)}`;
          return {
            text: `I have recorded your updated delivery destination request:\n\n• **Updated Shipping Address**: ${address}\n• **Modification Dossier**: #${modRef}\n• **Status**: Queued for Dispatch Supervisor Review\n\nOur fulfillment center updates the carrier manifest before the courier airway bill is generated. Would you like me to instantly send this address update to our dispatch manager on WhatsApp?`,
            type: 'address_card',
            data: {
              requestId: modRef,
              address: address,
              status: 'Queued for Airway Bill Update',
              phone: '+91 7977641125',
            },
            quickReplies: ['Confirm on WhatsApp', 'Track My Order', 'Speak to Concierge'],
            pendingAction: null,
          };
        }

        return {
          text: `You can modify your delivery destination or contact phone number anytime before courier dispatch.\n\nPlease share your **new delivery address** (for example: house number, street, city, pincode) and your **Order ID**, and our dispatch team will update the manifest immediately.`,
          type: 'text',
          quickReplies: ['Change Size Instead', 'Speak to Concierge', 'Track My Order'],
          pendingAction: 'AWAITING_ADDRESS',
        };
      }

      case 'ORDER_TRACKING': {
        const orderId = entities.orderId;
        const userOrders: any[] = storeContext?.orders || [];

        if (orderId) {
          const found = userOrders.find(
            (o) => o.id && o.id.toUpperCase().replace(/\s+/g, '-') === orderId.toUpperCase()
          );
          if (found) {
            return {
              text: `I located your order **#${found.id}**! It is currently **${found.status}**. Delivery is estimated for **${found.estimatedDelivery || 'Within 2-3 business days'}** via ${found.trackingNumber || 'BlueDart Express'}.`,
              type: 'order_card',
              data: found,
              quickReplies: ['Need Address Change', 'Returns & Exchanges', 'Speak to Concierge'],
            };
          }

          return {
            text: `I could not locate an active order matching **#${orderId}** in our dispatch records.\n\nPlease double-check that the order number matches the one in your confirmation email or SMS. If you placed the order under a different mobile number or need manual record verification, please connect directly with our concierge team.`,
            type: 'text',
            quickReplies: ['Track by Mobile Number', 'Connect on WhatsApp', 'Speak to Concierge'],
          };
        }

        if (userOrders.length > 0) {
          const latest = userOrders[0];
          return {
            text: `You have **${userOrders.length}** recent order(s) on file. Here is the latest dispatch for order **#${latest.id}** (${latest.status}):`,
            type: 'order_card',
            data: latest,
            quickReplies: userOrders.length > 1
              ? userOrders.slice(1, 3).map((o) => `Track #${o.id}`)
              : ['Need Address Change', 'Returns & Exchanges', 'Speak to Concierge'],
          };
        }

        return {
          text: `You do not have any orders associated with this account or browser session yet.\n\nIf you recently placed an order as a guest, please share your **Order ID** (for example, **#DUK-XXXXXX**) or your 10-digit registered mobile number, and I will track it for you right away.`,
          type: 'text',
          quickReplies: ['Track by Mobile Number', 'Check Shipping Timelines', 'Speak to Concierge'],
          pendingAction: 'AWAITING_ORDER_ID',
        };
      }

      case 'RETURNS_EXCHANGES': {
        const returnRef = `RET-${Math.floor(100000 + Math.random() * 900000)}`;
        return {
          text: `We offer an effortless **7-Day Doorstep Size Replacement & Return Guarantee** with zero pickup fees across all Indian PIN codes. Our courier partner will collect the garment directly from your address. Would you like to schedule a size replacement or a return?`,
          type: 'return_card',
          data: {
            returnRef,
            window: '7 Days from Delivery',
            pickupFee: 'Free (₹0 Doorstep Pickup)',
            timeline: 'Courier assigned within 24-48 hours',
          },
          quickReplies: ['Exchange for Different Size', 'Refund to Bank/UPI', 'Return Policy Details', 'Check Sizing'],
        };
      }

      case 'SIZING_FIT': {
        const size = (entities.size || '').toUpperCase();
        if (size === 'M' || size === 'MEDIUM') {
          return {
            text: `Here is the comprehensive fit dossier for size **Medium (M)**:\n\n• **Chest Width**: 40 inches (102 cm) with 2 inches of comfortable European drape\n• **Shoulder Posture**: Architectural relaxed dropped shoulder\n• **Recommended Body**: Height 5'8" - 5'11" (172 - 180 cm), chest 38"-40"\n• **Fit Silhouette**: Unrestrictive and airy. Standard M provides clean drape without cling.\n• **Trouser Pairing**: Size 32 waist with double pleats and back elastic ease.\n\nAll Dukaan orders include complimentary 7-day doorstep size replacement.`,
            type: 'text',
            quickReplies: ['Check Size L Fit', 'Check Size S Fit', 'Recommend M Shirt', 'View Size Guide'],
            pendingAction: 'AWAITING_SIZE',
          };
        }

        if (size === 'L' || size === 'LARGE') {
          return {
            text: `Here is the comprehensive fit dossier for size **Large (L)**:\n\n• **Chest Width**: 42 inches (107 cm) with generous volume\n• **Shoulder Posture**: Modern dropped shoulder cut\n• **Recommended Body**: Height 5'10" - 6'2" (178 - 188 cm), chest 41"-43"\n• **Trouser Pairing**: Size 34 waist with relaxed wide-leg drape.\n\nIncludes 7-day doorstep replacement if you need a size adjustment.`,
            type: 'text',
            quickReplies: ['Check Size M Fit', 'Check Size XL Fit', 'Recommend L Shirt', 'View Size Guide'],
            pendingAction: 'AWAITING_SIZE',
          };
        }

        if (size === 'S' || size === 'SMALL') {
          return {
            text: `Here is the comprehensive fit dossier for size **Small (S)**:\n\n• **Chest Width**: 38 inches (96 cm)\n• **Shoulder Posture**: Clean subtle drop shoulder\n• **Recommended Body**: Height 5'5" - 5'8" (165 - 173 cm), chest 36"-38"\n• **Trouser Pairing**: Size 30 waist.`,
            type: 'text',
            quickReplies: ['Check Size M Fit', 'Recommend S Shirt', 'View Size Guide'],
            pendingAction: 'AWAITING_SIZE',
          };
        }

        if (size === 'XL' || size === 'EXTRA LARGE') {
          return {
            text: `Here is the comprehensive fit dossier for size **Extra Large (XL)**:\n\n• **Chest Width**: 44 inches (112 cm)\n• **Recommended Body**: Height 6'0"+ (183 cm+), chest 43"-45"\n• **Trouser Pairing**: Size 36 waist.`,
            type: 'text',
            quickReplies: ['Check Size L Fit', 'Check Size XXL Fit', 'View Size Guide'],
            pendingAction: 'AWAITING_SIZE',
          };
        }

        if (size === 'XS') {
          return {
            text: `Here is the comprehensive fit dossier for size **Extra Small (XS)**:\n\n• **Chest Width**: 36 inches (91 cm)\n• **Recommended Body**: Height up to 5'6" (167 cm), chest 34"-36"\n• **Trouser Pairing**: Size 28 waist.`,
            type: 'text',
            quickReplies: ['Check Size S Fit', 'View Size Guide'],
            pendingAction: 'AWAITING_SIZE',
          };
        }

        if (size === 'XXL' || size === '2XL') {
          return {
            text: `Here is the comprehensive fit dossier for size **XXL (46")**:\n\n• **Chest Width**: 46 inches (117 cm)\n• **Recommended Body**: Chest 45"-48"\n• **Trouser Pairing**: Size 38 waist.`,
            type: 'text',
            quickReplies: ['Check Size XL Fit', 'View Size Guide'],
            pendingAction: 'AWAITING_SIZE',
          };
        }

        if (['28', '30', '32', '34', '36', '38', '40'].includes(size)) {
          return {
            text: `Here is the trouser sizing breakdown for waist **${size}**:\n\n• Built-in internal drawstring with elasticated back waist for 2 inches of natural ease\n• Features deep front architectural double pleats and fluid wide-leg cut\n• Inseam length: 30-31 inches tailored for clean break over loafers or sandals.`,
            type: 'text',
            quickReplies: ['Explore Trousers', 'Check Shirt Sizing', 'View Size Guide'],
            pendingAction: 'AWAITING_SIZE',
          };
        }

        return {
          text: `Dukaan silhouettes are cut with a relaxed, modern unisex posture inspired by European tailoring:\n\n• **Shirts**: Feature relaxed dropped shoulders and generous chest volume. Choose true standard size for an effortless drape, or size down for tailored fit.\n• **Trousers**: Engineered with comfortable pull-on elasticated waistbands and deep double pleats for fluid ease of movement.\n• **Sizes Available**: XS (36"), S (38"), M (40"), L (42"), XL (44"), XXL (46").\n\nWhich size would you like a detailed measurement breakdown for? (e.g. S, M, L, XL)`,
          type: 'text',
          quickReplies: ['Size S', 'Size M', 'Size L', 'Size XL', 'Size Guide'],
          pendingAction: 'AWAITING_SIZE',
        };
      }

      case 'AFFIRMATIVE': {
        return {
          text: `Wonderful! How may I best proceed to assist you? You can ask for real-time order tracking, doorstep size replacement, fabric care guidance, or direct human concierge connection.`,
          type: 'text',
          quickReplies: ['Track My Order', '7-Day Exchange', 'Speak to Human Concierge'],
        };
      }

      case 'NEGATIVE': {
        return {
          text: `Understood! I'll be right here whenever you need anything. Please feel free to ask anytime.`,
          type: 'text',
          quickReplies: ['Explore Catalog', 'Track My Order', 'Size Guide'],
        };
      }

      case 'FABRIC_CARE': {
        return {
          text: `Dukaan garments are crafted exclusively from 100% natural Normandy flax linen and double-crinkle cotton gauze:
1. **Washing**: Hand wash or machine wash on a delicate cycle using cold water with mild liquid detergent.
2. **Drying**: Reshape gently while damp and dry flat in natural shade. Avoid tumble dryers to prevent fiber stress.
3. **Ironing**: Steam lightly while slightly damp for that relaxed, rich linen luster.
Natural flax linen softens gracefully and increases in tactile nobility with every single wash cycle.`,
          type: 'text',
          quickReplies: ['Does linen shrink?', 'Shop 100% Linen', 'Track Order', 'Return Policy'],
        };
      }

      case 'SHIPPING_DELIVERY': {
        return {
          text: `Here are our nationwide delivery standards:
• **Dispatch**: Every garment is dispatched from our fulfillment hub within 24 to 48 hours.
• **Metro Cities** (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune): **2 to 3 Business Days**.
• **Rest of India**: **3 to 5 Business Days**.
• **Free Shipping**: 100% FREE express shipping on all orders of ₹1,999 or more (a flat ₹150 applies for smaller orders).`,
          type: 'text',
          quickReplies: ['Track My Order', 'Is COD Available?', 'Shipping to Pincode', 'Speak to Concierge'],
        };
      }

      case 'PAYMENTS_REFUND': {
        return {
          text: `We provide complete flexibility and bank-grade security for your payments:
• **Cash on Delivery (COD)**: Available nationwide across 19,000+ Indian PIN codes.
• **Instant Online / UPI**: Google Pay, PhonePe, Paytm, BHIM, Credit/Debit cards & Net Banking.
• **Refund Timelines**: Once a returned item reaches our hub, refunds are credited back to your original payment method or UPI within **3 to 5 banking days**. For COD orders, refund is transferred directly to your bank account or UPI ID.`,
          type: 'text',
          quickReplies: ['Check Refund Status', 'Payment Failed Help', 'Track My Order', 'Speak to Concierge'],
        };
      }

      case 'PRODUCT_RECOMMENDATIONS': {
        const sampleProducts = storeContext?.products?.slice(0, 3) || [
          {
            id: 'fa-1',
            slug: 'almond-white-gauze-holiday-shirt',
            name: 'Almond White Gauze Holiday Shirt',
            price: 3890,
            category: 'shirts',
            image: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/AWGauze1.jpg?v=1780592855',
          },
          {
            id: 'fa-2',
            slug: 'beige-baggy-fit-trousers',
            name: 'Beige Baggy Fit Trousers',
            price: 3490,
            category: 'trousers',
            image: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/BeigeBaggyFitTrousers_1.jpg?v=1790961467',
          },
          {
            id: 'fa-3',
            slug: 'a-day-in-tulum-printed-cropped-shirt',
            name: 'A Day in Tulum Printed Co-Ord',
            price: 4100,
            category: 'co-ords',
            image: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/ADayinTulumPrintedCroppedShirt1.jpg?v=1784180849',
          },
        ];

        return {
          text: `Here are three of our most celebrated quiet-luxury pieces, handcrafted from Normandy raw flax linen and double-gauze cotton for effortless breathability:`,
          type: 'product_card',
          data: sampleProducts,
          quickReplies: ['Explore All Shirts', 'Explore Trousers', 'View Co-Ords', 'Size Guide'],
        };
      }

      case 'ORDER_CANCELLATION': {
        return {
          text: `You can modify your delivery destination, update contact details, or cancel your order anytime before courier dispatch.\n\nIf your order has not yet left our fulfillment hub, message us with your **Order ID** and the new details, and our concierge team will amend it instantly.`,
          type: 'text',
          quickReplies: ['Need Address Change', 'Change Size Instead', 'Speak to Concierge', 'Track My Order'],
          pendingAction: 'AWAITING_ADDRESS',
        };
      }

      case 'DAMAGED_DEFECTIVE': {
        const ticketRef = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;
        return {
          text: `I am deeply sorry that your garment was not in pristine condition. Dukaan holds every stitch to stringent craftsmanship standards. I have immediately raised Priority Ticket **#${ticketRef}**. We will arrange an immediate priority doorstep replacement with zero questions asked.`,
          type: 'ticket_card',
          data: {
            ticketId: ticketRef,
            status: 'Immediate Priority Replacement',
            action: 'Doorstep exchange within 24-48 hours',
            phone: '+91 7977641125',
          },
          quickReplies: ['Connect on WhatsApp', 'Provide Order ID', 'Request Full Refund'],
        };
      }

      case 'HUMAN_CONCIERGE': {
        const ticketRef = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;
        return {
          text: `Our dedicated Client Care Concierge is at your service:
• **WhatsApp Direct**: [+91 7977641125](https://wa.me/917977641125) (Instant responses 9 AM - 9 PM IST)
• **Concierge Desk**: concierge@dukaan-store.com
• **Callback Ticket**: **#${ticketRef}** has been reserved for your inquiry.`,
          type: 'ticket_card',
          data: {
            ticketId: ticketRef,
            status: 'Ready for Live Concierge',
            phone: '+91 7977641125',
            email: 'concierge@dukaan-store.com',
          },
          quickReplies: ['Chat on WhatsApp', 'Track an Order', 'Size Consultation', 'Returns Help'],
        };
      }

      case 'DISCOUNTS_PROMOS': {
        return {
          text: `We practice mindful, fair pricing on all our handcrafted natural fiber garments year-round:
• **Welcome Offer**: Use code **DUKAAN10** at checkout for **10% OFF** your first order.
• **Complimentary Shipping**: All orders over ₹1,999 include 100% free express delivery.
Enter the code in the discount field on the checkout page to apply your savings.`,
          type: 'text',
          quickReplies: ['Apply at Checkout', 'Explore Catalog', 'Track Order', 'Size Help'],
        };
      }

      case 'BRAND_STORY': {
        return {
          text: `DUKAAN represents an antidote to disposable fast fashion. We create contemporary unisex clothing crafted with 100% pure European Normandy flax linen, soft double-gauze cotton, and textured corduroy. Designed with comfortable dropped shoulders and architectural drape, our garments are crafted in limited batches to outlive seasonal trends.`,
          type: 'text',
          quickReplies: ['Explore Lookbook', 'Fabric Care Guide', 'Shop Best Sellers', 'Speak to Concierge'],
        };
      }

      case 'GRATITUDE': {
        return {
          text: `You're most welcome! It is our absolute pleasure to assist you.\n\nPlease feel free to reach out anytime if you need help with styling, sizing, or orders. Have a wonderful day!`,
          type: 'text',
          quickReplies: ['Explore Catalog', 'Track My Order', 'Fabric Care Guide'],
        };
      }

      case 'GREETINGS': {
        return {
          text: `Welcome to DUKAAN Concierge. I am here to assist you with order tracking, doorstep size exchanges, fabric care instructions, or personalized styling recommendations.\n\nHow may I assist you today?`,
          type: 'text',
          quickReplies: ['Track My Order', 'Returns & Exchanges', 'Size & Fit Guide', 'Fabric Care Guide', 'Speak to Concierge'],
        };
      }

      case 'PLAYFUL_BANTER': {
        return {
          text: `While our pure European linens and mulberry silks feel undeniably sensual against bare skin, as the DUKAAN digital concierge my role is to help you get dressed, not undressed.\n\nMay I assist you with tailored sizing, live order tracking, or styling your next ensemble?`,
          type: 'text',
          quickReplies: ['Explore Pure Linens', 'Size & Fit Guide', 'Track My Order', 'Speak to Human Team'],
        };
      }

      case 'FALLBACK':
      default: {
        return {
          text: `I want to make sure I assist you accurately. As the DUKAAN digital concierge, I specialize in:\n\n• **Live Order Tracking**: Real-time transit & dispatch updates\n• **7-Day Doorstep Returns & Exchanges**: Size swaps with free pickup\n• **Fabric & Linen Care**: Washing, pressing & maintenance advice\n• **Sizing & Silhouette Guide**: Relaxed European tailoring guidance\n• **Payments & Billing**: COD, UPI & instant digital invoices\n\nCould you please rephrase your request, or would you like to speak directly with our concierge team?`,
          type: 'text',
          quickReplies: ['Track My Order', 'Returns & Exchanges', 'Size & Fit Guide', 'Speak to Concierge'],
        };
      }
    }
  }
}
