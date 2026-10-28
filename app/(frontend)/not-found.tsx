import Layout from "@/components/layout/Layout";
import Link from "next/link";

/* Redirection-panel rules are applied by redirectOr404() in lib/redirect-guard,
   called from the routes that 404 — not here. Reading the request path in this
   boundary would force every page in the group to render per request. */
export default function NotFound() {
  return (
    <>
      <div className="mt-100 mb-200">
        <div className="entry-wraper">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 col-md-12 text-center">
              <h1 className="mb-20 display-1">404</h1>
              <h4 className="mb-30">We’re sorry, we seem to have lost this page, but we don’t want to lose you.</h4>
              <p>
                Visit the
                <Link href="/">
                  <u> Homepage </u>
                </Link>
                or
                <Link href="/contact">
                  <u> Report the broken link here</u>
                </Link>
              </p>
              <form action="/search" method="get" role="search" className="search-form d-lg-flex open-search mb-30">
                <i className="icon-search" />
                <input className="form-control" name="q" id="not-found-search" type="search" placeholder="Search..." aria-label="Search articles" />
              </form>
              <div className="mb-3">
                <Link href="/contact" className="btn btn-facebook btn-outline-secondary">
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
