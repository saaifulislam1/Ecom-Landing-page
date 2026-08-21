UPDATE "Product"
SET
  "deliveryDetails" = COALESCE("deliveryDetails", 'Inside city 1-2 days, outside city 3-5 days.'),
  "returnPolicy" = COALESCE("returnPolicy", 'Refund or exchange requests accepted within 7 days for eligible products.');
