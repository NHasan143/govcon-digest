import { Metadata } from "next";
import { searchPosts, type SearchHit } from "@/lib/cms";
import { newsUrl, postUrl, PostList } from "@/components/cms/PostList";

export const dynamic = "force-dynamic";

type Args = {
  searchParams: Promise<{ q?: string | string[]; query?: string | string[] }>;
};

// Per the SEO doc the search URL is /search/?q=...; `query` accepted as a legacy alias
const getQuery = (params: { q?: string | string[]; query?: string | string[] }) => {
  const raw = params.q ?? params.query;
  return (Array.isArray(raw) ? raw[0] : raw)?.trim() || "";
};

export async function generateMetadata({ searchParams }: Args): Promise<Metadata> {
  const q = getQuery(await searchParams);
  return {
    title: q ? `Search results for "${q}"` : "Search Articles",
    description: "Search through our collection of news articles, stories, and analysis.",
    alternates: {
      canonical: "/search",
    },
    // Per SEO requirements: search results pages are noindex, follow
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },
  };
}

export default async function Search({ searchParams }: Args) {
  const q = getQuery(await searchParams);
  const posts = q ? await searchPosts(q) : [];

  return (
    <>
      <div className="archive-header text-center mt-30">
        {q ? (
          <>
            <div className="breadcrumb font-small mb-15">
              We found {posts.length} {posts.length === 1 ? "result" : "results"} for:
            </div>
            <h2 className="font-weight-bold">
              <span className="font-family-normal">&ldquo;{q}&rdquo;</span>
            </h2>
          </>
        ) : (
          <h2 className="font-weight-bold">Search</h2>
        )}
        <span className="line-dots mt-30 mb-30" />
      </div>
      <div className="row mb-50">
        <div className="col-lg-2" />
        <div className="col-lg-8 col-md-12">
          {q ? (
            <PostList
              posts={posts}
              hrefFor={(doc) =>
                (doc as SearchHit).isNews ? newsUrl(doc) : postUrl(doc as Parameters<typeof postUrl>[0])
              }
            />
          ) : (
            <form action="/search" method="GET" className="search-header mb-50">
              <div className="input-group w-100">
                <input
                  type="text"
                  name="q"
                  className="form-control"
                  placeholder="Type your key words and hit enter"
                  required
                />
                <button className="btn btn-black" type="submit">
                  <i className="ti-search mr-5" /> Search
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
