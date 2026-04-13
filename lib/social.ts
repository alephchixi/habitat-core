export type SocialLink = {
  key: string;
  label: string;
  href: string;
};

export const FOOTER_SOCIAL_LINKS: SocialLink[] = [
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/habitatmd",
  },
  {
    key: "substack",
    label: "Substack",
    href: "https://habitatmd.substack.com/",
  },
  {
    key: "bluesky",
    label: "Bluesky",
    href: "https://bsky.app/profile/habitatmd.bsky.social",
  },
  {
    key: "x",
    label: "X",
    href: "https://x.com/habitat_md",
  },
  {
    key: "instagram",
    label: "Instagram",
    href: "https://instagram.com/habitat_md",
  },
  {
    key: "github",
    label: "GitHub",
    href: "https://github.com/alephchixi",
  },
];

export const ABOUT_SOCIAL_LINKS = [
  FOOTER_SOCIAL_LINKS[4],
  FOOTER_SOCIAL_LINKS[3],
  FOOTER_SOCIAL_LINKS[5],
  FOOTER_SOCIAL_LINKS[2],
  FOOTER_SOCIAL_LINKS[0],
  FOOTER_SOCIAL_LINKS[1],
];
