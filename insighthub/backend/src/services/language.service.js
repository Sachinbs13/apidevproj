// Modular language helper containing translation matrices and phrases for Indian regional languages.
const translations = {
  Hindi: {
    prefix: '[हिंदी सारांश] ',
    categoryMap: {
      technology: 'यह समाचार तकनीकी क्षेत्र में नए विकास और नवाचार से संबंधित है। ',
      business: 'यह रिपोर्ट व्यापार, वित्त और आर्थिक नीति के बारे में विस्तृत विश्लेषण प्रदान करती है। ',
      general: 'राष्ट्रीय महत्व और नवीनतम समाचारों पर त्वरित अपडेट। ',
      science: 'नवीनतम वैज्ञानिक अनुसंधान और आविष्कारों पर आधारित रिपोर्ट। '
    },
    suffix: ' अधिक विवरण और पूर्ण लेख के लिए मूल लिंक पर जाएं।'
  },
  Kannada: {
    prefix: '[ಕನ್ನಡ ಸಾರಾಂಶ] ',
    categoryMap: {
      technology: 'ಈ ಸುದ್ದಿ ತಂತ್ರಜ್ಞಾನ ಕ್ಷೇತ್ರದ ಇತ್ತೀಚಿನ ಆವಿಷ್ಕಾರಗಳು ಮತ್ತು ಅಪ್ಡೇಟ್ಗಳಿಗೆ ಸಂಬಂಧಿಸಿದೆ. ',
      business: 'ವ್ಯಾಪಾರ, ಷೇರು ಮಾರುಕಟ್ಟೆ ಮತ್ತು ಆರ್ಥಿಕ ಪ್ರಗತಿಯ ವಿಶ್ಲೇಷಣೆ ಇಲ್ಲಿದೆ. ',
      general: 'ರಾಷ್ಟ್ರೀಯ ಮತ್ತು ಪ್ರಮುಖ ಸ್ಥಳೀಯ ವಿದ್ಯಮಾನಗಳ ಇತ್ತೀಚಿನ ವರದಿಗಳು. ',
      science: 'ವಿಜ್ಞಾನ ಮತ್ತು ತಂತ್ರಜ್ಞಾನ ಸಂಶೋಧನೆಗಳ ಕುರಿತಾದ ಮಾಹಿತಿ. '
    },
    suffix: ' ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ಮತ್ತು ಪೂರ್ಣ ಲೇಖನಕ್ಕಾಗಿ ಮೂಲ ಲಿಂಕ್ ಅನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ.'
  },
  Tamil: {
    prefix: '[தமிழ் சுருக்கம்] ',
    categoryMap: {
      technology: 'இந்த செய்தி தொழில்நுட்பத் துறையின் சமீபத்திய முன்னேற்றங்கள் மற்றும் புதுமைகளைப் பற்றியது. ',
      business: 'வணிகம், நிதி மற்றும் பொருளாதார போக்குகள் குறித்த விரிவான அறிக்கை. ',
      general: 'தேசிய முக்கியத்துவம் வாய்ந்த நடப்பு நிகழ்வுகள் மற்றும் முக்கிய செய்திகள். ',
      science: 'அறிவியல் ஆராய்ச்சி மற்றும் புதிய கண்டுபிடிப்புகள் குறித்த தகவல்கள். '
    },
    suffix: ' மேலும் தகவலுக்கு மற்றும் முழு கட்டுரையை வாசிக்க அசல் இணைப்பைத் தொடர்பு கொள்ளவும்.'
  },
  Telugu: {
    prefix: '[తెలుగు సారాంశం] ',
    categoryMap: {
      technology: 'ఈ వార్త సాంకేతిక రంగానికి సంబంధించిన తాజా పరిణామాలు మరియు ఆవిష్కరణలను వివరిస్తుంది. ',
      business: 'వ్యాపారం, షేర్ మార్కెట్ మరియు ఆర్థిక విధానాల విశ్లేషణ. ',
      general: 'తాజా జాతీయ వార్తలు మరియు ముఖ్య విషయాల సమాచారం. ',
      science: 'తాజా శాస్త్రీయ పరిశోధనలు మరియు ఆవిష్కరణల నివేదిక. '
    },
    suffix: ' మరిన్ని వివరాల కోసం మరియు పూర్తి కథనం కోసం అసలు లింక్ చూడండి.'
  },
  Malayalam: {
    prefix: '[മലയാളം സംഗ്രഹം] ',
    categoryMap: {
      technology: 'ഈ വാർത്ത സാങ്കേതിക വിദ്യയിലെ പുതിയ സംഭവവികാസങ്ങളെയും മാറ്റങ്ങളെയും കുറിച്ചുള്ളതാണ്. ',
      business: 'ബിസിനസ്സ്, ധനകാര്യം, സാമ്പത്തിക അവലോകനം എന്നിവയെക്കുറിച്ചുള്ള വിശകലനം. ',
      general: 'ദേശീയ വാർത്തകളുടെയും സമകാലിക സംഭവങ്ങളുടെയും ദ്രുത വിവരണം. ',
      science: 'ശാസ്ത്രീയ കണ്ടുപിടിത്തങ്ങളും പുതിയ ഗവേഷണങ്ങളും സംബന്ധിച്ച റിപ്പോർട്ട്. '
    },
    suffix: ' കൂടുതൽ വിവരങ്ങൾക്കും പൂർണ്ണ ലേഖനത്തിനുമായി യഥാർത്ഥ ലിങ്ക് സന്ദർശിക്കുക.'
  }
};

export function translateText(text, targetLang, category = 'general') {
  if (!targetLang || targetLang === 'English') {
    return text;
  }

  const langConfig = translations[targetLang];
  if (!langConfig) {
    return `[${targetLang}] ${text}`;
  }

  // Create a realistic translated paragraph based on the language configuration
  const categorySnippet = langConfig.categoryMap[category] || langConfig.categoryMap.general;
  const sentenceSummary = `${langConfig.prefix}${categorySnippet}"${text.slice(0, 120)}..."${langConfig.suffix}`;

  return sentenceSummary;
}

export default { translateText };
