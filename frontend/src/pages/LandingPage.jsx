import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <i className="fas fa-utensils text-3xl text-blue-600"></i>
                            <span className="text-2xl font-bold text-gray-900">MenuPlatform</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="nav-link hidden md:flex items-center">
                                <i className="fas fa-sign-in-alt mr-2"></i>
                                Restaurant Login
                            </Link>
                            <Link to="/login" className="md:hidden text-blue-600 text-xl">
                                <i className="fas fa-sign-in-alt"></i>
                            </Link>
                            <Link to="/admin/login" className="nav-link hidden md:flex items-center">
                                <i className="fas fa-user-shield mr-2"></i>
                                Admin
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="gradient-bg text-white py-20 md:py-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob"></div>
                    <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-400 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-sky-400 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-block mb-6">
                            <span className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wider border border-white/30">
                                Digital Menu Solution
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Transform Your Restaurant
                            <span className="block mt-2 text-blue-200">Into Digital Excellence</span>
                        </h1>

                        <p className="text-lg md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto font-light leading-relaxed">
                            Create stunning digital menus, manage your offerings effortlessly, and provide your customers with an exceptional dining experience.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
                            <Link to="/apply" className="w-full sm:w-auto">
                                <button className="btn btn-outline text-lg px-8 py-4 w-full sm:w-auto hover:bg-white hover:text-blue-700 border-2">
                                    <i className="fas fa-rocket mr-2"></i>
                                    Get Started Free
                                </button>
                            </Link>
                            <Link to="/login" className="w-full sm:w-auto">
                                <button className="btn bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-4 w-full sm:w-auto shadow-lg">
                                    <i className="fas fa-sign-in-alt mr-2"></i>
                                    Sign In
                                </button>
                            </Link>
                        </div>

                        <div className="mt-12 flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm md:text-base text-blue-100">
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                                <i className="fas fa-check-circle text-green-400"></i>
                                <span>No Credit Card Required</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                                <i className="fas fa-check-circle text-green-400"></i>
                                <span>Setup in 5 Minutes</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                                <i className="fas fa-check-circle text-green-400"></i>
                                <span>24/7 Support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="section-title">Everything You Need to Succeed</h2>
                        <p className="section-subtitle max-w-2xl mx-auto">Powerful features designed for modern restaurants, cafes, and bars</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        <div className="feature-card group">
                            <div className="feature-icon group-hover:from-blue-600 group-hover:to-blue-800">
                                <i className="fas fa-palette"></i>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Custom Branding</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Customize colors, upload your logo, and create a menu that perfectly matches your restaurant's identity and style.
                            </p>
                        </div>

                        <div className="feature-card group">
                            <div className="feature-icon group-hover:from-blue-600 group-hover:to-blue-800">
                                <i className="fas fa-mobile-alt"></i>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Mobile Optimized</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Beautiful responsive design that looks perfect on smartphones, tablets, and desktops for all your customers.
                            </p>
                        </div>

                        <div className="feature-card group">
                            <div className="feature-icon group-hover:from-blue-600 group-hover:to-blue-800">
                                <i className="fas fa-bolt"></i>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Real-Time Updates</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Update menu items, prices, and availability instantly. Changes go live immediately for your customers.
                            </p>
                        </div>

                        <div className="feature-card group">
                            <div className="feature-icon group-hover:from-blue-600 group-hover:to-blue-800">
                                <i className="fas fa-images"></i>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Rich Media</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Upload high-quality images for your dishes to entice customers and showcase your culinary creations.
                            </p>
                        </div>

                        <div className="feature-card group">
                            <div className="feature-icon group-hover:from-blue-600 group-hover:to-blue-800">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Analytics Ready</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Track menu performance and customer preferences to make data-driven decisions for your business.
                            </p>
                        </div>

                        <div className="feature-card group">
                            <div className="feature-icon group-hover:from-blue-600 group-hover:to-blue-800">
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Secure & Reliable</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Enterprise-grade security and 99.9% uptime guarantee to keep your menu always accessible.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="section-title">Get Started in 3 Simple Steps</h2>
                        <p className="section-subtitle">Launch your digital menu in minutes</p>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-12 relative">
                            {/* Connector Line (Desktop) */}
                            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-gray-100 -z-10"></div>

                            <div className="text-center relative">
                                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-3xl font-bold mx-auto mb-6 border-4 border-white shadow-lg">
                                    1
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Apply & Get Approved</h3>
                                <p className="text-gray-600">
                                    Fill out a quick application form with your restaurant details. Our team reviews and approves within 24 hours.
                                </p>
                            </div>

                            <div className="text-center relative">
                                <div className="w-20 h-20 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 text-3xl font-bold mx-auto mb-6 border-4 border-white shadow-lg">
                                    2
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Customize Your Menu</h3>
                                <p className="text-gray-600">
                                    Upload your logo, set your brand colors, add categories, and populate your menu with delicious items.
                                </p>
                            </div>

                            <div className="text-center relative">
                                <div className="w-20 h-20 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 text-3xl font-bold mx-auto mb-6 border-4 border-white shadow-lg">
                                    3
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Share & Grow</h3>
                                <p className="text-gray-600">
                                    Get your unique menu URL, share it with customers via QR codes, social media, or your website.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 gradient-bg text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl mix-blend-multiply filter opacity-50"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl mix-blend-multiply filter opacity-50"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Restaurant?</h2>
                        <p className="text-xl md:text-2xl mb-10 text-blue-100">
                            Join hundreds of restaurants already using MenuPlatform
                        </p>
                        <Link to="/apply">
                            <button className="btn btn-outline text-xl px-12 py-5 hover:bg-white hover:text-blue-700 border-2">
                                <i className="fas fa-rocket mr-2"></i>
                                Start Your Free Trial
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <i className="fas fa-utensils text-2xl text-blue-500"></i>
                                <span className="text-xl font-bold text-white">MenuPlatform</span>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                The modern way to manage and display your restaurant menu digitally.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Examples</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Support</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                        <p>&copy; 2025 MenuPlatform. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
