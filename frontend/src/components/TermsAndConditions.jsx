import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText } from 'lucide-react';

const TermsAndConditions = () => {
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      // Adjusted block offset for sticky header spacing
      const yOffset = -100; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const tocItems = [
    { id: 'donations', title: '1. Donations' },
    { id: 'use-of-website', title: '2. Use of Website' },
    { id: 'payment-processing', title: '3. Payment Processing' },
    { id: 'intellectual-property', title: '4. Intellectual Property' },
    { id: 'limitation-of-liability', title: '5. Limitation of Liability' },
    { id: 'amendments', title: '6. Amendments' },
    { id: 'contact-us', title: '7. Contact Us' },
  ];

  return (
    <div className="relative min-h-screen bg-[#0a0f1c] text-slate-300 py-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-500/30 overflow-hidden">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[5%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-5xl mx-auto bg-white/[0.03] backdrop-blur-2xl p-8 md:p-12 shadow-2xl rounded-[2.5rem] border border-white/10 relative z-10"
      >
        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>

        <div className="text-center mb-12 border-b border-white/10 pb-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-6 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <ShieldCheck className="text-blue-400 w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">
            G Goodwill Trust
          </p>
          <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
          
          {/* LEFT: Table of Contents (Sticky) */}
          <div className="w-full md:w-1/3 shrink-0 relative">
            <div className="sticky top-28 bg-black/20 p-6 rounded-2xl border border-white/5 shadow-inner">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-4">
                <FileText className="w-5 h-5 text-blue-400" /> Contents
              </h2>
              <ul className="space-y-3 text-sm font-medium text-slate-400">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a 
                      href={`#${item.id}`} 
                      onClick={(e) => scrollToSection(e, item.id)} 
                      className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block cursor-pointer"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT: Content Sections */}
          <div className="w-full md:w-2/3 space-y-10 text-slate-300 leading-relaxed text-base">
            
            <p className="text-lg text-slate-400 font-medium">
              Welcome to <strong className="text-white">G Goodwill Trust</strong>. By accessing our website and making a donation, you agree to the following terms and conditions.
            </p>
            
            <section id="donations" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-blue-500">1.</span> Donations
              </h2>
              <p className="bg-white/5 p-4 rounded-xl border border-white/5">
                All donations made through our platform are voluntary and non-refundable, unless explicitly stated otherwise. Donations will be used for the welfare and charitable purposes as described by the organization. G Goodwill Trust is an 80G registered NGO, and donors will receive valid tax-exemption receipts.
              </p>
            </section>

            <section id="use-of-website" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-blue-500">2.</span> Use of Website
              </h2>
              <p>
                You agree not to misuse this website by attempting unauthorized access, transmitting harmful content, or violating applicable laws and regulations. The content is provided for informational and charitable purposes only.
              </p>
            </section>

            <section id="payment-processing" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-blue-500">3.</span> Payment Processing
              </h2>
              <p>
                We use secure, 100% encrypted third-party payment gateways to process donations. By making a payment, you agree to the respective payment provider's terms and privacy policies. We do not store your sensitive banking credentials.
              </p>
            </section>

            <section id="intellectual-property" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-blue-500">4.</span> Intellectual Property
              </h2>
              <p>
                All content on this website, including logos, text, images, and designs, are the property of G Goodwill Trust and may not be copied, reproduced, or used without prior written consent.
              </p>
            </section>

            <section id="limitation-of-liability" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-blue-500">5.</span> Limitation of Liability
              </h2>
              <p>
                We are not liable for any direct, indirect, or incidental damages arising from your use of this website or the donation process. While we ensure the highest security, technical interruptions may occur.
              </p>
            </section>

            <section id="amendments" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-blue-500">6.</span> Amendments
              </h2>
              <p>
                We reserve the right to update or change these Terms & Conditions at any time. Significant changes will be communicated via our website. Your continued use of the platform indicates acceptance of these changes.
              </p>
            </section>

            <section id="contact-us" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-blue-500">7.</span> Contact Us
              </h2>
              <p className="bg-blue-500/10 p-5 rounded-xl border border-blue-500/20">
                For any queries regarding these Terms & Conditions, please contact our official support team at:<br/>
                <a href="mailto:info@ggoodwilltrust.org" className="text-blue-400 font-bold hover:text-blue-300 underline underline-offset-4 mt-2 inline-block">
                  info@ggoodwilltrust.org
                </a>
              </p>
            </section>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsAndConditions;