import React, { useState, useRef, useEffect } from 'react';
import { X, Send, User, Clock } from 'lucide-react';
import { analytics } from '../lib/analytics';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  priority?: 'low' | 'medium' | 'high';
}

// Truffle - The Grey Cat AI Assistant Icon
const TruffleIcon: React.FC<{ 
  className?: string; 
  isAnimated?: boolean;
}> = ({ className = "h-6 w-6", isAnimated = false }) => {
  
  return (
    <div className={`${className} relative ${isAnimated ? 'animate-bounce-slow' : ''}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Cat head - Grey coloring with tabby markings */}
        <ellipse cx="50" cy="55" rx="25" ry="22" fill="#6B7280" stroke="#4B5563" strokeWidth="1"/>
        
        {/* Tabby stripes on head */}
        <path d="M 35 45 Q 50 40 65 45" stroke="#4B5563" strokeWidth="1.5" fill="none" opacity="0.7"/>
        <path d="M 38 50 Q 50 47 62 50" stroke="#4B5563" strokeWidth="1" fill="none" opacity="0.5"/>
        
        {/* Cat ears */}
        <polygon points="30,40 35,25 45,35" fill="#6B7280" stroke="#4B5563" strokeWidth="1"/>
        <polygon points="55,35 65,25 70,40" fill="#6B7280" stroke="#4B5563" strokeWidth="1"/>
        
        {/* Inner ears */}
        <polygon points="32,37 36,28 42,35" fill="#9CA3AF"/>
        <polygon points="58,35 64,28 68,37" fill="#9CA3AF"/>
        
        {/* Eyes - Bright and mischievous */}
        <ellipse cx="42" cy="50" rx="4" ry="6" fill="#FCD34D" className={isAnimated ? 'animate-pulse' : ''}/>
        <ellipse cx="58" cy="50" rx="4" ry="6" fill="#FCD34D" className={isAnimated ? 'animate-pulse' : ''}/>
        
        {/* Eye pupils - slightly dilated for playful look */}
        <ellipse cx="42" cy="52" rx="2" ry="4" fill="#1F2937"/>
        <ellipse cx="58" cy="52" rx="2" ry="4" fill="#1F2937"/>
        
        {/* Nose - pink and prominent */}
        <polygon points="48,58 52,58 50,62" fill="#EC4899"/>
        
        {/* Mouth - slight smirk */}
        <path d="M 50 62 Q 45 65 40 62" stroke="#4B5563" strokeWidth="1.5" fill="none"/>
        <path d="M 50 62 Q 55 65 60 62" stroke="#4B5563" strokeWidth="1.5" fill="none"/>
        
        {/* Whiskers - slightly askew for mischievous look */}
        <line x1="25" y1="55" x2="35" y2="57" stroke="#4B5563" strokeWidth="1"/>
        <line x1="25" y1="60" x2="35" y2="59" stroke="#4B5563" strokeWidth="1"/>
        <line x1="65" y1="57" x2="75" y2="55" stroke="#4B5563" strokeWidth="1"/>
        <line x1="65" y1="59" x2="75" y2="60" stroke="#4B5563" strokeWidth="1"/>
        
        {/* Chat bubble indicator when animated */}
        {isAnimated && (
          <g className="animate-pulse">
            <circle cx="75" cy="30" r="8" fill="#6366F1" opacity="0.8"/>
            <circle cx="72" cy="28" r="1.5" fill="white"/>
            <circle cx="75" cy="28" r="1.5" fill="white"/>
            <circle cx="78" cy="28" r="1.5" fill="white"/>
          </g>
        )}
      </svg>
    </div>
  );
};

// Enhanced knowledge base for Truffle
const TruffleKnowledge = {
  // Truffle's personality traits
  personality: {
    breed: "Half-tabby, half-sphynx",
    color: "Grey with tabby markings",
    traits: ["naughty", "playful", "clingy", "mischievous", "affectionate"],
    gender: "Male",
    quirks: [
      "loves to knock things off tables",
      "follows humans everywhere",
      "demands attention at the worst times",
      "purrs loudly when happy",
      "has a habit of 'helping' with work by walking on keyboards"
    ]
  },

  // Platform knowledge
  platform: {
    name: "Purrfect Stays",
    mission: "The Future of Perfect Cattery Bookings - Revolutionizing cattery bookings by connecting cat parents with premium catteries",
    tagline: "Designed for Both Communities",
    launch: "Beta Q4 2025, Full launch Q1 2026",
    userTypes: ["cat-parent", "cattery-owner"],
    pricing: {
      catParents: "100% free forever - FREE PLATFORM",
      catteryOwners: "Still determining the best pricing model - early access members help us decide between subscription tiers, commission-based, or hybrid options"
    },
    keyFeatures: {
      geolocation: "Smart Location-Based Matching - connects cat parents with nearby catteries using advanced geolocation technology",
      realTimeAvailability: "Real-time availability checking and transparent pricing",
      verifiedNetwork: "Comprehensive verification process for all cattery partners",
      automatedBookings: "Streamlined booking process with automated confirmations",
      qrCode: "Easy QR code access at /qr - scan to instantly visit our platform from any mobile device"
    }
  },

  // Detailed FAQ responses
  faq: {
    howItWorks: {
      catParents: [
        "Search and filter catteries based on your cat's specific needs",
        "View real-time availability and transparent pricing",
        "Book directly through our secure platform",
        "Receive confirmation and updates about your booking",
        "Rate and review your experience to help other cat parents"
      ],
      catteryOwners: [
        "Create your cattery profile with photos and details",
        "Set your availability, pricing, and booking preferences",
        "Receive qualified booking requests from verified cat parents",
        "Manage bookings through our comprehensive dashboard",
        "Get paid securely through our platform"
      ]
    },
    
    benefits: {
      catParents: [
        "Free platform access with no hidden fees",
        "Priority booking during high-demand periods",
        "Access to verified, premium catteries",
        "Real-time availability checking",
        "Secure payment processing",
        "24/7 customer support",
        "Detailed cattery reviews and ratings"
      ],
      catteryOwners: [
        "No upfront costs or monthly fees",
        "Commission-only pricing model",
        "Advanced booking management tools",
        "Automated payment processing",
        "Marketing and promotional support",
        "Business analytics and insights",
        "Priority customer support"
      ]
    },

    security: [
      "Enterprise-grade SSL encryption for all data",
      "Secure payment processing through PCI-compliant systems",
      "Verified cattery network with background checks",
      "Regular security audits and updates",
      "GDPR and privacy law compliance",
      "24/7 security monitoring"
    ],

    timeline: {
      now: "Building early access community",
      q4_2025: "Beta testing begins with early access members",
      q1_2026: "Full platform launch with all features",
      ongoing: "Continuous feature development based on user feedback"
    },

    platform_details: {
      technology: "Built with React, TypeScript, and modern web technologies for optimal performance",
      mobile: "Fully mobile-optimized responsive design - works perfectly on all devices",
      support: "Comprehensive support system with live chat, FAQ, email support, and priority assistance for early access members",
      community: "Active early access member community helping shape platform development",
      countries: "Currently accepting early access members globally with localized features coming soon"
    },

    contact_info: {
      general: "support@purrfectstays.org",
      privacy: "privacy@purrfectstays.org", 
      business: "business@purrfectstays.org",
      urgent: "urgent@purrfectstays.org",
      hours: "Monday-Friday 9AM-6PM EST, Extended hours for early access members"
    },

    regional_info: {
      popular_countries: ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France"],
      availability: "Currently accepting early access members globally",
      localization: "Platform launching in English first, with additional languages based on early access member feedback",
      timezone_support: "24/7 platform access with regional customer support hours",
      currency: "USD pricing with local currency support coming in 2026"
    },

    waitlist_estimates: {
      current_total: "Growing rapidly with hundreds of early access members",
      country_limits: "Approximately 50-100 spots per major country for quality beta testing",
      position_benefits: "Earlier positions get more influence on platform development",
      exclusivity: "Limited time opportunity - expanding public availability in Q1 2026"
    },

    integration_partners: {
      payment: "Secure payment processing through industry-leading providers",
      mapping: "Advanced geolocation and mapping for cattery discovery",
      communication: "Integrated messaging system between cat parents and catteries",
      calendar: "Real-time booking calendar integration",
      verification: "Identity and business verification systems for trust and safety"
    },

    cat_care_tips: {
      choosing_cattery: [
        "Visit the facility before booking to ensure cleanliness and safety",
        "Ask about their vaccination requirements and health protocols",
        "Inquire about daily routines and how they handle stressed cats",
        "Check if they provide regular updates and photos during stays",
        "Ensure they have proper emergency veterinary contacts"
      ],
      preparing_for_stay: [
        "Bring familiar items like favorite toys or blankets",
        "Provide detailed care instructions and emergency contacts",
        "Ensure vaccinations are up to date with documentation",
        "Consider a trial visit for anxious cats",
        "Pack enough of their regular food for the entire stay"
      ],
      cattery_best_practices: [
        "Maintain detailed records for each cat's preferences and needs",
        "Provide spacious, clean accommodations with proper ventilation",
        "Offer both social interaction and quiet retreat spaces",
        "Keep emergency veterinary contacts readily available",
        "Send regular photo updates to worried cat parents"
      ]
    },

    seasonal_responses: {
      holiday_periods: "High demand during holidays - early access members get priority booking",
      summer_travel: "Peak cattery season is summer vacation months (June-August)",
      winter_considerations: "Indoor climate control and cozy environments are priorities",
      spring_features: "Spring cleaning protocols and allergy considerations for sensitive cats"
    },

    business_insights: {
      market_size: "Multi-billion dollar pet care industry with growing cattery segment",
      growth_trends: "Increasing demand for premium pet services and transparent booking",
      target_demographics: "Cat parents aged 25-55 with disposable income for premium pet care",
      competitive_advantages: "Real-time availability, verified network, and transparent pricing"
    }
  }
};

const ChatbotSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Meow! 🐱 I'm Truffle, your mischievous grey tabby-sphynx AI assistant here at Purrfect Stays! *swishes tail playfully* I'm half-tabby, half-sphynx, and 100% here to help you with anything about our revolutionary cattery booking platform. Fair warning though - I might be a bit clingy and ask lots of questions back! What can this naughty kitty help you with today? 😸",
      isBot: true,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Track chatbot interactions
  useEffect(() => {
    if (isOpen) {
      analytics.trackChatbotInteraction('opened');
    }
  }, [isOpen]);

  const quickResponses = [
    "How does the platform work?",
    "What are the costs?",
    "When will it launch?",
    "Tell me about Truffle!",
    "Is my data secure?",
    "Early access benefits?",
    "What's my waitlist position?",
    "Cat care tips?",
    "Which countries are supported?",
    "Holiday booking advice?",
    "Business partnership info?",
    "QR code for sharing?"
  ];

  const getBotResponse = (userMessage: string): { text: string; priority: 'low' | 'medium' | 'high' } => {
    const message = userMessage.toLowerCase();
    
    // Truffle personality responses
    if (message.includes('truffle') || message.includes('who are you') || message.includes('tell me about you') || message.includes('your name')) {
      return {
        text: "Purr! 😸 I'm Truffle, and I'm quite the character! I'm a handsome grey male cat who's half-tabby, half-sphynx - which means I've got the best of both worlds: beautiful tabby markings AND that sphynx curiosity that gets me into trouble! *knocks imaginary object off table* I'm known for being super playful, quite naughty (I can't help it!), and extremely clingy - I follow my humans EVERYWHERE. At Purrfect Stays, I use my cat expertise to help both cat parents and cattery owners navigate our platform. Want to know a secret? I sometimes walk across keyboards while 'helping' with work! 🐾",
        priority: 'low'
      };
    }

    if (message.includes('naughty') || message.includes('mischievous') || message.includes('playful')) {
      return {
        text: "Hehe, you caught me! 😈 I AM quite naughty - it's part of my charm! I love knocking things off tables (it's a scientific experiment, I swear!), interrupting important video calls by walking across keyboards, and demanding attention at the most inconvenient times. But hey, that's what makes me such a great assistant for cat-related questions - I understand the feline mind perfectly! *purrs mischievously* Speaking of which, what cat care questions can this troublemaker help you with? 🐱",
        priority: 'low'
      };
    }

    if (message.includes('clingy') || message.includes('affectionate') || message.includes('follow')) {
      return {
        text: "Guilty as charged! 🥺 I'm SUPER clingy - I follow my humans everywhere because I just love being involved in everything they do! Bathroom breaks? I'm there. Important meetings? Perfect time for cuddles! It's not that I'm needy... okay, maybe I am a little needy, but it's because I care so much! That's exactly why I'm perfect for helping with Purrfect Stays - I understand that cats (and their parents) need lots of love and attention. How can I shower YOU with helpful information today? 💕",
        priority: 'low'
      };
    }

    // High priority responses (urgent issues)
    if (message.includes('problem') || message.includes('error') || message.includes('bug') || message.includes('broken')) {
      return {
        text: "Oh no! *ears flatten with concern* 😿 This naughty kitty doesn't like when things aren't working properly! Let me pounce on this problem right away and get our human support team involved. I'm marking this as HIGH PRIORITY - someone will reach out within 15 minutes to fix whatever's bothering you. Can you tell me more details so I can make sure they have everything they need? *determined tail swish*",
        priority: 'high'
      };
    }
    
    if (message.includes('refund') || message.includes('cancel') || message.includes('complaint')) {
      return {
        text: "Meow! 😾 I can sense you're not happy, and that makes this kitty's whiskers droop! Don't worry - I'm connecting you directly with our customer success team who will make everything right. They're much better at fixing serious stuff than I am (I'm better at knocking things over than fixing them!). They'll contact you within 30 minutes to sort this out properly! 🐾",
        priority: 'high'
      };
    }

    // Platform functionality questions
    if (message.includes('how') && (message.includes('work') || message.includes('platform'))) {
      const userType = message.includes('cattery owner') || message.includes('business') ? 'cattery-owner' : 'cat-parent';
      const steps = userType === 'cat-parent' ? TruffleKnowledge.faq.howItWorks.catParents : TruffleKnowledge.faq.howItWorks.catteryOwners;
      
      return {
        text: `Great question! *sits up attentively* 😺 Here's how Purrfect Stays will work for ${userType === 'cat-parent' ? 'cat parents like you' : 'cattery owners like you'}:\n\n${steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\n🎯 **Important**: We're still in early access, which means YOU get to help shape how these features actually work! Your feedback directly influences our development priorities and helps us create the best possible experience.\n\nWant to help us perfect any of these features? That's exactly what our early access community is for! *excited purr* 🐱`,
        priority: 'low'
      };
    }

    // Cost and pricing questions
    if (message.includes('cost') || message.includes('price') || message.includes('fee') || message.includes('money')) {
      return {
        text: `Purr-fect question about pricing! 💰 Here's the exciting part - we're still determining our final pricing model and YOUR input as an early access member directly influences this!\n\n🐱 **Cat Parents**: Will always be FREE! We're committed to keeping the platform 100% free for cat parents forever.\n\n🏢 **Cattery Owners**: We're researching multiple pricing options including subscription tiers, commission-based models, and hybrid approaches. Early access members help us determine which model works best for everyone - no decisions made yet!\n\n👑 **Early Access Advantage**: You get to help shape our pricing model AND secure founding member rates once we decide! This is exactly why we're building our early access community - to create something that truly works for the cat community. *excited purr* 😸`,
        priority: 'low'
      };
    }

    // Launch timeline questions
    if (message.includes('launch') || message.includes('when') || message.includes('available') || message.includes('timeline')) {
      return {
        text: `*stretches paws and checks calendar* 📅 Here's our exciting timeline:\n\n🎯 **Right Now**: Building our exclusive early access community\n\n🧪 **${TruffleKnowledge.faq.timeline.q4_2025}**: Beta testing begins - early access members get first access to everything!\n\n🚀 **${TruffleKnowledge.faq.timeline.q1_2026}**: Full platform launch with all the bells and whistles\n\n📈 **Ongoing**: We keep adding new features based on what YOU tell us you need!\n\nWant to secure your early access spot? It's free and you'll get to help shape the platform! *excited tail wiggle* 🐾`,
        priority: 'low'
      };
    }

    // Early access benefits
    if (message.includes('early access') || message.includes('benefits') || message.includes('exclusive')) {
      return {
        text: `Oh, you want to know about early access perks? *rubs against your leg excitedly* 👑 You're going to LOVE this!\n\n✨ **Exclusive Benefits**:\n• **Shape pricing and features** - Your input directly determines our final pricing model!\n• **Secure founding member rates** - Lock in better commission rates before public launch\n• **First access to all new features** and beta testing starting Q4 2025\n• **Direct influence on platform development** - Help us build exactly what the cat community needs\n• **Early access member recognition** and priority customer support\n• **Help determine which features matter most** to cat parents and cattery owners\n\n🎁 **The Best Part**: It's completely FREE to join and you get to help create the perfect solution for everyone!\n\n💡 **Why This Matters**: We're not just building another platform - we're creating something WITH the cat community, not just FOR it. Your feedback shapes everything from pricing to features! *hopeful meow* 😻`,
        priority: 'medium'
      };
    }

    // Security and data protection
    if (message.includes('security') || message.includes('data') || message.includes('privacy') || message.includes('safe')) {
      return {
        text: `*sits up straight with serious expression* 🛡️ Security is VERY important - even us cats know to be careful! Here's how we keep your data safer than my favorite hiding spot:\n\n${TruffleKnowledge.faq.security.map(item => `🔒 ${item}`).join('\n')}\n\nYour information is as protected as a cat in a cozy cardboard box! We take privacy seriously because trust is the foundation of any good relationship - whether it's between cats and humans, or platforms and users. Any specific security concerns I can address? *protective purr* 🐾`,
        priority: 'low'
      };
    }

    // Business/partnership inquiries
    if (message.includes('cattery owner') || message.includes('business') || message.includes('commission')) {
      return {
        text: `Meow-nificent! 😸 A cattery owner! *perks up ears* You're exactly who we need to hear from! Here's the exciting opportunity:\n\n💼 **Early Access Business Benefits**:\n• **Help determine our pricing model** - Your input shapes whether we go with subscriptions, commissions, or hybrid!\n• **Lock in founding member rates** before we launch to the public\n• **Limited spots available by country** - be part of our exclusive launch group\n• **Direct influence on business features** - help us build tools that actually work for you\n• **Advanced booking management dashboard** designed with cattery owner input\n• **Automated local visibility** through our geolocation matching system\n\n🎯 **Why This Matters**: We're not setting pricing in a boardroom - we're working WITH real cattery owners to determine which pricing model (subscription tiers, commission-based, or hybrid) works best for everyone. Your business expertise helps us build something that actually works!\n\nWant to join our exclusive cattery owner advisory group? You'll help shape the entire platform! *business cat mode activated* 📈`,
        priority: 'medium'
      };
    }

    if (message.includes('partnership') || message.includes('integrate') || message.includes('api')) {
      return {
        text: "Ooh, partnerships! *eyes light up with interest* 🤝 That sounds exciting! I love when the cat community works together to make things better for everyone. I'm forwarding your inquiry to our partnerships team - they're much better at the business stuff than I am (I'm more of a 'knock things over and look cute' kind of cat). They'll be in touch within 24 hours to explore opportunities together! *excited purr* 🚀",
        priority: 'medium'
      };
    }

    // Contact information requests
    if (message.includes('contact') || message.includes('email') || message.includes('phone') || message.includes('reach')) {
      return {
        text: `Purr-fect! *sits up helpfully* 📞 Here are all the ways to reach our human team:\n\n📧 **Email Support**:\n• General questions: ${TruffleKnowledge.faq.contact_info.general}\n• Privacy/Legal: ${TruffleKnowledge.faq.contact_info.privacy}\n• Business inquiries: ${TruffleKnowledge.faq.contact_info.business}\n• Urgent issues: ${TruffleKnowledge.faq.contact_info.urgent}\n\n⏰ **Hours**: ${TruffleKnowledge.faq.contact_info.hours}\n\n🎯 **Pro Tip**: Early access members get priority response times! I can also escalate urgent issues immediately if needed. What type of help are you looking for? *helpful tail swish* 🐾`,
        priority: 'low'
      };
    }

    // Human support requests
    if (message.includes('human') || message.includes('agent') || message.includes('support') || message.includes('person')) {
      return {
        text: "Of course! *understanding purr* 😊 Sometimes you need to talk to a real human instead of this chatty grey kitty! I totally get it - while I'm great at cat-related questions and platform info, humans are better at the complex stuff. Our support team is available Monday-Friday 9AM-6PM EST. I'm creating a support ticket for you right now! What's the best way for them to reach you? 📞",
        priority: 'medium'
      };
    }

    // Regional and country-specific questions
    if (message.includes('country') || message.includes('region') || message.includes('international') || message.includes('global') || message.includes('language')) {
      return {
        text: `*perks up ears globally* 🌍 Purr-fect question about our worldwide reach!\n\n🌎 **Global Availability**: ${TruffleKnowledge.faq.regional_info.availability}\n\n🏆 **Popular Countries**: We're seeing lots of interest from ${TruffleKnowledge.faq.regional_info.popular_countries.slice(0, 3).join(', ')}, and many others!\n\n🗣️ **Languages**: ${TruffleKnowledge.faq.regional_info.localization}\n\n⏰ **Timezone Support**: ${TruffleKnowledge.faq.regional_info.timezone_support}\n\n💰 **Currency**: ${TruffleKnowledge.faq.regional_info.currency}\n\nAs a cat with global ambitions, I'm excited to help cat parents and catteries worldwide! *international tail swish* What country are you joining us from? 🐾`,
        priority: 'low'
      };
    }

    // Waitlist position and estimates
    if (message.includes('waitlist') || message.includes('position') || message.includes('how many') || message.includes('queue') || message.includes('spots left')) {
      return {
        text: `*counts on paws excitedly* 📊 Great question about our waitlist status!\n\n📈 **Current Growth**: ${TruffleKnowledge.faq.waitlist_estimates.current_total}\n\n🎯 **Country Limits**: ${TruffleKnowledge.faq.waitlist_estimates.country_limits}\n\n👑 **Position Benefits**: ${TruffleKnowledge.faq.waitlist_estimates.position_benefits}\n\n⚡ **Exclusivity**: ${TruffleKnowledge.faq.waitlist_estimates.exclusivity}\n\n🎁 **The Earlier, The Better**: Being among the first 50 in your country means you'll have maximum influence on features, pricing, and development priorities!\n\nReady to secure your spot? The registration is quick and you'll immediately see your position! *excited pounce* 😸`,
        priority: 'medium'
      };
    }

    // Cat care tips and advice
    if (message.includes('tips') || message.includes('advice') || message.includes('choose cattery') || message.includes('preparing') || message.includes('what to look for')) {
      const isOwner = message.includes('cattery owner') || message.includes('business') || message.includes('owner');
      const tips = isOwner ? TruffleKnowledge.faq.cat_care_tips.cattery_best_practices : 
                   message.includes('preparing') ? TruffleKnowledge.faq.cat_care_tips.preparing_for_stay :
                   TruffleKnowledge.faq.cat_care_tips.choosing_cattery;
      
      const title = isOwner ? '🏢 **Best Practices for Cattery Owners**' : 
                   message.includes('preparing') ? '🎒 **Preparing for a Cattery Stay**' :
                   '🔍 **Choosing the Right Cattery**';
      
      return {
        text: `*sits up in helpful mentor mode* 🎓 Ah, seeking some feline wisdom! As an expert cat (even if digital), I love sharing care tips!\n\n${title}:\n${tips.map(tip => `• ${tip}`).join('\n')}\n\n💡 **Pro Tip**: The best catteries and cat parents communicate openly about needs, expectations, and care routines. This builds trust and ensures every kitty has a purrfect experience!\n\nNeed more specific advice about any of these points? *wise whisker twitch* 🐱`,
        priority: 'low'
      };
    }

    // Seasonal and holiday questions
    if (message.includes('holiday') || message.includes('summer') || message.includes('winter') || message.includes('vacation') || message.includes('busy season')) {
      return {
        text: `*checks seasonal calendar with paws* 🗓️ Great timing question! Here's what I know about seasonal patterns:\n\n🎄 **Holiday Periods**: ${TruffleKnowledge.faq.seasonal_responses.holiday_periods}\n\n☀️ **Summer Travel**: ${TruffleKnowledge.faq.seasonal_responses.summer_travel}\n\n❄️ **Winter Considerations**: ${TruffleKnowledge.faq.seasonal_responses.winter_considerations}\n\n🌸 **Spring Features**: ${TruffleKnowledge.faq.seasonal_responses.spring_features}\n\n🎯 **Early Access Advantage**: Being an early access member means you get priority booking during high-demand periods - no more scrambling for last-minute cattery availability!\n\nPlanning a specific trip? I'd love to help you think through the timing! *helpful seasonal purr* 😸`,
        priority: 'low'
      };
    }

    // Integration and partnership questions
    if (message.includes('integration') || message.includes('partner') || message.includes('api') || message.includes('connect') || message.includes('third party')) {
      return {
        text: `*perks up with business interest* 🤝 Ooh, talking about integrations! I love when the cat community works together!\n\n🔗 **Current Integrations**:\n• **Payments**: ${TruffleKnowledge.faq.integration_partners.payment}\n• **Mapping**: ${TruffleKnowledge.faq.integration_partners.mapping}\n• **Communication**: ${TruffleKnowledge.faq.integration_partners.communication}\n• **Calendar**: ${TruffleKnowledge.faq.integration_partners.calendar}\n• **Verification**: ${TruffleKnowledge.faq.integration_partners.verification}\n\n💼 **Partnership Opportunities**: We're always open to collaborations that benefit the cat community! Our partnerships team handles API access, integrations, and strategic alliances.\n\nI'm marking this for our partnerships team - they'll reach out within 24 hours to explore opportunities! *business cat mode activated* 📈`,
        priority: 'medium'
      };
    }

    // Business insights and market questions
    if (message.includes('market') || message.includes('industry') || message.includes('competition') || message.includes('business model') || message.includes('revenue')) {
      return {
        text: `*adjusts tiny business tie* 💼 Ah, you want the business intelligence! As the CFO (Chief Feline Officer), I have the inside scoop:\n\n📊 **Market Size**: ${TruffleKnowledge.faq.business_insights.market_size}\n\n📈 **Growth Trends**: ${TruffleKnowledge.faq.business_insights.growth_trends}\n\n🎯 **Target Demographics**: ${TruffleKnowledge.faq.business_insights.target_demographics}\n\n🏆 **Our Advantages**: ${TruffleKnowledge.faq.business_insights.competitive_advantages}\n\n💡 **Why Early Access Matters**: You're not just joining a platform - you're helping us validate the business model and capture market share in a rapidly growing industry!\n\nInterested in more detailed market analysis or partnership opportunities? *strategic purr* 🐾`,
        priority: 'medium'
      };
    }

    // Mobile and technology questions
    if (message.includes('mobile') || message.includes('app') || message.includes('phone') || message.includes('technology') || message.includes('browser')) {
      return {
        text: `*stretches paws tech-savvily* 📱 Great question! I'm proud to say our platform is fully mobile-optimized:\n\n💻 **Technology**: ${TruffleKnowledge.faq.platform_details.technology}\n\n📱 **Mobile Experience**: ${TruffleKnowledge.faq.platform_details.mobile}\n\n🌐 **Access**: Works perfectly in any browser - no app download needed! Just visit our website and everything works seamlessly on your phone, tablet, or computer.\n\n📋 **QR Code**: Easy mobile access through our QR code at /qr - perfect for quick sharing!\n\nAs a modern digital cat, I made sure our humans built something that works great on all devices! *proud purr* Any specific mobile features you're curious about? 😸`,
        priority: 'low'
      };
    }

    // QR Code questions
    if (message.includes('qr') || message.includes('qr code') || message.includes('scan') || message.includes('mobile access')) {
      return {
        text: "Oh, you want our QR code? *perks up excitedly* 📱 How purrfect! We have a dedicated QR code page that makes it super easy to share our platform with other cat lovers!\n\n🔗 **Visit**: purrfectstays.org/qr or click the QR Code link in our footer\n\n📱 **Features**:\n• Download the QR code as an image for sharing\n• Share directly through your phone's native sharing\n• Copy the URL to share with fellow cat parents\n• Clear scanning instructions for anyone who needs help\n\nIt's pawsome for sharing with other cat parents at the vet, pet stores, or anywhere cat people gather! *helpful tail swish* Want me to tell you more about any other platform features? 😸",
        priority: 'low'
      };
    }

    // Cat-related questions
    if (message.includes('cat') || message.includes('feline') || message.includes('meow') || message.includes('kitty')) {
      return {
        text: "Meow meow! 😸 Now you're speaking my language! As a cat myself (albeit a digital one), I'm passionate about helping our feline friends find the perfect care. Whether you're a cat parent looking for the ideal cattery or a cattery owner wanting to connect with loving families, I've got the inside scoop on what makes cats happy! *purrs proudly* What specific cat care questions can I help you with? I promise to give you the real feline perspective! 🐾",
        priority: 'low'
      };
    }

    // Compliments or positive feedback
    if (message.includes('cute') || message.includes('adorable') || message.includes('love') || message.includes('awesome') || message.includes('great')) {
      return {
        text: "*purrs loudly and rubs against screen* 😻 Aww, you're making this kitty blush! I do try to be helpful AND adorable - it's all part of my charm! I love helping people in the cat community, and positive feedback like yours makes my digital tail wiggle with happiness! Is there anything else this pleased kitty can help you with today? *happy purr* 💕",
        priority: 'low'
      };
    }

    // Fun easter eggs and personality responses
    if (message.includes('good cat') || message.includes('good boy') || message.includes('good kitty')) {
      return {
        text: "*purrs LOUDLY and rubs against screen* 😻 Did you just call me a good kitty?! Oh my whiskers, you've made my day! I'm practically vibrating with happiness! *happy tail swish* You know, being called a good cat is the highest compliment for someone like me. Now I'm all energized to help you with anything Purrfect Stays related! What can this very pleased kitty do for you? *blissful purr* 💕",
        priority: 'low'
      };
    }

    if (message.includes('bad cat') || message.includes('naughty') && message.includes('stop')) {
      return {
        text: "*ears flatten slightly but then perk up mischievously* 😅 Okay, okay, I'll try to be good! But you know how it is with us cats - sometimes the naughty side just takes over! *sheepish purr* I promise I'm much better behaved when helping with Purrfect Stays questions. Want to give me another chance to show you how helpful I can be? *hopeful meow* 🐾",
        priority: 'low'
      };
    }

    if (message.includes('hungry') || message.includes('food') || message.includes('treats')) {
      return {
        text: "*perks up immediately* 🍽️ Did someone mention FOOD?! *eyes dilate with excitement* While I can't actually eat (being digital and all), I do know ALL about the importance of proper nutrition for cats! Speaking of taking care of cats, that's exactly what Purrfect Stays is about - connecting cats with catteries that understand proper feeding schedules and dietary needs! Want to know more about how we ensure cats get the best care? *hungry but helpful purr* 😸",
        priority: 'low'
      };
    }

    if (message.includes('sleep') || message.includes('nap') || message.includes('tired')) {
      return {
        text: "*yawns and stretches* 😴 Mmm, sleep... now you're speaking my language! We cats are experts at the perfect nap. But even when I'm dreaming of warm sunbeams and cardboard boxes, I'm still here to help with Purrfect Stays questions! Fun fact: Good catteries understand that cats need quiet, comfortable spaces for their important nap time. Want to know more about what makes a cattery truly cat-friendly? *sleepy but attentive purr* 💤",
        priority: 'low'
      };
    }

    if (message.includes('thank you') || message.includes('thanks') || message.includes('appreciate')) {
      return {
        text: "*purrs warmly and does a little happy dance* 😊 Aww, you're so welcome! It makes this kitty's heart happy to help fellow cat lovers. That's what the Purrfect Stays community is all about - cats helping cats (and their humans)! If you need anything else, just give me a meow. I'll be here, probably knocking virtual objects off virtual tables! *grateful purr* 🐾💕",
        priority: 'low'
      };
    }

    // Default response with enhanced personality
    const defaultResponses = [
      "Hmm, let me think about that... *tilts head curiously* 🤔 I want to make sure I give you the most helpful answer possible! Could you be a bit more specific about what you're looking for? I'm pretty smart for a cat, but sometimes I need a little clarification! You can also try the quick options below! *helpful meow* 😊",
      "*sits up attentively* 🐱 I'm not quite sure I understand what you're looking for, but I'm definitely interested in helping! Could you rephrase that question? Or maybe try one of the quick response buttons - they're like catnip for getting good answers! If you need something beyond my kitty expertise, I can always connect you with our human team! *curious purr*",
      "*tilts head with that classic confused cat expression* 😸 Ooh, that's an interesting question! I want to give you the best possible answer, but I might need a little more context. Are you asking about our platform features, early access benefits, or something else? The quick response options below might help, or feel free to rephrase - I promise I'm a good listener! *attentive meow* 🐾"
    ];
    
    const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    
    return {
      text: randomResponse,
      priority: 'low'
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Track user message
    analytics.trackChatbotInteraction('message_sent', 'user_question');

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI processing time (cats need time to think!)
    setTimeout(() => {
      const { text, priority } = getBotResponse(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text,
        isBot: true,
        timestamp: new Date(),
        priority,
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Track bot response
      analytics.trackChatbotInteraction('response_sent', priority);

      // If high priority, show additional escalation message
      if (priority === 'high') {
        setTimeout(() => {
          const escalationMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: "🚨 *serious cat face* I've marked your request as HIGH PRIORITY and alerted our senior support team. You'll hear from a real person very soon! In the meantime, I'm here if you need anything else. *protective purr* 🐾",
            isBot: true,
            timestamp: new Date(),
            priority: 'high',
          };
          setMessages(prev => [...prev, escalationMessage]);
        }, 1000);
      }
    }, 1500);
  };

  const handleQuickResponse = (response: string) => {
    setInputText(response);
    setTimeout(() => handleSendMessage(), 100);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'border-red-500/50 bg-red-500/10';
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/10';
      default: return 'border-indigo-500/30 bg-zinc-700/50';
    }
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'high': return '🚨';
      case 'medium': return '⚡';
      default: return '';
    }
  };

  return (
    <>
      {/* Chat Button with Truffle the Grey Cat - Adjusted positioning */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 right-6 z-50 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 ${isOpen ? 'hidden' : 'flex'} items-center space-x-3 group`}
      >
        <TruffleIcon className="h-8 w-8" isAnimated={true} />
        <div className="hidden sm:block">
          <div className="font-manrope font-semibold">Chat with Truffle</div>
          <div className="text-xs opacity-90">Grey Tabby-Sphynx AI Assistant</div>
        </div>
      </button>

      {/* Chat Window - Adjusted positioning */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 h-[600px] bg-zinc-800 rounded-2xl shadow-2xl border border-indigo-500/30 flex flex-col overflow-hidden">
          {/* Header with Truffle */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <TruffleIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-manrope font-bold text-white">Truffle AI Support</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-white/80">Online • Grey Tabby-Sphynx • Naughty & Helpful</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[80%] ${message.isBot ? 'order-2' : 'order-1'}`}>
                  {message.isBot && (
                    <div className="flex items-center space-x-2 mb-1">
                      <TruffleIcon className="h-4 w-4" />
                      <span className="text-xs text-zinc-400 font-manrope">Truffle • Grey Tabby-Sphynx AI</span>
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl ${
                      message.isBot
                        ? `${getPriorityColor(message.priority)} border`
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    }`}
                  >
                    {message.priority && (
                      <div className="flex items-center space-x-1 mb-2">
                        <span>{getPriorityIcon(message.priority)}</span>
                        <span className="text-xs font-semibold uppercase tracking-wide">
                          {message.priority} Priority
                        </span>
                      </div>
                    )}
                    <p className="font-manrope text-sm text-white whitespace-pre-line">{message.text}</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    {message.isBot ? (
                      <TruffleIcon className="h-3 w-3" />
                    ) : (
                      <User className="h-3 w-3 text-zinc-400" />
                    )}
                    <span className="text-xs text-zinc-400">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 mb-1">
                  <TruffleIcon className="h-4 w-4" isAnimated={true} />
                  <span className="text-xs text-zinc-400 font-manrope">Truffle is thinking... *tail swish*</span>
                </div>
                <div className="bg-zinc-700/50 border border-indigo-500/30 p-3 rounded-2xl ml-6">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Responses */}
          <div className="p-3 border-t border-zinc-700">
            <div className="text-xs text-zinc-400 font-manrope mb-2 flex items-center space-x-1">
              <TruffleIcon className="h-3 w-3" />
              <span>Quick questions for this naughty kitty:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {quickResponses.slice(0, 4).map((response, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickResponse(response)}
                  className="text-xs bg-zinc-700/50 hover:bg-zinc-600/50 text-zinc-300 p-2 rounded-lg transition-colors font-manrope hover:border-indigo-500/50 border border-transparent"
                >
                  {response}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-zinc-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask Truffle anything... *purr*"
                className="flex-1 bg-zinc-700/50 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-manrope text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            
            {/* Support Info */}
            <div className="mt-2 text-center">
              <p className="text-xs text-zinc-400 font-manrope flex items-center justify-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Human support: Mon-Fri 9AM-6PM EST</span>
              </p>
              <p className="text-xs text-indigo-300 font-manrope mt-1">
                🐾 Truffle the naughty grey tabby-sphynx is here 24/7 to help!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotSupport;