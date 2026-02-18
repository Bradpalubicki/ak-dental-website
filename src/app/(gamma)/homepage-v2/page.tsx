import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Calendar,
  MapPin,
  Clock,
  Star,
  Monitor,
  Scan,
  Camera,
  Cpu,
  Heart,
  MessageCircle,
  BookOpen,
  ClipboardList,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Facebook,
  Instagram,
} from "lucide-react";
import { siteConfig } from "@/lib/config";

export const metadata = {
  title: "Homepage Preview V2 | AK Ultimate Dental",
  robots: "noindex, nofollow",
};

// ─── Hero ────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="bg-[#ede8e0]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
              AK Ultimate Dental: Your Trusted Dentist in Las Vegas
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              Welcome to a dental practice where exceptional care meets genuine
              compassion. At AK Ultimate Dental, we combine over a decade of
              expertise with cutting-edge technology to deliver personalized
              treatments that transform smiles and boost confidence throughout
              the Las Vegas community.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={siteConfig.phoneHref}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-gray-800"
              >
                <Phone className="h-4 w-4" />
                Call {siteConfig.phone}
              </a>
              <Link
                href="/appointment"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-900 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
              >
                <Calendar className="h-4 w-4" />
                Book Online
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="overflow-hidden rounded-2xl border border-stone-300/50 shadow-xl">
              <Image
                src="/gamma/1_AK-Ultimate-Dental-Your-Trusted-Dentist-in-Las-Vegas.png"
                alt="AK Ultimate Dental welcoming reception area"
                width={800}
                height={500}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Personalized Care (3-card dark section) ─────────────────────
function PersonalizedCareSection() {
  const cards = [
    {
      title: "Tailored Just for You",
      description:
        "Experience dental care customized to your unique needs, from routine preventive checkups and cleanings to advanced restorative and cosmetic treatments designed around your goals and lifestyle.",
      icon: Heart,
    },
    {
      title: "Decade of Expertise",
      description:
        "Benefit from over ten years of distinguished practice blending European precision and American innovation, delivering world-class dental solutions right here in Las Vegas.",
      icon: Star,
    },
    {
      title: "Comfort First",
      description:
        "Relax in our welcoming, comfortable environment where your smile and confidence come first. We've created a space where dental visits feel less like appointments and more like caring conversations.",
      icon: Sparkles,
    },
  ];

  return (
    <section className="bg-[#2c2c28] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
          Welcome to Personalized, Compassionate Dental Care
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {cards.map((card) => (
            <div key={card.title} className="text-center">
              <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-[#ede8e0]">
                <card.icon className="h-10 w-10 text-[#2c2c28]" />
              </div>
              <h3 className="font-serif text-xl font-semibold italic text-white">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Meet Our Doctor ─────────────────────────────────────────────
function MeetDoctorSection() {
  return (
    <section className="bg-[#ede8e0] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700">
          <Star className="h-3.5 w-3.5 fill-amber-600 text-amber-600" />
          Meet Our Doctor
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
          Meet Dr. Alex: Skilled Care with a Personal Touch
        </h2>
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-stone-300/50 bg-white shadow-lg">
            <Image
              src="/gamma/3_Meet-Our-Doctor.png"
              alt="Dr. Alex Khachaturian"
              width={600}
              height={500}
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Education &amp; Training
              </h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Dr. Alex&apos;s journey began with rigorous training in Romania
                before advancing his expertise in the United States, where he
                continuously pursues the latest techniques and technologies in
                modern dentistry.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Patient-Centered Philosophy
              </h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Known for thorough communication and attentive follow-up care,
                Dr. Alex ensures every patient feels heard, understood, and
                comfortable throughout their treatment journey.
              </p>
            </div>
            <blockquote className="border-l-4 border-stone-400 pl-5 italic text-gray-600">
              <p>
                &ldquo;Dr. Alex called me hours after my visit to check on
                my comfort and answer questions. That level of care is
                extraordinary.&rdquo;
              </p>
              <cite className="mt-2 block text-sm font-semibold not-italic text-gray-900">
                &mdash; Ion, grateful patient
              </cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Services ────────────────────────────────────────────────────
function ServicesSection() {
  const servicesList = [
    {
      title: "Crowns & Bridges",
      description:
        "Custom-crafted restorations that seamlessly blend with your natural teeth, providing strength, function, and aesthetics that last for years. Each crown is precisely designed to match your bite and smile.",
    },
    {
      title: "Porcelain Veneers",
      description:
        "Transform your smile's shape, size, and color with ultra-thin porcelain or durable zirconia veneers. Perfect for correcting chips, gaps, discoloration, or misalignment with minimal tooth preparation.",
    },
    {
      title: "Dental Implants",
      description:
        "Replace missing teeth with permanent, natural-looking solutions that restore full function and confidence. Our implant expertise ensures predictable results and long-term success for your investment.",
    },
  ];

  return (
    <section className="bg-[#ede8e0] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl font-bold italic text-gray-900 sm:text-4xl">
          Our Comprehensive Services to Keep Your Smile Strong
        </h2>
        <p className="mt-3 text-gray-600">
          From restorative procedures to cosmetic enhancements, we offer a full
          spectrum of dental services utilizing the latest materials and
          techniques to achieve beautiful, lasting results.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {servicesList.map((s) => (
            <div
              key={s.title}
              className="rounded-xl bg-[#ddd7cd] p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {s.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-amber-700 transition-colors"
          >
            View All Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Technology ──────────────────────────────────────────────────
function TechnologySection() {
  const tech = [
    {
      icon: Scan,
      title: "CBCT 3D Imaging",
      description:
        "Cone beam computed tomography provides three-dimensional views of your teeth, jaw, and surrounding structures, enabling precise diagnosis and treatment planning for implants and complex cases.",
    },
    {
      icon: Monitor,
      title: "Digital X-rays",
      description:
        "Modern digital radiography reduces radiation exposure by up to 90% compared to traditional X-rays while delivering instant, high-resolution images for accurate, immediate assessment.",
    },
    {
      icon: Cpu,
      title: "CEREC Same-Day Restorations",
      description:
        "Walk in with a damaged tooth, walk out with a permanent crown or restoration. Our CEREC technology designs, mills, and places custom ceramic restorations in a single appointment.",
    },
    {
      icon: Camera,
      title: "Intraoral Cameras",
      description:
        "Tiny cameras capture detailed images of your teeth and gums, displayed on monitors so you can understand your dental health and participate actively in treatment decisions.",
    },
  ];

  return (
    <section className="bg-[#ede8e0] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
          Cutting-Edge Technology for Precise, Efficient Care
        </h2>
        <p className="mt-3 text-gray-600">
          We invest in advanced dental technology to enhance diagnostic accuracy,
          treatment precision, and patient comfort, ensuring you receive the most
          effective care available today.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {tech.map((t) => (
            <div key={t.title} className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ddd7cd]">
                <t.icon className="h-5 w-5 text-gray-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{t.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {t.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Patient Comfort ─────────────────────────────────────────────
function PatientComfortSection() {
  const steps = [
    {
      num: "01",
      title: "Personalized Treatment Plans",
      description:
        "Every treatment plan is built around your specific goals, concerns, budget, and timeline. We never push unnecessary procedures — only what truly benefits your oral health.",
    },
    {
      num: "02",
      title: "Transparent Communication",
      description:
        "We explain every procedure in clear, jargon-free language, ensuring you understand what to expect before, during, and after treatment. Questions are always welcome and thoroughly answered.",
    },
    {
      num: "03",
      title: "Education-Driven Approach",
      description:
        "Knowledge is power. We empower you with information about oral health, preventive care, and treatment options so you can make confident, informed decisions about your smile.",
    },
  ];

  return (
    <section className="bg-[#ede8e0] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
          Patient Comfort &amp; Education: We Listen, Explain, Empower
        </h2>
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-stone-300/50 shadow-lg">
            <Image
              src="/gamma/6_Patient-Comfort-and-Education-We-Listen-Explain-Empower.png"
              alt="Doctor explaining treatment to patient on screen"
              width={600}
              height={450}
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.num} className="border-t border-stone-400/40 pt-4">
                <p className="text-xs font-bold text-stone-400">{step.num}</p>
                <h3 className="mt-1 text-lg font-bold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────────────────
function TestimonialsSection() {
  const reviews = [
    {
      quote:
        "Dr. Miller and his entire team are absolutely amazing. I highly recommend them for everything from routine fillings to complex crown work. The quality is exceptional and the care is genuine.",
      author: "Longtime Las Vegas Patient",
    },
    {
      quote:
        "The friendly staff and welcoming office atmosphere make every visit stress-free. I used to dread dental appointments, but now I actually look forward to my checkups. They've completely changed my perspective.",
      author: "Sarah M., Henderson",
    },
    {
      quote:
        "Professional, efficient, and caring — exactly what you want in a dental practice. They took time to explain everything and made sure I was comfortable throughout my implant procedure.",
      author: "Michael T., Summerlin",
    },
  ];

  return (
    <section className="bg-[#ede8e0] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-700">
          <Heart className="h-3.5 w-3.5 fill-rose-600 text-rose-600" />
          Patient Testimonials
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
          Real Smiles, Real Stories: What Our Patients Say
        </h2>
        <p className="mt-3 text-gray-600">
          Don&apos;t just take our word for it — hear from the hundreds of
          satisfied patients who have experienced the AK Ultimate Dental
          difference firsthand.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <div key={i} className="rounded-xl bg-white p-6 shadow-sm">
              <span className="font-serif text-5xl leading-none text-stone-300">
                &ldquo;
              </span>
              <p className="mt-2 text-sm leading-relaxed text-gray-700 italic">
                &ldquo;{r.quote}&rdquo;
              </p>
              <p className="mt-4 text-sm font-semibold text-gray-900">
                &mdash; {r.author}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-sm">
          <FileText className="h-5 w-5 text-gray-400" />
          <p className="text-sm text-gray-600">
            <strong>Want to see video testimonials?</strong> Visit our website
            to watch real patients share their experiences and see their smile
            transformations.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Appointment & Location ──────────────────────────────────────
function AppointmentSection() {
  return (
    <section className="bg-[#d8d3cb] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
          Easy Appointment Scheduling &amp; Convenient Location
        </h2>
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <MapPin className="h-5 w-5" />
                Find Us
              </h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                We&apos;re conveniently located in the heart of Las Vegas at{" "}
                <strong>7480 West Sahara Avenue, Las Vegas, NV 89117</strong>,
                with ample parking and easy access from all major neighborhoods
                including Summerlin, Henderson, and Downtown.
              </p>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Phone className="h-5 w-5" />
                Schedule Your Visit
              </h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Call us directly at{" "}
                <a
                  href={siteConfig.phoneHref}
                  className="font-semibold text-gray-900 underline"
                >
                  {siteConfig.phone}
                </a>{" "}
                to speak with our friendly scheduling team, or use our
                convenient online booking system available 24/7.
              </p>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <CheckCircle className="h-5 w-5" />
                New Patients Welcome
              </h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                We&apos;re accepting new patients ages 6 and up. Your first
                visit includes a comprehensive examination, digital X-rays, and
                a personalized consultation to discuss your dental health goals.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={siteConfig.phoneHref}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-gray-800"
              >
                Call Now
              </a>
              <Link
                href="/appointment"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-900 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
              >
                Book Online
              </Link>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Clock className="h-5 w-5" />
                Office Hours
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex justify-between">
                  <span>Monday</span><span>9:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Tuesday</span><span>9:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Wednesday</span><span>9:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Thursday</span><span>9:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Friday</span><span>9:00 AM - 5:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span><span>By Appointment</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span><span>Closed</span>
                </li>
              </ul>
            </div>
            <div className="overflow-hidden rounded-2xl border border-stone-300/50 shadow-lg">
              <Image
                src="/gamma/8_Easy-Appointment-Scheduling-and-Convenient-Location.png"
                alt="AK Ultimate Dental office building exterior"
                width={600}
                height={350}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Journey Steps ───────────────────────────────────────────────
function JourneySection() {
  const steps = [
    {
      icon: ClipboardList,
      title: "Schedule Consultation",
      description:
        "Book your personalized consultation to discuss your dental health, cosmetic goals, and any concerns in a relaxed, pressure-free environment.",
    },
    {
      icon: BookOpen,
      title: "Review Your Options",
      description:
        "Receive transparent pricing and multiple treatment options tailored to your needs, timeline, and budget with clear explanations of each approach.",
    },
    {
      icon: Sparkles,
      title: "Begin Your Transformation",
      description:
        "Join hundreds of satisfied patients who trust AK Ultimate Dental for exceptional care, beautiful results, and a dental experience that exceeds expectations.",
    },
  ];

  return (
    <section className="bg-[#ede8e0] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl font-bold italic text-gray-900 sm:text-4xl">
          Your Smile Journey Starts Here: Take the First Step Today
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-xl bg-[#ddd7cd] p-6 shadow-sm"
            >
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 md:block">
                  <ArrowRight className="h-5 w-5 text-stone-400" />
                </div>
              )}
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#c9c3b8]">
                <step.icon className="h-5 w-5 text-gray-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-gray-600">
          Don&apos;t wait to achieve the healthy, confident smile you deserve.
          Our team is ready to welcome you into our dental family and provide the
          comprehensive, compassionate care that sets us apart in Las Vegas.
        </p>
        <div className="mt-6">
          <a
            href={siteConfig.phoneHref}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2c2c28] px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-gray-800"
          >
            Start Your Journey &mdash; Call Today
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Connect Section (dark) ──────────────────────────────────────
function ConnectSection() {
  return (
    <section className="bg-[#2c2c28] py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl font-bold italic sm:text-4xl">
          Connect With Us &amp; Stay Informed
        </h2>
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold">Follow Our Social Media</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                Stay connected with AK Ultimate Dental on Facebook, Google, and
                Yelp for the latest updates, special offers, patient success
                stories, and helpful dental care tips to keep your smile healthy
                between visits.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Educational Resources</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                Access our comprehensive library of patient resources, frequently
                asked questions, and dental care tips on our regularly updated
                blog. Learn about the latest treatments, preventive care
                strategies, and oral health best practices.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/appointment"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-gray-900"
              >
                Schedule Your Appointment Now
              </Link>
              <a
                href={siteConfig.phoneHref}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-gray-900"
              >
                Call {siteConfig.phone}
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3">
              <Facebook className="h-5 w-5 text-blue-400" />
              <div>
                <span className="font-semibold">Facebook:</span>
                <span className="ml-2 text-sm text-gray-400">
                  Like our page for office updates and promotions
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3">
              <Star className="h-5 w-5 text-yellow-400" />
              <div>
                <span className="font-semibold">Google:</span>
                <span className="ml-2 text-sm text-gray-400">
                  Read reviews and get directions
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3">
              <MessageCircle className="h-5 w-5 text-red-400" />
              <div>
                <span className="font-semibold">Yelp:</span>
                <span className="ml-2 text-sm text-gray-400">
                  See what our patients are saying
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3">
              <Instagram className="h-5 w-5 text-pink-400" />
              <div>
                <span className="font-semibold">Instagram:</span>
                <span className="ml-2 text-sm text-gray-400">
                  Follow our smile transformations
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-gray-500">
          AK Ultimate Dental | 7480 West Sahara Avenue, Las Vegas, NV 89117 |{" "}
          {siteConfig.phone}
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export default function GammaPreviewPage() {
  return (
    <>
      <HeroSection />
      <PersonalizedCareSection />
      <MeetDoctorSection />
      <ServicesSection />
      <TechnologySection />
      <PatientComfortSection />
      <TestimonialsSection />
      <AppointmentSection />
      <JourneySection />
      <ConnectSection />
    </>
  );
}
