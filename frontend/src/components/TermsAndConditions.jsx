import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

const TermsAndConditions = () => {
  // Smooth scroll function
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Table of Contents Data
  const tocItems = [
    { id: 'general', title: 'General' },
    { id: 'use-of-website', title: 'Use of Website' },
    { id: 'unauthorized-use', title: 'Unauthorized Use' },
    { id: 'website-modifications', title: 'Website Modifications' },
    { id: 'changes-to-policies', title: 'Changes to Website Policies' },
    { id: 'electronic-communications', title: 'Electronic Communications' },
    { id: 'text-messages', title: 'Text Messages and Other Communications to a Telephone' },
    { id: 'phone-calls', title: 'Phone Calls with Us through this Website' },
    { id: 'links-widgets', title: 'Links, Widgets, Embeds, Social Media, and Other Third Party Features' },
    { id: 'endorsements', title: 'Endorsements' },
    { id: 'third-party-sites', title: 'Use of Third Party Sites and Organizations' },
    { id: 'submissions', title: 'Submissions' },
    { id: 'ownership', title: 'Ownership' },
    { id: 'privacy-info', title: 'Privacy and Information Use' },
    { id: 'copyrights', title: 'Copyrights and Trademarks' },
    { id: 'liability', title: 'Liability and Indemnity' },
    { id: 'no-agency', title: 'No Agency, Joint Venture, Employment, or Partnership' },
    { id: 'international-users', title: 'International Users' },
    { id: 'enforceability', title: 'Enforceability' },
    { id: 'entire-agreement', title: 'Entire Agreement and Headings' },
    { id: 'reservation', title: 'Reservation of Rights' },
    { id: 'assignment', title: 'Assignment' },
    { id: 'accessibility', title: 'Accessibility' },
    { id: 'additional-terms', title: 'Additional Terms' },
  ];

  return (
    <>
      {/* HEADER ADDED HERE */}
      <Header />

      <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 pt-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 60 }}
          className="max-w-5xl mx-auto bg-white p-8 md:p-12 shadow-xl rounded-xl border border-gray-100"
        >
          {/* Header Section */}
          <div className="text-center mb-10 border-b border-gray-200 pb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Terms & Conditions of Use
            </h1>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">
              Xen Motors Inc.
            </p>
            <p className="text-sm text-gray-400">Effective Date: September 19, 2019</p>
            <p className="mt-6 text-sm text-gray-600 max-w-3xl mx-auto italic">
              PLEASE READ THESE TERMS AND CONDITIONS OF USE CAREFULLY. BY ACCESSING THIS WEBSITE, AND ANY OF ITS PAGES, YOU AGREE THAT YOU ARE BOUND BY THESE TERMS AND CONDITIONS OF USE AS THEY MAY BE AMENDED FROM TIME TO TIME. IF YOU DO NOT AGREE WITH ANY OF THESE TERMS AND CONDITIONS OF USE, PLEASE EXIT THIS WEBSITE IMMEDIATELY.
            </p>
          </div>

          {/* Layout: Table of Contents + Content */}
          <div className="flex flex-col md:flex-row gap-10">
            
            {/* Interactive Table of Contents */}
            <div className="w-full md:w-1/3 shrink-0">
              <div className="sticky top-24 bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner max-h-[75vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-red-600 pb-2 inline-block">
                  Table of Contents
                </h2>
                <ul className="space-y-3 text-sm font-medium text-gray-600">
                  {tocItems.map((item) => (
                    <li key={item.id}>
                      <a 
                        href={`#${item.id}`} 
                        onClick={(e) => scrollToSection(e, item.id)}
                        className="hover:text-red-600 hover:underline transition-colors cursor-pointer"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Text Content */}
            <div className="w-full md:w-2/3 space-y-10 text-gray-700 leading-relaxed text-sm md:text-base">
              
              <section id="general" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">General</h2>
                <p>Thank you for visiting the website of Xen Motors Inc., (the "Website"). The terms “we” “our” and “us” refer to Xen Motors Inc., its subsidiaries and its affiliates, and the terms “you” or “your” refer to any individuals who access this Website. By accessing or using this Website, you agree and consent to be legally bound by these Terms and Conditions of Use (the “Terms”) without limitation or qualification.</p>
              </section>

              <section id="use-of-website" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Use of Website</h2>
                <p className="mb-3">This Website is not directed towards children. If you are using this Website, you are confirming that you are 18 years of age or older, or are over 13 years of age and using the Website with the consent and supervision of your parent or guardian. If required by applicable law, use of the Website will also be governed by our Privacy Policy, which informs users of our data collection practices.</p>
                <p className="mb-3">If you fail to comply with any of these Terms, your permission to use the Website automatically terminates. We reserve the right, in our sole discretion, to refuse, suspend, or terminate your access to this Website, or any of our resources or services, at any time for any reason without notice.</p>
                <p>You agree to indemnify and hold us and Carsforsale.com® harmless from any liability, loss, claim or expense including attorney's fees, related to your violation of these Terms or your use of the services, products, or information made available through the Website.</p>
              </section>

              <section id="unauthorized-use" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Unauthorized Use</h2>
                <p className="mb-3">Unauthorized use of this Website is prohibited. The following uses are expressly unauthorized:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Gathering, monitoring, or copying any content on this Website by using any crawler, spyware, engine, robot, “bot,” spider, device, or manual process of any kind without our express permission.</li>
                  <li>Harvesting or otherwise collecting information about others including, without limitation, e-mail addresses, without their explicit consent.</li>
                  <li>Interfering, or attempting to interfere, with the operations of the Website or using any device or software that will interfere.</li>
                  <li>Attempting to circumvent Website security in any way; probing or testing the vulnerability of the Website or hacking any part of the Website.</li>
                  <li>Uploading or submitting any data or information containing viruses, trojans, worms, malware, or any other computer code designed to interfere with this Website.</li>
                  <li>Taking any action or making any communication that is inappropriate, unlawful, threatening, obscene, vulgar, pornographic, profane, indecent, defamatory, abusive, or a violation of our legal rights.</li>
                </ul>
              </section>

              <section id="website-modifications" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Website Modifications</h2>
                <p>We reserve the right to modify or terminate this Website or any service available on this Website, any link, embed, platform, widget, application, software, product, or feature used by this Website, and your access to this Website, in whole or in part, at any time whatsoever.</p>
              </section>

              <section id="changes-to-policies" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Changes to Website Policies</h2>
                <p>We reserve the right to make changes to Website policies at any time without advance notice to you including, without limitation, these Terms and any applicable Privacy Policy. We encourage you to continue to review these Terms each time before using this Website.</p>
              </section>

              <section id="electronic-communications" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Electronic Communications</h2>
                <p>Visiting this Website, texting, or sending emails to us constitutes electronic communications. You consent to receive electronic communications from us and agree to notify us of any changes in your telephone number or email address.</p>
              </section>

              <section id="text-messages" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Text Messages and Other Communications to a Telephone</h2>
                <p>You authorize us to contact you, including by sending text messages directly or through a conduit text messaging service and other communications to a cell phone using an automatic telephone dialing system. You may opt out at any time by replying STOP.</p>
              </section>

              <section id="phone-calls" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Phone Calls with Us through this Website</h2>
                <p>You agree and knowingly accept that any call you make to us through this Website may be recorded for business purposes by us with recording technology powered by Carsforsale.com. You can end your telephone call at any time to cease additional recording.</p>
              </section>

              <section id="links-widgets" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Links, Widgets, Embeds, Social Media, and Other Third Party Features</h2>
                <p>This Website may provide links to other websites for the convenience of Website users. Your interactions with any link or third party widget, embed, social media, or other feature are governed by the terms and conditions of use of the third party providing the widget.</p>
              </section>

              <section id="endorsements" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Endorsements</h2>
                <p>Any description of a product, service, or publication on this Website does not imply endorsement by us of that product, service, or publication.</p>
              </section>

              <section id="third-party-sites" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Use of Third Party Sites and Organizations</h2>
                <p>Certain services made available via the Website are delivered by third party sites and organizations acting as our third party service providers. You hereby acknowledge and consent that we may share your information and data with any third party service provider.</p>
              </section>

              <section id="submissions" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Submissions</h2>
                <p className="mb-3">Any content, remarks, suggestions, testimonials, feedback, or other information communicated to us through this Website (the "Submissions") which you post is considered non-confidential. You grant us the royalty-free, perpetual right to use, reproduce, modify, and display all Submissions.</p>
                <p>You agree that all Submissions provided on this Website are the sole responsibility of the person or entity from which the Submissions originated.</p>
              </section>

              <section id="ownership" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Ownership</h2>
                <p>All content on this Website is the copyrighted work of us, Carsforsale.com®, or the owner(s) of the content. None of the contents may be copied, reproduced, distributed, or transmitted in any form without prior express written permission.</p>
              </section>

              <section id="privacy-info" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Privacy and Information Use</h2>
                <p>If required by applicable law, use of this Website will also be governed by this Website's Privacy Policy, which outlines what information is collected on the Website and how that information is used.</p>
              </section>

              <section id="copyrights" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Copyrights and Trademarks</h2>
                <p>Violating the trademark or copyright rights of others is a violation of these Terms. Carsforsale.com® or Xen Motors Inc. is the owner of all trademarks and service marks on this Website, whether registered or not.</p>
              </section>

              <section id="liability" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Liability and Indemnity</h2>
                <p className="mb-3 uppercase font-semibold text-xs">Liability Release.</p>
                <p className="mb-3">ANY AND ALL CONTENT CONTAINED ON THIS WEBSITE IS RELIED UPON AT YOUR OWN RISK AND IS PRESENTED “AS IS” OR “AS AVAILABLE.” NO WARRANTIES OF ANY KIND, WHETHER EXPRESS, STATUTORY, OR IMPLIED, ARE PROVIDED.</p>
                <p className="uppercase font-semibold text-xs mt-4 mb-3">Indemnity.</p>
                <p>BY USING THIS WEBSITE, YOU EXPRESSLY AGREE: YOUR USE OF THIS WEBSITE IS AT YOUR OWN RISK; AND YOU WILL INDEMNIFY AND HOLD US HARMLESS AGAINST ANY AND ALL LIABILITY ARISING FROM YOUR ACCESS TO OR USE OR MISUSE OF THIS WEBSITE.</p>
              </section>

              <section id="no-agency" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">No Agency, Joint Venture, Employment, or Partnership</h2>
                <p>You agree that no joint venture, partnership, employment, or agency relationship exists between you and us as a result of these Terms or use of the Website.</p>
              </section>

              <section id="international-users" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">International Users</h2>
                <p>This Website is controlled, operated, and administered by us from our offices within the United States of America. It is not targeted towards users outside of the United States.</p>
              </section>

              <section id="enforceability" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Enforceability</h2>
                <p>These Terms shall be given effect to the fullest extent permissible by law. If any provision of these Terms is deemed unlawful, void, or unenforceable, that provision shall be severed and the rest of these Terms shall remain valid.</p>
              </section>

              <section id="entire-agreement" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Entire Agreement and Headings</h2>
                <p>These Terms, coupled with any applicable Website Privacy Policy, reflect the entire agreement between you and us regarding the Website.</p>
              </section>

              <section id="reservation" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Reservation of Rights</h2>
                <p>All rights not expressly granted herein are reserved exclusively and entirely to us.</p>
              </section>

              <section id="assignment" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Assignment</h2>
                <p>You may not assign these Terms. We may assign these Terms, in whole or in part, at any time.</p>
              </section>

              <section id="accessibility" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Accessibility</h2>
                <p>If any portion of this Website is inaccessible to you for any reason, please contact us at our main telephone number.</p>
              </section>

              <section id="additional-terms" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Additional Terms</h2>
                <p>This Website may include additional or different terms provided by us, which are available in the “Additional Terms” page of the Website.</p>
              </section>
              
            </div>
          </div>
        </motion.div>
      </div>

      {/* FOOTER ADDED HERE */}
      <Footer />
    </>
  );
};

export default TermsAndConditions;