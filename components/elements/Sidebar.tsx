"use client";
import { Suspense } from "react";
import StickyBox from "react-sticky-box";
import NewsletterStatus from "./NewsletterStatus";

// `display` kept for call-site compatibility (used to toggle the removed
// comments widgets)
export default function Sidebar({ display }: { display?: string }) {
  return (
    <div className="col-lg-3 col-md-12 position-relative">
      <StickyBox offsetTop={100} offsetBottom={20}>
        <div className="widget-area">
          {/* Newsletter */}
          <div className="sidebar-widget widget_newsletter mt-15">
            <h6 className="widget-header widget-header-style-4 mb-20 text-center text-uppercase border-top-1 border-bottom-1 pt-5 pb-5">
              <span>Newsletter</span>
            </h6>
            <div className="newsletter">
              <p className="">Continue reading uninterrupted with a subscription</p>
              <form action="/api/newsletter" method="POST" className="subscribe_form relative mail_part">
                <div className="form-newsletter-cover">
                  <div className="form-newsletter">
                    <input type="email" name="EMAIL" placeholder="Email address" required />
                    <button type="submit">
                      <span className="long-arrow long-arrow-right" />
                    </button>
                  </div>
                </div>
              </form>
              <Suspense fallback={null}>
                <NewsletterStatus />
              </Suspense>
            </div>
          </div>
        </div>
      </StickyBox>
    </div>
  );
}
