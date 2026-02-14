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

    // Classes
    "classes.heading.part1": { de: "Unsere", tr: "", en: "Our", ru: "Наши" },
    "classes.B.desc": { de: "Auto (Schaltgetriebe)", tr: "Araba (Manuel vites)", en: "Car (Manual)", ru: "Автомобиль (МКПП)" },
    "classes.B197.desc": { de: "Automatik-Ausbildung", tr: "Otomatik vites eğitimi", en: "Automatic training", ru: "Обучение на автомате" },
    "classes.B78.desc": { de: "Autom. (Elektro)", tr: "Otomatik (Elektrikli)", en: "Auto (Electric)", ru: "Автомат (Электро)" },
    "classes.BE.desc": { de: "PKW + Anhänger", tr: "Araba + Römork", en: "Car + Trailer", ru: "Авто + прицеп" },
    "classes.B96.desc": { de: "PKW + Wohnwagen", tr: "Araba + Karavan", en: "Car + Caravan", ru: "Авто + дом на колесах" },

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
};
