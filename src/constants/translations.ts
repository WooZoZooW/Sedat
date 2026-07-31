export type TranslationKey = keyof typeof translations;

export const translations = {
    // Nav & General
    "nav.about": { de: "Über uns", tr: "Hakkımızda", en: "About Us", ru: "О нас" },
    "nav.classes": { de: "Klassen", tr: "Ehliyet Sınıfları", en: "Classes", ru: "Классы" },
    "nav.theory": { de: "Theorie", tr: "Teori", en: "Theory", ru: "Теория" },
    "nav.contact": { de: "Kontakt", tr: "İletişim", en: "Contact", ru: "Контакты" },
    "nav.join": { de: "Anmelden", tr: "Kayıt Ol", en: "Join", ru: "Записаться" },

    // Hero
    "hero.title": { de: "Fahrschule", tr: "Sürüş Okulu", en: "Driving School", ru: "Автошкола" },
    "hero.subtitle": {
        de: "Sicher ans Ziel – mit Kompetenz und Erfahrung. Wir begleiten dich Schritt für Schritt von den ersten Theoriestunden bis zur praktischen Prüfung.",
        tr: "Hedefinize güvenle ulaşın – uzmanlık ve tecrübe ile. İlk teori derslerinden pratik sınava kadar size adım adım eşlik ediyoruz.",
        en: "Arrive safely at your goal – with competence and experience. We accompany you step by step from the first theory lessons to the practical test.",
        ru: "Надежно к цели – с компетентностью и опытом. Мы сопровождаем вас шаг за шагом от первых теоретических занятий до практического экзамена."
    },

    // About
    "about.heading.part1": { de: "Über", tr: "", en: "About", ru: "О" },
    "about.heading.part2": { de: "uns", tr: "Hakkımızda", en: "Us", ru: "нас" },
    "about.p1": {
        de: "Unsere Fahrschule in Duisburg-Rheinhausen begleitet dich zuverlässig auf deinem Weg zum Führerschein. Unser Team erfahrener Fahrlehrer:innen (m/w/d) begleitet dich Schritt für Schritt von den ersten Theoriestunden bis zur praktischen Prüfung.",
        tr: "Duisburg-Rheinhausen'daki sürücü kursumuz, ehliyet yolunda size güvenilir bir şekilde eşlik ediyor. Deneyimli eğitmen kadromuz, ilk teori derslerinden pratik sınava kadar size adım adım eşlik ediyor.",
        en: "Our driving school in Duisburg-Rheinhausen reliably accompanies you on your way to your driving license. Our team of experienced driving instructors (m/f/d) accompanies you step by step from the first theory lessons to the practical test.",
        ru: "Наша автошкола в Дуйсбург-Райнхаузене надежно сопровождает вас на пути к получению водительских прав. Наша команда опытных инструкторов сопровождает вас шаг за шагом от первых теоретических занятий до практического экзамена."
    },
    "about.p2": {
        de: "Bei uns bist du nicht nur Fahrschüler:in, du wirst Teil unserer Fahrschul-Familie. Wir legen Wert auf ein freundliches Miteinander, individuelle Betreuung und ein Lernen, das Spaß macht und sicher ist.",
        tr: "Bizimle sadece bir sürücü adayı değil, sürücü kursu ailemizin bir parçası olursunuz. Arkadaşça bir birlikteliğe, bireysel desteğe ve eğlenceli ve güvenli bir öğrenmeye önem veriyoruz.",
        en: "With us, you are not just a driving student, you become part of our driving school family. We value friendly cooperation, individual support, and learning that is fun and safe.",
        ru: "С нами вы не просто ученик, вы становитесь частью нашей семьи автошколы. Мы ценим дружелюбное общение, индивидуальный подход и обучение, которое приносит удовольствие и безопасность."
    },
    "about.feature1": { de: "Freundliche Fahrlehrer/innen", tr: "Arkadaş canlısı eğitmenler", en: "Friendly instructors", ru: "Дружелюбные инструкторы" },
    "about.feature2": { de: "Moderne Ausbildungsfahrzeuge", tr: "Modern eğitim araçları", en: "Modern training vehicles", ru: "Современные учебные автомобили" },
    "about.feature3": { de: "Entspannte Atmosphäre", tr: "Rahat atmosfer", en: "Relaxed atmosphere", ru: "Расслабленная атмосфера" },
    "about.feature4": { de: "Persönliche Betreuung", tr: "Kişisel destek", en: "Personal support", ru: "Индивидуальный подход" },
    "about.feature5": { de: "Moderne Ausbildung", tr: "Modern eğitim", en: "Modern training", ru: "Современное обучение" },

    // Classes
    "classes.heading.part1": { de: "Unsere", tr: "", en: "Our", ru: "Наши" },
    "classes.B.desc": { de: "Schaltgetriebe", tr: "Manuel vites", en: "Manual transmission", ru: "МКПП (Механика)" },
    "classes.B197.desc": { de: "Automatik- + Schaltkompetenz Ausbildung", tr: "Otomatik + Manuel yeterlilik eğitimi", en: "Automatic + Manual competence training", ru: "Автомат + обучение механической компетенции" },
    "classes.B78.desc": { de: "Automatik", tr: "Otomatik vites", en: "Automatic", ru: "АКПП (Автомат)" },
    "classes.BE.desc": { de: "PKW + Anhänger", tr: "Araba + Römork", en: "Car + Trailer", ru: "Авто + прицеп" },
    "classes.B96.desc": { de: "PKW + Anhänger", tr: "Araba + Römork", en: "Car + Trailer", ru: "Авто + прицеп" },

    // Theory
    "theory.title": { de: "Theorieunterricht", tr: "Teori Eğitimi", en: "Theory Lessons", ru: "Теоретические занятия" },
    "theory.subtitle": { de: "Feste Theoriezeiten – ideal zum Planen", tr: "Sabit teori saatleri – planlama için ideal", en: "Fixed theory times – ideal for planning", ru: "Фиксированное время теории – идеально для планирования" },
    "theory.tuesday": { de: "Dienstag", tr: "Salı", en: "Tuesday", ru: "Вторник" },
    "theory.thursday": { de: "Donnerstag", tr: "Perşembe", en: "Thursday", ru: "Четверг" },
    "theory.note": { de: "In unseren modernen Unterrichtsräumen", tr: "Modern dersliklerimizde", en: "In our modern classrooms", ru: "В наших современных классах" },

    // Contact
    "contact.title": { de: "Kontakt", tr: "İletişim", en: "Contact", ru: "Контакты" },
    "contact.heading.part1": { de: "Kontakt &", tr: "İletişim &", en: "Contact &", ru: "Контакты и" },
    "contact.heading.part2": { de: "Anfahrt", tr: "Ulaşım", en: "Directions", ru: "проезд" },
    "contact.label": { de: "Jetzt kontaktieren:", tr: "Hemen iletişime geçin:", en: "Contact now:", ru: "Связаться сейчас:" },
    "contact.address": { de: "Adresse", tr: "Adres", en: "Address", ru: "Адрес" },
    "contact.phone": { de: "Telefon", tr: "Telefon", en: "Phone", ru: "Телефон" },
    "contact.hours": { de: "Öffnungszeiten", tr: "Açılış Saatleri", en: "Opening Hours", ru: "Часы работы" },
    "contact.days.mofr": { de: "Mo-Fr", tr: "Pzt-Cum", en: "Mon-Fri", ru: "Пн-Пт" },
    "contact.days.sa": { de: "Samstag", tr: "Cumartesi", en: "Saturday", ru: "Суббота" },

    // Footer
    "footer.tagline": { de: "Sicher ans Ziel in Duisburg.", tr: "Duisburg'da hedefinize güvenle ulaşın.", en: "Safely to your goal in Duisburg.", ru: "Надежно к цели в Дуйсбурге." },
    "footer.copyright": { de: "Alle Rechte vorbehalten.", tr: "Tüm hakları saklıdır.", en: "All rights reserved.", ru: "Все права защищены." },

    // Reviews
    "reviews.heading.part1": { de: "Kunden", tr: "Müşteri", en: "Customer", ru: "Отзывы " },
    "reviews.heading.part2": { de: "stimmen", tr: "Yorumları", en: "Reviews", ru: "клиентов" },
    "reviews.google": { de: "Google Bewertungen", tr: "Google Yorumları", en: "Google Reviews", ru: "Отзывы в Google" },

    // Pricing
    "pricing.heading.part1": { de: "Unsere ", tr: "Bizim ", en: "Our ", ru: "Наши " },
    "pricing.heading.part2": { de: "Preise", tr: "Fiyatlarımız", en: "Prices", ru: "цены" },
    "pricing.placeholder": { de: "Hier kommt bald die Preisvorstellung oder -tabelle hin.", tr: "Fiyat listesi yakında buraya eklenecektir.", en: "The price list or image will be placed here soon.", ru: "Скоро здесь появится изображение или таблица с ценами." },
    
    // Pricing Categories
    "pricing.cat.B": { de: "Klassen B & B197 & B78", tr: "Sınıf B & B197 & B78", en: "Class B & B197 & B78", ru: "Класс B и B197 и B78" },
    "pricing.cat.BE": { de: "Klasse BE", tr: "Sınıf BE", en: "Class BE", ru: "Класс BE" },
    "pricing.cat.B96": { de: "Klasse B96", tr: "Sınıf B96", en: "Class B96", ru: "Класс B96" },

    // Pricing Items
    "pricing.item.grund": { de: "Grundbetrag", tr: "Temel Ücret", en: "Basic Fee", ru: "Основной взнос" },
    "pricing.item.lesson": { de: "Fahrstunde (45 Min.)", tr: "Direksiyon Dersi (45 dk)", en: "Driving Lesson (45 min)", ru: "Урок вождения (45 мин)" },
    "pricing.item.special": { de: "Besondere Ausbildungsfahrten (Überland, Autobahn, Nacht)", tr: "Özel Sürüşler (Şehir dışı, Otoyol, Gece)", en: "Special Driving Lessons (Cross-country, Highway, Night)", ru: "Специальные поездки (загородные, автобан, ночные)" },
    "pricing.item.instruction": { de: "Unterweisung am Fahrzeug (45 Min.)", tr: "Araç Tanıtımı (45 dk)", en: "Vehicle Instruction (45 min)", ru: "Инструктаж по автомобилю (45 мин)" },
    "pricing.item.theory_exam": { de: "Theorie (Fahrschule)", tr: "Teori (Sürücü Kursu)", en: "Theory (Driving School)", ru: "Теория (Автошкола)" },
    "pricing.item.theory_exam_hint": { de: "zzgl. 24,99 € TÜV Gebühr", tr: "+ 24,99 € TÜV Ücreti", en: "+ 24,99 € TÜV Fee", ru: "+ 24,99 € взнос в TÜV" },
    "pricing.item.praxis_exam": { de: "Praxis (Fahrschule)", tr: "Pratik (Sürücü Kursu)", en: "Practical (Driving School)", ru: "Практика (Автошкола)" },
    "pricing.item.praxis_exam_hint": { de: "zzgl. 129,83 € TÜV Gebühr", tr: "+ 129,83 € TÜV Ücreti", en: "+ 129,83 € TÜV Fee", ru: "+ 129,83 € взнос в TÜV" },
    "pricing.item.praxis_exam_be": { de: "Praxis (Fahrschule)", tr: "Pratik (Sürücü Kursu)", en: "Practical (Driving School)", ru: "Практика (Автошкола)" },
    "pricing.item.praxis_exam_be_hint": { de: "zzgl. 129,83 € TÜV Gebühr", tr: "+ 129,83 € TÜV Ücreti", en: "+ 129,83 € TÜV Fee", ru: "+ 129,83 € взнос в TÜV" },

    // Seminars
    "pricing.seminars.title": { de: "Seminare", tr: "Seminerler", en: "Seminars", ru: "Семинары" },
    "pricing.seminars.asf.name": { de: "ASF", tr: "ASF", en: "ASF", ru: "ASF" },
    "pricing.seminars.asf.desc": { de: "Aufbauseminar für Fahranfänger", tr: "Yeni Sürücüler İçin Gelişim Semineri", en: "Advanced Seminar for Novice Drivers", ru: "Семинар для начинающих водителей" },
    "pricing.seminars.fes.name": { de: "FES", tr: "FES", en: "FES", ru: "FES" },
    "pricing.seminars.fes.desc": { de: "Fahreignungsseminar", tr: "Sürüş Uygunluk Semineri", en: "Driving Suitability Seminar", ru: "Семинар по пригодности к вождению" },
    "pricing.seminars.on_request": { de: "Auf Anfrage", tr: "Talep Üzerine", en: "On Request", ru: "По запросу" },

    // Promotion
    "promo.title": { de: "Sommeraktion", tr: "Yaz Kampanyası", en: "Summer Promotion", ru: "Летняя акция" },
    "promo.subtitle": { 
        de: "Nur für kurze Zeit ab dem 01.08.2026", 
        tr: "1 Ağustos 2026'dan itibaren kısa bir süre için", 
        en: "For a short time only from August 1, 2026", 
        ru: "Только на короткое время с 1 августа 2026" 
    },
    "promo.offer": { 
        de: "Anmeldung jetzt nur 99€ statt 250€", 
        tr: "Kayıt şimdi 250€ yerine sadece 99€", 
        en: "Registration now only 99€ instead of 250€", 
        ru: "Регистрация сейчас всего 99€ вместо 250€" 
    },
};
