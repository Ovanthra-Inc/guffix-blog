import { Timestamp } from "firebase/firestore";

export interface AffiliateLink {
  id?: string;
  name: string;
  url: string;
  anchorText: string;
  category: string;
  commission?: string;
  description?: string;
  isActive: boolean;
  clickCount: number;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface AffiliatePlacement {
  linkId: string;
  sectionId: string;
  type: "inline" | "cta" | "sidebar";
  position: number;
}

export type MonetizationType =
  | "affiliate"
  | "display_ad"
  | "sponsored"
  | "newsletter"
  | "digital_product";

export interface MonetizationConfig {
  adSlots: number;
  affiliateEnabled: boolean;
  newsletterEnabled: boolean;
  sponsoredEnabled: boolean;
}
