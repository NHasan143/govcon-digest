"use client";

import Link from "next/link";
import { NoScript } from "@/components/elements/NoScriptFallback";
import { CATEGORIES } from "@/lib/categories";

interface SearchFormProps {
  className?: string;
  placeholder?: string;
  suggestions?: Array<{
    label: string;
    href: string;
  }>;
  onSubmit?: (query: string, type: string) => void;
}

export default function SearchForm({
  className = "",
  placeholder = "Type your key words and hit enter",
  suggestions = CATEGORIES.map((c) => ({ label: c.name, href: `/${c.slug}` })),
  onSubmit
}: SearchFormProps) {
  return (
    <>
      {/*Start search form*/}
      <div className="main-search-form">
        <div className="container">
          <div className="main-search-form-cover pt-50 pb-50 m-auto">
            <div className="row mb-20">
              <div className="col-12">
                <form
                  action="/search"
                  method="GET"
                  className={`search-header ${className}`}
                  onSubmit={(e) => {
                    // Only prevent default if JavaScript is available and onSubmit is provided
                    if (onSubmit) {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const query = formData.get('q') as string;
                      onSubmit(query, "");
                    }
                    // If no onSubmit, let the form submit normally to /search
                  }}
                >
                  <div className="input-group w-100">
                    <input
                      type="text"
                      name="q"
                      className="form-control"
                      placeholder={placeholder}
                      required
                    />
                    <button className="btn btn-black" type="submit">
                      <i className="ti-search mr-5" /> Search
                    </button>
                  </div>
                  <NoScript>
                    <div className="mt-3">
                      <p className="text-muted small">
                        <strong>Note:</strong> For enhanced search features, please enable JavaScript.
                      </p>
                    </div>
                  </NoScript>
                </form>
              </div>
            </div>
            <div className="row">
              <div className="col-12 font-small suggested-area">
                <p className="suggested font-heading mb-10">
                  <strong>Suggestion</strong>
                </p>
                <ul className="list-inline d-inline-block">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="list-inline-item">
                      <Link href={suggestion.href}>{suggestion.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
