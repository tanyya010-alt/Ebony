# Ebony's Skin Therapy & Spa — Online Store

An elegant storefront for **Ebony's Skin Therapy & Spa**: skincare, perfumes, and skin therapy & spa treatments.

## What's included

- **Home / hero** with the brand's ebony, cream and champagne-gold look
- **Collections**: Skincare, Perfumes, and Skin Therapy & Spa
- **Shop** with category filters and a working shopping bag (saved in the browser)
- **Signature fragrance** feature (Ebony Noir)
- **Spa treatments menu** with a booking request form
- **Our Story**, testimonials, newsletter sign-up, and footer
- Fully responsive (phone, tablet, desktop)

## View it

Open `index.html` in a browser. Or run a local server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

To put it online for free, you can use GitHub Pages, Netlify or Vercel. No build step is needed.

## Make it yours

Everything editable is near the top of `script.js`:

- `PRODUCTS`: name, price, size, category (`skincare`, `perfume`, `therapy`), short description, optional tag (e.g. "New"), and colours for the illustrated bottle
- `TREATMENTS`: spa services with duration and price
- `CURRENCY` / `LOCALE`: e.g. `"NGN"` / `"en-NG"`, `"GBP"` / `"en-GB"`, `"ZAR"` / `"en-ZA"`

Edit `index.html` to change the address, opening hours, email, social links and Ebony's story.

## Next steps for a live shop

- **Real product photos**: replace the illustrated bottles with your own photography
- **Payments**: connect Stripe, Paystack, Flutterwave or Shopify Buy Button to the Checkout button
- **Bookings & newsletter**: connect the forms to a service such as Formspree, Calendly, Mailchimp or similar
