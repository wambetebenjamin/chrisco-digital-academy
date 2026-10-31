import { ORG } from "../data/org"
import { courses } from "../data/courses"

export default function JsonLdSchema() {
  const baseUrl = "https://chrisco-digital-academy.vercel.app"

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": `${baseUrl}/#organization`,
        name: ORG.academy,
        alternateName: ORG.programme,
        parentOrganization: {
          "@type": "Organization",
          name: ORG.umbrella,
        },
        url: baseUrl,
        email: ORG.email,
        telephone: "+254112272061",
        sameAs: [baseUrl],
        description:
          "CHRISCO Youth Aflame Digital Academy — equipping youth and teens across Kenya and East Africa with practical AI, coding, design, digital media, and entrepreneurship skills.",
      },
      {
        "@type": "EducationEvent",
        "@id": `${baseUrl}/#teens-ai-bootcamp-2026`,
        name: "CHRISCO Teens AI & Projects Bootcamp!",
        description:
          "Fun AI learning & creative digital projects designed for young minds (Ages 13+). 6-week holiday program with online classes and physical team activities.",
        startDate: "2026-11-03",
        endDate: "2026-12-11",
        eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        image: [`${baseUrl}/posters/teens-ai-bootcamp-official.png`],
        organizer: {
          "@id": `${baseUrl}/#organization`,
        },
        typicalAgeRange: "13-19",
      },
      {
        "@type": "ItemList",
        name: "CHRISCO Digital Academy Practical Courses",
        numberOfItems: courses.length,
        itemListElement: courses.slice(0, 10).map((course, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          item: {
            "@type": "Course",
            name: course.title,
            description: course.desc,
            provider: {
              "@id": `${baseUrl}/#organization`,
            },
          },
        })),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
