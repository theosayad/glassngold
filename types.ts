
export interface AppraisalResult {
  title: string;
  listingDescription: string;
  rentPrice: string;
  amenities: string[];
  broQuote: string;
}

export interface HistoryItem {
  id: string;
  imageUrl: string;
  result: AppraisalResult;
  timestamp: number;
}
