export interface ServicePageContent {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroDescription: string;
  content: string[];
  benefits: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  relatedServices: string[];
}

export const serviceContent: Record<string, ServicePageContent> = {
  "cleanings-prevention": {
    slug: "cleanings-prevention",
    title: "Cleanings & Prevention",
    metaTitle: "Dental Cleanings & Preventive Care Las Vegas | AK Ultimate Dental",
    metaDescription:
      "Professional dental cleanings and preventive care in Las Vegas. Digital X-rays, oral cancer screenings, and comprehensive exams. Call (702) 935-4395.",
    heroTitle: "Professional Dental Cleanings & Preventive Care in Las Vegas",
    heroDescription:
      "Maintain optimal oral health with comprehensive preventive dental care at AK Ultimate Dental. Our thorough cleanings and examinations help prevent costly dental problems.",
    content: [
      "Regular dental cleanings and preventive care are the foundation of a healthy smile. At AK Ultimate Dental in Las Vegas, Dr. Alexandru Chireu and our skilled hygiene team provide thorough, comfortable cleanings that go beyond what you can achieve at home. We recommend professional cleanings every six months to remove plaque and tartar buildup, preventing cavities, gum disease, and other oral health issues.",
      "During your preventive care visit, we perform a comprehensive examination of your teeth, gums, and overall oral health. Using advanced diagnostic tools including digital X-rays, intraoral cameras, and Diagnodent cavity detection technology, we can identify potential problems early—often before they cause pain or require extensive treatment. Early detection means simpler, less expensive solutions.",
      "Our preventive services include professional teeth cleaning (prophylaxis), comprehensive dental examinations, digital radiographs with reduced radiation exposure, oral cancer screenings, fluoride treatments, and dental sealants for cavity-prone teeth. We also provide personalized guidance on brushing and flossing techniques, helping you maintain excellent oral health between visits.",
      "Prevention is always better than treatment. Many dental problems, including cavities and gum disease, develop silently without obvious symptoms. By the time you feel pain, the problem has often progressed significantly. Regular preventive visits allow us to catch and address issues early, saving you time, discomfort, and money in the long run.",
      "At AK Ultimate Dental, we use the latest technology to make your preventive care visits efficient and informative. Our digital X-rays produce instant, high-quality images with up to 90% less radiation than traditional X-rays. Intraoral cameras let you see what we see, helping you understand your oral health status and the importance of recommended treatments.",
    ],
    benefits: [
      {
        title: "Early Problem Detection",
        description: "Catch cavities, gum disease, and other issues before they become serious",
      },
      {
        title: "Professional Cleaning",
        description: "Remove plaque and tartar that brushing alone can't eliminate",
      },
      {
        title: "Oral Cancer Screening",
        description: "Early detection of oral cancer dramatically improves outcomes",
      },
      {
        title: "Personalized Care Plan",
        description: "Custom recommendations based on your unique oral health needs",
      },
    ],
    faqs: [
      {
        question: "How often should I get my teeth cleaned?",
        answer:
          "Most patients benefit from professional cleanings every six months. However, patients with gum disease or other conditions may need more frequent visits. Dr. Chireu will recommend a schedule based on your individual needs.",
      },
      {
        question: "Do dental cleanings hurt?",
        answer:
          "Professional cleanings are generally comfortable. You may feel some pressure or slight sensitivity, but our gentle hygienists work carefully to ensure your comfort. Let us know if you experience any discomfort during your visit.",
      },
      {
        question: "What's included in a dental exam?",
        answer:
          "Our comprehensive exams include checking for cavities, gum disease, oral cancer, bite issues, and signs of grinding or clenching. We also review your medical history and discuss any concerns you have about your oral health.",
      },
      {
        question: "Are dental X-rays safe?",
        answer:
          "Yes. Our digital X-rays use up to 90% less radiation than traditional X-rays. We only take X-rays when necessary for diagnosis, and we follow strict safety protocols to minimize exposure.",
      },
    ],
    relatedServices: ["cosmetic-dentistry", "periodontics", "pediatric-dentistry"],
  },

  "cosmetic-dentistry": {
    slug: "cosmetic-dentistry",
    title: "Cosmetic Dentistry",
    metaTitle: "Cosmetic Dentistry Las Vegas | Veneers, Whitening | AK Ultimate Dental",
    metaDescription:
      "Transform your smile with cosmetic dentistry in Las Vegas. Teeth whitening, porcelain veneers, CEREC same-day restorations. Free consultation. Call (702) 935-4395.",
    heroTitle: "Cosmetic Dentistry in Las Vegas: Transform Your Smile",
    heroDescription:
      "Achieve the beautiful, confident smile you deserve with advanced cosmetic dentistry at AK Ultimate Dental. Dr. Alexandru Chireu combines artistry with technology for stunning results.",
    content: [
      "Your smile is one of the first things people notice about you. At AK Ultimate Dental in Las Vegas, we offer comprehensive cosmetic dentistry services to help you achieve the beautiful, confident smile you've always wanted. Dr. Alexandru Chireu combines artistic skill with advanced dental technology to create natural-looking results that enhance your unique features.",
      "Our cosmetic dentistry services include professional teeth whitening, porcelain veneers, composite bonding, CEREC same-day restorations, and smile makeovers. Whether you're dealing with stained, chipped, misshapen, or gapped teeth, we have solutions to address your concerns and help you smile with confidence.",
      "Professional teeth whitening is one of the most popular cosmetic treatments we offer. Unlike over-the-counter products, our professional whitening treatments use stronger, more effective formulas that can dramatically brighten your smile in just one visit. We also offer take-home whitening kits for convenient touch-ups and maintenance.",
      "Porcelain veneers are thin shells of dental ceramic that cover the front surface of your teeth, instantly transforming their appearance. Veneers can correct multiple issues at once—staining, chips, gaps, and minor misalignment—creating a stunning, natural-looking smile. Each veneer is custom-crafted to match your desired shape, size, and shade.",
      "With our CEREC technology, we can create beautiful, custom ceramic restorations in a single visit. No temporary crowns, no second appointments, no waiting. The CEREC system uses digital impressions and computer-aided design to mill your restoration right in our office, perfectly matched to your natural teeth.",
      "Every smile makeover begins with a comprehensive consultation. Dr. Chireu takes time to understand your goals, evaluate your oral health, and discuss all available options. We use digital imaging to show you potential results before treatment begins, ensuring you're completely confident in your treatment plan.",
    ],
    benefits: [
      {
        title: "Natural-Looking Results",
        description: "Custom-designed restorations that blend seamlessly with your smile",
      },
      {
        title: "Same-Day Options",
        description: "CEREC technology allows for single-visit crowns and restorations",
      },
      {
        title: "Comprehensive Solutions",
        description: "Address multiple cosmetic concerns with a personalized treatment plan",
      },
      {
        title: "Boosted Confidence",
        description: "A beautiful smile can positively impact all areas of your life",
      },
    ],
    faqs: [
      {
        question: "How long do porcelain veneers last?",
        answer:
          "With proper care, porcelain veneers typically last 10-15 years or longer. They're resistant to staining and very durable. Good oral hygiene and regular dental visits help maximize their lifespan.",
      },
      {
        question: "Is teeth whitening safe for my enamel?",
        answer:
          "Yes, professional teeth whitening is safe when performed by a dental professional. We carefully evaluate your oral health before treatment and use products specifically designed to whiten effectively while protecting your enamel.",
      },
      {
        question: "How long does a smile makeover take?",
        answer:
          "Treatment time varies depending on the procedures involved. Some treatments like teeth whitening can be completed in one visit, while comprehensive makeovers involving veneers may take 2-3 appointments over several weeks.",
      },
      {
        question: "Can cosmetic dentistry fix crooked teeth?",
        answer:
          "Minor misalignment can often be corrected with veneers or bonding. For more significant alignment issues, we may recommend orthodontic treatment first. During your consultation, we'll discuss the best approach for your situation.",
      },
    ],
    relatedServices: ["cleanings-prevention", "crowns-bridges", "orthodontics"],
  },

  "dental-implants": {
    slug: "dental-implants",
    title: "Dental Implants",
    metaTitle: "Dental Implants Las Vegas | Permanent Tooth Replacement | AK Ultimate Dental",
    metaDescription:
      "Dental implants in Las Vegas with Dr. Alexandru Chireu. Permanent tooth replacement that looks and functions like natural teeth. 3D imaging for precise placement. Call (702) 935-4395.",
    heroTitle: "Dental Implants in Las Vegas: Permanent Tooth Replacement",
    heroDescription:
      "Restore your smile permanently with dental implants at AK Ultimate Dental. Dr. Alexandru Chireu uses advanced 3D imaging for precise, long-lasting results.",
    content: [
      "Dental implants are the gold standard for replacing missing teeth. Unlike dentures or bridges, implants replace both the root and crown of missing teeth, providing a permanent solution that looks, feels, and functions like natural teeth. At AK Ultimate Dental in Las Vegas, Dr. Alexandru Chireu uses advanced technology including i-CAT 3D imaging to plan and place dental implants with precision.",
      "A dental implant consists of three parts: a titanium post that serves as an artificial tooth root, an abutment that connects the post to the crown, and a custom-crafted crown that matches your natural teeth. The titanium post fuses with your jawbone through a process called osseointegration, creating a stable, permanent foundation for your new tooth.",
      "One of the most significant advantages of dental implants is that they help preserve your jawbone. When you lose a tooth, the bone that supported it begins to deteriorate. Implants stimulate the jawbone just like natural tooth roots, preventing bone loss and maintaining your facial structure. This makes implants not just a cosmetic solution, but a health-preserving one.",
      "Our implant process begins with a thorough evaluation using 3D imaging technology. This allows Dr. Chireu to assess your bone density, identify the optimal implant position, and plan the procedure with exceptional accuracy. This precision planning results in better outcomes and faster healing times.",
      "Dental implants can replace a single tooth, multiple teeth, or support a full arch of teeth. Options include single implants, implant-supported bridges, and implant-retained dentures. During your consultation, we'll discuss which option best addresses your needs and goals.",
      "The implant process typically occurs in phases. After the implant post is placed, a healing period of several months allows the implant to fuse with your bone. Once healed, the abutment and crown are attached. While this takes time, the result is a restoration that can last a lifetime with proper care.",
    ],
    benefits: [
      {
        title: "Permanent Solution",
        description: "Dental implants can last a lifetime with proper care",
      },
      {
        title: "Preserves Jawbone",
        description: "Prevents bone loss that occurs after tooth loss",
      },
      {
        title: "Natural Function",
        description: "Eat, speak, and smile with complete confidence",
      },
      {
        title: "No Impact on Adjacent Teeth",
        description: "Unlike bridges, implants don't require altering healthy teeth",
      },
    ],
    faqs: [
      {
        question: "Am I a candidate for dental implants?",
        answer:
          "Most adults with good general health are candidates for implants. You need sufficient jawbone to support the implant, though bone grafting can often address this issue. During your consultation, we'll evaluate your specific situation.",
      },
      {
        question: "How long do dental implants last?",
        answer:
          "With proper care, dental implants can last a lifetime. The crown may need replacement after 10-15 years due to normal wear, but the implant itself typically lasts indefinitely.",
      },
      {
        question: "Is the implant procedure painful?",
        answer:
          "The procedure is performed under local anesthesia, so you shouldn't feel pain during placement. Post-operative discomfort is usually mild and manageable with over-the-counter pain medication. Most patients report less discomfort than they expected.",
      },
      {
        question: "How long is the implant process?",
        answer:
          "The complete process typically takes 3-6 months, depending on individual factors like healing time and whether bone grafting is needed. Some cases may qualify for immediate loading, where a temporary crown is placed the same day.",
      },
    ],
    relatedServices: ["oral-surgery", "crowns-bridges", "cosmetic-dentistry"],
  },

  "crowns-bridges": {
    slug: "crowns-bridges",
    title: "Crowns & Bridges",
    metaTitle: "Dental Crowns & Bridges Las Vegas | Same-Day CEREC | AK Ultimate Dental",
    metaDescription:
      "Dental crowns and bridges in Las Vegas. CEREC same-day crowns available. Restore damaged or missing teeth. Call (702) 935-4395 for a consultation.",
    heroTitle: "Dental Crowns & Bridges in Las Vegas",
    heroDescription:
      "Restore your smile with custom crowns and bridges at AK Ultimate Dental. Same-day CEREC crowns available for your convenience.",
    content: [
      "Dental crowns and bridges are tried-and-true restorations for damaged or missing teeth. At AK Ultimate Dental in Las Vegas, Dr. Alexandru Chireu provides custom-crafted crowns and bridges that restore both function and aesthetics. With our CEREC technology, many patients can receive beautiful, permanent crowns in just one visit.",
      "A dental crown, sometimes called a cap, covers and protects a damaged tooth. Crowns are recommended for teeth that are cracked, severely decayed, weakened after root canal treatment, or significantly worn. They restore the tooth's strength, shape, and appearance while protecting it from further damage.",
      "Our CEREC same-day crown technology revolutionizes the crown process. Traditional crowns require two appointments and temporary crowns while your permanent crown is made at an outside lab. With CEREC, we take digital impressions, design your crown on a computer, and mill it from a solid block of ceramic—all while you wait. You leave with your permanent, perfectly-fitted crown in a single visit.",
      "A dental bridge replaces one or more missing teeth by anchoring to adjacent teeth or implants. The bridge spans the gap left by missing teeth, restoring your ability to chew properly and preventing remaining teeth from shifting out of position. Bridges also help maintain your facial structure and smile aesthetics.",
      "Both crowns and bridges are custom-made to match your natural teeth in color, shape, and size. We use high-quality materials including all-ceramic, porcelain-fused-to-metal, and zirconia to create restorations that are both beautiful and durable. The right material choice depends on the tooth's location and your specific needs.",
      "Proper care extends the life of your crowns and bridges. With good oral hygiene and regular dental visits, crowns typically last 10-15 years or longer, while bridges can last even longer. We'll provide specific care instructions and monitor your restorations at each visit to ensure they continue to function optimally.",
    ],
    benefits: [
      {
        title: "Same-Day Crowns",
        description: "CEREC technology means no temporary crowns or second visits",
      },
      {
        title: "Custom Fit",
        description: "Digital impressions ensure precise, comfortable fit",
      },
      {
        title: "Natural Appearance",
        description: "Restorations match your natural teeth in color and shape",
      },
      {
        title: "Restored Function",
        description: "Eat, speak, and smile with confidence again",
      },
    ],
    faqs: [
      {
        question: "How long does a same-day crown take?",
        answer:
          "A CEREC same-day crown typically takes about 2 hours from start to finish. This includes digital impressions, design, milling, and bonding. You'll leave with your permanent crown in a single appointment.",
      },
      {
        question: "How do I care for my dental bridge?",
        answer:
          "Care for your bridge like your natural teeth—brush twice daily and floss under the bridge using a floss threader or special bridge floss. Regular dental cleanings help keep the supporting teeth and gums healthy.",
      },
      {
        question: "Will my crown look natural?",
        answer:
          "Yes. We carefully match the color, shape, and translucency of your crown to your surrounding teeth. Modern ceramic materials mimic natural tooth enamel beautifully, making restorations virtually undetectable.",
      },
      {
        question: "How long do crowns and bridges last?",
        answer:
          "With proper care, crowns typically last 10-15 years, and some last much longer. Bridges have similar longevity. Good oral hygiene and regular dental visits are key to maximizing the life of your restorations.",
      },
    ],
    relatedServices: ["dental-implants", "cosmetic-dentistry", "root-canal"],
  },

  "root-canal": {
    slug: "root-canal",
    title: "Root Canal Therapy",
    metaTitle: "Root Canal Treatment Las Vegas | Pain-Free Endodontics | AK Ultimate Dental",
    metaDescription:
      "Gentle root canal therapy in Las Vegas. Save your natural tooth and relieve pain. Modern techniques for comfortable treatment. Call (702) 935-4395.",
    heroTitle: "Root Canal Therapy in Las Vegas",
    heroDescription:
      "Save your natural tooth with gentle, effective root canal treatment at AK Ultimate Dental. Modern techniques make the procedure comfortable and successful.",
    content: [
      "Root canal therapy has an undeserved reputation for being painful, but modern techniques have made it a comfortable procedure that relieves pain rather than causing it. At AK Ultimate Dental in Las Vegas, Dr. Alexandru Chireu performs gentle root canal treatments that save natural teeth and eliminate the severe pain of infected tooth pulp.",
      "The inside of each tooth contains soft tissue called pulp, which includes nerves, blood vessels, and connective tissue. When the pulp becomes infected due to deep decay, cracks, or trauma, it can cause severe pain and lead to abscess formation. Root canal therapy removes the infected pulp, cleans and seals the inside of the tooth, and allows you to keep your natural tooth.",
      "Symptoms that may indicate you need a root canal include severe tooth pain, prolonged sensitivity to hot or cold, darkening of the tooth, swelling or tenderness in nearby gums, and a persistent pimple on the gums. However, some infected teeth cause no symptoms at all, which is why regular dental exams are important for detecting problems early.",
      "During root canal treatment, we first numb the area completely so you won't feel pain during the procedure. We then create a small opening in the tooth to access the pulp chamber, remove the infected tissue, clean and shape the root canals, and seal them with a biocompatible material. Most root canals are completed in one or two visits.",
      "After root canal therapy, your tooth will need a crown to protect it and restore full function. Teeth that have had root canals become more brittle over time, and a crown provides necessary strength and protection. We can often provide a same-day CEREC crown to complete your restoration conveniently.",
      "Root canal therapy has a high success rate—over 95%—and allows you to keep your natural tooth for years or even a lifetime. Preserving your natural tooth is almost always the best option, as it maintains your natural bite and prevents the bone loss that occurs after extraction.",
    ],
    benefits: [
      {
        title: "Pain Relief",
        description: "Eliminates the severe pain of an infected tooth",
      },
      {
        title: "Save Your Tooth",
        description: "Keeps your natural tooth rather than requiring extraction",
      },
      {
        title: "Modern Comfort",
        description: "Advanced techniques make treatment comfortable",
      },
      {
        title: "High Success Rate",
        description: "Over 95% of root canals are successful long-term",
      },
    ],
    faqs: [
      {
        question: "Is a root canal painful?",
        answer:
          "Modern root canals are no more uncomfortable than getting a filling. The area is completely numbed, and most patients report the procedure relieves their pain rather than causing it. Post-treatment discomfort is typically mild and short-lived.",
      },
      {
        question: "How long does a root canal take?",
        answer:
          "Most root canals are completed in one visit lasting 60-90 minutes, depending on the tooth's complexity. Some cases may require a second visit. We'll let you know what to expect based on your specific situation.",
      },
      {
        question: "Do I need a crown after a root canal?",
        answer:
          "In most cases, yes. A tooth that has had a root canal becomes more brittle and is at risk of fracturing. A crown provides protection and restores the tooth's strength and function. We often provide same-day CEREC crowns.",
      },
      {
        question: "What's the alternative to a root canal?",
        answer:
          "The only alternative to root canal therapy is tooth extraction. However, extracting a tooth leads to other complications including bone loss and shifting of adjacent teeth. Whenever possible, saving your natural tooth is the better choice.",
      },
    ],
    relatedServices: ["crowns-bridges", "dental-implants", "oral-surgery"],
  },

  "oral-surgery": {
    slug: "oral-surgery",
    title: "Oral Surgery",
    metaTitle: "Oral Surgery Las Vegas | Extractions, Bone Grafting | AK Ultimate Dental",
    metaDescription:
      "Oral surgery services in Las Vegas including tooth extractions, bone grafting, TMJ treatment, and sleep apnea solutions. Call (702) 935-4395.",
    heroTitle: "Oral Surgery Services in Las Vegas",
    heroDescription:
      "Expert oral surgery at AK Ultimate Dental. From simple extractions to bone grafting, we provide comfortable surgical care with precision and compassion.",
    content: [
      "Sometimes oral surgery is necessary to address dental issues that can't be resolved with other treatments. At AK Ultimate Dental in Las Vegas, Dr. Alexandru Chireu provides a range of oral surgery services in a comfortable, caring environment. We use advanced imaging technology and gentle techniques to ensure optimal outcomes and patient comfort.",
      "Tooth extraction is the most common oral surgery procedure. While we always try to save natural teeth when possible, extraction may be necessary for teeth that are severely damaged, infected, or impacted. We also perform extractions for orthodontic treatment and wisdom teeth that are causing problems or at risk of doing so.",
      "Bone grafting is a procedure that rebuilds bone in the jaw, often performed in preparation for dental implants. When teeth are lost, the surrounding bone begins to deteriorate. Bone grafts restore bone volume, creating a solid foundation for implant placement. We use various grafting materials and techniques based on each patient's needs.",
      "TMJ (temporomandibular joint) disorders can cause jaw pain, headaches, clicking sounds, and difficulty opening your mouth. We offer comprehensive TMJ evaluation and treatment, including oral appliances, physical therapy recommendations, and in some cases, surgical interventions.",
      "Sleep apnea is a serious condition where breathing repeatedly stops during sleep. Oral appliances can effectively treat mild to moderate sleep apnea by repositioning the jaw to keep the airway open. These custom-fitted devices offer an alternative to CPAP machines for many patients.",
      "All oral surgery procedures at AK Ultimate Dental are performed with patient comfort as a top priority. We thoroughly explain each procedure, discuss anesthesia options, and provide detailed post-operative instructions. Our goal is to help you through the surgical process as smoothly as possible.",
    ],
    benefits: [
      {
        title: "Advanced Imaging",
        description: "3D imaging for precise surgical planning",
      },
      {
        title: "Comfortable Experience",
        description: "Gentle techniques and appropriate anesthesia",
      },
      {
        title: "Comprehensive Care",
        description: "From consultation through recovery",
      },
      {
        title: "Same-Location Convenience",
        description: "No referrals needed for most procedures",
      },
    ],
    faqs: [
      {
        question: "Do I need my wisdom teeth removed?",
        answer:
          "Not everyone needs wisdom teeth removed. However, extraction is recommended if they're impacted, causing pain, crowding other teeth, or at risk of developing problems. We'll evaluate your wisdom teeth and recommend the best course of action.",
      },
      {
        question: "What should I expect after a tooth extraction?",
        answer:
          "After extraction, some swelling and discomfort are normal. We'll provide detailed instructions for care, including pain management, eating, and activity restrictions. Most patients recover fully within a few days to a week.",
      },
      {
        question: "How long does bone grafting take to heal?",
        answer:
          "Bone graft healing typically takes 3-6 months, depending on the type and size of the graft. During this time, new bone grows and integrates with the graft material. We'll monitor your healing and let you know when you're ready for the next step.",
      },
      {
        question: "Can you treat TMJ without surgery?",
        answer:
          "Yes, most TMJ cases are treated non-surgically with oral appliances, physical therapy, lifestyle modifications, and medications. Surgery is typically reserved for severe cases that don't respond to conservative treatment.",
      },
    ],
    relatedServices: ["dental-implants", "root-canal", "periodontics"],
  },

  periodontics: {
    slug: "periodontics",
    title: "Periodontics",
    metaTitle: "Gum Disease Treatment Las Vegas | Periodontics | AK Ultimate Dental",
    metaDescription:
      "Periodontal treatment for gum disease in Las Vegas. Laser gum therapy, deep cleanings, and gum surgery. Protect your oral health. Call (702) 935-4395.",
    heroTitle: "Periodontal Care & Gum Disease Treatment in Las Vegas",
    heroDescription:
      "Protect your smile's foundation with expert periodontal care at AK Ultimate Dental. We offer comprehensive gum disease treatment including laser therapy.",
    content: [
      "Your gums are the foundation of your smile. Periodontal (gum) disease is a serious infection that damages the soft tissue and bone supporting your teeth. Left untreated, it can lead to tooth loss and has been linked to systemic health issues including heart disease and diabetes. At AK Ultimate Dental in Las Vegas, we provide comprehensive periodontal care to protect your oral and overall health.",
      "Gum disease begins with gingivitis, characterized by red, swollen gums that bleed easily. At this stage, the condition is reversible with professional cleaning and improved home care. If left untreated, gingivitis progresses to periodontitis, where the gums pull away from the teeth, forming pockets that become infected. This stage causes bone loss and can eventually lead to tooth loss.",
      "Common signs of gum disease include bleeding gums when brushing or flossing, persistent bad breath, receding gums, loose teeth, and changes in how your teeth fit together. However, gum disease can progress without obvious symptoms, which is why regular dental exams are crucial for early detection.",
      "Treatment for gum disease depends on its severity. For gingivitis, professional cleaning and improved home care may be sufficient. For periodontitis, we may recommend scaling and root planing (deep cleaning), antibiotic therapy, or surgical treatment. Our BIOLASE laser technology allows for minimally invasive gum treatment with faster healing.",
      "We also offer periodontal maintenance programs for patients who have been treated for gum disease. These more frequent cleaning appointments help keep the disease under control and prevent recurrence. Gum disease can't be cured, but it can be effectively managed with proper professional care and home maintenance.",
      "Preventing gum disease starts with good oral hygiene—brushing twice daily, flossing daily, and seeing your dentist regularly. Other risk factors include smoking, diabetes, certain medications, and genetic predisposition. We'll help you understand your risk factors and create a prevention plan tailored to your needs.",
    ],
    benefits: [
      {
        title: "Early Detection",
        description: "Identify gum disease before it causes significant damage",
      },
      {
        title: "Laser Treatment",
        description: "Minimally invasive options with faster healing",
      },
      {
        title: "Comprehensive Care",
        description: "From prevention to advanced treatment",
      },
      {
        title: "Systemic Health",
        description: "Treating gum disease supports overall health",
      },
    ],
    faqs: [
      {
        question: "What causes gum disease?",
        answer:
          "Gum disease is primarily caused by plaque buildup on teeth. Other factors include smoking, diabetes, hormonal changes, certain medications, and genetic susceptibility. Poor oral hygiene allows plaque to accumulate and harden into tartar, leading to gum infection.",
      },
      {
        question: "Can gum disease be cured?",
        answer:
          "Gingivitis (early gum disease) can be reversed with proper treatment and home care. Periodontitis (advanced gum disease) cannot be cured but can be effectively managed with ongoing professional care and good oral hygiene.",
      },
      {
        question: "Is deep cleaning painful?",
        answer:
          "We numb the areas being treated, so you shouldn't feel pain during the procedure. Some sensitivity afterward is normal but usually resolves within a few days. We may recommend over-the-counter pain relievers if needed.",
      },
      {
        question: "How often should I come in for periodontal maintenance?",
        answer:
          "Patients with gum disease typically need maintenance visits every 3-4 months, rather than the standard 6-month schedule. This more frequent cleaning helps keep the disease under control and prevent progression.",
      },
    ],
    relatedServices: ["cleanings-prevention", "oral-surgery", "dental-implants"],
  },

  orthodontics: {
    slug: "orthodontics",
    title: "Orthodontics",
    metaTitle: "Orthodontics Las Vegas | SureSmile & Braces | AK Ultimate Dental",
    metaDescription:
      "Straighten your smile with orthodontics in Las Vegas. SureSmile clear aligners and traditional braces for teens and adults. Call (702) 935-4395.",
    heroTitle: "Orthodontics & Teeth Straightening in Las Vegas",
    heroDescription:
      "Achieve a straighter, healthier smile with orthodontic treatment at AK Ultimate Dental. We offer SureSmile clear aligners and traditional braces for all ages.",
    content: [
      "A straight smile is more than cosmetic—properly aligned teeth are easier to clean, function better, and are less prone to wear and damage. At AK Ultimate Dental in Las Vegas, we offer orthodontic solutions for patients of all ages, including SureSmile clear aligners and traditional braces. Dr. Alexandru Chireu will help you find the best option for your smile goals and lifestyle.",
      "SureSmile is an advanced clear aligner system that straightens teeth using a series of custom-made, virtually invisible trays. The trays are removable, allowing you to eat, brush, and floss normally. SureSmile is an excellent option for adults and teens who want to straighten their teeth discreetly.",
      "Traditional braces remain an effective option for complex orthodontic cases. Modern braces are smaller and more comfortable than ever, with options including metal braces and clear ceramic braces. Braces work by applying continuous pressure to gradually move teeth into proper alignment.",
      "Orthodontic treatment can address a variety of issues including crooked teeth, overcrowding, gaps between teeth, overbite, underbite, crossbite, and open bite. Beyond aesthetics, correcting these issues can improve your ability to chew, reduce jaw strain, and make teeth easier to clean—reducing your risk of cavities and gum disease.",
      "The length of orthodontic treatment varies depending on the complexity of your case. SureSmile treatment typically takes 6-18 months, while braces may take 12-36 months. During your consultation, we'll provide a personalized treatment timeline based on your specific needs.",
      "After orthodontic treatment, retainers are essential for maintaining your results. Teeth naturally want to shift back toward their original positions, and retainers prevent this movement. We'll provide custom retainers and instructions for wear to protect your investment in your new smile.",
    ],
    benefits: [
      {
        title: "Clear Options",
        description: "SureSmile aligners are virtually invisible",
      },
      {
        title: "Improved Function",
        description: "Properly aligned teeth work better",
      },
      {
        title: "Better Oral Health",
        description: "Straight teeth are easier to clean",
      },
      {
        title: "All Ages",
        description: "Orthodontic treatment for teens and adults",
      },
    ],
    faqs: [
      {
        question: "Am I too old for braces?",
        answer:
          "You're never too old for orthodontic treatment! More adults than ever are straightening their teeth. As long as your teeth and gums are healthy, you can benefit from orthodontics at any age.",
      },
      {
        question: "How often do I need to wear clear aligners?",
        answer:
          "For best results, clear aligners should be worn 20-22 hours per day, removing them only for eating, drinking anything other than water, and brushing your teeth. Consistent wear is key to staying on track with your treatment timeline.",
      },
      {
        question: "Do braces hurt?",
        answer:
          "You may experience some discomfort when braces are first placed and after adjustments, but this typically subsides within a few days. Over-the-counter pain relievers and orthodontic wax can help manage any discomfort.",
      },
      {
        question: "How do I know which option is right for me?",
        answer:
          "During your consultation, we'll evaluate your teeth, discuss your goals and lifestyle, and recommend the best option for your situation. Some complex cases require braces, while many cases can be effectively treated with clear aligners.",
      },
    ],
    relatedServices: ["cosmetic-dentistry", "cleanings-prevention", "pediatric-dentistry"],
  },

  "pediatric-dentistry": {
    slug: "pediatric-dentistry",
    title: "Pediatric Dentistry",
    metaTitle: "Pediatric Dentist Las Vegas | Kids Dental Care | AK Ultimate Dental",
    metaDescription:
      "Gentle pediatric dentistry in Las Vegas for children ages 6+. Kid-friendly environment, preventive care, and education. Call (702) 935-4395.",
    heroTitle: "Pediatric Dentistry for Kids in Las Vegas",
    heroDescription:
      "Gentle, kid-friendly dental care at AK Ultimate Dental. We make dental visits fun and educational for children ages 6 and up.",
    content: [
      "Setting children up for a lifetime of healthy smiles starts with positive early dental experiences. At AK Ultimate Dental in Las Vegas, we provide gentle, patient dental care for children ages 6 and up. Our team takes extra time to make young patients feel comfortable and even excited about taking care of their teeth.",
      "Children's dental needs are different from adults'. Their teeth and jaws are still developing, and they may have unique concerns like thumb sucking habits, early orthodontic needs, or dental anxiety. We address these concerns with patience and expertise, always keeping your child's comfort as our priority.",
      "Our pediatric services include regular exams and cleanings, fluoride treatments, dental sealants, cavity treatment, and education on proper brushing and flossing. Sealants are particularly effective for children—these thin protective coatings on back teeth can reduce cavity risk by up to 80%.",
      "We believe in educating children about oral health in ways they can understand. We explain procedures in kid-friendly terms, show them our tools before we use them, and teach them why taking care of their teeth is important. Our goal is to help children develop positive attitudes toward dental care that last a lifetime.",
      "Many children experience some anxiety about dental visits. We're experienced at helping anxious young patients feel at ease. We move at your child's pace, offer breaks when needed, and use distraction techniques to make visits more comfortable. Most children who start out nervous become happy dental patients with the right approach.",
      "We also monitor your child's dental development and can identify potential orthodontic issues early. Early intervention can sometimes simplify or even prevent the need for extensive orthodontic treatment later. We'll keep you informed about your child's development and recommend appropriate timing for any needed treatment.",
    ],
    benefits: [
      {
        title: "Gentle Approach",
        description: "Patient, kid-friendly care for anxious children",
      },
      {
        title: "Preventive Focus",
        description: "Sealants and fluoride to prevent cavities",
      },
      {
        title: "Education",
        description: "Teaching kids healthy habits that last",
      },
      {
        title: "Development Monitoring",
        description: "Tracking growth and identifying issues early",
      },
    ],
    faqs: [
      {
        question: "At what age should my child first see a dentist?",
        answer:
          "The American Dental Association recommends a child's first dental visit by age 1 or within 6 months of the first tooth appearing. At AK Ultimate Dental, we see patients ages 6 and up. For younger children, we can recommend pediatric dental specialists.",
      },
      {
        question: "How do I prepare my child for their first visit?",
        answer:
          "Keep the visit positive—avoid using words like 'hurt' or 'shot.' Read books about dental visits, play pretend dentist at home, and reassure your child that we're friendly and here to help. We'll take things slowly and make sure your child feels comfortable.",
      },
      {
        question: "What are dental sealants?",
        answer:
          "Sealants are thin protective coatings applied to the chewing surfaces of back teeth. They fill in the grooves where cavities often start, making teeth easier to clean and significantly reducing cavity risk. The application is quick, painless, and doesn't require numbing.",
      },
      {
        question: "How often should my child see the dentist?",
        answer:
          "Most children should see the dentist every 6 months for exams and cleanings. Some children may need more frequent visits depending on their individual risk factors. We'll recommend an appropriate schedule for your child.",
      },
    ],
    relatedServices: ["cleanings-prevention", "orthodontics", "cosmetic-dentistry"],
  },
};
