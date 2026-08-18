/**
 * قاعدة بيانات منتجات بورصة للمفروشات - مصر (مؤسسة الزكاة - المرج - القاهرة)
 * تشمل كافة أقسام المفروشات، حافظات السجاد، البطاطين، الألحفة، الملايات، أطقم العرائس، والمخدات
 */

const BORSSA_CATEGORIES = [
  { id: 'all', name: 'جميع المنتجات', icon: 'fas fa-th-large' },
  { id: 'carpet-covers', name: 'حافظات السجاد', icon: 'fas fa-rug' },
  { id: 'blankets-quilts', name: 'البطاطين والألحفة', icon: 'fas fa-bed' },
  { id: 'bed-sheets', name: 'الملايات والمفارش', icon: 'fas fa-layer-group' },
  { id: 'bridal-sets', name: 'أطقم العرائس الفاخرة', icon: 'fas fa-crown' },
  { id: 'pillows-toppers', name: 'المخدات وواقي المرتبة', icon: 'fas fa-feather' },
  { id: 'towels', name: 'الفوط والبشاكير', icon: 'fas fa-bath' }
];

const BORSSA_PRODUCTS = [
  // --- قسم حافظات السجاد ---
  {
    id: 'prod-001',
    name: 'حافظة سجاد قطيفة تركي حفر ليزر 3D',
    category: 'carpet-covers',
    price: 680,
    originalPrice: 950,
    discount: 28,
    rating: 4.9,
    reviewsCount: 184,
    badge: 'الأكثر مبيعاً',
    isNew: false,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['2 × 3 متر', '1.6 × 2.2 متر', '2 × 2.8 متر', 'مشاية 1 × 3 متر'],
    colors: ['بيج ملكي', 'رمادي كلاسيك', 'كشمير دافئ', 'كحلي بترولي'],
    material: 'قطيفة تركي مستوردة سميكة مع ظهر مانع للانزلاق من اللاتكس الطبيعي',
    description: 'حافظة سجاد فاخرة بتقنية الحفر الليزر ثلاثي الأبعاد، تحمي سجادتك الأصلية بالكامل وتعطي مظهر سجاد تركي مودرن، سهلة الغسيل في الغسالة ولا تتزحلق نهائياً.',
    features: [
      'ظهر محبب مانع للانزلاق تماماً على السيراميك والباركيه',
      'ألوان ثابتة لا تبهت مع الغسيل المتكرر',
      'خامة قطيفة سوبر سوفت مريحة جداً للمشي بدون حذاء',
      'حواف مسرفلة بخياطة دبل مدعمة لمتانة تدوم لسنوات'
    ]
  },
  {
    id: 'prod-002',
    name: 'حافظة سجاد ووتربروف مبطنة ضد المياه والسوائل',
    category: 'carpet-covers',
    price: 750,
    originalPrice: 1100,
    discount: 32,
    rating: 4.8,
    reviewsCount: 142,
    badge: 'حماية فائقة',
    isNew: true,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['2 × 3 متر', '2 × 2.5 متر', '1.6 × 2.2 متر'],
    colors: ['جريج حديث', 'بني شوكولاتة', 'زيتي ملكي'],
    material: 'وجه قماش قطيفة ناعم مع طبقة عزل ووتربروف TPU طبية مانعة لتسريب السوائل',
    description: 'الحل السحري لبيوت الأطفال والعائلات! تمنع تسرب العصير، المياه، والقهوة إلى السجادة، مع إمكانية مسح أي بقع فوراً بقطعة قماش مبللة.',
    features: [
      'عزل كامل 100% للسوائل والبقع والأتربة',
      'آمنة وصحية ومضادة لحشرة الفراش والبكتيريا',
      'تغسل في الغسالة الأوتوماتيك على دورة لطيفة',
      'تصميمات كلاسيكية ومودرن تناسب جميع الديكورات'
    ]
  },
  {
    id: 'prod-003',
    name: 'طقم حافظات سجاد وممرات مودرن (3 قطع)',
    category: 'carpet-covers',
    price: 1150,
    originalPrice: 1650,
    discount: 30,
    rating: 4.9,
    reviewsCount: 96,
    badge: 'عرض متكامل',
    isNew: false,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['قطعة 2×3 م + 2 مشاية 80×200 سم'],
    colors: ['أوف وايت مذهب', 'رصاصي سلفر', 'هافان ملكي'],
    material: 'شانيل تركي معالج مضاد للانكماش ومانع للانزلاق',
    description: 'طقم متناسق للصالون والطرقة يمنح منزلك وحدة ديكور متكاملة وأناقة لا تضاهى، خفيف وسهل الفرد والطي والتنظيف اليومي بالمكنسة.',
    features: [
      'يشمل 3 قطع متناسقة في النقشة والألوان',
      'مقاوم للكهرباء الساكنة ولا يجمع شعر أو وبر',
      'سهل التخزين والتنظيف السريع'
    ]
  },

  // --- قسم البطاطين والألحفة ---
  {
    id: 'prod-004',
    name: 'لحاف شتوي تركي فايبر حراري كينج (6 قطع)',
    category: 'blankets-quilts',
    price: 890,
    originalPrice: 1350,
    discount: 34,
    rating: 5.0,
    reviewsCount: 220,
    badge: 'الأعلى طلباً',
    isNew: false,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['مقاس كينج 240 × 260 سم'],
    colors: ['كشمير روز', 'كحلي ملكي', 'رصاصي رخامي', 'بيج شامبين'],
    material: 'وجه خارجي قطيفة كابوتنيه حراري مع حشو فايبر رول ألماني 450 جرام',
    description: 'طقم لحاف فايبر فاخر 6 قطع يتضمن (لحاف كبير 240×260 سم + ملاية سرير قطن + 2 كيس مخدة كبير + 2 كيس خدادية مطرز)، عزل حراري فائق وملمس مخملي جذاب.',
    features: [
      'حشو فايبر معالج ضد التحبب والتكتل مع الغسيل',
      'تدفئة عميقة خفيفة الوزن ومريحة جداً للنوم',
      'تصميم تركي فندقي مطرز بنقشات عصرية راقية'
    ]
  },
  {
    id: 'prod-005',
    name: 'بطانية مورا راشيل حفر وشين طبقتين 9 كجم',
    category: 'blankets-quilts',
    price: 1290,
    originalPrice: 1850,
    discount: 30,
    rating: 4.9,
    reviewsCount: 165,
    badge: 'وزن ثقيل ممتاز',
    isNew: false,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['220 × 240 سم (وزن 9 كجم صافي)'],
    colors: ['عنابي خمري', 'أزرق ملكي', 'زيتي كلاسيك', 'موكا هادئ'],
    material: 'أكريليك أصلي 100% أسباني معالج بتقنية الراشيل الكورية',
    description: 'بطانية العمر الطويل! طبقتين سميكتين ملحومتين بحفر ليزر بارز على الوجهين، وزن ثقيل 9 كجم يعطيك أقصى درجات الدفء في أبرد ليالي الشتاء.',
    features: [
      'طبقتين دبل راشيل بحفر مجسم ناعم جداً',
      'حواف من الستان الحريري العريض بخياطة مصفحة',
      'تأتي في شنطة جلد فاخرة مناسبة جداً لجهاز العروسة'
    ]
  },
  {
    id: 'prod-006',
    name: 'بطانية أطفال شتوية قطيفة سوبر سوفت 3D',
    category: 'blankets-quilts',
    price: 340,
    originalPrice: 500,
    discount: 32,
    rating: 4.8,
    reviewsCount: 88,
    badge: 'لطيف وآمن',
    isNew: true,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['120 × 150 سم'],
    colors: ['وردي بناتي أشكال كيوت', 'سماوي أولادي ديزني', 'أصفر أرانب ناعم'],
    material: 'مايكروفايبر قطني صحي 100% خالي من أي مواد مسببة للحساسية',
    description: 'بطانية أطفال ومواليد فائقة النعومة، خفيفة ودافئة وآمنة تماماً على بشرة الأطفال الحساسة، ألوان ورسومات زاهية محفورة بتقنية 3D ثابتة.',
    features: [
      'ملمس ناعم كالحرير لا يسبب حكة أو حساسية',
      'سهلة الغسيل والتجفيف السريع بدون أي تغير في الحجم',
      'مقاس مريح لسرير الأطفال وعربات السفر'
    ]
  },

  // --- قسم الملايات والمفارش ---
  {
    id: 'prod-007',
    name: 'طقم ملايات قطن العامرية الأصلي 100% (5 قطع)',
    category: 'bed-sheets',
    price: 460,
    originalPrice: 650,
    discount: 29,
    rating: 4.9,
    reviewsCount: 310,
    badge: 'قطن مصري أصلي',
    isNew: false,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['سرير كبير 240 × 260 سم'],
    colors: ['أبيض ناصع مطرز', 'سيمون هادئ', 'منت جرين', 'لافندر ملكي'],
    material: 'قطن مصري طويل التيلة نخب أول 100% قطن صافي',
    description: 'الطقم الكلاسيكي الأشهر في مصر! نسيج قطني نقي بارد وصحي في الصيف وناعم ومريح في الشتاء، تطريز كمبيوتر دقيق وثابت لا ينقطع.',
    features: [
      'محتويات الطقم: ملاية كبيرة + 2 كيس مخدة طويل + 2 كيس خدادية مطرز',
      'قطن أصلي نقي لا يوبر ولا يتغير ملمسه بعد عشرات الغسلات',
      'ألوان بيئة طبيعية ثابتة 100%'
    ]
  },
  {
    id: 'prod-008',
    name: 'طقم ملايات سرير أطفال قطن قطعتين سرير (6 قطع)',
    category: 'bed-sheets',
    price: 590,
    originalPrice: 850,
    discount: 31,
    rating: 4.8,
    reviewsCount: 120,
    badge: 'لسريرين أطفال',
    isNew: false,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['مقاس 180 × 240 سم (لطقم سريرين 120 سم)'],
    colors: ['رسومات ديزني كارتون', 'مودرن خطوط هندسية', 'أزرق نجوم وفضاء'],
    material: 'قطن مخلوط عالي النعومة معالج ضد التجعد',
    description: 'طقم سرير أطفال وشبابي كامل لسريرين، يشمل 2 ملاية كبيرة + 2 كيس مخدة + 2 كيس خدادية، رسومات مبهجة تضيف حيوية لغرفة أطفالك.',
    features: [
      'طقم موفر يكفي سريرين أطفال كاملين',
      'أقمشة مريحة لنوم هادئ وصحي لأطفالك',
      'ثبات فائق للألوان مع الغسيل المتكرر'
    ]
  },
  {
    id: 'prod-009',
    name: 'طقم ملاية أستيك داير ما يدور قطن ليكرا',
    category: 'bed-sheets',
    price: 280,
    originalPrice: 400,
    discount: 30,
    rating: 4.7,
    reviewsCount: 95,
    badge: 'ثبات محكم',
    isNew: true,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['160 × 200 سم ارتفاع 30 سم', '180 × 200 سم ارتفاع 30 سم', '120 × 200 سم'],
    colors: ['رمادي داكن', 'أبيض ثلجي', 'بيج كراميل', 'كحلي نايت'],
    material: 'قطن جيرسي ليكرا مطاطي ناعم الملمس',
    description: 'وداعاً للملايات التي تفلت من المرتبة أثناء النوم! أستيك قوي داير ما يدور يلتف حول المرتبة بالكامل ويعطي ثباتاً مثالياً ومظهراً فندقياً مشدوداً.',
    features: [
      'أستيك محكم يغطي جوانب وارتفاع المرتبة حتى 30 سم',
      'يشمل كيسين خدادية متناسقين تماماً',
      'لا تحتاج للكي ومريحة جداً في الفرد والفك'
    ]
  },

  // --- قسم أطقم العرائس الفاخرة ---
  {
    id: 'prod-010',
    name: 'مفرش سرير عروسة تركي ستان مطرز بالجبير الإسباني (7 قطع)',
    category: 'bridal-sets',
    price: 1850,
    originalPrice: 2700,
    discount: 31,
    rating: 5.0,
    reviewsCount: 154,
    badge: 'قمة الفخامة',
    isNew: false,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['مقاس كينج جامبو 260 × 270 سم'],
    colors: ['أوف وايت عاجي', 'شامبين دهبي', 'وردي باستيل عروسة'],
    material: 'ستان تركي ملكي مع تطريز جبير إسباني كلاسيك وتطعيمات لؤلؤية يدوية',
    description: 'القطعة الملكية في جهاز أي عروسة! مفرش ليلة الزفاف الفاخر بـ 7 قطع متكاملة (مفرش كبير + ملاية حرير قطن + 2 كيس مخدة + 2 كيس خدادية جبير + تكوة قلب ديكور)، يمنح غرفة النوم فخامة قصور الملوك.',
    features: [
      'صناعة تركية فائقة الجودة بتشطيب يدوي راقي',
      'تغليف في صندوق كرتوني هدايا مبطن بالساتان الفاخر',
      'تطريز مصفح غير بارز ومريح للاستخدام والتزيين'
    ]
  },
  {
    id: 'prod-011',
    name: 'طقم كوفرتة فور سيزون صيفي جاكار تركي (6 قطع)',
    category: 'bridal-sets',
    price: 920,
    originalPrice: 1350,
    discount: 32,
    rating: 4.9,
    reviewsCount: 110,
    badge: 'طوال العام',
    isNew: true,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['240 × 250 سم'],
    colors: ['أخضر زيتي فاتح', 'رمادي لؤلؤي', 'موف هادئ'],
    material: 'قطن بيكيه جاكار بارز مع حشوة فايبر خفيفة كابوتنيه',
    description: 'كوفرتة لجميع فصول السنة خفيفة وأنيقة، تناسب ليالي الصيف والربيع المعتدلة، مظهر مودرن ونسيج قطني يسمح بتنفس البشرة.',
    features: [
      'طقم 6 قطع يشمل كوفرتة + ملاية + 2 كيس مخدة + 2 خدادية',
      'نقشات جاكار بارزة ثابتة لا تتأثر بالغسيل',
      'خفيفة وسهلة الغسيل والتخزين'
    ]
  },
  {
    id: 'prod-012',
    name: 'بكج جهاز العروسة الماسي المتكامل من بورصة (18 قطعة)',
    category: 'bridal-sets',
    price: 4950,
    originalPrice: 7200,
    discount: 31,
    rating: 5.0,
    reviewsCount: 84,
    badge: 'عرض التوفير الأكبر',
    isNew: false,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['بكج شامل لكافة مقاسات السرير والسجاد'],
    colors: ['تشكيلة ألوان منسقة بعناية للعرائس'],
    material: 'أجود الخامات المصرية والتركية الأصلية مع شهادة ضمان معتمدة',
    description: 'أقوى عروض بورصة للمفروشات بمؤسسة الزكاة! بكج يشمل: طقم لحاف تركي 6 قطع + بطانية مورا 9 كجم + حافظة سجاد ليزر 2×3 + 2 طقم ملايات قطن العامرية + علبة فوط حمام عرايسي 6 قطع + 2 مخدة طبية فايبر، وفر أكثر من 2250 جنيه في بكج واحد!',
    features: [
      'تجهيز كامل للعروسة بأعلى الخامات وبأقل سعر جملة',
      'إمكانية اختيار الألوان والنقشات بحرية تامة عند تأكيد الطلب',
      'تغليف هدايا فاخر لكل قطعة بالبكج'
    ]
  },

  // --- قسم المخدات وواقي المرتبة ---
  {
    id: 'prod-013',
    name: 'مخدة طبية ميموري فوم لآلام الرقبة والعمود الفقري',
    category: 'pillows-toppers',
    price: 320,
    originalPrice: 480,
    discount: 33,
    rating: 4.8,
    reviewsCount: 190,
    badge: 'نوم صحي',
    isNew: false,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['مقاس 40 × 60 سم بارتفاع مدرج طبي'],
    colors: ['أبيض فندقي مع كفر قابل للنزع والغسيل'],
    material: 'فوم طبي عالي الكثافة يستجيب لحرارة الجسم وضغط الرأس',
    description: 'تخلص من آلام الرقبة والصداع الصباحي مع مخدة الميموري فوم الأصلية، تأخذ شكل فقرات الرقبة وتوزع الوزن بتوازن مثالي.',
    features: [
      'تصميم انسيابي طبي يدعم فقرات الرقبة أثناء النوم على الظهر أو الجنب',
      'كفر خارجي من قماش البامبو الطبيعي القابل للغسيل ومضاد للتعرق',
      'عمر افتراضي طويل لا تهبط مع الاستخدام'
    ]
  },
  {
    id: 'prod-014',
    name: 'طقم مخدات فايبر مايكروسوفت فندقي (قطعتين)',
    category: 'pillows-toppers',
    price: 240,
    originalPrice: 350,
    discount: 31,
    rating: 4.7,
    reviewsCount: 148,
    badge: 'راحة فندقية',
    isNew: false,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1629949009765-40fc74c9521b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1629949009765-40fc74c9521b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['قطعتين مقاس 50 × 70 سم'],
    colors: ['أبيض ناصع مطرز بحواف ذهبية'],
    material: 'حشو فايبر هولوكون معالج ناعم كالحرير مع كسوة قطن خارجي',
    description: 'استمتع بإحساس النوم في أفخم الفنادق العالمية! مخدات ممتلئة وناعمة ومرنة تعود لشكلها الأصلي فور الاستيقاظ.',
    features: [
      'حشوة ناعمة ومرنة لا تسبب كتمة أو حساسية',
      'مغلفة بغلاف قطني عالي الجودة مضاد للأتربة',
      'تأتي في عبوة شفافة مضغوطة سهلة الحمل'
    ]
  },
  {
    id: 'prod-015',
    name: 'واقي مرتبة ووتربروف مبطن ضد السوائل والبكتيريا',
    category: 'pillows-toppers',
    price: 360,
    originalPrice: 520,
    discount: 30,
    rating: 4.9,
    reviewsCount: 205,
    badge: 'حماية المرتبة',
    isNew: true,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['160 × 200 سم', '180 × 200 سم', '120 × 200 سم'],
    colors: ['أبيض طبي معالج'],
    material: 'وجه قماش قطن منشفة ماص للرطوبة مع بطانة عازلة بولي يوريثان طبي',
    description: 'يحمي مرتبتك الغالية من التلف والبقع والتسريب نهائياً! عازل طبي صامت لا يصدر أي صوت خشخشة عند الحركة، بأستيك دائري كامل لتثبيت محكم.',
    features: [
      'عازل 100% ضد كافة أنواع السوائل والرطوبة',
      'صامت ومريح تماماً بدون صوت أكياس بلاستيكية',
      'قابل للغسيل في الغسالة ويجف بسرعة'
    ]
  },

  // --- قسم الفوط والبشاكير ---
  {
    id: 'prod-016',
    name: 'علبة فوط حمام قطن المحلة سوبر لوكس (6 قطع ألوان)',
    category: 'towels',
    price: 430,
    originalPrice: 620,
    discount: 30,
    rating: 4.9,
    reviewsCount: 175,
    badge: 'قطن المحلة 100%',
    isNew: false,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['6 قطع مقاس 50 × 90 سم'],
    colors: ['مجموعة ألوان الباستيل العصرية (سيمون، بترولي، رمادي، زيتي، كشمير، بيج)'],
    material: 'غزل قطن مصري 100% حلقة مزدوجة امتصاص فائق للماء',
    description: 'فوط المحلة الكبرى الشهيرة بأعلى معايير الجودة! امتصاص فوري وسريع للماء وملمس قطني دافئ لا يترك وبراً على البشرة، في علبة كرتون شيك جداً.',
    features: [
      'امتصاص مضاعف للماء من أول استخدام',
      'ألوان معالجة ضد الكلور والبهتان',
      'خياطة أطراف دبل مانعة للتنسيل'
    ]
  },
  {
    id: 'prod-017',
    name: 'بشكير حمام جامبو قطن مصري 100% (100 × 180 سم)',
    category: 'towels',
    price: 260,
    originalPrice: 380,
    discount: 31,
    rating: 4.8,
    reviewsCount: 82,
    badge: 'مقاس جامبو',
    isNew: false,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['مقاس جامبو كبير 100 × 180 سم'],
    colors: ['أزرق بحري', 'رمادي فندقي', 'أبيض ملكي', 'عنابي'],
    material: 'قطن مصري نقي 100% كثافة 650 جرام/م²',
    description: 'بشكير بحجم كبير جداً يلف الجسم براحة ونعومة فائقة، نسيج قطني كثيف يجفف الجسم في ثوانٍ ومثالي للاستحمام والمسابح والشواطئ.',
    features: [
      'حجم كبير يغطي الجسم بالكامل',
      'كثافة عالية وامتصاص سريع للرطوبة',
      'شريط تطريز أنيق على الحواف'
    ]
  },
  {
    id: 'prod-018',
    name: 'طقم برنس حمام عرايسي قطن فاخر (6 قطع)',
    category: 'towels',
    price: 1100,
    originalPrice: 1600,
    discount: 31,
    rating: 5.0,
    reviewsCount: 92,
    badge: 'طقم عرايس متكامل',
    isNew: true,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['مقاس موحد لارج / إكس لارج مع حزام تعديل'],
    colors: ['طقم أوف وايت حريمي + رمادي رجالي', 'طقم وردي حريمي + كحلي رجالي'],
    material: 'قطن تركي ممشط ناعم على الجسم والجلد',
    description: 'طقم روب الحمام الأفخم للعروسين، يشمل 2 برنس حمام كابيشو (رجالي وحريمي) + 2 فوطة شعر ووجه + 2 سليبر منزلي ناعم، هدية مثالية لجهاز العروسة.',
    features: [
      'محتويات متكاملة للعروسين في بوكس هدايا فخم',
      'تطريز ذهبي خفيف وأنيق على الياقة والأكمام',
      'جيوب جانبية مريحة وحزام خصر متين'
    ]
  }
];

// محافظات مصر وتكلفة التوصيل ومواعيد الشحن التقديرية
const BORSSA_GOVERNORATES = [
  { id: 'cairo', name: 'القاهرة (المرج ومحيطها - استلام أو توصيل)', shippingFee: 35, time: '24-48 ساعة' },
  { id: 'giza', name: 'الجيزة', shippingFee: 40, time: '24-48 ساعة' },
  { id: 'qalyubia', name: 'القليوبية', shippingFee: 40, time: '24-48 ساعة' },
  { id: 'alex', name: 'الإسكندرية', shippingFee: 55, time: '2-3 أيام عمل' },
  { id: 'sharqia', name: 'الشرقية', shippingFee: 50, time: '2-3 أيام عمل' },
  { id: 'dakahlia', name: 'الدقهلية', shippingFee: 50, time: '2-3 أيام عمل' },
  { id: 'gharbia', name: 'الغربية', shippingFee: 50, time: '2-3 أيام عمل' },
  { id: 'monufia', name: 'المنوفية', shippingFee: 50, time: '2-3 أيام عمل' },
  { id: 'beheira', name: 'البحيرة', shippingFee: 55, time: '2-3 أيام عمل' },
  { id: 'kafr-el-sheikh', name: 'كفر الشيخ', shippingFee: 55, time: '2-3 أيام عمل' },
  { id: 'damietta', name: 'دمياط', shippingFee: 55, time: '2-3 أيام عمل' },
  { id: 'port-said', name: 'بورسعيد', shippingFee: 55, time: '2-3 أيام عمل' },
  { id: 'ismailia', name: 'الإسماعيلية', shippingFee: 55, time: '2-3 أيام عمل' },
  { id: 'suez', name: 'السويس', shippingFee: 55, time: '2-3 أيام عمل' },
  { id: 'fayoum', name: 'الفيوم', shippingFee: 60, time: '2-4 أيام عمل' },
  { id: 'beni-suef', name: 'بني سويف', shippingFee: 60, time: '2-4 أيام عمل' },
  { id: 'minya', name: 'المنيا', shippingFee: 65, time: '3-4 أيام عمل' },
  { id: 'assiut', name: 'أسيوط', shippingFee: 70, time: '3-5 أيام عمل' },
  { id: 'sohag', name: 'سوهاج', shippingFee: 70, time: '3-5 أيام عمل' },
  { id: 'qena', name: 'قنا', shippingFee: 75, time: '3-5 أيام عمل' },
  { id: 'luxor-aswan', name: 'الأقصر وأسوان', shippingFee: 80, time: '3-5 أيام عمل' },
  { id: 'store-pickup', name: 'استلام ذاتي من المعرض (محور مؤسسة الزكاة بالمرج - مجاناً)', shippingFee: 0, time: 'متاح فوراً خلال ساعات العمل' }
];

// كوبونات الخصم الفعالة
const BORSSA_COUPONS = {
  'BORSSA10': { discountPercent: 10, description: 'خصم 10% إضافي للعملاء الجدد' },
  'AROSA2026': { discountPercent: 15, description: 'خصم 15% خاص بجهاز العروسة' },
  'ZAKAH50': { fixedDiscount: 50, description: 'خصم 50 جنيه لزوار مؤسسة الزكاة' }
};

// معلومات المعرض الرسمية
const STORE_CONFIG = {
  name: 'بورصة للمفروشات',
  tagline: 'كل اللي بتحلمي بيه في بورصة هتلاقيه',
  phone: '01555560928',
  whatsapp: '201555560928',
  address: 'محور مؤسسة الزكاة - بجوار محطة عبد الله الرفاعي - المرج - القاهرة',
  metroStations: 'أقرب محطتي مترو: عزبة النخل و هشام بركات (أو النزهة)',
  ringRoadExit: 'النزول عند كوبري / محطة مؤسسة الزكاة على الطريق الدائري',
  openingHours: 'يومياً من 10:00 صباحاً حتى 11:00 مساءً (الجمعة من 1:00 ظهراً)',
  freeShippingThreshold: 1500, // شحن مجاني للطلبات فوق 1500 جنيه
  facebookUrl: 'https://www.facebook.com/share/1Cem65p17X/',
  tiktokUrl: 'https://www.tiktok.com/@borsa.el.mafroshat',
  instagramUrl: 'https://www.instagram.com/borsa.elmafroshat',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=محور+مؤسسة+الزكاة+بجوار+محطة+عبد+الله+الرفاعي+المرج+القاهرة'
};
