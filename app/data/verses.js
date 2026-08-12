// Daily Bible verses paired with YouTube links for deeper study.
// Verses are rotated deterministically by day of year so everyone sees the same verse each day.
// To add a new verse: append to the VERSES array. Pick short, memorable verses and link to a
// reputable sermon/worship/explanation video on YouTube.

export const VERSES = [
  {
    ref: "Philippians 4:13",
    text: "I can do all this through him who gives me strength.",
    theme: "Strength",
    videoLabel: "How to Rely on Christ's Strength",
    videoUrl: "https://www.youtube.com/results?search_query=Philippians+4+13+sermon",
  },
  {
    ref: "Jeremiah 29:11",
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    theme: "Future",
    videoLabel: "Trusting God's Plan for Your Life",
    videoUrl: "https://www.youtube.com/results?search_query=Jeremiah+29+11+youth+sermon",
  },
  {
    ref: "Proverbs 3:5-6",
    text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    theme: "Wisdom",
    videoLabel: "Trusting God With Your Future",
    videoUrl: "https://www.youtube.com/results?search_query=Proverbs+3+5-6+teaching",
  },
  {
    ref: "Psalm 119:105",
    text: "Your word is a lamp for my feet, a light on my path.",
    theme: "Guidance",
    videoLabel: "Studying the Bible Daily",
    videoUrl: "https://www.youtube.com/results?search_query=Psalm+119+105+worship+teaching",
  },
  {
    ref: "1 Timothy 4:12",
    text: "Don't let anyone look down on you because you are young, but set an example for the believers in speech, in conduct, in love, in faith and in purity.",
    theme: "Youth",
    videoLabel: "Don't Let Anyone Look Down on You Because You Are Young",
    videoUrl: "https://www.youtube.com/results?search_query=1+Timothy+4+12+youth+message",
  },
  {
    ref: "Joshua 1:9",
    text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    theme: "Courage",
    videoLabel: "Be Strong and Courageous",
    videoUrl: "https://www.youtube.com/results?search_query=Joshua+1+9+sermon",
  },
  {
    ref: "Matthew 6:33",
    text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.",
    theme: "Priorities",
    videoLabel: "Seek First the Kingdom",
    videoUrl: "https://www.youtube.com/results?search_query=Matthew+6+33+sermon",
  },
  {
    ref: "Romans 12:2",
    text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind.",
    theme: "Mindset",
    videoLabel: "Renewing Your Mind",
    videoUrl: "https://www.youtube.com/results?search_query=Romans+12+2+teaching",
  },
  {
    ref: "Ecclesiastes 9:10",
    text: "Whatever your hand finds to do, do it with all your might.",
    theme: "Work",
    videoLabel: "Working as Unto the Lord",
    videoUrl: "https://www.youtube.com/results?search_query=Ecclesiastes+9+10+youth+sermon",
  },
  {
    ref: "Psalm 23:1",
    text: "The Lord is my shepherd, I lack nothing.",
    theme: "Provision",
    videoLabel: "Psalm 23 Explained",
    videoUrl: "https://www.youtube.com/results?search_query=Psalm+23+the+Lord+is+my+shepherd",
  },
  {
    ref: "Isaiah 40:31",
    text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    theme: "Hope",
    videoLabel: "Wait on the Lord",
    videoUrl: "https://www.youtube.com/results?search_query=Isaiah+40+31+teaching",
  },
  {
    ref: "Proverbs 16:3",
    text: "Commit to the Lord whatever you do, and he will establish your plans.",
    theme: "Planning",
    videoLabel: "Committing Your Plans to God",
    videoUrl: "https://www.youtube.com/results?search_query=Proverbs+16+3+youth",
  },
  {
    ref: "Colossians 3:23",
    text: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.",
    theme: "Excellence",
    videoLabel: "Working Heartily As Unto the Lord",
    videoUrl: "https://www.youtube.com/results?search_query=Colossians+3+23+teaching",
  },
  {
    ref: "Psalm 139:14",
    text: "I praise you because I am fearfully and wonderfully made.",
    theme: "Identity",
    videoLabel: "Fearfully and Wonderfully Made",
    videoUrl: "https://www.youtube.com/results?search_query=Psalm+139+14+youth+message",
  },
]

// A short rotation of worship songs for the dashboard/faith section
export const WORSHIP_SONGS = [
  { title: "Good Good Father", artist: "Tomlin", url: "https://www.youtube.com/results?search_query=good+good+father+worship" },
  { title: "Way Maker", artist: "Sinach", url: "https://www.youtube.com/results?search_query=way+maker+sinach" },
  { title: "Oceans", artist: "Hillsong", url: "https://www.youtube.com/results?search_query=oceans+hillsong+united" },
  { title: "10,000 Reasons", artist: "Matt Redman", url: "https://www.youtube.com/results?search_query=10000+reasons+bless+the+lord" },
  { title: "Reckless Love", artist: "Cory Asbury", url: "https://www.youtube.com/results?search_query=reckless+love+cory+asbury" },
]

export function getVerseOfTheDay() {
  const d = new Date()
  const start = new Date(d.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((d - start) / 86400000)
  return VERSES[dayOfYear % VERSES.length]
}

export function getWorshipPick() {
  const d = new Date()
  const start = new Date(d.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((d - start) / 86400000)
  return WORSHIP_SONGS[dayOfYear % WORSHIP_SONGS.length]
}
