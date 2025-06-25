import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl my-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4 text-gray-700 dark:text-gray-200">Last updated: {new Date().toLocaleDateString('en-GB')}</p>
      <p className="mb-4">JobsTracker (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services, in accordance with UK law and the UK General Data Protection Regulation (UK GDPR).</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
      <ul className="list-disc ml-6 mb-4">
        <li><b>Personal Data:</b> Name, email address, and other information you provide when registering or using our services.</li>
        <li><b>Usage Data:</b> Information about how you use our website, such as IP address, browser type, device information, and pages visited.</li>
        <li><b>Cookies:</b> We use cookies and similar tracking technologies to enhance your experience. You can control cookies through your browser settings.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>To provide, operate, and maintain our services</li>
        <li>To improve, personalise, and expand our services</li>
        <li>To communicate with you, including for customer service and updates</li>
        <li>To process your transactions and manage your account</li>
        <li>To comply with legal obligations</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">3. Sharing Your Information</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>We do not sell your personal data.</li>
        <li>We may share your information with trusted third-party service providers who assist us in operating our website and services, subject to strict confidentiality agreements.</li>
        <li>We may disclose your information if required by law or to protect our rights.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">4. Data Security</h2>
      <p className="mb-4">We implement appropriate technical and organisational measures to protect your personal data. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">5. Your Rights (UK GDPR)</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Right to access your data</li>
        <li>Right to rectification</li>
        <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
        <li>Right to restrict processing</li>
        <li>Right to data portability</li>
        <li>Right to object</li>
        <li>Right to withdraw consent at any time</li>
      </ul>
      <p className="mb-4">To exercise your rights, please contact us at <a href="mailto:support@jobstracker.com" className="underline">support@jobstracker.com</a>.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">6. Third-Party Services</h2>
      <p className="mb-4">Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of such third parties.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">7. Changes to This Policy</h2>
      <p className="mb-4">We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">8. Contact Us</h2>
      <p className="mb-4">If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:support@jobstracker.com" className="underline">support@jobstracker.com</a>.</p>
      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>
    </main>
  );
} 