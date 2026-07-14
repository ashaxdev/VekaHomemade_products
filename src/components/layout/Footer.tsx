import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Facebook,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden text-cream-100">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/Home/footer.png"
          alt="Footer Background"
          fill
          className="object-cover object-right md:object-center"
        />
        <div className="absolute inset-0 bg-brown-900/85" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-1">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
                Veka
              </h3>

              <p className="text-gold-400 text-xs tracking-widest uppercase font-semibold mb-4">
                Homemade Products
              </p>

              <p className="text-cream-200 text-sm md:text-base leading-7 mb-5 max-w-sm">
                Handcrafted with love in our kitchen, bringing you the authentic
                taste of South Indian homes since 2018.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#"
                  className="p-2 bg-white/10 rounded-lg hover:bg-gold-500 transition"
                >
                  <Instagram size={18} />
                </a>

                <a
                  href="#"
                  className="p-2 bg-white/10 rounded-lg hover:bg-gold-500 transition"
                >
                  <Facebook size={18} />
                </a>

                <a
                  href="mailto:kalaveluchamy0430@gmail.com"
                  className="p-2 bg-white/10 rounded-lg hover:bg-gold-500 transition"
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>

              <ul className="space-y-3 text-sm md:text-base">
                <li>
                  <Link href="/shop" className="hover:text-gold-400">
                    Shop All
                  </Link>
                </li>

                <li>
                  <Link
                    href="/shop?category=Thokku"
                    className="hover:text-gold-400"
                  >
                    Thokku
                  </Link>
                </li>

                <li>
                  <Link
                    href="/shop?category=Masala"
                    className="hover:text-gold-400"
                  >
                    Masala
                  </Link>
                </li>

                <li>
                  <Link
                    href="/shop?category=ReadyMix"
                    className="hover:text-gold-400"
                  >
                    ReadyMix
                  </Link>
                </li>
              </ul>
            </div>

            {/* Information */}
            <div>
              <h4 className="font-semibold text-white mb-4">Information</h4>

              <ul className="space-y-3 text-sm md:text-base">
                <li>
                  <Link href="/about" className="hover:text-gold-400">
                    About Us
                  </Link>
                </li>

                <li>
                  <Link href="/contact" className="hover:text-gold-400">
                    Contact
                  </Link>
                </li>

                <li>
                  <Link href="/faq" className="hover:text-gold-400">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="col-span-2 lg:col-span-1">
              <h4 className="font-semibold text-white mb-4">Get In Touch</h4>

              <ul className="space-y-4 text-sm md:text-base">
                <li className="flex gap-3">
                  <Phone
                    className="text-gold-400 mt-1 flex-shrink-0"
                    size={16}
                  />
                  <span className="break-words">+91 63815 13752</span>
                </li>

                <li className="flex gap-3">
                  <Mail
                    className="text-gold-400 mt-1 flex-shrink-0"
                    size={16}
                  />
                  <span className="break-words">
                    kalaveluchamy0430@gmail.com
                  </span>
                </li>

                <li className="flex gap-3">
                  <MapPin
                    className="text-gold-400 mt-1 flex-shrink-0"
                    size={16}
                  />
                  <span className="break-words">
                    Burmanagar, Ennore, Chennai
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs md:text-sm text-cream-200">
            <p>
              © {new Date().getFullYear()} Veka Homemade Products. All rights
              reserved.
            </p>

            <p className="flex items-center gap-1">
              Made with
              <Heart size={13} className="text-red-500 fill-red-500" />
            </p>

            <p>
              Developed by{" "}
              <a
                href="https://nexirasolution.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-400 font-medium"
              >
                Nexira Solution
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}