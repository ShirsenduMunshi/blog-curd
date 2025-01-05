// app/pages/terms.js
'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen flex flex-col px-6 py-16">
      <section className="max-w-4xl mx-auto space-y-8">
        {/* Page Title */}
        <h1 className="text-4xl font-bold font-roboto text-center">Terms and Conditions</h1>

        {/* Introduction */}
        <p className="text-gray-600 text-lg dark:text-gray-300">
          Welcome to Phoenix - Unbound Thought. These Terms and Conditions govern your use of our platform. By accessing or using our services, you agree to comply with these terms.
        </p>

        {/* User Responsibilities */}
        <section>
          <h2 className="text-2xl font-bold font-roboto">User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Provide accurate and up-to-date information during registration.</li>
            <li>Use the platform in compliance with applicable laws and regulations.</li>
            <li>Respect the intellectual property and privacy rights of others.</li>
          </ul>
        </section>

        {/* Prohibited Activities */}
        <section>
          <h2 className="text-2xl font-bold font-roboto">Prohibited Activities</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Engaging in unlawful, harmful, or abusive behavior.</li>
            <li>Uploading or sharing content that violates our policies.</li>
            <li>Attempting to disrupt the platform's functionality or security.</li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section>
          <h2 className="text-2xl font-bold font-roboto">Intellectual Property</h2>
          <p className="text-gray-600 dark:text-gray-300">
            All content on the platform, including text, images, and code, is protected by copyright and other intellectual property laws. You may not reproduce or distribute our content without prior permission.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section>
          <h2 className="text-2xl font-bold font-roboto">Limitation of Liability</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Phoenix - Unbound Thought is not liable for any indirect, incidental, or consequential damages arising from your use of the platform.
          </p>
        </section>

        {/* Modifications */}
        <section>
          <h2 className="text-2xl font-bold font-roboto">Modifications to Terms</h2>
          <p className="text-gray-600 dark:text-gray-300">
            We reserve the right to update or modify these terms at any time. Changes will be effective upon posting. Continued use of the platform constitutes acceptance of the revised terms.
          </p>
        </section>

        {/* Contact Us */}
        <section>
          <h2 className="text-2xl font-bold font-roboto">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-300">
            If you have any questions about these Terms and Conditions, please <Link href="/contact" className="text-blue-600 hover:underline">contact us</Link>.
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
