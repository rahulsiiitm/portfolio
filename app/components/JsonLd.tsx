const JsonLd = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rahul Sharma",
    url: "https://rahul.aishtrex.com",
    image: "https://rahul.aishtrex.com/profile.jpg",
    jobTitle: "Full Stack & AI Engineer",
    description:
      "Full Stack & AI Engineer specializing in machine learning, robotics, and modern web development. Building intelligent products that merge deep learning with clean interfaces.",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "IIIT Manipur",
    },
    knowsAbout: [
      "Machine Learning",
      "Deep Learning",
      "Robotics",
      "React",
      "Next.js",
      "Python",
      "TensorFlow",
      "Full Stack Development",
    ],
    sameAs: [
      "https://github.com/rahulsiiitm",
      "https://www.linkedin.com/in/rahulsiiitm",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default JsonLd;
