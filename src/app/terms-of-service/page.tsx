import Link from 'next/link';

export default function TermsOfService() {
  return (
    <main className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl my-12">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4 text-gray-700 dark:text-gray-200">Last updated: {new Date().toLocaleDateString('en-GB')}</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">1. Acceptance of Terms</h2>
      <p className="mb-4">By accessing or using JobsTracker (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, please do not use our services.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">2. Use of Service</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>You must be at least 16 years old to use our services.</li>
        <li>You agree to use the service only for lawful purposes and in accordance with these Terms.</li>
        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">3. User Accounts</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>You are responsible for all activities that occur under your account.</li>
        <li>You must provide accurate and complete information when creating an account.</li>
        <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">4. Intellectual Property</h2>
      <p className="mb-4">All content, trademarks, and data on this website, including but not limited to software, databases, text, graphics, icons, and hyperlinks are the property of JobsTracker or its licensors and are protected by UK and international copyright laws.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">5. Termination</h2>
      <p className="mb-4">We may suspend or terminate your access to the service at any time, without prior notice or liability, for any reason, including if you breach these Terms.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">6. Disclaimers</h2>
      <p className="mb-4">The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no warranties, express or implied, regarding the operation or availability of the service.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">7. Limitation of Liability</h2>
      <p className="mb-4">To the fullest extent permitted by law, JobsTracker and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">8. Governing Law</h2>
      <p className="mb-4">These Terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">9. Changes to Terms</h2>
      <p className="mb-4">We reserve the right to update or modify these Terms at any time. Changes will be effective upon posting to this page. Your continued use of the service constitutes acceptance of the revised Terms.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">10. Contact Us</h2>
      <p className="mb-4">If you have any questions about these Terms, please contact us at <a href="mailto:support@jobstracker.com" className="underline">support@jobstracker.com</a>.</p>
      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>
    </main>
  );
} 