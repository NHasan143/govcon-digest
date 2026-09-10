import MoreArticles from "@/components/elements/MoreArticles";
import Link from "next/link";
import { Article, Author, Tag } from "@/types";
import Image from "next/image";

interface RelatedArticle {
    id: string | number;
    title: string;
    excerpt: string;
    slug: string;
    category: {
        name: string;
        slug: string;
    };
    featuredImage: string;
    formatIcon?: string;
}

interface SingleSection3Props {
    article?: Article;
    author?: Author;
    tags?: Tag[];
    relatedArticles?: RelatedArticle[];
    className?: string;
    showNewsletter?: boolean;
    showRelated?: boolean;
}

export default function Section3({
    article = {
        id: 1,
        title: "The effect of livestock on the physiological condition of roe deer is modulated by habitat quality",
        content: "Gosh jaguar ostrich quail one excited dear hello and bound and the and bland moral misheard roadrunner flapped lynx far that and jeepers giggled far and far bald that roadrunner python inside held shrewdly the manatee.",
        excerpt: "Gosh jaguar ostrich quail one excited dear hello and bound and the and bland moral misheard roadrunner flapped lynx far that and jeepers giggled far and far bald that roadrunner python inside held shrewdly the manatee.",
        slug: "/single",
        publishedAt: new Date(),
        status: "published",
        author: {
            id: 1,
            name: "Barbara Cartland",
            email: "barbara@example.com",
            slug: "/author/barbara-cartland",
            avatar: "/assets/imgs/authors/author-3.jpg",
            bio: "You should write because you love the shape of stories and sentences and the creation of different words on a page.",
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
        bio: "You should write because you love the shape of stories and sentences and the creation of different words on a page.",
    },
    tags = [
        { id: 1, name: "deer", slug: "/tag/deer" },
        { id: 2, name: "nature", slug: "/tag/nature" },
        { id: 3, name: "conserve", slug: "/tag/conserve" },
    ],
    relatedArticles = [
        {
            id: 1,
            title: "The World Caters to Average People and Mediocre Lifestyles",
            excerpt: "These people envy me for having a lifestyle they don't have, but the truth is, sometimes I envy their lifestyle instead. Struggling to sell one multi-million dollar home currently.",
            slug: "/single",
            category: { name: "Fashion", slug: "/category/fashion" },
            featuredImage: "/assets/imgs/news/news-11.jpg",
            formatIcon: "mdi-flash-on",
        },
        {
            id: 2,
            title: "Why Teamwork Really Makes The Dream Work",
            excerpt: "We live in a world where disruption and dynamism reign supreme and businesses must be ready to adapt to the many unpredictable changes that come with this.",
            slug: "/single",
            category: { name: "Technology", slug: "/category/technology" },
            featuredImage: "/assets/imgs/news/news-12.jpg",
            formatIcon: "mdi-favorite",
        },
        {
            id: 3,
            title: "9 Things I Love About Shaving My Head During Quarantine",
            excerpt: "At the Emmys, broadcast scripted shows created by people of color gained ground relative to those pitched by White show creators, while broadcast scripted shows.",
            slug: "/single",
            category: { name: "Sport", slug: "/category/sport" },
            featuredImage: "/assets/imgs/news/news-13.jpg",
            formatIcon: "mdi-audiotrack",
        },
    ],
    className = "",
    showNewsletter = true,
    showRelated = true,
}: SingleSection3Props) {
    return (
        <>
            {/*figure*/}
            <article className={`entry-wraper mb-50 ${className}`}>
                <div className="excerpt mb-30">
                    <p>{article.excerpt}</p>
                </div>
                <div className="entry-left-col">
                    <div className="social-sticky">
                        <a href="#">
                            <i className="ti-facebook" />
                        </a>
                        <a href="#">
                            <i className="ti-twitter" />
                        </a>
                        <a href="#">
                            <i className="ti-heart" />
                        </a>
                        <a href="#">
                            <i className="ti-email" />
                        </a>
                    </div>
                </div>
                <div className="entry-main-content dropcap ">
                    <p>
                        Gosh jaguar ostrich quail one excited dear hello and <a href="#">bound</a>
                        <sup>
                            <a href="#">[1]</a>
                        </sup>
                        and the and bland moral misheard roadrunner flapped lynx far that and jeepers giggled far and far bald that roadrunner python inside held shrewdly the manatee.
                    </p>
                    <hr className="wp-block-separator is-style-dots" />
                    <p>
                        Thanks sniffed in hello after in foolhardy and some far purposefully much one at the much conjointly leapt skimpily that quail sheep some goodness <a href="#">nightingale</a> the instead exited expedient up far ouch mellifluous altruistic and and lighted more instead much when ferret but the.
                    </p>
                    <figure className="wp-block-gallery columns-3 wp-block-image">
                        <ul className="blocks-gallery-grid">
                            <li className="blocks-gallery-item">
                                <a href="#">
                                    <Image className="border-radius-5 cover-image" src="/assets/imgs/news/thumb-10.jpg" alt="News gallery image 1" width={256} height={256} />
                                </a>
                            </li>
                            <li className="blocks-gallery-item">
                                <a href="#">
                                    <Image className="border-radius-5 cover-image" src="/assets/imgs/news/thumb-11.jpg" alt="News gallery image 2" width={256} height={256} />
                                </a>
                            </li>
                            <li className="blocks-gallery-item">
                                <a href="#">
                                    <Image className="border-radius-5 cover-image" src="/assets/imgs/news/thumb-12.jpg" alt="News gallery image 3" width={256} height={256} />
                                </a>
                            </li>
                        </ul>
                        <figcaption>
                            <i className="ti-credit-card mr-5" />
                            Image credit: Behance
                        </figcaption>
                    </figure>
                    <hr className="section-divider" />
                    <p>
                        Yet more some certainly yet alas abandonedly whispered <a href="#">intriguingly</a>
                        <sup>
                            <a href="#">[2]</a>
                        </sup>
                        well extensive one howled talkative admonishingly below a rethought overlaid dear gosh activated less <a href="#">however</a> hawk yet oh scratched ostrich some outside crud irrespective lightheartedly and much far amenably that the elephant since when.
                    </p>
                    <h2>The Guitar Legends</h2>
                    <p>
                        Furrowed this in the upset <a href="#">some across</a>
                        <sup>
                            <a href="#">[3]</a>
                        </sup>
                        tiger oh loaded house gosh whispered <a href="#">faltering alas</a>
                        <sup>
                            <a href="#">[4]</a>
                        </sup>
                        ouch cuckoo coward in scratched undid together bit fumblingly so besides salamander heron during the jeepers hello fitting jauntily much smoothly globefish darn blessedly far so along bluebird leopard and.
                    </p>
                    <blockquote>
                        <p>
                            Integer eu faucibus <a href="#">dolor</a>
                            <sup>
                                <a href="#">[5]</a>
                            </sup>
                            . Ut venenatis tincidunt diam elementum imperdiet. Etiam accumsan semper nisl eu congue. Sed aliquam magna erat, ac eleifend lacus rhoncus in.
                        </p>
                    </blockquote>
                    <p>Fretful human far recklessly while caterpillar well a well blubbered added one a some far whispered rampantly whispered while irksome far clung irrespective wailed more rosily and where saluted while black dear so yikes as considering recast to some crass until cow much less and rakishly overdrew consistent for by responsible oh one hypocritical less bastard hey oversaw zebra browbeat a well.</p>
                    <h3>Getting Crypto Rich</h3>
                    <hr className="wp-block-separator is-style-wide" />
                    <div className="wp-block-image">
                        <figure className="alignleft is-resized">
                            <Image className="border-radius-5 cover-image" src="/assets/imgs/news/thumb-13.jpg" alt="post-title" width={200} height={300} />
                            <figcaption>And far contrary smoked some contrary among stealthy</figcaption>
                        </figure>
                    </div>
                    <p>And far contrary smoked some contrary among stealthy engagingly suspiciously a cockatoo far circa sank dully lewd slick cracked llama the much gecko yikes more squirrel sniffed this and the the much within uninhibited this abominable a blubbered overdid foresaw through alas the pessimistic.</p>
                    <p>Gosh jaguar ostrich quail one excited dear hello and bound and the and bland moral misheard roadrunner flapped lynx far that and jeepers giggled far and far bald that roadrunner python inside held shrewdly the manatee.</p>
                    <hr className="section-divider" />
                    <p>Thanks sniffed in hello after in foolhardy and some far purposefully much one at the much conjointly leapt skimpily that quail sheep some goodness nightingale the instead exited expedient up far ouch mellifluous altruistic and and lighted more instead much when ferret but the.</p>
                    {/*Begin Subcrible*/}
                    {showNewsletter && (
                        <div className="border-radius-5 mb-50 border p-30 ">
                            <div className="row justify-content-between">
                                <div className="col-md-5 mb-2 mb-md-0">
                                    <h5 className="font-weight-bold secondfont mb-30 mt-0">Become a member</h5>
                                    <p className="font-small">Get the latest news right in your inbox. We never spam!</p>
                                </div>
                                <div className="col-md-7">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <input type="text" className="form-control" placeholder="Enter your e-mail address" />
                                        </div>
                                        <div className="col-md-12 mt-2">
                                            <button type="submit" className="btn btn-info btn-block">
                                                Subscribe
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/*End Subcrible*/}
                    <p>Yet more some certainly yet alas abandonedly whispered intriguingly well extensive one howled talkative admonishingly below a rethought overlaid dear gosh activated less however hawk yet oh scratched ostrich some outside crud irrespective lightheartedly and much far amenably that the elephant since when.</p>
                </div>
                <div className="entry-bottom mt-50 mb-30 ">
                    <div className="tags">
                        {tags.map((tag) => (
                            <Link key={tag.id} href={tag.slug} rel="tag">
                                {tag.name}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="single-social-share clearfix ">
                    <div className="entry-meta meta-1 font-small color-grey float-start mt-10">
                        <span className="hit-count mr-15">
                            <i className="ti-heart mr-5" />
                            268 likes
                        </span>
                        <span className="hit-count">
                            <i className="ti-star mr-5" />
                            Rate: 9/10
                        </span>
                    </div>
                    <ul className="d-inline-block list-inline float-md-right mt-md-0 mt-4">
                        <li className="list-inline-item">
                            <a className="social-icon facebook-icon text-xs-center" target="_blank" href="#">
                                <i className="ti-facebook" />
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a className="social-icon twitter-icon text-xs-center" target="_blank" href="#">
                                <i className="ti-twitter-alt" />
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a className="social-icon pinterest-icon text-xs-center" target="_blank" href="#">
                                <i className="ti-pinterest" />
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a className="social-icon instagram-icon text-xs-center" target="_blank" href="#">
                                <i className="ti-instagram" />
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="bt-1 border-color-1 mt-30 mb-30" />
                {/*author box*/}
                <div className="author-bio ">
                    <div className="author-image mb-30">
                        <Link href={`/author/${author.slug}`}>
                            <Image src={author.avatar || "/assets/imgs/authors/author-3.jpg"} alt={author.name} className="avatar" width={90} height={90} />
                        </Link>
                    </div>
                    <div className="author-info">
                        <h3>
                            <span className="vcard author">
                                <span className="fn">
                                    <Link href={`/author/${author.slug}`} title={`Posted by ${author.name}`} rel="author">
                                        {author.name}
                                    </Link>
                                </span>
                            </span>
                        </h3>
                        <h5>About author</h5>
                        <div className="author-description">{author.bio}</div>
                        <Link href={`/author/${author.slug}`} className="author-bio-link mb-md-0 mb-3">
                            View all posts
                        </Link>
                        <div className="author-social">
                            <ul className="author-social-icons">
                                <li className="author-social-link-facebook">
                                    <a href="#" target="_blank">
                                        <i className="ti-facebook" />
                                    </a>
                                </li>
                                <li className="author-social-link-twitter">
                                    <a href="#" target="_blank">
                                        <i className="ti-twitter-alt" />
                                    </a>
                                </li>
                                <li className="author-social-link-pinterest">
                                    <a href="#" target="_blank">
                                        <i className="ti-pinterest" />
                                    </a>
                                </li>
                                <li className="author-social-link-instagram">
                                    <a href="#" target="_blank">
                                        <i className="ti-instagram" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/*related posts*/}
                {showRelated && (
                    <div className="related-posts">
                        <h3 className="mb-30">Related posts</h3>
                        <div className="loop-list">
                            {relatedArticles.map((relatedArticle) => (
                                <article key={relatedArticle.id} className="row mb-30 ">
                                    <div className="col-md-4">
                                        <div className="post-thumb position-relative thumb-overlay mb-md-0 mb-3">
                                            <div className="img-hover-slide border-radius-5 position-relative">
                                                <div className="post-image-container">
                                                    <Image src={relatedArticle.featuredImage} alt={relatedArticle.title} width={256} height={256} className="post-image" />
                                                </div>
                                                <Link className="img-link" href={relatedArticle.slug} />
                                                {relatedArticle.formatIcon && (
                                                    <span className="top-right-icon background8">
                                                        <i className={`mdi ${relatedArticle.formatIcon}`} />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-8 align-center-vertical">
                                        <div className="post-content">
                                            <div className="entry-meta meta-0 font-small mb-15">
                                                <Link href={relatedArticle.category.slug}>
                                                    <span className="post-cat background2 color-white"># {relatedArticle.category.name}</span>
                                                </Link>
                                            </div>
                                            <h4 className="post-title mb-15">
                                                <Link href={relatedArticle.slug}>{relatedArticle.title}</Link>
                                            </h4>
                                            <p className="font-medium excerpt">{relatedArticle.excerpt}</p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                )}
                {/*More posts*/}
                <MoreArticles>
                    <h6 className="widget-title mb-30 font-weight-bold text">You might be interested in</h6>
                    <div className="post-block-list post-module-1 post-module-5">
                        <ul className="list-post">
                            <li className="mb-15">
                                <div className="d-flex">
                                    <div className="post-thumb post-thumb-80 d-flex mr-15 border-radius-5 img-hover-scale">
                                        <Link className="color-white" href="/single">
                                            <Image className="cover-image" src="/assets/imgs/news/thumb-1.jpg" alt="newsboard" width={80} height={80} />
                                        </Link>
                                    </div>
                                    <div className="post-content media-body">
                                        <h6 className="post-title mb-10 text-limit-2-row">
                                            <Link href="/single">America's Governors Get Tested for a Virus That Is Testing Them</Link>
                                        </h6>
                                        <div className="entry-meta meta-1 font-x-small color-grey">
                                            <span className="post-on">25 Jun</span>
                                            <span className="hit-count has-dot">126k Views</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="d-flex">
                                    <div className="post-thumb post-thumb-80 d-flex mr-15 border-radius-5 img-hover-scale">
                                        <Link className="color-white" href="/single">
                                            <Image className="cover-image" src="/assets/imgs/news/thumb-2.jpg" alt="newsboard" width={80} height={80} />
                                        </Link>
                                    </div>
                                    <div className="post-content media-body">
                                        <h6 className="post-title mb-10 text-limit-2-row">
                                            <Link href="/single">Bartering Child's Dress for Food: Life in Lebanon's Economic Crisis</Link>
                                        </h6>
                                        <div className="entry-meta meta-1 font-x-small color-grey mt-10">
                                            <span className="post-on">25 April</span>
                                            <span className="hit-count has-dot">37k Views</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </MoreArticles>
            </article>
        </>
    );
}
