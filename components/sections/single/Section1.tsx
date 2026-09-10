import Link from "next/link";
import { Article, Author } from "@/types";
import Image from "next/image";

interface SingleSection1Props {
  article?: Article;
  author?: Author;
  className?: string;
  showTools?: boolean;
}

export default function Section1({
  article = {
    id: 1,
    title: "The effect of livestock on the physiological condition of roe deer is modulated by habitat quality",
    content: "",
    excerpt: "",
    slug: "/single",
    publishedAt: new Date("2025-04-15"),
    status: "published",
    readTime: 8,
    author: {
      id: 1,
      name: "Barbara Cartland",
      email: "barbara@example.com",
      slug: "/author/barbara-cartland",
      avatar: "/assets/imgs/authors/author-3.jpg",
    },
    category: {
      id: 1,
      name: "Science",
      slug: "/category/science",
    },
  },
  author = {
    id: 1,
    name: "Barbara Cartland",
    email: "barbara@example.com",
    slug: "/author/barbara-cartland",
    avatar: "/assets/imgs/authors/author-3.jpg",
  },
  className = "",
  showTools = true,
}: SingleSection1Props) {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <div className={`entry-header entry-header-style-1 mb-30 mt-50 ${className}`}>
        <h1 className="entry-title mb-30 font-weight-500">{article.title}</h1>
        <div className="row">
          <div className="col-lg-6">
            <div className="entry-meta align-items-center meta-2 font-small color-muted">
              <p className="mb-5">
                <a className="author-avatar" href="#">
                  <Image className="img-circle" src={author.avatar || "/assets/imgs/authors/author-3.jpg"} alt={author.name} width={50} height={50} />
                </a>
                By
                <Link href={`/author/${author.slug}`}>
                  <span className="author-name font-weight-bold">{author.name}</span>
                </Link>
              </p>
              <span className="me-10">{formatDate(article.publishedAt)}</span>
              <span className="has-dot">{article.readTime} mins read</span>
            </div>
          </div>
          {showTools && (
            <div className="col-lg-6 text-end">
              <div className="single-tools">
                <div className="entry-meta align-items-center meta-2 font-small color-muted">
                  <span className="mr-15">
                    <span className="me-2">Font size</span>
                    <i className="fonts-size-zoom-in ti-zoom-in mr-5" />
                    <i className="fonts-size-zoom-out ti-zoom-out" />
                  </span>
                  <a className="single-print mr-15">
                    <span>
                      <i className="ti-printer mr-5" />
                      Print
                    </span>
                  </a>
                  <div className="vline-space d-inline-block" />
                  <a href="#">
                    <span>
                      <i className="ti-email mr-5" />
                      Email
                    </span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
