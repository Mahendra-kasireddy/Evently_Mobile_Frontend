/**
 * `react-native-razorpay` ships no types.
 *
 * Declared here rather than loosened to `any`, and deliberately narrow: only
 * the options this app actually passes. A field nobody sets is a field nobody
 * has checked the meaning of, and the next person to add one should have to
 * read Razorpay's documentation to do it.
 */
declare module 'react-native-razorpay' {
  export interface RazorpayCheckoutOptions {
    /** The publishable key id. The secret never reaches the app. */
    key: string;
    /** The order created server-side — what fixes the amount. */
    order_id: string;
    /** Paise, and only ever the server's figure. */
    amount: number;
    currency: string;
    name: string;
    description?: string;
    image?: string;
    /**
     * `method` opens the sheet on the customer's choice; the contact fields
     * save them retyping what the account already knows.
     */
    prefill?: {
      method?: 'upi' | 'card' | 'netbanking' | 'wallet';
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: Record<string, string>;
    theme?: { color?: string };
  }

  /** What a successful checkout returns — verified server-side, never here. */
  export interface RazorpaySuccess {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }

  /** A dismissal or a failure. `code` 0 and 2 mean the customer closed it. */
  export interface RazorpayFailure {
    code?: number;
    description?: string;
  }

  const RazorpayCheckout: {
    open(options: RazorpayCheckoutOptions): Promise<RazorpaySuccess>;
  };

  export default RazorpayCheckout;
}
