import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
    return (
        <main className="main-bg">
            {/* 背景ギアSVG（レゴテクニック風・歯を外向きに修正） */}

            {/* <Header /> */}
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
            <Footer />
        </main>
    );
} 