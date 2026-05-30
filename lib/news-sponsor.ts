export type NewsSponsor = {
  name: string
  href: string
  logoSrc: string
  logoAlt: string
  matchers: string[]
}

const sponsors: NewsSponsor[] = [
  {
    name: "DAS",
    href: "https://das.info.vn/",
    logoSrc: encodeURI("/logo NTT/Rounded DAS Logo.png"),
    logoAlt: "Logo Design Anthropology School",
    matchers: ["design anthropology school", "das"],
  },
  {
    name: "XPPen Vietnam",
    href: "https://www.storexppen.vn/series/graphic-display.html?utm_source=google&utm_medium=cpc&utm_campaign=VN_Pmax_Conv_%E6%96%B0%E5%93%81AT2&utm_adgroup=&utm_campaignid=17867959330&utm_adgroupid=&gad_source=1&gad_campaignid=21033645557&gbraid=0AAAAAotkxkklKsUdOkEdU9L9bEnyXPWvY&gclid=CjwKCAjwwJzPBhBREiwAJfHRnSwapkQjsUEj5KF4JQhINIiaQB4xGP7Tf3tQPuzcsrkRR8GpSgFitRoCBQkQAvD_BwE",
    logoSrc: encodeURI("/logo NTT/XPPen Logo.jpg"),
    logoAlt: "Logo XPPen Vietnam",
    matchers: ["xppen"],
  },
  {
    name: "PrepHires",
    href: "https://www.prephires.com/",
    logoSrc: encodeURI("/logo NTT/Official PrepHires logo.png"),
    logoAlt: "Logo PrepHires",
    matchers: ["prephires", "prep hires"],
  },
  {
    name: "The Korean School",
    href: "https://thekoreanschool.com/",
    logoSrc: encodeURI("/logo NTT/The Korean logo.jpg"),
    logoAlt: "Logo The Korean School",
    matchers: ["the korean school", "korean school"],
  },
  {
    name: "Quickom",
    href: "https://quickom.net/",
    logoSrc: encodeURI("/logo NTT/Logo Quickom Trắng.png"),
    logoAlt: "Logo Quickom",
    matchers: ["quickom"],
  },
]

export function getNewsSponsor(title?: string | null, slug?: string | null) {
  const haystack = `${title ?? ""} ${slug ?? ""}`.toLowerCase()
  return sponsors.find((sponsor) => sponsor.matchers.some((matcher) => haystack.includes(matcher))) ?? null
}
