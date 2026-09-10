import Sidebar from "@/components/elements/Sidebar";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types";

interface Section7Props {
  articles?: Article[];
  className?: string;
}

// Slot layout (9 articles): [0] big feature, [1-4] medium rows with thumbs,
// [5] right-column image card, [6-8] right-column text-only.
const defaultArticles: Article[] = [
  {
    id: "s7-1",
    title: "How to Reopen Schools: What Science and Other Countries Teach Us",
    content: "",
    excerpt:
      "The pressure to bring American students back to classrooms is intense, but the calculus is tricky with infections still out of control in many communities.",
    featuredImage: "/assets/imgs/news/news-15.jpg",
    slug: "/single",
    publishedAt: "2025-04-15",
    status: "published",
    author: { id: "1", name: "Steven Kenedy", email: "", slug: "/author" },
    category: { id: "1", name: "World", slug: "/category" },
    tags: [
      { id: "1", name: "World", slug: "/category" },
      { id: "2", name: "Education", slug: "/category" },
    ],
  },
  {
    id: "s7-2",
    title: "The Endgame for LinkedIn Is Coming",
    content: "",
    excerpt: "Every time this LinkedIn commercial pops up on YouTube I am reminded of how low the company has fallen to.",
    featuredImage: "/assets/imgs/news/thumb-2.jpg",
    slug: "/single",
    publishedAt: "2025-04-15",
    status: "published",
    author: { id: "1", name: "Steven Kenedy", email: "", slug: "/author" },
    category: { id: "2", name: "Technology", slug: "/category" },
    tags: [{ id: "3", name: "Technology", slug: "/category" }],
  },
  {
    id: "s7-3",
    title: "Neuroscience Says Listening to This Song Reduces Anxiety by Up to 65 Percent",
    content: "",
    excerpt: "After a calamitous drop in March, the stock market has had a ferocious rally, despite a cascade of awful news. How can investors cope?",
    featuredImage: "/assets/imgs/news/thumb-4.jpg",
    slug: "/single",
    publishedAt: "2025-04-15",
    status: "published",
    author: { id: "1", name: "Steven Kenedy", email: "", slug: "/author" },
    category: { id: "3", name: "Music", slug: "/category" },
    tags: [{ id: "4", name: "Music", slug: "/category" }],
  },
  {
    id: "s7-4",
    title: "I Have A Theory That Donald Glover And Childish Gambino Are Secretly The Same Person",
    content: "",
    excerpt:
      "For anyone who doesn’t know who these 2 dudes are, Donald Glover is a beloved actor/writer/comedian and Childish Gambino is a popular musician.",
    featuredImage: "/assets/imgs/news/thumb-8.jpg",
    slug: "/single",
    publishedAt: "2025-04-15",
    status: "published",
    author: { id: "1", name: "Steven Kenedy", email: "", slug: "/author" },
    category: { id: "4", name: "Entertainment", slug: "/category" },
    tags: [{ id: "5", name: "Entertainment", slug: "/category" }],
  },
  {
    id: "s7-5",
    title: "Half a million people have seen me naked",
    content: "",
    excerpt:
      "Twitch has quickly become a household name after its acquisition by Amazon. You can watch strangers livestream just about anything these days.",
    featuredImage: "/assets/imgs/news/thumb-9.jpg",
    slug: "/single",
    publishedAt: "2025-04-15",
    status: "published",
    author: { id: "1", name: "Steven Kenedy", email: "", slug: "/author" },
    category: { id: "5", name: "World", slug: "/category" },
    tags: [{ id: "6", name: "World", slug: "/category" }],
  },
  {
    id: "s7-6",
    title: "What Is Your True ‘Character’? And Who’s to Judge It?",
    content: "",
    excerpt:
      "Marjorie Garber’s new book prods at confusion surrounding the word — its philosophical roots, literary history, political uses and inadvertent comedy.",
    featuredImage: "/assets/imgs/news/news-4.jpg",
    slug: "/single",
    publishedAt: "2025-04-15",
    status: "published",
    author: { id: "1", name: "Steven Kenedy", email: "", slug: "/author" },
    category: { id: "6", name: "Books", slug: "/category" },
    tags: [],
  },
  {
    id: "s7-7",
    title: "How the United Arab Emirates Set Its Sights on Mars",
    content: "",
    excerpt: "The launch of the Hope orbiter was delayed because of weather. The goal is for it to make contributions to research on the red planet.",
    slug: "/single",
    publishedAt: "2025-04-15",
    status: "published",
    author: { id: "1", name: "Steven Kenedy", email: "", slug: "/author" },
    category: { id: "7", name: "Science", slug: "/category" },
    tags: [],
  },
  {
    id: "s7-8",
    title: "A Big California Quake Just Got ‘a Little Likelier’",
    content: "",
    excerpt: "A new analysis puts the likelihood of an earthquake slightly higher than earlier forecasts.",
    slug: "/single",
    publishedAt: "2025-04-15",
    status: "published",
    author: { id: "1", name: "Steven Kenedy", email: "", slug: "/author" },
    category: { id: "8", name: "Science", slug: "/category" },
    tags: [],
  },
  {
    id: "s7-9",
    title: "A Record 5.4 Million Americans Have Lost Health Insurance",
    content: "",
    excerpt:
      "California’s governor announced a sweeping rollback of the state’s reopening and Los Angeles and San Diego school districts will be online-only in the fall.",
    slug: "/single",
    publishedAt: "2025-04-15",
    status: "published",
    author: { id: "1", name: "Steven Kenedy", email: "", slug: "/author" },
    category: { id: "9", name: "Health", slug: "/category" },
    tags: [],
  },
];

export default function Section7({ articles = defaultArticles, className = "" }: Section7Props) {
  const big = articles[0];
  const medium = articles.slice(1, 5);
  const rightImage = articles[5];
  const rightText = articles.slice(6, 9);

  return (
    <>
      <section className={`recent-new mb-30 ${className}`}>
        <div className="row vertical-divider overflow-visible">
          <div className="col-lg-9 col-md-12">
            <h5 className="font-weight-bold widget-header widget-header-style-3 mb-20">
              <span className="d-inline-block block mb-10 widget-title font-family-normal"># Recent posts</span>
              <span className="line-dots" />
            </h5>
            <div className="loop-grid-3">
              {big && (
                <article className="row ">
                  <div className="col-md-6 mb-md-0 mb-sm-3">
                    <figure className="mb-0">
                      <Link href={big.slug}>
                        <Image className="cover-image" src={big.featuredImage || "/assets/imgs/news/news-15.jpg"} alt={big.title} width={441} height={328} />
                      </Link>
                      <span className="post-format position-top-right text-uppercase font-small">
                        <i className="ti-stats-up" />
                      </span>
                    </figure>
                  </div>
                  <div className="col-md-6 align-self-center">
                    <div className="post-content text-center plr-5-percent">
                      <div className="entry-meta meta-0 mb-15 font-small">
                        {(big.tags?.length ? big.tags : [big.category]).map((tag, i) => (
                          <Link key={i} href={tag.slug}>
                            <span className="post-cat position-relative"># {tag.name}</span>
                          </Link>
                        ))}
                      </div>
                      <h2 className="post-title mb-30 position-relative divider-wave">
                        <Link href={big.slug}>{big.title}</Link>
                      </h2>
                      <p className="excerpt">{big.excerpt}</p>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="horizontal-divider mt-15 mb-15" />
                  </div>
                </article>
              )}
              <div className="row vertical-divider">
                <div className="col-md-8">
                  {medium.map((article, index) => (
                    <article key={article.id} className="row ">
                      <div className="col-md-4">
                        <figure className="mb-md-0 mb-sm-3">
                          <Link href={article.slug}>
                            <Image className="cover-image" src={article.featuredImage || "/assets/imgs/news/thumb-2.jpg"} alt={article.title} width={183} height={183} />
                          </Link>
                        </figure>
                      </div>
                      <div className="col-md-8 pl-0">
                        <div className="entry-meta meta-0 mb-15 font-small">
                          <Link href={article.category.slug}>
                            <span className="post-cat position-relative"># {article.category.name}</span>
                          </Link>
                        </div>
                        <h6 className="post-title mb-20 font-weight-bold">
                          <Link href={article.slug}>{article.title}</Link>
                        </h6>
                        <p className="excerpt mb-0">{article.excerpt}</p>
                      </div>
                      {index < medium.length - 1 && (
                        <div className="col-md-12">
                          <div className="horizontal-divider mt-15 mb-15" />
                        </div>
                      )}
                    </article>
                  ))}
                </div>
                <div className="col-md-4">
                  {rightImage && (
                    <article className="">
                      <figure className="mb-15">
                        <Link href={rightImage.slug}>
                          <Image className="cover-image" src={rightImage.featuredImage || "/assets/imgs/news/news-4.jpg"} alt={rightImage.title} width={286} height={214} />
                        </Link>
                      </figure>
                      <h6 className="post-title font-weight-bold mb-10">
                        <Link href={rightImage.slug}>{rightImage.title}</Link>
                      </h6>
                      <p className="excerpt">{rightImage.excerpt}</p>
                      <div className="horizontal-divider mt-15 mb-15" />
                    </article>
                  )}
                  {rightText.map((article, index) => (
                    <article key={article.id} className="">
                      <h6 className="post-title mb-10 font-weight-bold">
                        <Link href={article.slug}>{article.title}</Link>
                      </h6>
                      <p className="excerpt mb-0">{article.excerpt}</p>
                      {index < rightText.length - 1 ? <div className="horizontal-divider mt-15 mb-15" /> : null}
                    </article>
                  ))}
                </div>
              </div>
              {/*Start pagination */}
              <div className="pagination-area pt-30 border-top-2 mt-30 font-heading ">
                <div className="container">
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="single-wrap d-flex">
                        <nav aria-label="More articles">
                          <ul className="pagination">
                            <li className="page-item">
                              <Link className="page-link" href="/latest">
                                View all latest →
                              </Link>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* End pagination  */}
            </div>
          </div>
          <Sidebar display="d-none" />
        </div>
      </section>
    </>
  );
}
