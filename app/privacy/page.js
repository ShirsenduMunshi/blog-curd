// app/pages/privacy.js
'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col px-6 py-16">
      <section className="max-w-4xl mx-auto space-y-8">
        {/* Page Title */}
        <h1 className="text-4xl font-bold font-roboto text-center">Privacy Policy</h1>

        {/* Introduction */}
        <p className=" text-lg">
          At Phoenix - Unbound Thought, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our platform.
        </p>

        {/* Information Collection */}
        <section>
          <h2 className="text-2xl font-bold font-roboto">Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2 ">
            <li>Personal information, such as your name and email address, provided during registration.</li>
            <li>Content you create or share on the platform.</li>
            <li>Usage data, including interactions with the site and analytics.</li>
          </ul>
        </section>

        {/* Use of Information */}
        <section>
          <h2 className="text-2xl font-bold font-roboto">How We Use Your Information</h2>
          <p className="">
            We use your information to:
          </p>
          <ul className="list-disc pl-6 space-y-2 ">
            <li>Provide and improve our services.</li>
            <li>Personalize your experience on the platform.</li>
            <li>Communicate with you about updates and offers.</li>
          </ul>
        </section>

        {/* Data Security */}
        <section>
          <h2 className="text-2xl font-bold font-roboto">Data Security</h2>
          <p className="">
            We implement industry-standard measures to protect your data. However, please note that no system can guarantee absolute security.
          </p>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="text-2xl font-bold font-roboto">Your Rights</h2>
          <ul className="list-disc pl-6 space-y-2 ">
            <li>Access and update your personal information.</li>
            <li>Request deletion of your data.</li>
            <li>Opt out of certain data collection practices.</li>
          </ul>
        </section>

        {/* Contact Us */}
        <section>
          <h2 className="text-2xl font-bold font-roboto">Contact Us</h2>
          <p className="">
            If you have any questions or concerns about our Privacy Policy, please <Link href="/contact" className="text-blue-600 hover:underline">contact us</Link>.
          </p>
        </section>

        {/* Back to Home Button */}
        <div className="text-center mt-10">
          <Link href="/">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium">
              Back to Home
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
