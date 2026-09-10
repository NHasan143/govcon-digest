"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import VerticalTicker from "@/util/VerticalTicker";
import { HeroSectionProps } from "@/types";
import ModernSlider, { SwiperSlide } from "@/components/ui/ModernSlider";

const newsItems: string[] = ["Monday, July 13, 2025", "Get the Today's Paper", "33° Sunny, Washington DC"];

// Type definition for post data
interface PostData {
    id: number;
    image: string;
    date: string;
    categories: string[];
    title: string;
    slug: string;
}

// Data arrays for posts
const highlightPosts: PostData[] = [
    {
        id: 1,
        image: "/assets/imgs/news/slide-1.jpg",
        date: "25 Jan 2025",
        categories: ["World", "Travel"],
        title: "Gyms Add More Obstacles to Fitness Training",
        slug: "/single",
    },
    {
        id: 2,
        image: "/assets/imgs/news/slide-2.jpg",
        date: "25 Jan 2025",
        categories: ["World", "Travel"],
        title: "China Imposes Tit-for-Tat Sanctions on Three American Lawmakers",
        slug: "/single",
    },
    {
        id: 3,
        image: "/assets/imgs/news/slide-5.jpg",
        date: "25 Jan 2025",
        categories: ["World", "Travel"],
        title: "Best Guess on When Business Travel Will Recover? It Could be Years",
        slug: "/single",
    },
    {
        id: 4,
        image: "/assets/imgs/news/slide-3.jpg",
        date: "25 Jan 2025",
        categories: ["World", "Travel"],
        title: "Tucker Carlson to Take 'Long-Planned' Vacation After Writer's Resignation",
        slug: "/single",
    },
];

const trendingPosts: PostData[] = [
    {
        id: 1,
        image: "/assets/imgs/news/slide-11.jpg",
        date: "25 Jan 2025",
        categories: ["World", "Travel"],
        title: "Tesla's Cooking Up A New Way To Wire Its Cars, Report Says",
        slug: "/single",
    },
    {
        id: 2,
        image: "/assets/imgs/news/slide-10.jpg",
        date: "25 Jan 2025",
        categories: ["World", "Travel"],
        title: "Tesla's Cooking Up A New Way To Wire Its Cars, Report Says",
        slug: "/single",
    },
    {
        id: 3,
        image: "/assets/imgs/news/slide-7.jpg",
        date: "25 Jan 2025",
        categories: ["World", "Travel"],
        title: "Tesla's Cooking Up A New Way To Wire Its Cars, Report Says",
        slug: "/single",
    },
    {
        id: 4,
        image: "/assets/imgs/news/slide-12.jpg",
        date: "25 Jan 2025",
        categories: ["World", "Travel"],
        title: "Tesla's Cooking Up A New Way To Wire Its Cars, Report Says",
        slug: "/single",
    },
    {
        id: 5,
        image: "/assets/imgs/news/slide-8.jpg",
        date: "25 Jan 2025",
        categories: ["World", "Travel"],
        title: "Tesla's Cooking Up A New Way To Wire Its Cars, Report Says",
        slug: "/single",
    },
    {
        id: 6,
        image: "/assets/imgs/news/slide-9.jpg",
        date: "25 Jan 2025",
        categories: ["World", "Travel"],
        title: "Tesla's Cooking Up A New Way To Wire Its Cars, Report Says",
        slug: "/single",
    },
];

interface SliderSettings {
    slidesPerView: number;
    spaceBetween: number;
    loop: boolean;
    autoplay: boolean;
    autoplayDelay: number;
    effect: "slide" | "fade" | "cube" | "coverflow" | "flip";
    navigation: boolean;
    pagination: boolean;
    breakpoints?: {
        [key: number]: {
            slidesPerView: number;
            spaceBetween: number;
        };
    };
}

// Post thumb component for reusability
const PostThumb = ({ post, isPriority = false }: { post: PostData; isPriority?: boolean }) => (
    <div className="post-thumb position-relative" role="article" aria-labelledby={`post-title-${post.id}`}>
        <div className="thumb-overlay img-hover-slide transition-04s position-relative">
            <Link className="img-link" href={post.slug} aria-label={`Read more about ${post.title}`} />
            <div className="post-image-container">
                <Image
                    src={post.image}
                    alt={`Featured image for: ${post.title}`}
                    width={410}
                    height={550}
                    className="post-image"
                    priority={isPriority}
                    loading={isPriority ? "eager" : "lazy"}
                    onError={(e) => {
                        // Fallback to a default image if loading fails
                        const target = e.target as HTMLImageElement;
                        target.src = "/assets/imgs/news/news-1.jpg";
                    }}
                />
            </div>
            <div className="post-content-overlay transition-04s p-20">
                <div className="entry-meta mb-20 text-uppercase font-small text-white">
                    <span className="create-date mr-15" aria-label="Publication date">
                        {post.date}
                    </span>
                    {post.categories.map((category, index) => (
                        <Link key={index} href="/category" aria-label={`Browse ${category} category`}>
                            <span className="post-cat text-white position-relative">{category}</span>
                        </Link>
                    ))}
                </div>
                <h4 className="post-title" id={`post-title-${post.id}`}>
                    <Link className="text-white" href={post.slug} aria-label={`Read full article: ${post.title}`}>
                        {post.title}
                    </Link>
                </h4>
            </div>
        </div>
    </div>
);

export default function Section1({ articles = [], title, subtitle, showSlider = true, autoPlay = true, slidesToShow = 3 }: HeroSectionProps = {}) {
    const mainSlider = useRef<any>(null);
    const [activeTab, setActiveTab] = useState("highlight");

    const mainSettings: SliderSettings = {
        slidesPerView: slidesToShow,
        spaceBetween: 0,
        loop: true,
        autoplay: autoPlay,
        autoplayDelay: 3000,
        effect: "slide",
        navigation: false,
        pagination: false,
        breakpoints: {
            1024: {
                slidesPerView: 3,
                spaceBetween: 0,
            },
            991: {
                slidesPerView: 2,
                spaceBetween: 0,
            },
            480: {
                slidesPerView: 2,
                spaceBetween: 0,
            },
            320: {
                slidesPerView: 1,
                spaceBetween: 0,
            },
        },
    };

    const handleTabChange = (tabName: string) => {
        setActiveTab(tabName);
    };

    return (
        <>
            {/*Featured post Start*/}
            <div className="home-featured mb-20 mt-30">
                {/*Tab Nav  */}
                <div className="row font-heading mb-20">
                    <div className="col-md-6 text-uppercase">
                        <nav className="tab-nav font-weight-bold">
                            <div className="nav nav-tabs" role="tablist">
                                <button className={`nav-item nav-link nav-tab ${activeTab === "highlight" ? "active" : ""}`} onClick={() => handleTabChange("highlight")} role="tab" aria-controls="nav-highlight" aria-selected={activeTab === "highlight"}>
                                    Today Highlight
                                </button>
                                <button className={`nav-item nav-link nav-tab ${activeTab === "trending" ? "active" : ""}`} onClick={() => handleTabChange("trending")} role="tab" aria-controls="nav-trending" aria-selected={activeTab === "trending"}>
                                    Hot &amp; Trending
                                </button>
                            </div>
                        </nav>
                    </div>
                    <div className="col-md-6 text-end d-none d-md-block">
                        <div id="date-time text-end" className="d-inline-table">
                            <VerticalTicker items={newsItems} pause={3000} speed={800} animation="slide" showItems={1} mousePause={false} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="tab-content" id="nav-tabContent">
                            <div className={`tab-pane fade ${activeTab === "highlight" ? "show active" : ""}`} id="nav-highlight" role="tabpanel" aria-labelledby="nav-highlight">
                                <ModernSlider settings={mainSettings} className="home-featured-1 post-module-1">
                                    {highlightPosts.map((post, index) => (
                                        <SwiperSlide key={post.id}>
                                            <PostThumb post={post} isPriority={index < 2} />
                                        </SwiperSlide>
                                    ))}
                                </ModernSlider>
                                {/*Tab content 1*/}
                            </div>
                            {/*end tab content 1*/}
                            <div className={`tab-pane fade ${activeTab === "trending" ? "show active" : ""}`} id="nav-trending" role="tabpanel" aria-labelledby="nav-trending">
                                <ModernSlider settings={mainSettings} className="home-featured-1 post-module-1">
                                    {trendingPosts.map((post, index) => (
                                        <SwiperSlide key={post.id}>
                                            <PostThumb post={post} isPriority={index < 2} />
                                        </SwiperSlide>
                                    ))}
                                </ModernSlider>
                                {/*Tab content 2*/}
                            </div>
                            {/*end tab content 2*/}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
