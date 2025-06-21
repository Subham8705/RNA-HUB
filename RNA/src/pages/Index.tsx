import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import "./PlatformCard.css"; // Make sure the CSS is in this path

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section
        className="w-full h-[85vh] relative bg-cover bg-center bg-no-repeat bg-gradient-to-br from-primary/10 via-background to-accent/10"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dpa0sb1tm/image/upload/c_crop,w_1000,h_1000,g_auto/v1745566595/background_czwzgo.jpg')",
        }}
      >
        <div className="absolute top-12 left-12 max-w-3xl text-left">
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
            RNA HUB
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mt-4">
            A web-based platform that provides AI-driven RNA 3D structure prediction and cancer biomarker detection, offering tools for researchers, doctors, students and biotech professionals.
          </p>
          <div className="flex flex-wrap gap-4 pt-6">
            <Button asChild size="lg">
              <Link to="/rna-structure">Explore RNA Structures</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/research">Browse Research</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2 text-white">Our Platform</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-white/60">
            Comprehensive genomic research tools and resources
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {[
            {
              title: "RNA Structure And 3D Generator",
              description: "Learn about our research team and mission",
              link: "/rna-structure",
              icon: "🔬",
            },
            {
              title: "Cancer Biomarker Detector",
              description: "Access our collection of RNA and DNA research publications",
              link: "/predict",
              icon: "🧪",
            },
            {
              title: "Research Library",
              description: "Analyze RNA structures with our advanced tools",
              link: "/rna-structure",
              icon: "📚",
            },
          ].map((feature, index) => (
            <div key={index} className="card">
              <div className="card__border"></div>
              <div className="card_title__container">
                <div className="text-4xl mb-2">{feature.icon}</div>
                <h3 className="card_title text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="card_paragraph text-sm">{feature.description}</p>
              </div>
              <div className="flex-grow" />
              <Link to={feature.link} className="button mt-4 text-center block">
                Explore
              </Link>
            </div>
          ))}
        </div>
      </section>
      {/* About Us Section */}

        <section id="about-us" className="bg-gradient-to-r from-purple-300 via-purple-900 to-purple-900 text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4 text-center">About Us</h2>
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg max-w-3xl mx-auto mb-6">
              We are a team of scientists and engineers committed to advancing genomic research through innovative AI-driven tools. Our mission is to revolutionize the understanding of RNA and DNA structures and their implications in health and disease.
            </p>
            <Button asChild size="lg">
              <Link to="/about">Learn More About Our Team</Link>
            </Button>
          </div>
        </section>


      {/* CTA Section */}
      <section className="bg-accent/20 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Ready to Start Your Research?
        </h2>
        <p className="text-white/50 max-w-2xl mx-auto mb-6">
          Our comprehensive platform provides everything you need to advance your genomic research.
        </p>
        <Button asChild size="lg">
          <Link to="/rna-structure">Start Now</Link>
        </Button>
      </section>
    </div>
  );
};

export default Home;
