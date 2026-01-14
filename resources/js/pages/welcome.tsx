import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [scrolled, setScrolled] = useState(false);
    const [navOpen, setNavOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setNavOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <Head title="BalonData - Ghana's #1 Data Reseller Platform">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800,900" rel="stylesheet" />
            </Head>
            
            <div className="min-h-screen bg-background overflow-x-hidden">
                {/* Navigation */}
                <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                    scrolled 
                        ? 'bg-primary/95 backdrop-blur-md shadow-xl' 
                        : 'bg-primary'
                } border-b border-primary-foreground/10`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center">
                              <img src='/balondata.jpeg' alt="BalonData" className="w-32 h-16 rounded-2xl" />
                            </div>
                            <button
                                className="lg:hidden flex items-center px-3 py-2 border rounded text-primary-foreground border-primary-foreground/30 focus:outline-none"
                                onClick={() => setNavOpen(!navOpen)}
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div className="hidden lg:flex space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={auth.user.role === 'admin' ? route('admin.dashboard') :  route('dashboard')}
                                        className="px-6 py-2 bg-secondary text-secondary-foreground font-semibold rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('register')}
                                            className="px-6 py-2 bg-accent text-accent-foreground font-medium rounded-full hover:bg-accent/80 hover:-translate-y-0.5 transition-all duration-300"
                                        >
                                            Get Started
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="px-6 py-2 border border-primary-foreground/30 text-primary-foreground font-medium rounded-full hover:bg-primary-foreground/10 hover:-translate-y-0.5 transition-all duration-300"
                                        >
                                            Sign In
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative mt-7">
                    <div className="max-w-6xl mx-auto text-center z-10 pt-20">
                        <div className="mb-8">
                            <span className="inline-block px-4 py-2 bg-accent/20 text-accent-foreground rounded-full text-sm font-medium mb-6">
                                🚀 Ghana's Leading Data Platform
                            </span>
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-8 leading-tight">
                            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                Start Your Data Business
                            </span>
                            <br />
                            <span className="text-foreground">
                                Today
                            </span>
                        </h1>
                        
                        <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
                            Join thousands of entrepreneurs making money selling data bundles with our reliable platform.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                            {auth.user ? (
                                <Link
                                    href={auth.user.role === 'admin' ? route('admin.dashboard') :  route('dashboard')}
                                    className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform hover:scale-105"
                                >
                                    Go to Dashboard →
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform hover:scale-105"
                                    >
                                        Start Earning Now →
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="w-full sm:w-auto px-8 py-4 border-2 border-primary text-primary font-semibold text-lg rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <div className="bg-card p-6 rounded-2xl shadow-xl border border-border hover:shadow-2xl transition-all duration-300">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Instant Delivery</h3>
                                <p className="text-muted-foreground">Data bundles delivered within minutes. No delays, no hassles.</p>
                            </div>
                            
                            <div className="bg-card p-6 rounded-2xl shadow-xl border border-border hover:shadow-2xl transition-all duration-300">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Best Prices</h3>
                                <p className="text-muted-foreground">Cheapest data rates in Ghana. Maximize your profits with our wholesale prices.</p>
                            </div>
                            
                            <div className="bg-card p-6 rounded-2xl shadow-xl border border-border hover:shadow-2xl transition-all duration-300">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">24/7 Support</h3>
                                <p className="text-muted-foreground">Round-the-clock customer support to help grow your business.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-6">
                            Ready to Start Your Data Empire?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            Join BalonData today and start earning from day one.
                        </p>
                        {!auth.user && (
                            <Link
                                href={route('register')}
                                className="inline-block px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform hover:scale-105"
                            >
                                Get Started Free →
                            </Link>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}