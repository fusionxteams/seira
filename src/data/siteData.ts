export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  summary: string;
  details: string;
  image: string;
  focusAreas: string[];
}

export interface WhyChooseItem {
  number: string;
  title: string;
  description: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  image: string;
  takeaways: string[];
  body: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Clinic Space' | 'Treatments';
  image: string;
  caption: string;
}

export const CLINIC_INFO = {
  name: 'Seira Wellness',
  tagline: 'Advanced Care for Skin, Hair & Beauty',
  phone: '+91 84520 70757',
  email: 'enquiry@seirawellness.com',
  hours: 'Mon – Sat · 10AM to 8PM',
  address: 'A1 97, 4th St, Sidco Nagar, Villivakkam, Chennai, Tamil Nadu 600049',
  copyright: '© 2026 Seira Wellness — All Rights Reserved.',
};

export const CLINIC_STATS = [
  { value: '10+', label: 'Years of Experience' },
  { value: '5K+', label: 'Patients Treated' },
  { value: '15+', label: 'Advanced Treatments' },
  { value: '96%', label: 'Patient Satisfaction' },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'skin-treatments',
    number: '01',
    title: 'Skin Treatments',
    summary:
      "Restore your skin's natural glow and improve concerns such as pigmentation, acne, scars, uneven tone, and skin texture.",
    details:
      'Every skin journey begins with a detailed clinical assessment of your skin barrier, tone, and underlying triggers so each protocol is tailored to restore clarity and balance.',
    image: '/images/about-care.jpg',
    focusAreas: ['Pigmentation & Melasma', 'Acne & Scar Revision', 'Texture & Tone Renewal'],
  },
  {
    id: 'anti-aging-solutions',
    number: '02',
    title: 'Anti-Aging Solutions',
    summary:
      'Advanced aesthetic solutions designed to address visible signs of aging, including fine lines, wrinkles, loss of firmness, and skin rejuvenation.',
    details:
      'Focused on subtle, natural-looking rejuvenation that supports collagen renewal, facial harmony, and long-term skin vitality without overdone results.',
    image: '/images/service-skin.webp',
    focusAreas: ['Fine Lines & Wrinkles', 'Firmness & Lift', 'Collagen Rejuvenation'],
  },
  {
    id: 'hair-treatments',
    number: '03',
    title: 'Hair Treatments',
    summary:
      'Personalized solutions for hair fall, thinning, hair loss, scalp concerns, and hair restoration, based on your individual requirements.',
    details:
      'Root-cause scalp diagnostics paired with targeted hair restoration therapies designed to strengthen follicles and support healthy density.',
    image: '/images/service-antiaging.webp',
    focusAreas: ['Hair Fall & Thinning', 'Scalp Health', 'Hair Restoration'],
  },
  {
    id: 'cosmetic-surgery',
    number: '04',
    title: 'Cosmetic Surgery',
    summary:
      'A range of cosmetic procedures designed to enhance selected facial and body features while taking your individual goals and expectations into consideration.',
    details:
      'Guided by ethical consultation, safety standards, and proportional aesthetics to deliver balanced, refined outcomes.',
    image: '/images/service-hair.webp',
    focusAreas: ['Facial Contouring', 'Body Refinement', 'Individualized Planning'],
  },
  {
    id: 'semi-permanent-makeup',
    number: '05',
    title: 'Semi-Permanent Makeup',
    summary:
      'Enhance and define your natural features with carefully designed semi-permanent makeup solutions for a polished and refined appearance.',
    details:
      'Precision pigment work crafted to complement your natural bone structure and skin undertone for effortless everyday polish.',
    image: '/images/service-cosmetic.webp',
    focusAreas: ['Natural Feature Definition', 'Custom Pigment Matching', 'Refined Finish'],
  },
  {
    id: 'laser-treatments',
    number: '06',
    title: 'Laser Treatments',
    summary:
      'Modern laser-based treatments designed to address selected skin, hair, and aesthetic concerns with precision and professional guidance.',
    details:
      'Calibrated medical-grade laser protocols performed under professional supervision for targeted, predictable care.',
    image: '/images/service-makeup.webp',
    focusAreas: ['Targeted Skin Resurfacing', 'Laser Hair Reduction', 'Precision Pigment Care'],
  },
  {
    id: 'obesity-treatment',
    number: '07',
    title: 'Obesity Treatment',
    summary:
      'Personalized obesity and weight-management solutions focused on understanding individual needs and supporting healthier lifestyle and wellness goals.',
    details:
      'Structured, supportive wellness planning tailored to metabolic health, sustainable habits, and whole-body confidence.',
    image: '/images/service-laser.webp',
    focusAreas: ['Individualized Assessment', 'Metabolic Support', 'Sustainable Wellness'],
  },
];

export const ABOUT_CONTENT = {
  headline: 'Where Advanced Aesthetics Meet Personalized Care',
  intro:
    'At Seira Wellness, we believe that true beauty is about feeling confident in your own skin. Our approach combines advanced aesthetic treatments, modern technology, and personalized care to help you achieve your individual beauty and wellness goals. From skin and hair treatments to facial aesthetics, anti-aging solutions, and advanced procedures, we focus on understanding your concerns before recommending a treatment approach that is right for you.',
  missionTitle: 'Our Mission',
  mission:
    "At Seira Wellness, our mission is to provide personalized, ethical, and patient-focused aesthetic care using modern techniques, advanced technology, and professional expertise. We strive to understand every individual's unique concerns and deliver thoughtful treatment plans that enhance natural beauty, confidence, and overall well-being.",
  visionTitle: 'Our Vision',
  vision:
    'Our vision is to build a trusted destination for advanced aesthetic treatments where innovation, expertise, safety, and personalized care come together. We aspire to continuously evolve with advancements in aesthetic medicine while creating a comfortable and transparent experience for every patient who chooses Seira Wellness.',
  whyTitle: 'Why Choose Seira Wellness',
  whySubtitle:
    'Every individual deserves a treatment approach as unique as they are. We combine personalized attention, modern aesthetic solutions, and a patient-first approach.',
};

export const WHY_CHOOSE_ITEMS: WhyChooseItem[] = [
  {
    number: '01',
    title: 'Best Treatment Plans',
    description:
      'We take the time to understand your concerns, goals, and requirements before recommending a suitable treatment approach.',
  },
  {
    number: '02',
    title: 'Advanced Solutions',
    description:
      'We offer a comprehensive range of modern treatments for skin, hair, anti-aging, laser, and aesthetic concerns.',
  },
  {
    number: '03',
    title: 'Professional Expertise',
    description:
      'Our approach is guided by professional knowledge and a commitment to delivering thoughtful, responsible aesthetic care.',
  },
  {
    number: '04',
    title: 'Focus on Natural Results',
    description:
      'Our philosophy is centered on enhancing your natural features and creating balanced, refined results.',
  },
  {
    number: '05',
    title: 'Patient-Centred Care',
    description:
      'From your first consultation through every follow-up, we prioritize communication, comfort, and personalized attention.',
  },
  {
    number: '06',
    title: 'Comfort Environment',
    description:
      'We aim to create a welcoming space where you can discuss your concerns openly and feel comfortable.',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Seira Wellness Clinic Interior',
    category: 'Clinic Space',
    image: '/images/clinic-interior.jpeg',
    caption: 'A calm, welcoming clinical environment in Villivakkam, Chennai.',
  },
  {
    id: 'g-2',
    title: 'Consultation & Aesthetic Suite',
    category: 'Clinic Space',
    image: '/images/hero-clinic.png',
    caption: 'Designed for private, unhurried consultations and personalized care.',
  },
  {
    id: 'g-3',
    title: 'Skin Rejuvenation & Glow Care',
    category: 'Treatments',
    image: '/images/about-care.jpg',
    caption: 'Targeted protocols for pigmentation, texture, and skin clarity.',
  },
  {
    id: 'g-4',
    title: 'Precision Laser Solutions',
    category: 'Treatments',
    image: '/images/service-makeup.webp',
    caption: 'Modern laser-based aesthetic care with professional guidance.',
  },
  {
    id: 'g-5',
    title: 'Hair & Scalp Restoration',
    category: 'Treatments',
    image: '/images/service-antiaging.webp',
    caption: 'Individualized therapies addressing thinning and scalp health.',
  },
  {
    id: 'g-6',
    title: 'Anti-Aging & Facial Harmony',
    category: 'Treatments',
    image: '/images/service-skin.webp',
    caption: 'Balanced rejuvenation focused on natural expression and firmness.',
  },
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'anti-aging-skincare',
    title: 'Anti-Aging Skincare: How to Maintain Healthy-Looking Skin',
    date: 'September 29, 2026',
    readTime: '4 min read',
    category: 'Skin & Anti-Aging',
    excerpt:
      'Practical, evidence-informed ways to protect collagen, support your skin barrier, and choose clinical anti-aging treatments tailored to your skin.',
    image: '/images/service-skin.webp',
    takeaways: [
      'Daily broad-spectrum sun protection preserves existing collagen fibers.',
      'Barrier-first hydration prevents irritation before introducing clinical actives.',
      'Personalized protocols target fine lines and firmness without over-treating.',
    ],
    body: [
      'Healthy-looking skin over time relies on two fundamentals: protecting your existing skin barrier daily and addressing deeper structural changes thoughtfully.',
      'Consistent broad-spectrum sun protection, gentle cleansing, and barrier-supporting hydration form the foundation of every effective routine before introducing active clinical treatments.',
      'When fine lines, loss of firmness, or uneven tone become a concern, a personalized consultation helps match modern anti-aging procedures to your skin type and goals without over-treating.',
    ],
  },
  {
    id: 'understanding-hair-fall',
    title: 'Understanding Hair Fall: Common Causes & When to Seek Professional Advice',
    date: 'September 29, 2026',
    readTime: '4 min read',
    category: 'Hair & Scalp Care',
    excerpt:
      'Learn how to distinguish normal daily shedding from persistent hair thinning and why early scalp evaluation leads to better restoration outcomes.',
    image: '/images/service-hair.webp',
    takeaways: [
      'Distinguish seasonal shedding from progressive follicle miniaturization.',
      'Early scalp evaluation identifies nutritional, stress, and hormonal triggers.',
      'Targeted restoration plans work best before follicle density declines.',
    ],
    body: [
      'Daily shedding is a normal part of the hair growth cycle, but noticeable thinning, widening parts, or persistent scalp discomfort often signal an underlying concern.',
      'Nutritional gaps, stress, hormonal shifts, and scalp health all influence follicle strength. Identifying the specific cause is essential before starting any treatment.',
      'At Seira Wellness, hair and scalp assessments guide personalized restoration plans designed around your individual hair density and wellness profile.',
    ],
  },
  {
    id: 'laser-skin-precision',
    title: 'Laser Treatments Explained: Precision Care for Pigmentation & Texture',
    date: 'October 14, 2026',
    readTime: '3 min read',
    category: 'Laser & Aesthetics',
    excerpt:
      'How modern clinical laser systems target stubborn pigmentation, uneven tone, and unwanted hair while keeping surrounding skin calm and protected.',
    image: '/images/service-laser.webp',
    takeaways: [
      'Modern wavelengths calibrate to individual skin tones for safer outcomes.',
      'Pre- and post-care hydration minimizes redness and accelerates recovery.',
      'Staged sessions deliver gradual, natural-looking clarity.',
    ],
    body: [
      'Modern laser technology is designed around precision—delivering controlled energy to targeted pigment or hair follicles while preserving the integrity of surrounding skin.',
      'Before any session, a thorough skin-tone and sensitivity evaluation determines the right wavelength and fluence so comfort and safety remain the priority.',
      'Paired with disciplined sun protection and soothing post-procedure barrier care, staged laser sessions steadily refine skin clarity and smoothness.',
    ],
  },
  {
    id: 'natural-facial-harmony',
    title: 'Facial Aesthetics: Prioritizing Natural Balance Over Over-Correction',
    date: 'November 02, 2026',
    readTime: '3 min read',
    category: 'Laser & Aesthetics',
    excerpt:
      'Why modern aesthetic medicine focuses on subtle facial proportions, refreshed contours, and preserving natural expression.',
    image: '/images/service-cosmetic.webp',
    takeaways: [
      'Subtle structural support enhances natural proportions without stiffness.',
      'Conservative pacing lets your features settle naturally between visits.',
      'A patient-first consultation aligns outcomes with your everyday expression.',
    ],
    body: [
      'Thoughtful facial aesthetics is never about changing who you are—it is about restoring quiet balance, rested contours, and confidence in your natural features.',
      'By evaluating facial symmetry, skin elasticity, and dynamic movement together, our clinicians design conservative plans that respect natural expression.',
      'Whether refreshing under-eye fatigue or refining facial contours, paced, individualized care ensures results look effortless in any light.',
    ],
  },
];
