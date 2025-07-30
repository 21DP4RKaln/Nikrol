'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-purple-900 dark:to-black py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-amber-200 dark:border-purple-700 shadow-xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
              Terms of Service
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  By accessing and using this service, you accept and agree to
                  be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Use License</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Permission is granted to temporarily use this service for
                  personal, non-commercial transitory viewing only. This is the
                  grant of a license, not a transfer of title.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  You are responsible for maintaining the confidentiality of
                  your account and password and for restricting access to your
                  computer.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">
                  4. Prohibited Uses
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  You may not use our service for any unlawful purpose or to
                  solicit others to perform or participate in any unlawful acts.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Termination</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We may terminate or suspend your account immediately, without
                  prior notice or liability, for any reason whatsoever,
                  including without limitation if you breach the Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">
                  6. Contact Information
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  If you have any questions about these Terms of Service, please
                  contact us at{' '}
                  <a
                    href="mailto:support@nikrol.com"
                    className="text-amber-600 dark:text-purple-400 hover:underline"
                  >
                    support@nikrol.com
                  </a>
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
