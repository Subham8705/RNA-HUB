import { Card, CardContent } from "@/components/ui/card";

const AboutUs = () => {
  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">About RNA HUB</h1>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg mb-4">
          A web-based platform that provides AI-driven RNA 3D structure prediction and cancer biomarker detection, offering tools for researchers, doctors, students and biotech professionals.
          </p>
          <p className="text-lg">
          Our platform serves as a hub where doctors, nurses, researchers and scientists can generate the 3D structure of RNA and detect cancer biomarkers present in the RNA using Deep learning and Machine Learning Models to deepen their understanding of RNA and its structure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p>
              We envision a world where genomic insights are readily accessible to researchers and clinicians, enabling personalized treatments and revolutionary approaches to human health. RNA HUB strives to be at the forefront of this genomic revolution, providing the tools and knowledge needed to transform complex data into life-changing applications.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Our Approach</h2>
            <p>
              We combine advanced computational techniques with a deep understanding of molecular biology to create intuitive, powerful tools for RNA and DNA analysis. Our interdisciplinary team works at the intersection of bioinformatics, structural biology, and clinical genomics, ensuring that our platform remains at the cutting edge of scientific discovery.
            </p>
          </div>
        </div>
      </section>

      {/* <section>
        <h2 className="text-2xl font-bold mb-6 text-center">Our Research Team</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Naina",
              role: "idk some role",
              expertise: "Structural RNA Biology",
              bio: "Naina leads our research initiatives with over 15 years of experience in RNA structure analysis and computational genomics."
            },
            {
              name: "Gowthami",
              role: "idkkkkk some role",
              expertise: "Computational Genomics",
              bio: "Specializing in machine learning approaches to predict RNA secondary structures from sequence data."
            },
            {
              name: "Venkat",
              role: "idkkkkk some role",
              expertise: "Computational Genomics",
              bio: "Specializing in machine learning approaches to predict RNA secondary structures from sequence data."
            },
            {
              name: "Subham",
              role: "Good boy",
              expertise: "Computational Genomics",
              bio: "Specializing in machine learning approaches to predict RNA secondary structures from sequence data."
            },
          ].map((member, index) => (
            <Card key={index} className="bg-white dark:bg-zinc-900">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="font-medium text-accent-foreground mb-1">{member.role}</p>
                <p className="text-sm text-muted-foreground mb-3">Expertise: {member.expertise}</p>
                <p className="text-sm">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section> */}
    </div>
  );
};

export default AboutUs;
