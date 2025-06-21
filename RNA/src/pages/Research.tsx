
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const researchData = [
  {
    id: 1,
    title: "Structural Analysis of SARS-CoV-2 RNA Genome",
    authors: "Johnson S., Peterson M., Williams R.",
    journal: "Nature Genomics",
    year: 2023,
    category: "RNA",
    tags: ["viral RNA", "COVID-19", "structure prediction"],
    abstract: "This study investigates the secondary and tertiary structures of the SARS-CoV-2 RNA genome, providing insights into potential therapeutic targets for antiviral development."
  },
  {
    id: 2,
    title: "Computational Methods for tRNA Structure Prediction",
    authors: "Chen L., Rodriguez E., Smith A.",
    journal: "Bioinformatics Advances",
    year: 2022,
    category: "RNA",
    tags: ["tRNA", "structure prediction", "algorithms"],
    abstract: "A comprehensive review of computational approaches for predicting tRNA structures, with benchmarking of current methods and proposed improvements."
  },
  {
    id: 3,
    title: "Non-coding RNAs in Neurological Disorders",
    authors: "Patel A., Kim R., Johnson S.",
    journal: "RNA Biology",
    year: 2023,
    category: "RNA",
    tags: ["ncRNA", "neurology", "disease mechanisms"],
    abstract: "This research explores the role of various non-coding RNAs in the pathogenesis of neurological disorders, highlighting potential biomarkers and therapeutic targets."
  },
  {
    id: 4,
    title: "DNA Methylation Patterns in Cancer Progression",
    authors: "Williams R., Chen L., Davis T.",
    journal: "Cancer Genomics",
    year: 2021,
    category: "DNA",
    tags: ["epigenetics", "methylation", "cancer"],
    abstract: "Analysis of DNA methylation profiles across various cancer types reveals common patterns associated with disease progression and treatment resistance."
  },
  {
    id: 5,
    title: "G-Quadruplex Structures in Telomeric DNA",
    authors: "Rodriguez E., Patel A., Thompson J.",
    journal: "Nucleic Acids Research",
    year: 2022,
    category: "DNA",
    tags: ["G-quadruplex", "telomeres", "aging"],
    abstract: "Investigation of G-quadruplex formations in telomeric DNA and their implications for cellular aging and cancer development."
  },
  {
    id: 6,
    title: "CRISPR-Cas9 Off-Target Effects on DNA Structure",
    authors: "Kim R., Johnson S., Chen L.",
    journal: "Genome Engineering",
    year: 2023,
    category: "DNA",
    tags: ["CRISPR", "off-target", "DNA repair"],
    abstract: "This study examines how CRISPR-Cas9 editing affects local DNA structure and the implications for off-target effects in gene therapy applications."
  },
  {
    id: 7,
    title: "RNA-Protein Interactions in Riboswitches",
    authors: "Smith A., Williams R., Patel A.",
    journal: "Molecular Cell",
    year: 2021,
    category: "RNA",
    tags: ["riboswitches", "RNA-protein", "regulation"],
    abstract: "Detailed analysis of RNA-protein interactions in bacterial riboswitches, providing insights into gene regulation mechanisms."
  },
  {
    id: 8,
    title: "Chromatin Structure and DNA Accessibility",
    authors: "Thompson J., Rodriguez E., Davis T.",
    journal: "Epigenetics",
    year: 2022,
    category: "DNA",
    tags: ["chromatin", "accessibility", "gene expression"],
    abstract: "Investigation of the relationship between chromatin structure, DNA accessibility, and gene expression patterns in development and disease."
  }
];

const Research = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  const filteredResearch = useMemo(() => {
    return researchData.filter(item => {
      const searchString = searchTerm.toLowerCase();
      const matchesSearch = 
        item.title.toLowerCase().includes(searchString) ||
        item.authors.toLowerCase().includes(searchString) ||
        item.abstract.toLowerCase().includes(searchString) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchString)) ||
        item.journal.toLowerCase().includes(searchString);
        
      const matchesCategory = activeCategory === "all" || item.category.toLowerCase() === activeCategory.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Patient Data</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our comprehensive collection of publications on RNA and DNA structures and their applications
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by title, author, or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-2/3"
        />
        <Button 
          variant="outline" 
          onClick={() => setSearchTerm("")}
          className="md:w-auto"
        >
          Clear
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-8">
          <TabsTrigger value="all">All Publications</TabsTrigger>
          <TabsTrigger value="RNA">RNA Research</TabsTrigger>
          <TabsTrigger value="DNA">DNA Research</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredResearch.map((item) => (
              <ResearchCard key={item.id} research={item} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="RNA" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredResearch
              .filter((item) => item.category === "RNA")
              .map((item) => (
                <ResearchCard key={item.id} research={item} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="DNA" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredResearch
              .filter((item) => item.category === "DNA")
              .map((item) => (
                <ResearchCard key={item.id} research={item} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {filteredResearch.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl font-medium">No research publications found matching your search criteria.</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              setActiveCategory("all");
            }}
            className="mt-4"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

interface ResearchCardProps {
  research: typeof researchData[0];
}

const ResearchCard = ({ research }: ResearchCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{research.title}</CardTitle>
          <Badge variant={research.category === "RNA" ? "default" : "secondary"}>
            {research.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm font-medium">{research.authors}</p>
        <p className="text-sm text-muted-foreground">{research.journal} ({research.year})</p>
        <p className="text-sm mt-2">{research.abstract}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {research.tags.map((tag, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">View Publication</Button>
      </CardFooter>
    </Card>
  );
};

export default Research;
