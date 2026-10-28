import "../css/globals.css";

import HeaderComponent from "@/components/general/header/header-component";
import type { Metadata } from "next";
import { FooterComponent } from "@/components/general/footer";
import LayoutContainer from "@/components/general/layout-container";
import globalRequest from "@/requests/global-requests";
import { Suspense } from "react";
import Loading from "./loading";
import Script from "next/script";
import MotionToggle from "@/components/general/motion-toggle/motion-toggle";
import { MOTION_INIT_SCRIPT } from "@/utils/motion";

export const revalidate = 3600;
export const fetchCache = 'force-cache';

export async function generateMetadata(): Promise<Metadata> {
  const global = await globalRequest();
  const faviconUrl = global?.header?.favicon;

  

  return {
    title: "Kilburn & Strode LLP",
    description: "Kilburn & Strode LLP is a leading law firm that provides a wide range of legal services to clients in the UK and internationally.",
    icons: faviconUrl
      ? {
          icon: faviconUrl,
          shortcut: faviconUrl,
          apple: faviconUrl,
        }
      : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const global = await globalRequest();

  const header = global?.header;
  const footer = global?.footer;
  const ga4MeasurementId = global?.ga4MeasurementId !== "G-D2XBQE20QF" ? global?.ga4MeasurementId : undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={`font-modern-era antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N5QN3MS"
            height="0"
            width="0"
            title="Google Tag Manager"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <div className="hidden text-yellow text-bright-red text-dark-purple text-dark-blue text-dark-green text-dark-red text-white text-dark-gray text-light-gray text-medium-gray text-light-green text-light-blue text-light-purple bg-yellow bg-bright-red bg-dark-purple bg-dark-blue bg-dark-green bg-dark-red bg-dark-gray bg-light-gray bg-medium-gray bg-light-green bg-light-blue bg-light-purple" />

        {/* sets data-motion on <html> before any animation code runs */}
        <Script id="motion-preference" strategy="beforeInteractive">
          {MOTION_INIT_SCRIPT}
        </Script>

        <a
          href="#main-content"
          data-page-transition="off"
          className="sr-only focus:not-sr-only focus:fixed focus:top-sm focus:left-sm focus:z-[100] focus:bg-white focus:text-dark-gray focus:px-md focus:py-xs font-modern-era-medium"
        >
          Skip to main content
        </a>

        <LayoutContainer>
          <Suspense fallback={<Loading />}>
            {header && <HeaderComponent header={header} />}
            {children}
            {footer && <FooterComponent footer={footer} logo={header?.logo} />}
          </Suspense>
        </LayoutContainer>

        {/* <MotionToggle /> */}

        {/* HubSpot Tracking */}
        <Script
          id="hs-script-loader"
          src="//js-eu1.hs-scripts.com/144529621.js"
          strategy="afterInteractive"
        />
        {/* Google Tag Manager: GA4 (G-D2XBQE20QF) is loaded by the container's Google tag,
            so there is no separate gtag.js snippet (it would double-count page views) */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-N5QN3MS');
          `}
        </Script>

        {/* GA4 from Strapi global-setting → ga4_measurement_id */}
        {ga4MeasurementId && (
          <>
            <Script
              id="ga4-loader"
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4MeasurementId}');
              `}
            </Script>
          </>
        )}

        {/* iubenda Cookie Banner */}
        <Script id="iubenda-config" strategy="beforeInteractive">
          {`
            var _iub = _iub || [];
            _iub.csConfiguration = {
              "siteId": 4467817,
              "cookiePolicyId": "28234565-ed86-4618-b6db-c9cc36746fc4",
              "lang": "en-GB",
              "storage": { "useSiteId": true },
              "invalidateConsentWithoutLog": false,
              "skipSaveConsent": false,
              "localConsentDomain": "kilburn-and-strode-gray.vercel.app",
              "preferenceCookie": { "expireAfter": 180 },
              "enableRemoteConsent": true
            };
          `}
        </Script>

        <Script
          type="text/javascript"
          src="https://embeds.iubenda.com/widgets/28234565-ed86-4618-b6db-c9cc36746fc4.js"
        />
      </body>
    </html>
  );
}