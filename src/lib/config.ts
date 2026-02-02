export const siteConfig = {
  name: "AK Ultimate Dental",
  description: "Comprehensive general and cosmetic dentistry in Las Vegas, NV. Our team provides personalized dental care using advanced technology.",
  url: "https://www.akultimatedental.com",
  phone: "(702) 935-4395",
  phoneHref: "tel:+17029354395",
  email: "dentalremind@yahoo.com",
  address: {
    street: "7480 West Sahara Avenue",
    city: "Las Vegas",
    state: "Nevada",
    stateAbbr: "NV",
    zip: "89117",
    full: "7480 West Sahara Avenue, Las Vegas, NV 89117",
  },
  hours: {
    monday: "8:00 AM - 5:00 PM",
    tuesday: "8:00 AM - 5:00 PM",
    wednesday: "8:00 AM - 5:00 PM",
    thursday: "8:00 AM - 5:00 PM",
    friday: "Closed",
    saturday: "Closed",
    sunday: "Closed",
  },
  social: {
    facebook: "https://www.facebook.com/scottmillerddslv/",
    yelp: "https://www.yelp.com/biz/ak-ultimate-dental-las-vegas",
    google: "https://maps.google.com/?cid=YOUR_CID",
  },
  doctor: {
    name: "Our Dental Team",
    title: "",
    credentials: "",
    experience: "Years of dental education and hands-on experience",
  },
};

export const services = [
  {
    title: "Cleanings & Prevention",
    slug: "cleanings-prevention",
    description: "Comprehensive dental exams, cleanings, and preventive care to maintain optimal oral health.",
    icon: "Shield",
    featured: true,
  },
  {
    title: "Cosmetic Dentistry",
    slug: "cosmetic-dentistry",
    description: "Transform your smile with teeth whitening, porcelain veneers, and CEREC same-day restorations.",
    icon: "Sparkles",
    featured: true,
  },
  {
    title: "Dental Implants",
    slug: "dental-implants",
    description: "Permanent tooth replacement solutions that look, feel, and function like natural teeth.",
    icon: "CircleDot",
    featured: true,
  },
  {
    title: "Crowns & Bridges",
    slug: "crowns-bridges",
    description: "Restore damaged or missing teeth with custom-crafted crowns and bridges.",
    icon: "Crown",
    featured: true,
  },
  {
    title: "Root Canal Therapy",
    slug: "root-canal",
    description: "Pain-free endodontic treatment to save infected teeth and relieve discomfort.",
    icon: "Heart",
    featured: true,
  },
  {
    title: "Oral Surgery",
    slug: "oral-surgery",
    description: "Expert tooth extractions, bone grafting, and surgical procedures.",
    icon: "Scissors",
    featured: true,
  },
  {
    title: "Periodontics",
    slug: "periodontics",
    description: "Diagnosis and treatment of gum disease to protect your oral health foundation.",
    icon: "Leaf",
    featured: false,
  },
  {
    title: "Orthodontics",
    slug: "orthodontics",
    description: "Straighten your smile with SureSmile and modern orthodontic solutions.",
    icon: "AlignCenter",
    featured: false,
  },
  {
    title: "Pediatric Dentistry",
    slug: "pediatric-dentistry",
    description: "Gentle, kid-friendly dental care for patients ages 6 and up.",
    icon: "Baby",
    featured: false,
  },
];

export const testimonials = [
  {
    name: "Carey K.",
    text: "Dr. Miller has been my dentist for over 20 years. The care and attention to detail is exceptional. The entire staff makes you feel like family.",
    rating: 5,
  },
  {
    name: "Jacqui C.",
    text: "I've been going to this practice for 15 years. They always take the time to explain procedures and make sure I'm comfortable.",
    rating: 5,
  },
  {
    name: "Norm K.",
    text: "Best dental experience I've ever had. Professional, thorough, and genuinely caring about their patients' well-being.",
    rating: 5,
  },
  {
    name: "Cynthia C.",
    text: "The technology they use is impressive - digital x-rays, same-day crowns. It's like stepping into the future of dentistry.",
    rating: 5,
  },
  {
    name: "Penny C.",
    text: "I was terrified of dentists until I found this practice. They took the time to address my fears and now I actually look forward to my visits.",
    rating: 5,
  },
  {
    name: "Nick P.",
    text: "Excellent work on my dental implant. The procedure was smooth and the results are amazing. Highly recommend!",
    rating: 5,
  },
  {
    name: "Janelle J.",
    text: "From the front desk to the dental chair, everyone here is professional and friendly. They truly care about their patients.",
    rating: 5,
  },
  {
    name: "Robert M.",
    text: "I've recommended this practice to all my friends and family. Quality dental care with a personal touch.",
    rating: 5,
  },
];

export const navigation = {
  main: [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Reviews", href: "/reviews" },
    { name: "Contact", href: "/contact" },
  ],
  services: services.map((s) => ({ name: s.title, href: `/services/${s.slug}` })),
};
